package com.crm.analytics.entity;

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
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 50)
    private String type; // SALES, LEADS, TICKETS, CAMPAIGNS

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    private String data; // JSON blob for report data

    private Long createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 50)
    private String companyId;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
