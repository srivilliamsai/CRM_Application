package com.crm.marketing.repository;

import com.crm.marketing.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByCompanyId(String companyId);

    List<Campaign> findByCompanyIdAndStatus(String companyId, Campaign.CampaignStatus status);

    List<Campaign> findByCompanyIdAndType(String companyId, Campaign.CampaignType type);
}
