package com.crm.sales.dto;

import lombok.Data;

/**
 * DTO to receive Customer data from customer-service via Feign.
 */
@Data
public class CustomerDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String company;
    private String status;
}
