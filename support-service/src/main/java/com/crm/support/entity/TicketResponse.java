package com.crm.support.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ticket_responses")
@lombok.Getter
@lombok.Setter
@lombok.ToString(exclude = "ticket")
@lombok.EqualsAndHashCode(exclude = "ticket")
@NoArgsConstructor
@SuppressFBWarnings(value = { "EI_EXPOSE_REP",
        "EI_EXPOSE_REP2" }, justification = "JPA @ManyToOne entity references cannot be defensively copied without breaking Hibernate proxy tracking")
public class TicketResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private Long respondedBy; // User ID

    @Column(length = 20)
    private String responderType; // AGENT, CUSTOMER

    @Column(length = 36)
    private String companyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    @lombok.Setter(lombok.AccessLevel.NONE)
    private Ticket ticket;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Manual getter/setter for mutable entity reference (SpotBugs EI_EXPOSE_REP
    // fix)
    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    // AllArgsConstructor replacement
    public TicketResponse(Long id, String message, Long respondedBy, String responderType,
            String companyId, Ticket ticket, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.respondedBy = respondedBy;
        this.responderType = responderType;
        this.companyId = companyId;
        this.ticket = ticket;
        this.createdAt = createdAt;
    }
}
