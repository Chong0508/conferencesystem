package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.LogActivity;
import com.webcrafters.confease_backend.repository.LogActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/log-activities")
public class LogActivityController {

    @Autowired
    private LogActivityRepository logActivityRepository;

    // Get all log activities
    @GetMapping
    public ResponseEntity<List<LogActivity>> getAllLogActivities() {
        List<LogActivity> logActivities = logActivityRepository.findAll();
        return ResponseEntity.ok(logActivities);
    }

    // Get log activity by ID
    @GetMapping("/{id}")
    public ResponseEntity<LogActivity> getLogActivityById(@PathVariable Long id) {
        Optional<LogActivity> logActivity = logActivityRepository.findById(id);
        if (logActivity.isPresent()) {
            return ResponseEntity.ok(logActivity.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new log activity
    @PostMapping
    public ResponseEntity<LogActivity> createLogActivity(@RequestBody LogActivity logActivity) {
        LogActivity savedLogActivity = logActivityRepository.save(logActivity);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLogActivity);
    }

    // Update an existing log activity
    @PutMapping("/{id}")
    public ResponseEntity<LogActivity> updateLogActivity(@PathVariable Long id, @RequestBody LogActivity logActivityDetails) {
        Optional<LogActivity> optionalLogActivity = logActivityRepository.findById(id);
        if (optionalLogActivity.isPresent()) {
            LogActivity logActivity = optionalLogActivity.get();
            // Update fields
            logActivity.setUser_id(logActivityDetails.getUser_id());
            logActivity.setAction(logActivityDetails.getAction());
            logActivity.setDetails(logActivityDetails.getDetails());
            logActivity.setLogin_time(logActivityDetails.getLogin_time());
            logActivity.setLogout_time(logActivityDetails.getLogout_time());

            LogActivity updatedLogActivity = logActivityRepository.save(logActivity);
            return ResponseEntity.ok(updatedLogActivity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a log activity
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLogActivity(@PathVariable Long id) {
        if (logActivityRepository.existsById(id)) {
            logActivityRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}