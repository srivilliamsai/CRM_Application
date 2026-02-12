package com.crm.marketing.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class CampaignDTO {

    private Long id;

    @NotBlank(message = "Campaign name is required")
    private String name;

    private String description;
    private String type;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer targetAudience;
}
