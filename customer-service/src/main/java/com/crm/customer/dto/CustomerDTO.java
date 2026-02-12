package com.crm.customer.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class CustomerDTO {

    private Long id;

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
}
