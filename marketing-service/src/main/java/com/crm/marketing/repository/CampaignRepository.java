package com.crm.marketing.repository;

import com.crm.marketing.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByStatus(Campaign.CampaignStatus status);

    List<Campaign> findByType(Campaign.CampaignType type);
}
