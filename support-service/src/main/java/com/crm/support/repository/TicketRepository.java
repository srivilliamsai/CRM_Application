package com.crm.support.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.support.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCompanyId(String companyId);

    List<Ticket> findByCompanyIdAndStatus(String companyId, Ticket.TicketStatus status);

    List<Ticket> findByCompanyIdAndCustomerId(String companyId, Long customerId);

    List<Ticket> findByCompanyIdAndAssignedTo(String companyId, Long userId);

    long countByStatus(Ticket.TicketStatus status);
}
