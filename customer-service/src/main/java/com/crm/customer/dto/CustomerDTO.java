package com.crm.customer.dto;

import java.math.BigDecimal;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class CustomerDTO {

    private Long id;
    private String companyId;
    private Long assignedTo;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Email must be valid")
    private String email;

    private String phone;
    private String company;
    private String jobTitle;
    private String address;
    private String city;
    private String state;
    private String country;
    private String status;
    private String source;

    private String website;
    private String industry;
    private BigDecimal annualRevenue;
    private String rating; // Enum as String
    private String zipCode;

    // Billing Address
    private String billingStreet;
    private String billingCity;
    private String billingState;
    private String billingZipCode;
    private String billingCountry;
}
