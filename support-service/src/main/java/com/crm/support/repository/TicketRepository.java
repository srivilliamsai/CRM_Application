package com.crm.support.repository;

import com.crm.support.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(Ticket.TicketStatus status);

    List<Ticket> findByPriority(Ticket.TicketPriority priority);

    List<Ticket> findByCustomerId(Long customerId);

    List<Ticket> findByAssignedTo(Long userId);

    long countByStatus(Ticket.TicketStatus status);
}
