package com.crm.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;

@FeignClient(name = "support-service")
public interface SupportClient {

    @GetMapping("/api/tickets")
    List<Map<String, Object>> getAllTickets();
}
