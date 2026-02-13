package com.crm.integration.service;

import com.crm.integration.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send a simple text email.
     */
    public Map<String, Object> sendSimpleEmail(EmailRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getTo());
            message.setSubject(request.getSubject());
            message.setText(request.getBody());

            if (request.getCc() != null && !request.getCc().isEmpty()) {
                message.setCc(request.getCc().toArray(new String[0]));
            }

            mailSender.send(message);
            result.put("status", "SUCCESS");
            result.put("message", "Email sent to " + request.getTo());
        } catch (Exception e) {
            result.put("status", "FAILED");
            result.put("error", e.getMessage());
        }
        return result;
    }

    /**
     * Send an HTML email.
     */
    public Map<String, Object> sendHtmlEmail(EmailRequest request) {
        Map<String, Object> result = new HashMap<>();
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true); // true = isHtml

            if (request.getCc() != null && !request.getCc().isEmpty()) {
                helper.setCc(request.getCc().toArray(new String[0]));
            }

            mailSender.send(mimeMessage);
            result.put("status", "SUCCESS");
            result.put("message", "HTML email sent to " + request.getTo());
        } catch (MessagingException e) {
            result.put("status", "FAILED");
            result.put("error", e.getMessage());
        }
        return result;
    }
}
