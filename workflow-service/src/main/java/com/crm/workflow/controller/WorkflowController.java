package com.crm.workflow.controller;

import com.crm.workflow.dto.WorkflowTriggerDTO;
import com.crm.workflow.entity.WorkflowAction;
import com.crm.workflow.entity.WorkflowLog;
import com.crm.workflow.entity.WorkflowRule;
import com.crm.workflow.repository.WorkflowActionRepository;
import com.crm.workflow.repository.WorkflowLogRepository;
import com.crm.workflow.service.WorkflowEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workflows")
@CrossOrigin(origins = "*")
public class WorkflowController {

    @Autowired
    private WorkflowEngine workflowEngine;

    @Autowired
    private WorkflowActionRepository actionRepository;

    @Autowired
    private WorkflowLogRepository logRepository;

    // ============ Trigger ============

    /**
     * POST /api/workflows/trigger
     * Called by other services when an event occurs.
     */
    @PostMapping("/trigger")
    public ResponseEntity<List<WorkflowLog>> triggerWorkflow(@RequestBody WorkflowTriggerDTO trigger) {
        List<WorkflowLog> results = workflowEngine.processEvent(trigger);
        return ResponseEntity.ok(results);
    }

    // ============ Rules CRUD ============

    @PostMapping("/rules")
    public ResponseEntity<WorkflowRule> createRule(@RequestBody WorkflowRule rule) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workflowEngine.createRule(rule));
    }

    @GetMapping("/rules")
    public ResponseEntity<List<WorkflowRule>> getAllRules() {
        return ResponseEntity.ok(workflowEngine.getAllRules());
    }

    @GetMapping("/rules/active")
    public ResponseEntity<List<WorkflowRule>> getActiveRules() {
        return ResponseEntity.ok(workflowEngine.getActiveRules());
    }

    @GetMapping("/rules/{id}")
    public ResponseEntity<WorkflowRule> getRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(workflowEngine.getRuleById(id));
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<WorkflowRule> updateRule(@PathVariable Long id, @RequestBody WorkflowRule rule) {
        return ResponseEntity.ok(workflowEngine.updateRule(id, rule));
    }

    @PutMapping("/rules/{id}/toggle")
    public ResponseEntity<WorkflowRule> toggleRule(@PathVariable Long id) {
        return ResponseEntity.ok(workflowEngine.toggleRule(id));
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        workflowEngine.deleteRule(id);
        return ResponseEntity.noContent().build();
    }

    // ============ Actions CRUD ============

    @PostMapping("/actions")
    public ResponseEntity<WorkflowAction> createAction(@RequestBody WorkflowAction action) {
        return ResponseEntity.status(HttpStatus.CREATED).body(actionRepository.save(action));
    }

    @GetMapping("/actions")
    public ResponseEntity<List<WorkflowAction>> getAllActions() {
        return ResponseEntity.ok(actionRepository.findAll());
    }

    @DeleteMapping("/actions/{id}")
    public ResponseEntity<Void> deleteAction(@PathVariable Long id) {
        actionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ============ Logs ============

    @GetMapping("/logs")
    public ResponseEntity<List<WorkflowLog>> getRecentLogs() {
        return ResponseEntity.ok(logRepository.findTop50ByOrderByCreatedAtDesc());
    }

    @GetMapping("/logs/rule/{ruleId}")
    public ResponseEntity<List<WorkflowLog>> getLogsByRule(@PathVariable Long ruleId) {
        return ResponseEntity.ok(logRepository.findByRuleId(ruleId));
    }

    @GetMapping("/logs/entity/{entityType}/{entityId}")
    public ResponseEntity<List<WorkflowLog>> getLogsByEntity(
            @PathVariable String entityType, @PathVariable Long entityId) {
        return ResponseEntity.ok(logRepository.findByEntityTypeAndEntityId(entityType, entityId));
    }
}
