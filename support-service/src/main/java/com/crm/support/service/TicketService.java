package com.crm.support.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crm.support.dto.TicketDTO;
import com.crm.support.entity.Ticket;
import com.crm.support.entity.TicketResponse;
import com.crm.support.repository.TicketRepository;
import com.crm.support.repository.TicketResponseRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketResponseRepository responseRepository;

    public Ticket createTicket(TicketDTO dto) {
        Ticket ticket = new Ticket();
        mapDtoToEntity(dto, ticket);
        if (dto.getCompanyId() != null) {
            ticket.setCompanyId(dto.getCompanyId());
        }
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets(String companyId) {
        return ticketRepository.findByCompanyId(companyId);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public List<Ticket> getTicketsByStatus(String companyId, String status) {
        return ticketRepository.findByCompanyIdAndStatus(companyId, Ticket.TicketStatus.valueOf(status.toUpperCase()));
    }

    public List<Ticket> getTicketsByCustomer(String companyId, Long customerId) {
        return ticketRepository.findByCompanyIdAndCustomerId(companyId, customerId);
    }

    public List<Ticket> getTicketsByAssignee(String companyId, Long userId) {
        return ticketRepository.findByCompanyIdAndAssignedTo(companyId, userId);
    }

    public Ticket updateTicket(Long id, TicketDTO dto) {
        Ticket ticket = getTicketById(id);
        mapDtoToEntity(dto, ticket);
        if (dto.getCompanyId() != null) {
			ticket.setCompanyId(dto.getCompanyId());
		}
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long id, String status) {
        Ticket ticket = getTicketById(id);
        Ticket.TicketStatus newStatus = Ticket.TicketStatus.valueOf(status.toUpperCase());
        ticket.setStatus(newStatus);

        if (newStatus == Ticket.TicketStatus.RESOLVED || newStatus == Ticket.TicketStatus.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        return ticketRepository.save(ticket);
    }

    // ============ Responses ============

    public TicketResponse addResponse(Long ticketId, String message, Long respondedBy, String responderType) {
        Ticket ticket = getTicketById(ticketId);
        TicketResponse response = new TicketResponse();
        response.setMessage(message);
        response.setRespondedBy(respondedBy);
        response.setResponderType(responderType);
        response.setTicket(ticket);
        response.setCompanyId(ticket.getCompanyId());
        return responseRepository.save(response);
    }

    public List<TicketResponse> getResponses(Long ticketId) {
        return responseRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }

    private void mapDtoToEntity(TicketDTO dto, Ticket ticket) {
        ticket.setSubject(dto.getSubject());
        ticket.setDescription(dto.getDescription());
        ticket.setCategory(dto.getCategory());
        ticket.setCustomerId(dto.getCustomerId());
        ticket.setAssignedTo(dto.getAssignedTo());
        if (dto.getPriority() != null) {
			ticket.setPriority(Ticket.TicketPriority.valueOf(dto.getPriority().toUpperCase()));
		}
        if (dto.getStatus() != null) {
			ticket.setStatus(Ticket.TicketStatus.valueOf(dto.getStatus().toUpperCase()));
		}
    }
}
