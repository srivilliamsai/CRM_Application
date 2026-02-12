package com.crm.customer.service;

import com.crm.customer.dto.CustomerDTO;
import com.crm.customer.entity.Customer;
import com.crm.customer.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // ========== CREATE ==========

    public Customer createCustomer(CustomerDTO dto) {
        if (dto.getEmail() != null && customerRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with this email already exists!");
        }

        Customer customer = new Customer();
        mapDtoToEntity(dto, customer);
        return customerRepository.save(customer);
    }

    // ========== READ ==========

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public List<Customer> searchCustomers(String keyword) {
        return customerRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(keyword, keyword);
    }

    public List<Customer> getCustomersByStatus(String status) {
        return customerRepository.findByStatus(Customer.CustomerStatus.valueOf(status.toUpperCase()));
    }

    // ========== UPDATE ==========

    public Customer updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = getCustomerById(id);
        mapDtoToEntity(dto, customer);
        return customerRepository.save(customer);
    }

    // ========== DELETE ==========

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }

    // ========== Helper ==========

    private void mapDtoToEntity(CustomerDTO dto, Customer customer) {
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setCompany(dto.getCompany());
        customer.setJobTitle(dto.getJobTitle());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setState(dto.getState());
        customer.setCountry(dto.getCountry());
        customer.setSource(dto.getSource());

        if (dto.getStatus() != null) {
            customer.setStatus(Customer.CustomerStatus.valueOf(dto.getStatus().toUpperCase()));
        }
    }
}
