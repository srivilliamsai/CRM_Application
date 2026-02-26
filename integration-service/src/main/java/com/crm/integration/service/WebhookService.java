package com.crm.integration.service;

import com.crm.integration.dto.WebhookRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Sends HTTP webhooks to external systems (Slack, Zapier, custom APIs).
 */
@Service
public class WebhookService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> sendWebhook(WebhookRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            if (request.getHeaders() != null) {
                request.getHeaders().forEach(headers::set);
            }

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request.getPayload(), headers);

            ResponseEntity<String> response;
            switch (request.getMethod().toUpperCase()) {
                case "POST":
                    response = restTemplate.exchange(request.getUrl(), HttpMethod.POST, entity, String.class);
                    break;
                case "PUT":
                    response = restTemplate.exchange(request.getUrl(), HttpMethod.PUT, entity, String.class);
                    break;
                case "GET":
                    response = restTemplate.exchange(request.getUrl(), HttpMethod.GET, entity, String.class);
                    break;
                default:
                    throw new RuntimeException("Unsupported HTTP method: " + request.getMethod());
            }

            result.put("status", "SUCCESS");
            result.put("httpStatus", response.getStatusCodeValue());
            result.put("response", response.getBody());
        } catch (org.springframework.web.client.RestClientException e) {
            result.put("status", "FAILED");
            result.put("error", e.getMessage());
        } catch (RuntimeException e) {
            result.put("status", "FAILED");
            result.put("error", e.getMessage());
        }
        return result;
    }
}
