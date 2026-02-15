package com.crm.sales.service;

import com.crm.sales.entity.Followup;
import com.crm.sales.repository.FollowupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowupService {

    @Autowired
    private FollowupRepository followupRepository;

    public Followup createFollowup(Followup followup) {
        // Enforce companyId from context or object
        return followupRepository.save(followup);
    }

    public List<Followup> getFollowupsByDeal(String companyId, Long dealId) {
        return followupRepository.findByCompanyIdAndDealId(companyId, dealId);
    }

    public List<Followup> getPendingFollowups(String companyId) {
        return followupRepository.findByCompanyIdAndCompletedFalse(companyId);
    }

    public List<Followup> getPendingByUser(String companyId, Long userId) {
        return followupRepository.findByCompanyIdAndAssignedToAndCompletedFalse(companyId, userId);
    }

    public Followup markComplete(Long id) {
        Followup followup = followupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Followup not found with id: " + id));
        followup.setCompleted(true);
        return followupRepository.save(followup);
    }

    public void deleteFollowup(Long id) {
        followupRepository.deleteById(id);
    }
}
