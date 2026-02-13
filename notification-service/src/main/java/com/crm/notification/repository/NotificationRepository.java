package com.crm.notification.repository;

import com.crm.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByRecipientUserIdAndStatus(Long userId, Notification.NotificationStatus status);

    List<Notification> findByType(Notification.NotificationType type);

    List<Notification> findByStatus(Notification.NotificationStatus status);

    long countByRecipientUserIdAndStatus(Long userId, Notification.NotificationStatus status);
}
