package com.crm.sales.repository;

import com.crm.sales.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByCompanyId(String companyId);

    List<Opportunity> findByCompanyIdAndStatus(String companyId, Opportunity.OpportunityStatus status);

    List<Opportunity> findByCompanyIdAndCustomerId(String companyId, Long customerId);

    List<Opportunity> findByCompanyIdAndProbabilityGreaterThanEqual(String companyId, Integer probability);
}
