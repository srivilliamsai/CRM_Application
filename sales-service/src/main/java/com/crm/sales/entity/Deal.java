package com.crm.sales.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals", indexes = {
        @Index(name = "idx_deal_company_id", columnList = "companyId"),
        @Index(name = "idx_deal_stage", columnList = "stage"),
        @Index(name = "idx_deal_assigned_to", columnList = "assignedTo")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String description;

    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DealStage stage = DealStage.NEW;

    private Long customerId; // from customer-service

    private Long assignedTo; // User ID from auth-service

    @Column(length = 36)
    private String companyId;

    @Column(length = 50)
    private String priority; // LOW, MEDIUM, HIGH

    private LocalDate expectedCloseDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DealType type; // New Business, Existing Business

    @Column(length = 50)
    private String leadSource;

    @Column(length = 255)
    private String nextStep;

    private Integer probability; // 0-100%

    @Column(length = 36)
    private String campaignSource; // Campaign ID

    @Column(length = 100)
    private String pipelineName;

    private Integer pipelineOrder;

    private boolean isDeleted = false;
    private LocalDateTime deletedAt;

    private Long createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DealStage {
        NEW, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST
    }

    public enum DealType {
        NEW_BUSINESS, EXISTING_BUSINESS
    }
}
