package com.crm.support.repository;

import com.crm.support.entity.TicketResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketResponseRepository extends JpaRepository<TicketResponse, Long> {

    List<TicketResponse> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}
