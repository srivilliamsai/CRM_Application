package com.crm.analytics.service;

import com.crm.analytics.client.CustomerClient;
import com.crm.analytics.client.SalesClient;
import com.crm.analytics.client.SupportClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        try {
            List<Map<String, Object>> customers = customerClient.getAllCustomers();
            dashboard.put("totalCustomers", customers.size());
        } catch (Exception e) {
            dashboard.put("totalCustomers", "unavailable");
        }

        try {
            List<Map<String, Object>> leads = customerClient.getAllLeads();
            dashboard.put("totalLeads", leads.size());
        } catch (Exception e) {
            dashboard.put("totalLeads", "unavailable");
        }

        try {
            List<Map<String, Object>> deals = salesClient.getAllDeals();
            dashboard.put("totalDeals", deals.size());

            long closedWon = deals.stream()
                    .filter(d -> "CLOSED_WON".equals(d.get("stage")))
                    .count();
            dashboard.put("closedWonDeals", closedWon);
        } catch (Exception e) {
            dashboard.put("totalDeals", "unavailable");
        }

        try {
            List<Map<String, Object>> tickets = supportClient.getAllTickets();
            dashboard.put("totalTickets", tickets.size());

            long openTickets = tickets.stream()
                    .filter(t -> "OPEN".equals(t.get("status")))
                    .count();
            dashboard.put("openTickets", openTickets);
        } catch (Exception e) {
            dashboard.put("totalTickets", "unavailable");
        }

        return dashboard;
    }
}
