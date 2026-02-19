package com.crm.customer.entity;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Index;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leads", indexes = {
        @Index(name = "idx_lead_email", columnList = "email"),
        @Index(name = "idx_lead_company_id", columnList = "companyId"),
        @Index(name = "idx_lead_status", columnList = "status"),
        @Index(name = "idx_lead_assigned_to", columnList = "assignedTo")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(length = 100)
    private String title; // Job Title

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

    private boolean isConverted = false;
    private Long convertedCustomerId;

    private boolean isDeleted = false;
    private java.time.LocalDateTime deletedAt;

    private Long createdBy;

    @Column(length = 500)
    private String notes;

    private Long assignedTo; // User ID from auth-service

    @Column(length = 36)
    private String companyId; // Company isolation

    @Column(length = 255)
    private String website;

    @Column(length = 50)
    private String industry;

    private BigDecimal annualRevenue;
    private Integer numberOfEmployees;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private LeadRating rating;

    // Address
    @Column(length = 200)
    private String street;
    @Column(length = 100)
    private String city;
    @Column(length = 100)
    private String state;
    @Column(length = 20)
    private String zipCode;
    @Column(length = 100)
    private String country;

    // Social
    @Column(length = 255)
    private String linkedinUrl;
    @Column(length = 255)
    private String twitterHandle;

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

    public enum LeadRating {
        HOT, WARM, COLD
    }
}
