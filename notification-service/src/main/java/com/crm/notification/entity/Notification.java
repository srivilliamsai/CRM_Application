package com.crm.notification.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notif_recipient", columnList = "recipientUserId"),
        @Index(name = "idx_notif_status", columnList = "status"),
        @Index(name = "idx_notif_ref", columnList = "referenceId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String recipientEmail;

    private String recipientPhone;

    private Long recipientUserId; // For in-app notifications

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NotificationStatus status = NotificationStatus.PENDING;

    private String source; // Which service triggered this (e.g. workflow-service, support-service)

    private String referenceType; // LEAD, DEAL, TICKET
    private Long referenceId;

    private LocalDateTime sentAt;

    private LocalDateTime readAt;

    private Integer retryCount = 0;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private boolean isDeleted = false;
    private LocalDateTime deletedAt;

    private LocalDateTime updatedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum NotificationType {
        EMAIL, SMS, IN_APP, PUSH
    }

    public enum NotificationStatus {
        PENDING, SENT, DELIVERED, READ, FAILED
    }
}
