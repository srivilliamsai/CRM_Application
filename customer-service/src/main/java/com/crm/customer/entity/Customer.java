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
@Table(name = "customers", indexes = {
        @Index(name = "idx_customer_email", columnList = "email"),
        @Index(name = "idx_customer_company_id", columnList = "companyId"),
        @Index(name = "idx_customer_status", columnList = "status"),
        @Index(name = "idx_customer_assigned_to", columnList = "assignedTo")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 200)
    private String company;

    @Column(length = 100)
    private String jobTitle;

    @Column(length = 300)
    private String address;

    @Column(length = 50)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(length = 50)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CustomerStatus status = CustomerStatus.ACTIVE;

    @Column(length = 50)
    private String source; // e.g., Website, Referral, Campaign

    @Column(length = 36)
    private String companyId; // Company isolation

    @Column(length = 255)
    private String website;

    @Column(length = 50)
    private String industry;

    private BigDecimal annualRevenue;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CustomerRating rating;

    @Column(length = 20)
    private String zipCode;

    // Billing Address
    @Column(length = 200)
    private String billingStreet;
    @Column(length = 50)
    private String billingCity;
    @Column(length = 50)
    private String billingState;
    @Column(length = 20)
    private String billingZipCode;
    @Column(length = 50)
    private String billingCountry;

    private Long assignedTo; // User ID

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private boolean isDeleted = false;
    private java.time.LocalDateTime deletedAt;

    private Long createdBy;

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

    public enum CustomerStatus {
        ACTIVE, INACTIVE, PROSPECT
    }

    public enum CustomerRating {
        HOT, WARM, COLD
    }
}
