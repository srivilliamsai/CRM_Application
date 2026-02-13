package com.crm.notification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

/**
 * Feign Client to call integration-service for sending emails.
 */
@FeignClient(name = "integration-service")
public interface IntegrationClient {

    @PostMapping("/api/integrations/email/send")
    Map<String, Object> sendEmail(@RequestBody Map<String, Object> emailRequest);
}
