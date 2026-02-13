package com.crm.workflow.repository;

import com.crm.workflow.entity.WorkflowLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowLogRepository extends JpaRepository<WorkflowLog, Long> {

    List<WorkflowLog> findByRuleId(Long ruleId);

    List<WorkflowLog> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<WorkflowLog> findByStatus(WorkflowLog.ExecutionStatus status);

    List<WorkflowLog> findTop50ByOrderByCreatedAtDesc();
}
