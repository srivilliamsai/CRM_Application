package com.crm.customer.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lead_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long leadId;

    @Column(nullable = false, length = 50)
    private String fieldChanged; // e.g. "STATUS", "SCORE", "NOTE"

    @Column(length = 500)
    private String oldValue;

    @Column(length = 500)
    private String newValue;

    private Long changedBy; // User ID

    @Column(length = 36)
    private String companyId;

    @Column(updatable = false)
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        changedAt = LocalDateTime.now();
    }
}
