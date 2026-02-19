package com.crm.sales.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DealDTO {

    private Long id;

    @NotBlank(message = "Deal title is required")
    private String title;

    private String description;
    private BigDecimal value;
    private String stage;
    private Long customerId;
    private Long assignedTo;
    private String companyId;
    private String priority;
    private LocalDate expectedCloseDate;

    private String type; // Enum
    private String leadSource;
    private String nextStep;
    private Integer probability;
    private String campaignSource;
}
