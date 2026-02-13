package com.crm.workflow.repository;

import com.crm.workflow.entity.WorkflowAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowActionRepository extends JpaRepository<WorkflowAction, Long> {

    List<WorkflowAction> findByType(String type);

    List<WorkflowAction> findByActiveTrue();
}
