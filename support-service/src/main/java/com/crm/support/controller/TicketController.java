package com.crm.support.controller;

import com.crm.support.dto.TicketDTO;
import com.crm.support.entity.Ticket;
import com.crm.support.entity.TicketResponse;
import com.crm.support.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ticket>> getTicketsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Ticket>> getTicketsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ticketService.getTicketsByCustomer(customerId));
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
