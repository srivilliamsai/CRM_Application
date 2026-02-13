package com.crm.integration.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class EmailRequest {

    @NotBlank(message = "Recipient email is required")
    private String to;

    private List<String> cc;
    private List<String> bcc;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Body is required")
    private String body;

    private boolean isHtml = false;
}
