package com.crm.customer.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Index;
import javax.persistence.PreUpdate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activities", indexes = {
        @Index(name = "idx_activity_company_id", columnList = "companyId"),
        @Index(name = "idx_activity_type", columnList = "type"),
        @Index(name = "idx_activity_customer_id", columnList = "customerId"),
        @Index(name = "idx_activity_lead_id", columnList = "leadId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ActivityType type;

    @Column(nullable = false, length = 300)
    private String description;

    private Long customerId;

    private Long performedBy; // User ID from auth-service

    @Column(length = 20)
    private String phoneNumber;

    private Long leadId;

    @Column(length = 36)
    private String companyId;

    private boolean isDeleted = false;
    private LocalDateTime deletedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Phone Call Specific Fields
    private LocalDateTime startTime;
    private Integer duration; // in seconds
    private String outcome; // e.g., Answered, Missed, Voicemail
    private String direction; // INBOUND, OUTBOUND
    private String recordingUrl;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (startTime == null) {
            startTime = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ActivityType {
        CALL, EMAIL, MEETING, NOTE, TASK
    }
}
