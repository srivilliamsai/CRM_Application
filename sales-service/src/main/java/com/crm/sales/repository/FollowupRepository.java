package com.crm.sales.repository;

import com.crm.sales.entity.Followup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowupRepository extends JpaRepository<Followup, Long> {

    List<Followup> findByCompanyIdAndDealId(String companyId, Long dealId);

    List<Followup> findByCompanyIdAndAssignedToAndCompletedFalse(String companyId, Long userId);

    List<Followup> findByCompanyIdAndCompletedFalse(String companyId);
}
