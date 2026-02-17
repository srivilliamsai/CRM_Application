package com.crm.notification.service;

import com.crm.notification.entity.Notification;
import com.crm.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Map<String, Object> sendFromWorkflow(Map<String, Object> payload) {
        Notification notification = new Notification();
        notification.setTitle((String) payload.getOrDefault("title", "Notification"));
        notification.setMessage((String) payload.getOrDefault("message", ""));
        if (payload.get("recipientUserId") != null) {
            notification.setRecipientUserId(Long.valueOf(payload.get("recipientUserId").toString()));
        }
        notification.setType(Notification.NotificationType.IN_APP);
        notification.setSource("workflow-service");
        notification.setStatus(Notification.NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());

        notificationRepository.save(notification);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SENT");
        response.put("notificationId", notification.getId());
        return response;
    }

    public Notification sendNotification(Notification notification) {
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(Notification.NotificationStatus.SENT);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    // Note: The controller expects getUserNotifications to return generally all or
    // unread?
    // The method name in Controller is getUserNotifications. Usually implies all
    // history.
    // But repository has findByRecipientUserIdOrderByCreatedAtDesc.
    // Let's use that one for getUserNotifications to be safe.

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientUserIdAndStatus(userId, Notification.NotificationStatus.SENT);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientUserIdAndStatus(userId, Notification.NotificationStatus.SENT);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus(Notification.NotificationStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientUserIdAndStatus(userId,
                Notification.NotificationStatus.SENT);
        unread.forEach(n -> {
            n.setStatus(Notification.NotificationStatus.READ);
            n.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unread);
    }
}
