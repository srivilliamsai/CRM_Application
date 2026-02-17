package com.crm.customer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.customer.entity.Lead;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByCompanyId(String companyId);

    List<Lead> findByCompanyIdAndStatus(String companyId, Lead.LeadStatus status);

    List<Lead> findByCompanyIdAndAssignedTo(String companyId, Long userId);

    List<Lead> findByCompanyIdAndSource(String companyId, String source);

    List<Lead> findByCompanyIdAndScoreGreaterThanEqual(String companyId, Integer score);
}
