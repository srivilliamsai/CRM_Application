package com.crm.sales.controller;

import com.crm.sales.dto.DealDTO;
import com.crm.sales.entity.Deal;
import com.crm.sales.service.DealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "*")
public class DealController {

    @Autowired
    private DealService dealService;

    @PostMapping
    public ResponseEntity<Deal> createDeal(@Valid @RequestBody DealDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dealService.createDeal(dto));
    }

    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals(@RequestParam String companyId) {
        return ResponseEntity.ok(dealService.getAllDeals(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deal> getDealById(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.getDealById(id));
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<Deal>> getDealsByStage(@PathVariable String stage, @RequestParam String companyId) {
        return ResponseEntity.ok(dealService.getDealsByStage(companyId, stage));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Deal>> getDealsByCustomer(@PathVariable Long customerId,
            @RequestParam String companyId) {
        return ResponseEntity.ok(dealService.getDealsByCustomer(companyId, customerId));
    }

    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<Deal>> getDealsByAssignee(@PathVariable Long userId, @RequestParam String companyId) {
        return ResponseEntity.ok(dealService.getDealsByAssignee(companyId, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Deal>> searchDeals(@RequestParam String keyword, @RequestParam String companyId) {
        return ResponseEntity.ok(dealService.searchDeals(companyId, keyword));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(@PathVariable Long id, @Valid @RequestBody DealDTO dto) {
        return ResponseEntity.ok(dealService.updateDeal(id, dto));
    }

    @PutMapping("/{id}/stage")
    public ResponseEntity<Deal> updateDealStage(@PathVariable Long id, @RequestParam String stage) {
        return ResponseEntity.ok(dealService.updateDealStage(id, stage));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeal(@PathVariable Long id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }
}
