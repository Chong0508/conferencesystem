package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.ReviewScore;
import com.webcrafters.confease_backend.model.ReviewScoreId;
import com.webcrafters.confease_backend.service.ReviewScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-scores")
public class ReviewScoreController {

    private final ReviewScoreService reviewScoreService;

    public ReviewScoreController(ReviewScoreService reviewScoreService) {
        this.reviewScoreService = reviewScoreService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewScore>> getAllReviewScores() {
        List<ReviewScore> list = reviewScoreService.getAll(); // use getAll()
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{reviewId}/{criterionId}")
    public ResponseEntity<ReviewScore> getReviewScoreById(@PathVariable Long reviewId,
                                                          @PathVariable Integer criterionId) {
        ReviewScoreId id = new ReviewScoreId();
        id.setReview_id(reviewId);
        id.setCriterion_id(criterionId);

        try {
            ReviewScore reviewScore = reviewScoreService.getById(id); // use getById()
            return new ResponseEntity<>(reviewScore, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<ReviewScore> createReviewScore(@RequestBody ReviewScore reviewScore) {
        ReviewScore saved = reviewScoreService.create(reviewScore); // use create()
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{reviewId}/{criterionId}")
    public ResponseEntity<ReviewScore> updateReviewScore(@PathVariable Long reviewId,
                                                         @PathVariable Integer criterionId,
                                                         @RequestBody ReviewScore reviewScoreDetails) {
        ReviewScoreId id = new ReviewScoreId();
        id.setReview_id(reviewId);
        id.setCriterion_id(criterionId);

        try {
            ReviewScore updated = reviewScoreService.update(id, reviewScoreDetails); // use update()
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{reviewId}/{criterionId}")
    public ResponseEntity<Void> deleteReviewScore(@PathVariable Long reviewId,
                                                  @PathVariable Integer criterionId) {
        ReviewScoreId id = new ReviewScoreId();
        id.setReview_id(reviewId);
        id.setCriterion_id(criterionId);

        reviewScoreService.delete(id); // use delete()
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
