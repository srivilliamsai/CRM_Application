package com.crm.workflow.repository;

import com.crm.workflow.entity.WorkflowRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRuleRepository extends JpaRepository<WorkflowRule, Long> {

    List<WorkflowRule> findByEntityTypeAndTriggerEventAndActiveTrue(String entityType, String triggerEvent);

    List<WorkflowRule> findByActiveTrue();

    List<WorkflowRule> findByEntityType(String entityType);
}
