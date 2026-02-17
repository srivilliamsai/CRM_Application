package com.crm.analytics.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crm.analytics.client.CustomerClient;
import com.crm.analytics.client.SalesClient;
import com.crm.analytics.client.SupportClient;

/**
 * Aggregates data from all services via Feign to produce dashboard metrics.
 */
@Service
public class DashboardService {

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private SalesClient salesClient;

    @Autowired
    private SupportClient supportClient;

    /**
     * Returns a combined dashboard with counts and breakdowns from all services.
     */
    public Map<String, Object> getDashboard(String companyId) {
        Map<String, Object> dashboard = new HashMap<>();

        // 1. Fetch Data
        List<Map<String, Object>> customers = null;
        try {
            customers = customerClient.getAllCustomers(companyId);
            dashboard.put("totalCustomers", customers.size());
        } catch (Exception e) {
            dashboard.put("totalCustomers", 0);
        }

        List<Map<String, Object>> leads = null;
        try {
            leads = customerClient.getAllLeads(companyId);
            dashboard.put("totalLeads", leads != null ? leads.size() : 0);
        } catch (Exception e) {
            dashboard.put("totalLeads", 0);
        }

        List<Map<String, Object>> deals = null;
        try {
            deals = salesClient.getAllDeals(companyId);
            dashboard.put("totalDeals", deals != null ? deals.size() : 0);
        } catch (Exception e) {
            dashboard.put("totalDeals", 0);
        }

        List<Map<String, Object>> tickets = null;
        try {
            tickets = supportClient.getAllTickets(companyId);
            dashboard.put("totalTickets", tickets != null ? tickets.size() : 0);

            long openTickets = tickets != null ? tickets.stream()
                    .filter(t -> "OPEN".equals(t.get("status")))
                    .count() : 0;
            dashboard.put("openTickets", openTickets);
        } catch (Exception e) {
            dashboard.put("openTickets", 0);
        }

        List<Map<String, Object>> activities = null;
        try {
            activities = customerClient.getAllActivities();
            dashboard.put("totalActivities", activities != null ? activities.size() : 0);

            // Get recent 5 activities
            if (activities != null) {
                List<Map<String, Object>> recentActivities = activities.stream()
                        .limit(5)
                        .collect(java.util.stream.Collectors.toList());
                dashboard.put("recentActivities", recentActivities);
            } else {
                dashboard.put("recentActivities", java.util.Collections.emptyList());
            }
        } catch (Exception e) {
            dashboard.put("totalActivities", 0);
            dashboard.put("recentActivities", java.util.Collections.emptyList());
        }

        // 2. Calculate Key Metrics
        Map<String, Double> monthlySales = new HashMap<>();

        if (deals != null) {
            double totalRevenue = deals.stream()
                    .filter(d -> "CLOSED_WON".equals(d.get("stage")))
                    .mapToDouble(d -> {
                        Object val = d.get("value");
                        if (val instanceof Number) {
                            return ((Number) val).doubleValue();
                        }
                        return 0.0;
                    })
                    .sum();
            dashboard.put("totalRevenue", totalRevenue);

            long closedWon = deals.stream()
                    .filter(d -> "CLOSED_WON".equals(d.get("stage")))
                    .count();
            dashboard.put("closedWonDeals", closedWon);

            // 3. Deal Distribution (Pie Chart)
            Map<String, Long> dealDistribution = deals.stream()
                    .collect(java.util.stream.Collectors.groupingBy(
                            d -> (String) d.getOrDefault("stage", "UNKNOWN"),
                            java.util.stream.Collectors.counting()));

            // Format for frontend Recharts: { name: 'Stage', value: 10 }
            List<Map<String, Object>> pieData = dealDistribution.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> item = new HashMap<>();
                        item.put("name", entry.getKey());
                        item.put("value", entry.getValue());
                        return item;
                    })
                    .collect(java.util.stream.Collectors.toList());
            dashboard.put("dealDistribution", pieData);

            // Collect Sales Data
            for (Map<String, Object> deal : deals) {
                if ("CLOSED_WON".equals(deal.get("stage"))) {
                    java.time.LocalDateTime date = parseDate(deal.get("createdAt"));
                    if (date != null) {
                        String month = date.getMonth().getDisplayName(java.time.format.TextStyle.SHORT,
                                java.util.Locale.ENGLISH);

                        double val = 0.0;
                        Object v = deal.get("value");
                        if (v instanceof Number) {
                            val = ((Number) v).doubleValue();
                        }

                        monthlySales.merge(month, val, Double::sum);
                    }
                }
            }
        } else {
            dashboard.put("dealDistribution", java.util.Collections.emptyList());
        }

        // LEADS Trend Data Collection (Outside deals check)
        Map<String, Long> monthlyLeads = new HashMap<>();
        if (leads != null) {
            for (Map<String, Object> lead : leads) {
                java.time.LocalDateTime date = parseDate(lead.get("createdAt"));
                if (date != null) {
                    String month = date.getMonth().getDisplayName(java.time.format.TextStyle.SHORT,
                            java.util.Locale.ENGLISH);

                    monthlyLeads.merge(month, 1L, Long::sum);
                }
            }
        }

        // GENERATE TREND DATA (Always runs)
        // Combine into list: [{ name: 'Jan', sales: 100, leads: 5 }, ...]
        // Fixed list of months to ensure order
        String[] months = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        List<Map<String, Object>> trendData = new java.util.ArrayList<>();

        for (String month : months) {
            // ALWAYS add the month, even if data is 0, so the graph axis renders correctly
            Map<String, Object> point = new HashMap<>();
            point.put("name", month);
            point.put("sales", monthlySales.getOrDefault(month, 0.0));
            point.put("leads", monthlyLeads.getOrDefault(month, 0L));
            trendData.add(point);
        }
        dashboard.put("salesTrend", trendData);

        return dashboard;
    }

    private java.time.LocalDateTime parseDate(Object dateObj) {
        if (dateObj == null) {
            return null;
        }
        try {
            if (dateObj instanceof String) {
                return java.time.LocalDateTime.parse((String) dateObj);
            } else if (dateObj instanceof java.util.List) {
                java.util.List<?> list = (java.util.List<?>) dateObj;
                if (list.size() >= 3) {
                    int year = ((Number) list.get(0)).intValue();
                    int month = ((Number) list.get(1)).intValue();
                    int day = ((Number) list.get(2)).intValue();
                    int hour = list.size() > 3 ? ((Number) list.get(3)).intValue() : 0;
                    int minute = list.size() > 4 ? ((Number) list.get(4)).intValue() : 0;
                    int second = list.size() > 5 ? ((Number) list.get(5)).intValue() : 0;
                    return java.time.LocalDateTime.of(year, month, day, hour, minute, second);
                }
            }
        } catch (Exception e) {
            // Ignore parsing errors
        }
        return null;
    }
}
