package com.crm.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_rules", indexes = {
        @Index(name = "idx_wf_company_id", columnList = "companyId"),
        @Index(name = "idx_wf_entity_type", columnList = "entityType"),
        @Index(name = "idx_wf_active", columnList = "active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 500)
    private String description;

    /**
     * The service/entity this rule applies to.
     * e.g. LEAD, DEAL, TICKET, CAMPAIGN
     */
    @Column(nullable = false, length = 50)
    private String entityType;

    /**
     * The event that triggers this rule.
     * e.g. CREATED, UPDATED, STATUS_CHANGED, SCORE_CHANGED
     */
    @Column(nullable = false, length = 50)
    private String triggerEvent;

    /**
     * JSON condition expression.
     * e.g. {"field": "leadScore", "operator": ">=", "value": 80}
     */
    @Column(columnDefinition = "TEXT")
    private String conditionExpression;

    /**
     * What action to take when rule matches.
     * e.g. ASSIGN_USER, SEND_NOTIFICATION, CHANGE_STATUS, CREATE_TASK
     */
    @Column(nullable = false, length = 50)
    private String actionType;

    /**
     * JSON action parameters.
     * e.g. {"assignTo": 5} or {"notificationType": "EMAIL", "template":
     * "high_score_lead"}
     */
    @Column(columnDefinition = "TEXT")
    private String actionParams;

    private boolean active = true;

    private Integer priority = 0; // Higher = runs first

    private Long createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime activeFrom;
    private LocalDateTime activeTo;

    private boolean isDeleted = false;
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
