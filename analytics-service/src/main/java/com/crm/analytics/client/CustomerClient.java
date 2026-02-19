package com.crm.analytics.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "customer-service")
public interface CustomerClient {

    @GetMapping("/api/customers")
    List<Map<String, Object>> getAllCustomers(
            @org.springframework.web.bind.annotation.RequestParam("companyId") String companyId);

    @GetMapping("/api/leads")
    List<Map<String, Object>> getAllLeads(
            @org.springframework.web.bind.annotation.RequestParam("companyId") String companyId);

    @GetMapping("/api/activities")
    List<Map<String, Object>> getAllActivities(
            @org.springframework.web.bind.annotation.RequestParam("companyId") String companyId);
}
