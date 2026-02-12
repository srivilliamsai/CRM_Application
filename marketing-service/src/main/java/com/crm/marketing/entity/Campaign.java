package com.crm.marketing.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CampaignType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CampaignStatus status = CampaignStatus.DRAFT;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer targetAudience = 0;
    private Integer sentCount = 0;
    private Integer openCount = 0;
    private Integer clickCount = 0;

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

    public enum CampaignType {
        EMAIL, SMS, SOCIAL_MEDIA, WEBINAR
    }

    public enum CampaignStatus {
        DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, CANCELLED
    }
}
