package com.crm.customer.repository;

import com.crm.customer.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    List<Activity> findByPerformedBy(Long userId);
}
