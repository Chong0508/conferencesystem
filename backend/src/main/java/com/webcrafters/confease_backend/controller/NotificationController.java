package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Notification;
import com.webcrafters.confease_backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationRepository.findAll();
        return ResponseEntity.ok(notifications);
    }

    // Get notification by ID
    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            return ResponseEntity.ok(notification.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
    }

    // Update an existing notification
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification notificationDetails) {
        Optional<Notification> optionalNotification = notificationRepository.findById(id);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            // Update fields
            notification.setUser_id(notificationDetails.getUser_id());
            notification.setMessage(notificationDetails.getMessage());
            notification.setType(notificationDetails.getType());
            notification.setIs_read(notificationDetails.getIs_read());
            // Note: sent_at is typically not updated, as it's a timestamp for when it was sent

            Notification updatedNotification = notificationRepository.save(notification);
            return ResponseEntity.ok(updatedNotification);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}