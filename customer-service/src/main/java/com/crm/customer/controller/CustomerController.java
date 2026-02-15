package com.crm.customer.controller;

import com.crm.customer.dto.CustomerDTO;
import com.crm.customer.entity.Customer;
import com.crm.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody CustomerDTO dto) {
        Customer created = customerService.createCustomer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers(@RequestParam String companyId) {
        return ResponseEntity.ok(customerService.getAllCustomers(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam String keyword,
            @RequestParam String companyId) {
        return ResponseEntity.ok(customerService.searchCustomers(companyId, keyword));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Customer>> getByStatus(@PathVariable String status, @RequestParam String companyId) {
        return ResponseEntity.ok(customerService.getCustomersByStatus(companyId, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerDTO dto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
