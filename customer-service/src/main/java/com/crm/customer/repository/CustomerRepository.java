package com.crm.customer.repository;

import com.crm.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByCompanyId(String companyId);

    Optional<Customer> findByEmailAndCompanyId(String email, String companyId);

    List<Customer> findByCompanyIdAndStatus(String companyId, Customer.CustomerStatus status);

    List<Customer> findByCompanyIdAndCompanyContainingIgnoreCase(String companyId, String company);

    List<Customer> findByCompanyIdAndFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String companyId,
            String firstName, String lastName);
}
