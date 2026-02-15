package com.crm.customer.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LeadDTO {

    private Long id;

    @NotBlank(message = "Lead name is required")
    private String name;

    private String email;
    private String phone;
    private String company;
    private String source;
    private String status;
    private Integer score;
    private String notes;
    private Long assignedTo;
    private String companyId;
}
