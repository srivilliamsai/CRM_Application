package com.crm.customer.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crm.customer.dto.LeadDTO;
import com.crm.customer.entity.Lead;
import com.crm.customer.entity.LeadHistory;
import com.crm.customer.service.LeadService;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class LeadController {

    @Autowired
    private LeadService leadService;

    @PostMapping
    public ResponseEntity<Lead> createLead(@Valid @RequestBody LeadDTO dto) {
        Lead created = leadService.createLead(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads(@RequestParam String companyId) {
        return ResponseEntity.ok(leadService.getAllLeads(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Lead>> getLeadsByStatus(@PathVariable String status, @RequestParam String companyId) {
        return ResponseEntity.ok(leadService.getLeadsByStatus(companyId, status));
    }

    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<Lead>> getLeadsByAssignee(@PathVariable Long userId, @RequestParam String companyId) {
        return ResponseEntity.ok(leadService.getLeadsByAssignee(companyId, userId));
    }

    @GetMapping("/high-score")
    public ResponseEntity<List<Lead>> getHighScoreLeads(@RequestParam(defaultValue = "70") Integer minScore,
            @RequestParam String companyId) {
        return ResponseEntity.ok(leadService.getHighScoreLeads(companyId, minScore));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @Valid @RequestBody LeadDTO dto) {
        return ResponseEntity.ok(leadService.updateLead(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(leadService.updateLeadStatus(id, status));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<LeadHistory>> getLeadHistory(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadHistory(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
