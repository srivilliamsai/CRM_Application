package com.crm.customer.service;

import com.crm.customer.dto.LeadDTO;
import com.crm.customer.entity.Lead;
import com.crm.customer.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    @Autowired
    private LeadRepository leadRepository;

    // ========== CREATE ==========

    public Lead createLead(LeadDTO dto) {
        Lead lead = new Lead();
        mapDtoToEntity(dto, lead);
        return leadRepository.save(lead);
    }

    // ========== READ ==========

    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    public List<Lead> getLeadsByStatus(String status) {
        return leadRepository.findByStatus(Lead.LeadStatus.valueOf(status.toUpperCase()));
    }

    public List<Lead> getLeadsByAssignee(Long userId) {
        return leadRepository.findByAssignedTo(userId);
    }

    public List<Lead> getHighScoreLeads(Integer minScore) {
        return leadRepository.findByScoreGreaterThanEqual(minScore);
    }

    // ========== UPDATE ==========

    public Lead updateLead(Long id, LeadDTO dto) {
        Lead lead = getLeadById(id);
        mapDtoToEntity(dto, lead);
        return leadRepository.save(lead);
    }

    public Lead updateLeadStatus(Long id, String status) {
        Lead lead = getLeadById(id);
        lead.setStatus(Lead.LeadStatus.valueOf(status.toUpperCase()));
        return leadRepository.save(lead);
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
}
