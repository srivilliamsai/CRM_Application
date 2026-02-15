package com.crm.marketing.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "segments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Segment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 300)
    private String description;

    @Column(length = 500)
    private String criteria; // JSON or rule string, e.g. "industry=IT AND status=ACTIVE"

    @Column(length = 36)
    private String companyId;

    private Integer memberCount = 0;

    private Long createdBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
