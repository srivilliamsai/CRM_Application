package com.crm.customer.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String company;

    @Column(length = 50)
    private String source; // Website, Referral, Campaign, etc.

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private LeadStatus status = LeadStatus.NEW;

    private Integer score = 0; // Lead score (0-100)

    @Column(length = 500)
    private String notes;

    private Long assignedTo; // User ID from auth-service

    @Column(length = 36)
    private String companyId; // Company isolation

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

    public enum LeadStatus {
        NEW, CONTACTED, QUALIFIED, UNQUALIFIED, CONVERTED
    }
}
