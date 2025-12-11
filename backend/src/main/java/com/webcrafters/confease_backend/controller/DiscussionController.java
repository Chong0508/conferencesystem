package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Discussion;
import com.webcrafters.confease_backend.repository.DiscussionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
public class DiscussionController {

    @Autowired
    private DiscussionRepository discussionRepository;

    // Get all discussions
    @GetMapping
    public ResponseEntity<List<Discussion>> getAllDiscussions() {
        List<Discussion> discussions = discussionRepository.findAll();
        return ResponseEntity.ok(discussions);
    }

    // Get discussion by ID
    @GetMapping("/{id}")
    public ResponseEntity<Discussion> getDiscussionById(@PathVariable Long id) {
        Optional<Discussion> discussion = discussionRepository.findById(id);
        if (discussion.isPresent()) {
            return ResponseEntity.ok(discussion.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new discussion
    @PostMapping
    public ResponseEntity<Discussion> createDiscussion(@RequestBody Discussion discussion) {
        Discussion savedDiscussion = discussionRepository.save(discussion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDiscussion);
    }

    // Update an existing discussion
    @PutMapping("/{id}")
    public ResponseEntity<Discussion> updateDiscussion(@PathVariable Long id, @RequestBody Discussion discussionDetails) {
        Optional<Discussion> optionalDiscussion = discussionRepository.findById(id);
        if (optionalDiscussion.isPresent()) {
            Discussion discussion = optionalDiscussion.get();
            // Update fields
            discussion.setPaper_id(discussionDetails.getPaper_id());
            discussion.setParticipant_id(discussionDetails.getParticipant_id());
            discussion.setMessage(discussionDetails.getMessage());
            // Note: posted_at is typically not updated, as it's a timestamp for when it was posted

            Discussion updatedDiscussion = discussionRepository.save(discussion);
            return ResponseEntity.ok(updatedDiscussion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a discussion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscussion(@PathVariable Long id) {
        if (discussionRepository.existsById(id)) {
            discussionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}