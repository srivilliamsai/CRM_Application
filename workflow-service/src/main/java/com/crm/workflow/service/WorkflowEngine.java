package com.crm.workflow.service;

import com.crm.workflow.client.NotificationClient;
import com.crm.workflow.dto.WorkflowTriggerDTO;
import com.crm.workflow.entity.WorkflowLog;
import com.crm.workflow.entity.WorkflowRule;
import com.crm.workflow.repository.WorkflowLogRepository;
import com.crm.workflow.repository.WorkflowRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Core Workflow Engine — evaluates rules and executes actions.
 */
@Service
public class WorkflowEngine {

    @Autowired
    private WorkflowRuleRepository ruleRepository;

    @Autowired
    private WorkflowLogRepository logRepository;

    @Autowired
    private NotificationClient notificationClient;

    /**
     * Main entry point: triggered when an event occurs in any service.
     * Finds matching active rules and executes their actions.
     */
    public List<WorkflowLog> processEvent(WorkflowTriggerDTO trigger) {
        // Find all active rules matching this entity type + trigger event
        List<WorkflowRule> matchingRules = ruleRepository
                .findByEntityTypeAndTriggerEventAndActiveTrue(
                        trigger.getEntityType(),
                        trigger.getTriggerEvent()
                );

        List<WorkflowLog> logs = new java.util.ArrayList<>();

        for (WorkflowRule rule : matchingRules) {
            WorkflowLog log = new WorkflowLog();
            log.setRuleId(rule.getId());
            log.setRuleName(rule.getName());
            log.setEntityType(trigger.getEntityType());
            log.setEntityId(trigger.getEntityId());
            log.setTriggerEvent(trigger.getTriggerEvent());
            log.setActionType(rule.getActionType());
            log.setInputData(trigger.getData() != null ? trigger.getData().toString() : "{}");

            try {
                // Evaluate condition
                if (evaluateCondition(rule, trigger.getData())) {
                    // Execute action
                    executeAction(rule, trigger);
                    log.setStatus(WorkflowLog.ExecutionStatus.SUCCESS);
                    log.setOutputData("Action executed successfully");
                } else {
                    log.setStatus(WorkflowLog.ExecutionStatus.SKIPPED);
                    log.setOutputData("Condition not met");
                }
            } catch (Exception e) {
                log.setStatus(WorkflowLog.ExecutionStatus.FAILED);
                log.setOutputData("Error: " + e.getMessage());
            }

            log.setExecutedAt(LocalDateTime.now());
            logs.add(logRepository.save(log));
        }

        return logs;
    }

    /**
     * Simple condition evaluator.
     * Supports basic conditions like:
     *   {"field": "leadScore", "operator": ">=", "value": 80}
     */
    private boolean evaluateCondition(WorkflowRule rule, Map<String, Object> data) {
        if (rule.getConditionExpression() == null || rule.getConditionExpression().isEmpty()) {
            return true; // No condition = always match
        }

        if (data == null) return false;

        // Basic field-operator-value evaluation
        // In production, use a proper rule engine like Drools
        try {
            String condition = rule.getConditionExpression();

            // Simple parsing: extract field, operator, value from JSON-like string
            if (condition.contains("field") && condition.contains("operator") && condition.contains("value")) {
                String field = extractJsonValue(condition, "field");
                String operator = extractJsonValue(condition, "operator");
                String expectedValue = extractJsonValue(condition, "value");

                Object actualValue = data.get(field);
                if (actualValue == null) return false;

                double actual = Double.parseDouble(actualValue.toString());
                double expected = Double.parseDouble(expectedValue);

                switch (operator) {
                    case ">=": return actual >= expected;
                    case "<=": return actual <= expected;
                    case ">": return actual > expected;
                    case "<": return actual < expected;
                    case "==": return actual == expected;
                    case "!=": return actual != expected;
                    default: return false;
                }
            }

            return true; // If can't parse, default to match
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Executes the action defined in the rule.
     */
    private void executeAction(WorkflowRule rule, WorkflowTriggerDTO trigger) {
        switch (rule.getActionType().toUpperCase()) {
            case "SEND_NOTIFICATION":
                sendNotification(rule, trigger);
                break;
            case "SEND_EMAIL":
                sendNotification(rule, trigger); // Routes through notification-service
                break;
            default:
                // Log action for manual processing
                break;
        }
    }

    private void sendNotification(WorkflowRule rule, WorkflowTriggerDTO trigger) {
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("type", "WORKFLOW_TRIGGER");
            notification.put("ruleName", rule.getName());
            notification.put("entityType", trigger.getEntityType());
            notification.put("entityId", trigger.getEntityId());
            notification.put("actionParams", rule.getActionParams());
            notification.put("data", trigger.getData());

            notificationClient.sendNotification(notification);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification: " + e.getMessage());
        }
    }

    private String extractJsonValue(String json, String key) {
        // Simple JSON value extractor (for demo purposes)
        String search = "\"" + key + "\"";
        int keyIdx = json.indexOf(search);
        if (keyIdx == -1) return "";

        int colonIdx = json.indexOf(":", keyIdx);
        int startIdx = json.indexOf("\"", colonIdx + 1);
        if (startIdx == -1) {
            // Numeric value
            int numStart = colonIdx + 1;
            while (numStart < json.length() && (json.charAt(numStart) == ' ' || json.charAt(numStart) == ':')) numStart++;
            int numEnd = numStart;
            while (numEnd < json.length() && (Character.isDigit(json.charAt(numEnd)) || json.charAt(numEnd) == '.')) numEnd++;
            return json.substring(numStart, numEnd).trim();
        }
        int endIdx = json.indexOf("\"", startIdx + 1);
        return json.substring(startIdx + 1, endIdx);
    }

    // ============ CRUD for Rules ============

    public WorkflowRule createRule(WorkflowRule rule) {
        return ruleRepository.save(rule);
    }

    public List<WorkflowRule> getAllRules() {
        return ruleRepository.findAll();
    }

    public List<WorkflowRule> getActiveRules() {
        return ruleRepository.findByActiveTrue();
    }

    public WorkflowRule getRuleById(Long id) {
        return ruleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found with id: " + id));
    }

    public WorkflowRule updateRule(Long id, WorkflowRule rule) {
        WorkflowRule existing = getRuleById(id);
        existing.setName(rule.getName());
        existing.setDescription(rule.getDescription());
        existing.setEntityType(rule.getEntityType());
        existing.setTriggerEvent(rule.getTriggerEvent());
        existing.setConditionExpression(rule.getConditionExpression());
        existing.setActionType(rule.getActionType());
        existing.setActionParams(rule.getActionParams());
        existing.setActive(rule.isActive());
        existing.setPriority(rule.getPriority());
        return ruleRepository.save(existing);
    }

    public WorkflowRule toggleRule(Long id) {
        WorkflowRule rule = getRuleById(id);
        rule.setActive(!rule.isActive());
        return ruleRepository.save(rule);
    }

    public void deleteRule(Long id) {
        ruleRepository.deleteById(id);
    }
}
