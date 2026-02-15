package com.crm.sales.repository;

import com.crm.sales.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByCompanyId(String companyId);

    List<Deal> findByCompanyIdAndStage(String companyId, Deal.DealStage stage);

    List<Deal> findByCompanyIdAndCustomerId(String companyId, Long customerId);

    List<Deal> findByCompanyIdAndAssignedTo(String companyId, Long userId);

    List<Deal> findByCompanyIdAndPriority(String companyId, String priority);
}
