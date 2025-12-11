package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.EmailLog;
import com.webcrafters.confease_backend.repository.EmailLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/email-logs")
public class EmailLogController {

    @Autowired
    private EmailLogRepository emailLogRepository;

    // Get all email logs
    @GetMapping
    public ResponseEntity<List<EmailLog>> getAllEmailLogs() {
        List<EmailLog> emailLogs = emailLogRepository.findAll();
        return ResponseEntity.ok(emailLogs);
    }

    // Get email log by ID
    @GetMapping("/{id}")
    public ResponseEntity<EmailLog> getEmailLogById(@PathVariable Long id) {
        Optional<EmailLog> emailLog = emailLogRepository.findById(id);
        if (emailLog.isPresent()) {
            return ResponseEntity.ok(emailLog.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new email log
    @PostMapping
    public ResponseEntity<EmailLog> createEmailLog(@RequestBody EmailLog emailLog) {
        EmailLog savedEmailLog = emailLogRepository.save(emailLog);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEmailLog);
    }

    // Update an existing email log
    @PutMapping("/{id}")
    public ResponseEntity<EmailLog> updateEmailLog(@PathVariable Long id, @RequestBody EmailLog emailLogDetails) {
        Optional<EmailLog> optionalEmailLog = emailLogRepository.findById(id);
        if (optionalEmailLog.isPresent()) {
            EmailLog emailLog = optionalEmailLog.get();
            // Update fields
            emailLog.setRecipient_id(emailLogDetails.getRecipient_id());
            emailLog.setRecipient_email(emailLogDetails.getRecipient_email());
            emailLog.setSubject(emailLogDetails.getSubject());
            emailLog.setBody(emailLogDetails.getBody());
            emailLog.setStatus(emailLogDetails.getStatus());
            emailLog.setSent_by(emailLogDetails.getSent_by());
            // Note: sent_at and delivered_at are typically not updated, as they are timestamps

            EmailLog updatedEmailLog = emailLogRepository.save(emailLog);
            return ResponseEntity.ok(updatedEmailLog);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an email log
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmailLog(@PathVariable Long id) {
        if (emailLogRepository.existsById(id)) {
            emailLogRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}