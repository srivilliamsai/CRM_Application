package com.crm.support.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.support.entity.TicketResponse;

@Repository
public interface TicketResponseRepository extends JpaRepository<TicketResponse, Long> {

    List<TicketResponse> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
