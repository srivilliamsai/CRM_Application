package com.crm.customer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.customer.entity.LeadHistory;

@Repository
public interface LeadHistoryRepository extends JpaRepository<LeadHistory, Long> {
    List<LeadHistory> findByLeadIdOrderByChangedAtDesc(Long leadId);
}
