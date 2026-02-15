package com.crm.support.dto;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class TicketDTO {

    private Long id;

    @NotBlank(message = "Subject is required")
    private String subject;

    private String description;
    private String status;
    private String priority;
    private String category;
    private Long customerId;
    private Long assignedTo;
    private String companyId;
}
