package com.crm.sales.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "followups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Followup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long dealId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private FollowupType type;

    @Column(nullable = false, length = 500)
    private String notes;

    private LocalDateTime scheduledAt;

    private boolean completed = false;

    private Long assignedTo;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum FollowupType {
        CALL, EMAIL, MEETING, DEMO, OTHER
    }
}
