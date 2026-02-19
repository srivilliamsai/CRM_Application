package com.crm.customer.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crm.customer.dto.CustomerDTO;
import com.crm.customer.entity.Customer;
import com.crm.customer.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private com.crm.customer.client.NotificationClient notificationClient;

    // ========== CREATE ==========

    public Customer createCustomer(CustomerDTO dto) {
        if (dto.getEmail() != null
                && customerRepository.findByEmailAndCompanyId(dto.getEmail(), dto.getCompanyId()).isPresent()) {
            throw new RuntimeException("Customer with this email already exists!");
        }

        Customer customer = new Customer();
        mapDtoToEntity(dto, customer);
        Customer savedCustomer = customerRepository.save(customer);

        // Notify if assigned
        if (savedCustomer.getAssignedTo() != null) {
            sendAssignmentNotification(savedCustomer.getAssignedTo(), "Customer", savedCustomer.getId(),
                    savedCustomer.getFirstName() + " " + savedCustomer.getLastName());
        }

        return savedCustomer;
    }

    // ========== READ ==========

    public List<Customer> getAllCustomers(String companyId) {
        return customerRepository.findByCompanyId(companyId);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public List<Customer> searchCustomers(String companyId, String keyword) {
        return customerRepository
                .findByCompanyIdAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(companyId, keyword,
                        keyword);
    }

    public List<Customer> getCustomersByStatus(String companyId, String status) {
        return customerRepository.findByCompanyIdAndStatus(companyId,
                Customer.CustomerStatus.valueOf(status.toUpperCase()));
    }

    // ========== UPDATE ==========

    public Customer updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = getCustomerById(id);
        Long oldAssignee = customer.getAssignedTo();

        mapDtoToEntity(dto, customer);
        Customer savedCustomer = customerRepository.save(customer);

        // Notify if assignment changed
        if (dto.getAssignedTo() != null && !dto.getAssignedTo().equals(oldAssignee)) {
            System.out.println("Triggering notification for Customer assignment. New: " + dto.getAssignedTo()
                    + ", Old: " + oldAssignee);
            sendAssignmentNotification(dto.getAssignedTo(), "Customer", savedCustomer.getId(),
                    savedCustomer.getFirstName() + " " + savedCustomer.getLastName());
        } else {
            System.out.println(
                    "No notification triggered for Customer. New: " + dto.getAssignedTo() + ", Old: " + oldAssignee);
        }

        return savedCustomer;
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
            try {
                customer.setStatus(Customer.CustomerStatus.valueOf(dto.getStatus().toUpperCase()));
            } catch (Exception e) {
                // Ignore
            }
        }

        customer.setWebsite(dto.getWebsite());
        customer.setIndustry(dto.getIndustry());
        customer.setAnnualRevenue(dto.getAnnualRevenue());
        customer.setZipCode(dto.getZipCode());
        customer.setBillingStreet(dto.getBillingStreet());
        customer.setBillingCity(dto.getBillingCity());
        customer.setBillingState(dto.getBillingState());
        customer.setBillingZipCode(dto.getBillingZipCode());
        customer.setBillingCountry(dto.getBillingCountry());

        if (dto.getRating() != null && !dto.getRating().isEmpty()) {
            try {
                customer.setRating(Customer.CustomerRating.valueOf(dto.getRating().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Ignore
            }
        }

        if (dto.getCompanyId() != null) {
            customer.setCompanyId(dto.getCompanyId());
        }

        if (dto.getAssignedTo() != null) {
            customer.setAssignedTo(dto.getAssignedTo());
        }
    }

    private void sendAssignmentNotification(Long recipientId, String type, Long referenceId, String name) {
        try {
            java.util.Map<String, Object> notification = new java.util.HashMap<>();
            notification.put("recipientUserId", recipientId);
            notification.put("type", "IN_APP");
            notification.put("title", "New " + type + " Assigned");
            notification.put("message", "You have been assigned a new " + type + ": " + name);
            notification.put("source", "CUSTOMER_SERVICE");
            notification.put("referenceType", type.toUpperCase()); // LEAD or CUSTOMER
            notification.put("referenceId", referenceId);
            notification.put("status", "PENDING");

            notificationClient.sendNotification(notification);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}
