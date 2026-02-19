package com.crm.customer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.crm.customer.entity.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Activity> findByCustomerIdAndCompanyIdOrderByCreatedAtDesc(Long customerId, String companyId);

    List<Activity> findByCompanyIdOrderByCreatedAtDesc(String companyId);

    List<Activity> findAllByOrderByCreatedAtDesc();

    List<Activity> findByPerformedBy(Long userId);
}
