package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Reviewer;
import com.webcrafters.confease_backend.service.ReviewerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviewers")
public class ReviewerController {

    private final ReviewerService reviewerService;

    public ReviewerController(ReviewerService reviewerService) {
        this.reviewerService = reviewerService;
    }

    @GetMapping
    public ResponseEntity<List<Reviewer>> getAllReviewers() {
        return ResponseEntity.ok(reviewerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reviewer> getReviewerById(@PathVariable Long id) {
        Reviewer reviewer = reviewerService.getById(id);
        if (reviewer != null) return ResponseEntity.ok(reviewer);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Reviewer> createReviewer(@RequestBody Reviewer reviewer) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewerService.create(reviewer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reviewer> updateReviewer(@PathVariable Long id, @RequestBody Reviewer reviewerDetails) {
        Reviewer updated = reviewerService.update(id, reviewerDetails);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReviewer(@PathVariable Long id) {
        reviewerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
