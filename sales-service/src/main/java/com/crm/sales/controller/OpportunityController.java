package com.crm.sales.controller;

import com.crm.sales.entity.Opportunity;
import com.crm.sales.service.OpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@CrossOrigin(origins = "*")
public class OpportunityController {

    @Autowired
    private OpportunityService opportunityService;

    @PostMapping
    public ResponseEntity<Opportunity> create(@RequestBody Opportunity opportunity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(opportunityService.createOpportunity(opportunity));
    }

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAll(@RequestParam String companyId) {
        return ResponseEntity.ok(opportunityService.getAllOpportunities(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getById(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Opportunity>> getByStatus(@PathVariable String status, @RequestParam String companyId) {
        return ResponseEntity.ok(opportunityService.getOpportunitiesByStatus(companyId, status));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Opportunity>> getByCustomer(@PathVariable Long customerId,
            @RequestParam String companyId) {
        return ResponseEntity.ok(opportunityService.getOpportunitiesByCustomer(companyId, customerId));
    }

    @GetMapping("/high-probability")
    public ResponseEntity<List<Opportunity>> getHighProbability(
            @RequestParam(defaultValue = "70") Integer minProbability, @RequestParam String companyId) {
        return ResponseEntity.ok(opportunityService.getHighProbabilityOpportunities(companyId, minProbability));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Opportunity> update(@PathVariable Long id, @RequestBody Opportunity opportunity) {
        return ResponseEntity.ok(opportunityService.updateOpportunity(id, opportunity));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Opportunity> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(opportunityService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        opportunityService.deleteOpportunity(id);
        return ResponseEntity.noContent().build();
    }
}
