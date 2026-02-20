package com.crm.customer.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crm.customer.dto.LeadDTO;
import com.crm.customer.entity.Lead;
import com.crm.customer.entity.LeadHistory;
import com.crm.customer.repository.LeadHistoryRepository;
import com.crm.customer.repository.LeadRepository;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private LeadHistoryRepository leadHistoryRepository;

    @Autowired
    private com.crm.customer.client.NotificationClient notificationClient;

    // ========== CREATE ==========

    public Lead createLead(LeadDTO dto) {
        Lead lead = new Lead();
        mapDtoToEntity(dto, lead);
        lead.setCompanyId(dto.getCompanyId());
        Lead savedLead = leadRepository.save(lead);
        saveHistory(savedLead.getId(), "CREATED", null, "Lead Created with Status: " + savedLead.getStatus(),
                dto.getCompanyId());

        // Notify if assigned
        if (savedLead.getAssignedTo() != null) {
            sendAssignmentNotification(savedLead.getAssignedTo(), "Lead", savedLead.getId(),
                    savedLead.getFirstName() + " " + savedLead.getLastName(),
                    dto.getCompanyId());
        }

        return savedLead;
    }

    // ========== READ ==========

    public List<Lead> getAllLeads(String companyId) {
        return leadRepository.findByCompanyId(companyId);
    }

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    public List<Lead> getLeadsByStatus(String companyId, String status) {
        return leadRepository.findByCompanyIdAndStatus(companyId, Lead.LeadStatus.valueOf(status.toUpperCase()));
    }

    public List<Lead> getLeadsByAssignee(String companyId, Long userId) {
        return leadRepository.findByCompanyIdAndAssignedTo(companyId, userId);
    }

    public List<Lead> searchLeads(String companyId, String keyword) {
        return leadRepository
                .findByCompanyIdAndFirstNameContainingOrCompanyIdAndLastNameContainingOrCompanyIdAndEmailContainingOrCompanyIdAndCompanyContaining(
                        companyId, keyword, companyId, keyword, companyId, keyword, companyId, keyword);
    }

    public List<Lead> getHighScoreLeads(String companyId, Integer minScore) {
        return leadRepository.findByCompanyIdAndScoreGreaterThanEqual(companyId, minScore);
    }

    public List<LeadHistory> getLeadHistory(Long leadId) {
        return leadHistoryRepository.findByLeadIdOrderByChangedAtDesc(leadId);
    }

    // ========== UPDATE ==========

    public Lead updateLead(Long id, LeadDTO dto) {
        Lead lead = getLeadById(id);
        Long oldAssignee = lead.getAssignedTo();

        // Track changes
        if (dto.getStatus() != null && !dto.getStatus().equalsIgnoreCase(lead.getStatus().name())) {
            saveHistory(lead.getId(), "STATUS", lead.getStatus().name(), dto.getStatus().toUpperCase(),
                    lead.getCompanyId());
        }
        if (dto.getScore() != null && !dto.getScore().equals(lead.getScore())) {
            saveHistory(lead.getId(), "SCORE", String.valueOf(lead.getScore()), String.valueOf(dto.getScore()),
                    lead.getCompanyId());
        }
        if (dto.getNotes() != null && !dto.getNotes().equals(lead.getNotes())) {
            // Only save if meaningful change (not just whitespace if already empty)
            saveHistory(lead.getId(), "NOTE", lead.getNotes(), dto.getNotes(), lead.getCompanyId());
        }

        mapDtoToEntity(dto, lead);
        Lead savedLead = leadRepository.save(lead);

        // Notify if assignment changed
        if (dto.getAssignedTo() != null && !dto.getAssignedTo().equals(oldAssignee)) {
            System.out.println("Triggering notification for Lead assignment. New: " + dto.getAssignedTo() + ", Old: "
                    + oldAssignee);
            sendAssignmentNotification(dto.getAssignedTo(), "Lead", savedLead.getId(),
                    savedLead.getFirstName() + " " + savedLead.getLastName(),
                    lead.getCompanyId());
        } else {
            System.out.println("No notification triggered. New: " + dto.getAssignedTo() + ", Old: " + oldAssignee);
        }

        return savedLead;
    }

    public Lead updateLeadStatus(Long id, String status) {
        Lead lead = getLeadById(id);
        String oldStatus = lead.getStatus().name();
        String newStatus = status.toUpperCase();

        if (!oldStatus.equals(newStatus)) {
            saveHistory(lead.getId(), "STATUS", oldStatus, newStatus, lead.getCompanyId());
            lead.setStatus(Lead.LeadStatus.valueOf(newStatus));
            return leadRepository.save(lead);
        }
        return lead;
    }

    // ========== DELETE ==========

    public void deleteLead(Long id) {
        Lead lead = getLeadById(id);
        leadRepository.delete(lead);
    }

    // ========== Helper ==========

    private void mapDtoToEntity(LeadDTO dto, Lead lead) {
        lead.setFirstName(dto.getFirstName());
        lead.setLastName(dto.getLastName());
        lead.setTitle(dto.getTitle());
        lead.setEmail(dto.getEmail());
        lead.setPhone(dto.getPhone());
        lead.setCompany(dto.getCompany());
        lead.setSource(dto.getSource());
        lead.setNotes(dto.getNotes());
        lead.setAssignedTo(dto.getAssignedTo());

        lead.setWebsite(dto.getWebsite());
        lead.setIndustry(dto.getIndustry());
        lead.setAnnualRevenue(dto.getAnnualRevenue());
        lead.setNumberOfEmployees(dto.getNumberOfEmployees());
        lead.setStreet(dto.getStreet());
        lead.setCity(dto.getCity());
        lead.setState(dto.getState());
        lead.setZipCode(dto.getZipCode());
        lead.setCountry(dto.getCountry());
        lead.setLinkedinUrl(dto.getLinkedinUrl());
        lead.setTwitterHandle(dto.getTwitterHandle());

        if (dto.getRating() != null && !dto.getRating().isEmpty()) {
            try {
                lead.setRating(Lead.LeadRating.valueOf(dto.getRating().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore invalid rating or handle gracefully
            }
        }

        if (dto.getStatus() != null) {
            try {
                lead.setStatus(Lead.LeadStatus.valueOf(dto.getStatus().toUpperCase()));
            } catch (Exception e) {
                // Ignore
            }
        }
        if (dto.getScore() != null) {
            lead.setScore(dto.getScore());
        }
    }

    private void saveHistory(Long leadId, String field, String oldValue, String newValue, String companyId) {
        LeadHistory history = new LeadHistory();
        history.setLeadId(leadId);
        history.setFieldChanged(field);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setCompanyId(companyId);
        // history.setChangedBy(userId); // TODO: Add user context
        leadHistoryRepository.save(history);
    }

    private void sendAssignmentNotification(Long recipientId, String type, Long referenceId, String name,
            String companyId) {
        try {
            java.util.Map<String, Object> notification = new java.util.HashMap<>();
            notification.put("recipientUserId", recipientId);
            notification.put("type", "IN_APP");
            notification.put("title", "New " + type + " Assigned");
            notification.put("message", "You have been assigned a new " + type + ": " + name);
            notification.put("source", "CUSTOMER_SERVICE");
            notification.put("referenceType", type.toUpperCase()); // LEAD or CUSTOMER
            notification.put("referenceId", referenceId);
            notification.put("status", "PENDING");

            notificationClient.sendNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
            // Don't fail the transaction just because notification failed
        }
    }
}
