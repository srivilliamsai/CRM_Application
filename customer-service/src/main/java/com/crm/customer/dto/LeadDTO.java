package com.crm.customer.dto;

import java.math.BigDecimal;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LeadDTO {

    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String title;

    private String email;
    private String phone;
    private String company;
    private String source;
    private String status;
    private Integer score;
    private String notes;
    private Long assignedTo;
    private String linkedinUrl;
    private String twitterHandle;
    private String website;
    private String industry;
    private BigDecimal annualRevenue;
    private Integer numberOfEmployees;
    private String rating; // Enum as String

    // Address
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    private String companyId;
}
