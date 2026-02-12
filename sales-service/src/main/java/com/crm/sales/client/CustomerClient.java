package com.crm.sales.client;

import com.crm.sales.dto.CustomerDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign Client to communicate with Customer Service.
 * Uses Eureka service discovery — no hardcoded URLs needed.
 */
@FeignClient(name = "customer-service")
public interface CustomerClient {

    @GetMapping("/api/customers/{id}")
    CustomerDTO getCustomerById(@PathVariable("id") Long id);
}
