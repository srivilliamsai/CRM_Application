package com.crm.marketing.service;

import com.crm.marketing.dto.CampaignDTO;
import com.crm.marketing.entity.Campaign;
import com.crm.marketing.repository.CampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    public Campaign createCampaign(CampaignDTO dto) {
        Campaign campaign = new Campaign();
        mapDtoToEntity(dto, campaign);
        if (dto.getCompanyId() != null) {
            campaign.setCompanyId(dto.getCompanyId());
        }
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getAllCampaigns(String companyId) {
        return campaignRepository.findByCompanyId(companyId);
    }

    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found with id: " + id));
    }

    public List<Campaign> getCampaignsByStatus(String companyId, String status) {
        return campaignRepository.findByCompanyIdAndStatus(companyId,
                Campaign.CampaignStatus.valueOf(status.toUpperCase()));
    }

    public Campaign updateCampaign(Long id, CampaignDTO dto) {
        Campaign campaign = getCampaignById(id);
        mapDtoToEntity(dto, campaign);
        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaignStatus(Long id, String status) {
        Campaign campaign = getCampaignById(id);
        campaign.setStatus(Campaign.CampaignStatus.valueOf(status.toUpperCase()));
        return campaignRepository.save(campaign);
    }

    public void deleteCampaign(Long id) {
        Campaign campaign = getCampaignById(id);
        campaignRepository.delete(campaign);
    }

    private void mapDtoToEntity(CampaignDTO dto, Campaign campaign) {
        campaign.setName(dto.getName());
        campaign.setDescription(dto.getDescription());
        campaign.setStartDate(dto.getStartDate());
        campaign.setEndDate(dto.getEndDate());
        campaign.setBudget(dto.getBudget());
        campaign.setGoal(dto.getGoal());
        if (dto.getTargetAudience() != null)
            campaign.setTargetAudience(dto.getTargetAudience());
        if (dto.getSentCount() != null)
            campaign.setSentCount(dto.getSentCount());
        if (dto.getOpenCount() != null)
            campaign.setOpenCount(dto.getOpenCount());
        if (dto.getClickCount() != null)
            campaign.setClickCount(dto.getClickCount());
        if (dto.getType() != null)
            campaign.setType(Campaign.CampaignType.valueOf(dto.getType().toUpperCase()));
        if (dto.getStatus() != null)
            campaign.setStatus(Campaign.CampaignStatus.valueOf(dto.getStatus().toUpperCase()));
    }
}
