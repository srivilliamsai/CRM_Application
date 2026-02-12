package com.crm.customer.controller;

import com.crm.customer.dto.LeadDTO;
import com.crm.customer.entity.Lead;
import com.crm.customer.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

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
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Lead>> getLeadsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(leadService.getLeadsByStatus(status));
    }

    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<Lead>> getLeadsByAssignee(@PathVariable Long userId) {
        return ResponseEntity.ok(leadService.getLeadsByAssignee(userId));
    }

    @GetMapping("/high-score")
    public ResponseEntity<List<Lead>> getHighScoreLeads(@RequestParam(defaultValue = "70") Integer minScore) {
        return ResponseEntity.ok(leadService.getHighScoreLeads(minScore));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lead> updateLead(@PathVariable Long id, @Valid @RequestBody LeadDTO dto) {
        return ResponseEntity.ok(leadService.updateLead(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(leadService.updateLeadStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
