package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Review;
import com.webcrafters.confease_backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    // Get all reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return ResponseEntity.ok(reviews);
    }

    // Get review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Optional<Review> review = reviewRepository.findById(id);
        if (review.isPresent()) {
            return ResponseEntity.ok(review.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new review
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    // Update an existing review
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review reviewDetails) {
        Optional<Review> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            // Update fields
            review.setAssignment_id(reviewDetails.getAssignment_id());
            review.setReviewer_id(reviewDetails.getReviewer_id());
            review.setOverall_score(reviewDetails.getOverall_score());
            review.setComments_to_author(reviewDetails.getComments_to_author());
            review.setComments_to_chair(reviewDetails.getComments_to_chair());
            review.setRecommendation(reviewDetails.getRecommendation());
            review.setRound_number(reviewDetails.getRound_number());
            review.setDue_date(reviewDetails.getDue_date());
            review.setAttachment(reviewDetails.getAttachment());
            // Note: reviewed_at is typically not updated, as it's a timestamp for when the review was submitted

            Review updatedReview = reviewRepository.save(review);
            return ResponseEntity.ok(updatedReview);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}