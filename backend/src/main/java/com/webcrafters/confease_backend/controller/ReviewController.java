package com.webcrafters.confease_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcrafters.confease_backend.model.Review;
import com.webcrafters.confease_backend.model.ReviewScore;
import com.webcrafters.confease_backend.repository.PaperRepository;
import com.webcrafters.confease_backend.repository.ReviewRepository;
import com.webcrafters.confease_backend.service.ReviewScoreService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:4200", "http://frontend:4200", "http://host.docker.internal:4200"}, allowCredentials = "true")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewScoreService reviewScoreService;

    @Autowired
    private PaperRepository paperRepository;

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
            review.setAssignment_id(reviewDetails.getAssignment_id());
            review.setReviewer_id(reviewDetails.getReviewer_id());
            review.setOverall_score(reviewDetails.getOverall_score());
            review.setComments_to_author(reviewDetails.getComments_to_author());
            review.setComments_to_chair(reviewDetails.getComments_to_chair());
            review.setRecommendation(reviewDetails.getRecommendation());
            review.setRound_number(reviewDetails.getRound_number());
            review.setDue_date(reviewDetails.getDue_date());
            review.setAttachment(reviewDetails.getAttachment());

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

    @PostMapping("/submit-full")
    @Transactional // Ensures atomicity: all 3 tables update or none do
    public ResponseEntity<?> submitFullReview(@RequestBody Map<String, Object> payload) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.findAndRegisterModules(); // For Date handling

            // 1. Save the Review
            Review review = mapper.convertValue(payload.get("review"), Review.class);
            Review savedReview = reviewRepository.save(review);

            // 2. Save the Review Scores (linking to the new review_id)
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> scoresData = (List<Map<String, Object>>) payload.get("scores");
            for (Map<String, Object> s : scoresData) {
                ReviewScore rs = new ReviewScore();
                rs.setReview_id(savedReview.getReview_id());
                rs.setCriterion_id((Integer) s.get("criterion_id"));
                rs.setScore(Double.valueOf(s.get("score").toString()));
                reviewScoreService.create(rs);
            }

            // 3. Update Paper Status based on Recommendation
            paperRepository.findById(savedReview.getAssignment_id()).ifPresent(paper -> {
                String recommendation = savedReview.getRecommendation();
                String newStatus;

                // Mapping logic based on your requirement
                if ("Accept".equalsIgnoreCase(recommendation)) {
                    newStatus = "Accepted";
                } else if ("Reject".equalsIgnoreCase(recommendation)) {
                    newStatus = "Rejected";
                } else if ("Revision".equalsIgnoreCase(recommendation)) {
                    newStatus = "Revised";
                } else {
                    newStatus = "Reviewed"; // Fallback default
                }

                paper.setStatus(newStatus); 
                paperRepository.save(paper);
            });

            return ResponseEntity.ok(Map.of(
                "message", "Full review processed successfully",
                "status", "Success"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}