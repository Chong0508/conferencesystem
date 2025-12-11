package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Conference;
import com.webcrafters.confease_backend.repository.ConferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/conferences")
public class ConferenceController {

    @Autowired
    private ConferenceRepository conferenceRepository;

    // Get all conferences
    @GetMapping
    public ResponseEntity<List<Conference>> getAllConferences() {
        List<Conference> conferences = conferenceRepository.findAll();
        return ResponseEntity.ok(conferences);
    }

    // Get conference by ID
    @GetMapping("/{id}")
    public ResponseEntity<Conference> getConferenceById(@PathVariable Long id) {
        Optional<Conference> conference = conferenceRepository.findById(id);
        if (conference.isPresent()) {
            return ResponseEntity.ok(conference.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new conference
    @PostMapping
    public ResponseEntity<Conference> createConference(@RequestBody Conference conference) {
        Conference savedConference = conferenceRepository.save(conference);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedConference);
    }

    // Update an existing conference
    @PutMapping("/{id}")
    public ResponseEntity<Conference> updateConference(@PathVariable Long id, @RequestBody Conference conferenceDetails) {
        Optional<Conference> optionalConference = conferenceRepository.findById(id);
        if (optionalConference.isPresent()) {
            Conference conference = optionalConference.get();
            // Update fields
            conference.setTitle(conferenceDetails.getTitle());
            conference.setAcronym(conferenceDetails.getAcronym());
            conference.setStart_date(conferenceDetails.getStart_date());
            conference.setEnd_date(conferenceDetails.getEnd_date());
            conference.setLocation(conferenceDetails.getLocation());
            conference.setDescription(conferenceDetails.getDescription());
            conference.setWebsite_url(conferenceDetails.getWebsite_url());
            conference.setSubmission_deadline(conferenceDetails.getSubmission_deadline());
            conference.setReview_deadline(conferenceDetails.getReview_deadline());
            conference.setRebuttal_deadline(conferenceDetails.getRebuttal_deadline());
            conference.setCamera_ready_deadline(conferenceDetails.getCamera_ready_deadline());
            conference.setRegistration_deadline(conferenceDetails.getRegistration_deadline());
            conference.setLate_submission_deadline(conferenceDetails.getLate_submission_deadline());
            conference.setStatus(conferenceDetails.getStatus());
            conference.setCreated_by(conferenceDetails.getCreated_by());
            // Note: created_at is typically not updated

            Conference updatedConference = conferenceRepository.save(conference);
            return ResponseEntity.ok(updatedConference);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a conference
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConference(@PathVariable Long id) {
        if (conferenceRepository.existsById(id)) {
            conferenceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}