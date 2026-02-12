package com.crm.sales.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
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
    private DealStage stage = DealStage.PROSPECTING;

    private Long customerId; // from customer-service

    private Long assignedTo; // User ID from auth-service

    @Column(length = 50)
    private String priority; // LOW, MEDIUM, HIGH

    private LocalDateTime expectedCloseDate;

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
        PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST
    }
}
