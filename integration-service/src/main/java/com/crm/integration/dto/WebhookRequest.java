package com.crm.integration.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Map;

@Data
public class WebhookRequest {

    @NotBlank(message = "URL is required")
    private String url;

    private String method = "POST"; // GET, POST, PUT

    private Map<String, String> headers;

    private Map<String, Object> payload;
}
