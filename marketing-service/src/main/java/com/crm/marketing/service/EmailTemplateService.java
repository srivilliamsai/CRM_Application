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
        return templateRepository.save(template);
    }

    public List<EmailTemplate> getAllActiveTemplates() {
        return templateRepository.findByActiveTrue();
    }

    public List<EmailTemplate> getTemplatesByCategory(String category) {
        return templateRepository.findByCategory(category);
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
        return templateRepository.save(existing);
    }

    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
}
