package com.crm.marketing.controller;

import com.crm.marketing.dto.CampaignDTO;
import com.crm.marketing.entity.Campaign;
import com.crm.marketing.entity.EmailTemplate;
import com.crm.marketing.repository.EmailTemplateRepository;
import com.crm.marketing.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "*")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private EmailTemplateRepository templateRepository;

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@Valid @RequestBody CampaignDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(campaignService.createCampaign(dto));
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Campaign>> getCampaignsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(campaignService.getCampaignsByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignDTO dto) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Campaign> updateCampaignStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(campaignService.updateCampaignStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    // ============ Email Templates ============

    @GetMapping("/templates")
    public ResponseEntity<List<EmailTemplate>> getAllTemplates() {
        return ResponseEntity.ok(templateRepository.findByActiveTrue());
    }

    @PostMapping("/templates")
    public ResponseEntity<EmailTemplate> createTemplate(@RequestBody EmailTemplate template) {
        return ResponseEntity.status(HttpStatus.CREATED).body(templateRepository.save(template));
    }
}
