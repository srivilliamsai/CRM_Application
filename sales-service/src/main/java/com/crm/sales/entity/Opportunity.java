package com.crm.sales.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    private BigDecimal amount;

    private Integer probability; // 0-100%

    @Column(length = 50)
    private String source;

    private Long customerId;

    private Long assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private OpportunityStatus status = OpportunityStatus.OPEN;

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

    public enum OpportunityStatus {
        OPEN, WON, LOST
    }
}
