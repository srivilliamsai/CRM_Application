package com.crm.marketing.service;

import com.crm.marketing.entity.EmailTemplate;
import com.crm.marketing.repository.EmailTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailTemplateService {

    @Autowired
    private EmailTemplateRepository templateRepository;

    public EmailTemplate createTemplate(EmailTemplate template) {
        // Enforce companyId from context or object
        return templateRepository.save(template);
    }

    public List<EmailTemplate> getAllActiveTemplates(String companyId) {
        return templateRepository.findByCompanyIdAndActiveTrue(companyId);
    }

    public List<EmailTemplate> getTemplatesByCategory(String companyId, String category) {
        return templateRepository.findByCompanyIdAndCategory(companyId, category);
    }

    public EmailTemplate getTemplateById(Long id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
    }

    public EmailTemplate updateTemplate(Long id, EmailTemplate template) {
        EmailTemplate existing = getTemplateById(id);
        existing.setName(template.getName());
        existing.setSubject(template.getSubject());
        existing.setBody(template.getBody());
        existing.setCategory(template.getCategory());
        existing.setActive(template.isActive());
        if (template.getCompanyId() != null)
            existing.setCompanyId(template.getCompanyId());
        return templateRepository.save(existing);
    }

    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
}
