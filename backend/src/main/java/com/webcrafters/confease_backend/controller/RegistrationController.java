package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Registration;
import com.webcrafters.confease_backend.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    // Get all registrations
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationRepository.findAll();
        return ResponseEntity.ok(registrations);
    }

    // Get registration by ID
    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable Long id) {
        Optional<Registration> registration = registrationRepository.findById(id);
        if (registration.isPresent()) {
            return ResponseEntity.ok(registration.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new registration
    @PostMapping
    public ResponseEntity<Registration> createRegistration(@RequestBody Registration registration) {
        Registration savedRegistration = registrationRepository.save(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegistration);
    }

    // Update an existing registration
    @PutMapping("/{id}")
    public ResponseEntity<Registration> updateRegistration(@PathVariable Long id, @RequestBody Registration registrationDetails) {
        Optional<Registration> optionalRegistration = registrationRepository.findById(id);
        if (optionalRegistration.isPresent()) {
            Registration registration = optionalRegistration.get();
            // Update fields
            registration.setUser_id(registrationDetails.getUser_id());
            registration.setConference_id(registrationDetails.getConference_id());
            registration.setRegistration_type(registrationDetails.getRegistration_type());
            registration.setEarly_bird(registrationDetails.getEarly_bird());
            registration.setPayment_status(registrationDetails.getPayment_status());
            // Note: registered_at is typically not updated, as it's a timestamp for when the registration was made

            Registration updatedRegistration = registrationRepository.save(registration);
            return ResponseEntity.ok(updatedRegistration);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a registration
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long id) {
        if (registrationRepository.existsById(id)) {
            registrationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}