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
        return opportunityRepository.save(opportunity);
    }

    public List<Opportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

    public Opportunity getOpportunityById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found with id: " + id));
    }

    public List<Opportunity> getOpportunitiesByStatus(String status) {
        return opportunityRepository.findByStatus(Opportunity.OpportunityStatus.valueOf(status.toUpperCase()));
    }

    public List<Opportunity> getOpportunitiesByCustomer(Long customerId) {
        return opportunityRepository.findByCustomerId(customerId);
    }

    public List<Opportunity> getHighProbabilityOpportunities(Integer minProbability) {
        return opportunityRepository.findByProbabilityGreaterThanEqual(minProbability);
    }

    public Opportunity updateOpportunity(Long id, Opportunity opportunity) {
        Opportunity existing = getOpportunityById(id);
        existing.setName(opportunity.getName());
        existing.setAmount(opportunity.getAmount());
        existing.setProbability(opportunity.getProbability());
        existing.setSource(opportunity.getSource());
        existing.setCustomerId(opportunity.getCustomerId());
        existing.setAssignedTo(opportunity.getAssignedTo());
        if (opportunity.getStatus() != null) existing.setStatus(opportunity.getStatus());
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
