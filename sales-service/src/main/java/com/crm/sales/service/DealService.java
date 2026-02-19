package com.crm.sales.service;

import com.crm.sales.client.CustomerClient;
import com.crm.sales.dto.CustomerDTO;
import com.crm.sales.dto.DealDTO;
import com.crm.sales.entity.Deal;
import com.crm.sales.repository.DealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DealService {

    @Autowired
    private DealRepository dealRepository;

    @Autowired
    private CustomerClient customerClient;

    public Deal createDeal(DealDTO dto) {
        // Verify customer exists via Feign Client
        if (dto.getCustomerId() != null) {
            CustomerDTO customer = customerClient.getCustomerById(dto.getCustomerId());
            if (customer == null) {
                throw new RuntimeException("Customer not found with id: " + dto.getCustomerId());
            }
        }

        Deal deal = new Deal();
        mapDtoToEntity(dto, deal);
        if (dto.getCompanyId() != null) {
            deal.setCompanyId(dto.getCompanyId());
        }
        return dealRepository.save(deal);
    }

    public List<Deal> getAllDeals(String companyId) {
        return dealRepository.findByCompanyId(companyId);
    }

    public Deal getDealById(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found with id: " + id));
    }

    public List<Deal> getDealsByStage(String companyId, String stage) {
        return dealRepository.findByCompanyIdAndStage(companyId, Deal.DealStage.valueOf(stage.toUpperCase()));
    }

    public List<Deal> getDealsByCustomer(String companyId, Long customerId) {
        return dealRepository.findByCompanyIdAndCustomerId(companyId, customerId);
    }

    public List<Deal> getDealsByAssignee(String companyId, Long userId) {
        return dealRepository.findByCompanyIdAndAssignedTo(companyId, userId);
    }

    public Deal updateDeal(Long id, DealDTO dto) {
        Deal deal = getDealById(id);
        mapDtoToEntity(dto, deal);
        return dealRepository.save(deal);
    }

    public Deal updateDealStage(Long id, String stage) {
        Deal deal = getDealById(id);
        deal.setStage(Deal.DealStage.valueOf(stage.toUpperCase()));
        return dealRepository.save(deal);
    }

    public void deleteDeal(Long id) {
        Deal deal = getDealById(id);
        dealRepository.delete(deal);
    }

    private void mapDtoToEntity(DealDTO dto, Deal deal) {
        deal.setTitle(dto.getTitle());
        deal.setDescription(dto.getDescription());
        deal.setValue(dto.getValue());
        deal.setCustomerId(dto.getCustomerId());
        deal.setAssignedTo(dto.getAssignedTo());
        deal.setPriority(dto.getPriority());
        deal.setExpectedCloseDate(dto.getExpectedCloseDate());
        if (dto.getStage() != null) {
            deal.setStage(Deal.DealStage.valueOf(dto.getStage().toUpperCase()));
        }

        if (dto.getType() != null) {
            try {
                deal.setType(Deal.DealType.valueOf(dto.getType().toUpperCase()));
            } catch (Exception e) {
                // Ignore
            }
        }

        deal.setLeadSource(dto.getLeadSource());
        deal.setNextStep(dto.getNextStep());
        deal.setProbability(dto.getProbability());
        deal.setCampaignSource(dto.getCampaignSource());
    }
}
