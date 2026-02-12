package com.crm.marketing.repository;

import com.crm.marketing.entity.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {

    List<EmailTemplate> findByCategory(String category);

    List<EmailTemplate> findByActiveTrue();
}
