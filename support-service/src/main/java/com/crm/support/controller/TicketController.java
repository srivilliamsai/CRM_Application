package com.crm.support.controller;

import java.util.List;
import java.util.Map;

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

import com.crm.support.dto.TicketDTO;
import com.crm.support.entity.Ticket;
import com.crm.support.entity.TicketResponse;
import com.crm.support.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.createTicket(dto));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(@RequestParam String companyId) {
        return ResponseEntity.ok(ticketService.getAllTickets(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String status,
            @RequestParam String companyId) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(companyId, status));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Ticket>> getTicketsByCustomer(@PathVariable Long customerId,
            @RequestParam String companyId) {
        return ResponseEntity.ok(ticketService.getTicketsByCustomer(companyId, customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketDTO dto) {
        return ResponseEntity.ok(ticketService.updateTicket(id, dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // ============ Responses ============

    @PostMapping("/{id}/responses")
    public ResponseEntity<TicketResponse> addResponse(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String message = (String) body.get("message");
        Long respondedBy = Long.valueOf(body.get("respondedBy").toString());
        String responderType = (String) body.getOrDefault("responderType", "AGENT");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addResponse(id, message, respondedBy, responderType));
    }

    @GetMapping("/{id}/responses")
    public ResponseEntity<List<TicketResponse>> getResponses(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getResponses(id));
    }
}
