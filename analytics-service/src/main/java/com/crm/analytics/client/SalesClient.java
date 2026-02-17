package com.crm.analytics.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "sales-service")
public interface SalesClient {

    @GetMapping("/api/deals")
    List<Map<String, Object>> getAllDeals(
            @org.springframework.web.bind.annotation.RequestParam("companyId") String companyId);
}
