package com.crm.workflow.dto;

import lombok.Data;

import java.util.Map;

/**
 * DTO received when an event occurs in another service.
 * e.g. When a lead is created, customer-service sends this to workflow-service.
 */
@Data
public class WorkflowTriggerDTO {

    private String entityType;   // LEAD, DEAL, TICKET, CAMPAIGN
    private Long entityId;
    private String triggerEvent; // CREATED, UPDATED, STATUS_CHANGED
    private Map<String, Object> data; // Dynamic payload with entity fields
}
