package com.crm.workflow.dto;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * DTO received when an event occurs in another service.
 * e.g. When a lead is created, customer-service sends this to workflow-service.
 */
public class WorkflowTriggerDTO {

    private String entityType; // LEAD, DEAL, TICKET, CAMPAIGN
    private Long entityId;
    private String triggerEvent; // CREATED, UPDATED, STATUS_CHANGED
    private Map<String, Object> data; // Dynamic payload with entity fields

    // Standard getters
    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getTriggerEvent() {
        return triggerEvent;
    }

    public void setTriggerEvent(String triggerEvent) {
        this.triggerEvent = triggerEvent;
    }

    // Defensive copy getter/setter for Map
    public Map<String, Object> getData() {
        return data == null ? Collections.emptyMap() : Collections.unmodifiableMap(data);
    }

    public void setData(Map<String, Object> data) {
        this.data = data == null ? new HashMap<>() : new HashMap<>(data);
    }
}
