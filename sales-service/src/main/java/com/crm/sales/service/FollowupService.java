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
        return followupRepository.save(followup);
    }

    public List<Followup> getFollowupsByDeal(Long dealId) {
        return followupRepository.findByDealId(dealId);
    }

    public List<Followup> getPendingFollowups() {
        return followupRepository.findByCompletedFalse();
    }

    public List<Followup> getPendingByUser(Long userId) {
        return followupRepository.findByAssignedToAndCompletedFalse(userId);
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
