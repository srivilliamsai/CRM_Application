package com.crm.sales.repository;

import com.crm.sales.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByStage(Deal.DealStage stage);

    List<Deal> findByCustomerId(Long customerId);

    List<Deal> findByAssignedTo(Long userId);

    List<Deal> findByPriority(String priority);
}
