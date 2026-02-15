package com.crm.sales.service;

import com.crm.sales.entity.Opportunity;
import com.crm.sales.repository.OpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpportunityService {

    @Autowired
    private OpportunityRepository opportunityRepository;

    public Opportunity createOpportunity(Opportunity opportunity) {
        // Enforce companyId from context or object
        return opportunityRepository.save(opportunity);
    }

    public List<Opportunity> getAllOpportunities(String companyId) {
        return opportunityRepository.findByCompanyId(companyId);
    }

    public Opportunity getOpportunityById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found with id: " + id));
    }

    public List<Opportunity> getOpportunitiesByStatus(String companyId, String status) {
        return opportunityRepository.findByCompanyIdAndStatus(companyId,
                Opportunity.OpportunityStatus.valueOf(status.toUpperCase()));
    }

    public List<Opportunity> getOpportunitiesByCustomer(String companyId, Long customerId) {
        return opportunityRepository.findByCompanyIdAndCustomerId(companyId, customerId);
    }

    public List<Opportunity> getHighProbabilityOpportunities(String companyId, Integer minProbability) {
        return opportunityRepository.findByCompanyIdAndProbabilityGreaterThanEqual(companyId, minProbability);
    }

    public Opportunity updateOpportunity(Long id, Opportunity opportunity) {
        Opportunity existing = getOpportunityById(id);
        existing.setName(opportunity.getName());
        existing.setAmount(opportunity.getAmount());
        existing.setProbability(opportunity.getProbability());
        existing.setSource(opportunity.getSource());
        existing.setCustomerId(opportunity.getCustomerId());
        existing.setAssignedTo(opportunity.getAssignedTo());
        if (opportunity.getCompanyId() != null)
            existing.setCompanyId(opportunity.getCompanyId());
        if (opportunity.getStatus() != null)
            existing.setStatus(opportunity.getStatus());
        return opportunityRepository.save(existing);
    }

    public Opportunity updateStatus(Long id, String status) {
        Opportunity opp = getOpportunityById(id);
        opp.setStatus(Opportunity.OpportunityStatus.valueOf(status.toUpperCase()));
        return opportunityRepository.save(opp);
    }

    public void deleteOpportunity(Long id) {
        opportunityRepository.deleteById(id);
    }
}
