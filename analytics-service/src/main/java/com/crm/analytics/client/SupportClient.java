package com.crm.analytics.client;

import java.util.List;
import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "support-service")
public interface SupportClient {

    @GetMapping("/api/tickets")
    List<Map<String, Object>> getAllTickets(
            @org.springframework.web.bind.annotation.RequestParam("companyId") String companyId);
}
