package com.crm.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ruleId;

    @Column(length = 100)
    private String ruleName;

    @Column(length = 50)
    private String entityType;

    private Long entityId;

    @Column(length = 50)
    private String triggerEvent;

    @Column(length = 50)
    private String actionType;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ExecutionStatus status = ExecutionStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String inputData;  // JSON snapshot of trigger data

    @Column(columnDefinition = "TEXT")
    private String outputData; // JSON result or error message

    private LocalDateTime executedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ExecutionStatus {
        PENDING, SUCCESS, FAILED, SKIPPED
    }
}
