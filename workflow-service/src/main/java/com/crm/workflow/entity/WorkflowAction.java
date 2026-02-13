package com.crm.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 300)
    private String description;

    /**
     * Action type: ASSIGN_USER, SEND_EMAIL, SEND_SMS, CHANGE_STATUS, CREATE_FOLLOWUP, WEBHOOK
     */
    @Column(nullable = false, length = 50)
    private String type;

    /**
     * Target service to call.
     * e.g. notification-service, customer-service, sales-service
     */
    @Column(length = 100)
    private String targetService;

    /**
     * API endpoint to hit on target service.
     * e.g. /api/notifications/send
     */
    @Column(length = 200)
    private String targetEndpoint;

    /**
     * JSON payload template with placeholders.
     * e.g. {"to": "${customerEmail}", "subject": "Welcome!", "body": "Hi ${customerName}"}
     */
    @Column(columnDefinition = "TEXT")
    private String payloadTemplate;

    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
