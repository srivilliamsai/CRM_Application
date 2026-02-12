package com.crm.sales.controller;

import com.crm.sales.entity.Followup;
import com.crm.sales.service.FollowupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
@CrossOrigin(origins = "*")
public class FollowupController {

    @Autowired
    private FollowupService followupService;

    @PostMapping
    public ResponseEntity<Followup> create(@RequestBody Followup followup) {
        return ResponseEntity.status(HttpStatus.CREATED).body(followupService.createFollowup(followup));
    }

    @GetMapping("/deal/{dealId}")
    public ResponseEntity<List<Followup>> getByDeal(@PathVariable Long dealId) {
        return ResponseEntity.ok(followupService.getFollowupsByDeal(dealId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Followup>> getPending() {
        return ResponseEntity.ok(followupService.getPendingFollowups());
    }

    @GetMapping("/pending/user/{userId}")
    public ResponseEntity<List<Followup>> getPendingByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(followupService.getPendingByUser(userId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Followup> markComplete(@PathVariable Long id) {
        return ResponseEntity.ok(followupService.markComplete(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        followupService.deleteFollowup(id);
        return ResponseEntity.noContent().build();
    }
}
