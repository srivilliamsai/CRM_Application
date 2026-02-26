package com.crm.support.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Index;

import lombok.NoArgsConstructor;

@Entity
@Table(name = "tickets", indexes = {
        @Index(name = "idx_ticket_company_id", columnList = "companyId"),
        @Index(name = "idx_ticket_status", columnList = "status"),
        @Index(name = "idx_ticket_assigned_to", columnList = "assignedTo"),
        @Index(name = "idx_ticket_customer_id", columnList = "customerId")
})
@lombok.Getter
@lombok.Setter
@lombok.ToString
@lombok.EqualsAndHashCode
@NoArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TicketStatus status = TicketStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TicketPriority priority = TicketPriority.MEDIUM;

    @Column(length = 50)
    private String category; // Billing, Technical, General, Feature Request

    private Long customerId; // from customer-service
    private Long assignedTo; // from auth-service
    private Long createdBy;

    @Column(length = 36)
    private String companyId;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TicketResponse> responses = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    // SLA fields
    private LocalDateTime slaDeadline;
    private Long resolutionTime; // in minutes
    private LocalDateTime firstResponseTime;

    private boolean isDeleted = false;
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TicketStatus {
        OPEN, IN_PROGRESS, WAITING_ON_CUSTOMER, RESOLVED, CLOSED
    }

    public enum TicketPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    // Manual defensive copy getter/setter for responses (mutable List)
    public List<TicketResponse> getResponses() {
        return responses == null ? java.util.Collections.emptyList()
                : java.util.Collections.unmodifiableList(responses);
    }

    public void setResponses(List<TicketResponse> responses) {
        this.responses = responses == null ? new ArrayList<>() : new ArrayList<>(responses);
    }

    public void addResponse(TicketResponse response) {
        if (this.responses == null)
            this.responses = new ArrayList<>();
        this.responses.add(response);
    }

    // AllArgsConstructor replacement with defensive copy
    public Ticket(Long id, String subject, String description, TicketStatus status, TicketPriority priority,
            String category, Long customerId, Long assignedTo, Long createdBy, String companyId,
            List<TicketResponse> responses, LocalDateTime createdAt, LocalDateTime updatedAt,
            LocalDateTime resolvedAt, LocalDateTime slaDeadline, Long resolutionTime,
            LocalDateTime firstResponseTime, boolean isDeleted, LocalDateTime deletedAt) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.category = category;
        this.customerId = customerId;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.companyId = companyId;
        this.responses = responses == null ? new ArrayList<>() : new ArrayList<>(responses);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.slaDeadline = slaDeadline;
        this.resolutionTime = resolutionTime;
        this.firstResponseTime = firstResponseTime;
        this.isDeleted = isDeleted;
        this.deletedAt = deletedAt;
    }
}
