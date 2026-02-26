package com.crm.integration.dto;

import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

    // Standard getters/setters
    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isHtml() {
        return isHtml;
    }

    public void setHtml(boolean html) {
        isHtml = html;
    }

    // Defensive copy getters/setters for Lists
    public List<String> getCc() {
        return cc == null ? Collections.emptyList() : Collections.unmodifiableList(cc);
    }

    public void setCc(List<String> cc) {
        this.cc = cc == null ? new ArrayList<>() : new ArrayList<>(cc);
    }

    public List<String> getBcc() {
        return bcc == null ? Collections.emptyList() : Collections.unmodifiableList(bcc);
    }

    public void setBcc(List<String> bcc) {
        this.bcc = bcc == null ? new ArrayList<>() : new ArrayList<>(bcc);
    }
}
