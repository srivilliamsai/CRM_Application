package com.crm.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@FeignClient(name = "sales-service")
public interface SalesClient {

    @GetMapping("/api/deals")
    List<Map<String, Object>> getAllDeals();
}
