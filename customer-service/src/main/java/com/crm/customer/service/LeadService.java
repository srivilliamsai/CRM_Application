package com.crm.customer.service;

import com.crm.customer.dto.LeadDTO;
import com.crm.customer.entity.Lead;
import com.crm.customer.entity.LeadHistory;
import com.crm.customer.repository.LeadRepository;
import com.crm.customer.repository.LeadHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private LeadHistoryRepository leadHistoryRepository;

    // ========== CREATE ==========

    public Lead createLead(LeadDTO dto) {
        Lead lead = new Lead();
        mapDtoToEntity(dto, lead);
        lead.setCompanyId(dto.getCompanyId());
        Lead savedLead = leadRepository.save(lead);
        saveHistory(savedLead.getId(), "CREATED", null, "Lead Created with Status: " + savedLead.getStatus(),
                dto.getCompanyId());
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

    public List<Lead> getHighScoreLeads(String companyId, Integer minScore) {
        return leadRepository.findByCompanyIdAndScoreGreaterThanEqual(companyId, minScore);
    }

    public List<LeadHistory> getLeadHistory(Long leadId) {
        return leadHistoryRepository.findByLeadIdOrderByChangedAtDesc(leadId);
    }

    // ========== UPDATE ==========

    public Lead updateLead(Long id, LeadDTO dto) {
        Lead lead = getLeadById(id);

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
        return leadRepository.save(lead);
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
        lead.setName(dto.getName());
        lead.setEmail(dto.getEmail());
        lead.setPhone(dto.getPhone());
        lead.setCompany(dto.getCompany());
        lead.setSource(dto.getSource());
        lead.setNotes(dto.getNotes());
        lead.setAssignedTo(dto.getAssignedTo());

        if (dto.getStatus() != null) {
            lead.setStatus(Lead.LeadStatus.valueOf(dto.getStatus().toUpperCase()));
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
}
