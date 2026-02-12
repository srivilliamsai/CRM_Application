package com.crm.customer.repository;

import com.crm.customer.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByStatus(Lead.LeadStatus status);

    List<Lead> findByAssignedTo(Long userId);

    List<Lead> findBySource(String source);

    List<Lead> findByScoreGreaterThanEqual(Integer score);
}
