package com.crm.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@FeignClient(name = "customer-service")
public interface CustomerClient {

    @GetMapping("/api/customers")
    List<Map<String, Object>> getAllCustomers();

    @GetMapping("/api/leads")
    List<Map<String, Object>> getAllLeads();
}
