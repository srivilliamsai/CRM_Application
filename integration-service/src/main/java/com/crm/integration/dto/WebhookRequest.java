package com.crm.integration.dto;

import javax.validation.constraints.NotBlank;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class WebhookRequest {

    @NotBlank(message = "URL is required")
    private String url;

    private String method = "POST"; // GET, POST, PUT

    private Map<String, String> headers;

    private Map<String, Object> payload;

    // Standard getters/setters
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    // Defensive copy getters/setters for Maps
    public Map<String, String> getHeaders() {
        return headers == null ? Collections.emptyMap() : Collections.unmodifiableMap(headers);
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers == null ? new HashMap<>() : new HashMap<>(headers);
    }

    public Map<String, Object> getPayload() {
        return payload == null ? Collections.emptyMap() : Collections.unmodifiableMap(payload);
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload == null ? new HashMap<>() : new HashMap<>(payload);
    }
}
