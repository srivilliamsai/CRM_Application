package com.crm.integration.controller;

import com.crm.integration.dto.EmailRequest;
import com.crm.integration.dto.WebhookRequest;
import com.crm.integration.service.EmailService;
import com.crm.integration.service.WebhookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations")
@CrossOrigin(origins = "*")
public class IntegrationController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private WebhookService webhookService;

    // ============ Email ============

    @PostMapping("/email/send")
    public ResponseEntity<Map<String, Object>> sendEmail(@Valid @RequestBody EmailRequest request) {
        Map<String, Object> result;
        if (request.isHtml()) {
            result = emailService.sendHtmlEmail(request);
        } else {
            result = emailService.sendSimpleEmail(request);
        }
        return ResponseEntity.ok(result);
    }

    // ============ Webhook ============

    @PostMapping("/webhook/send")
    public ResponseEntity<Map<String, Object>> sendWebhook(@Valid @RequestBody WebhookRequest request) {
        return ResponseEntity.ok(webhookService.sendWebhook(request));
    }

    // ============ Health ============

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "integration-service");
        status.put("status", "UP");
        status.put("capabilities", new String[]{"EMAIL_SMTP", "WEBHOOK_HTTP", "CALENDAR_API"});
        return ResponseEntity.ok(status);
    }
}
