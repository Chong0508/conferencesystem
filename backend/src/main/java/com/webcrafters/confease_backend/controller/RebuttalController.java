package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Rebuttal;
import com.webcrafters.confease_backend.repository.RebuttalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rebuttals")
public class RebuttalController {

    @Autowired
    private RebuttalRepository rebuttalRepository;

    // Get all rebuttals
    @GetMapping
    public ResponseEntity<List<Rebuttal>> getAllRebuttals() {
        List<Rebuttal> rebuttals = rebuttalRepository.findAll();
        return ResponseEntity.ok(rebuttals);
    }

    // Get rebuttal by ID
    @GetMapping("/{id}")
    public ResponseEntity<Rebuttal> getRebuttalById(@PathVariable Long id) {
        Optional<Rebuttal> rebuttal = rebuttalRepository.findById(id);
        if (rebuttal.isPresent()) {
            return ResponseEntity.ok(rebuttal.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new rebuttal
    @PostMapping
    public ResponseEntity<Rebuttal> createRebuttal(@RequestBody Rebuttal rebuttal) {
        Rebuttal savedRebuttal = rebuttalRepository.save(rebuttal);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRebuttal);
    }

    // Update an existing rebuttal
    @PutMapping("/{id}")
    public ResponseEntity<Rebuttal> updateRebuttal(@PathVariable Long id, @RequestBody Rebuttal rebuttalDetails) {
        Optional<Rebuttal> optionalRebuttal = rebuttalRepository.findById(id);
        if (optionalRebuttal.isPresent()) {
            Rebuttal rebuttal = optionalRebuttal.get();
            // Update fields
            rebuttal.setPaper_id(rebuttalDetails.getPaper_id());
            rebuttal.setAuthor_id(rebuttalDetails.getAuthor_id());
            rebuttal.setReview_round(rebuttalDetails.getReview_round());
            rebuttal.setContent(rebuttalDetails.getContent());
            // Note: submitted_at is typically not updated, as it's a timestamp for when the rebuttal was submitted

            Rebuttal updatedRebuttal = rebuttalRepository.save(rebuttal);
            return ResponseEntity.ok(updatedRebuttal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a rebuttal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRebuttal(@PathVariable Long id) {
        if (rebuttalRepository.existsById(id)) {
            rebuttalRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}