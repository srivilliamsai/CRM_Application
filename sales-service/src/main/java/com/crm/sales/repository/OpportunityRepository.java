package com.crm.sales.repository;

import com.crm.sales.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByStatus(Opportunity.OpportunityStatus status);

    List<Opportunity> findByCustomerId(Long customerId);

    List<Opportunity> findByProbabilityGreaterThanEqual(Integer probability);
}
