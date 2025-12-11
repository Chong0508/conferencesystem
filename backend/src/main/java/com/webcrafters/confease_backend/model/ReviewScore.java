package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "review_score")
@IdClass(ReviewScoreId.class)
public class ReviewScore {

    @Id
    private Long review_id;
    @Id
    private Integer criterion_id;
    private Double score;

    // Getters and Setters
    public Long getReview_id() { return review_id; }
    public void setReview_id(Long review_id) { this.review_id = review_id; }

    public Integer getCriterion_id() { return criterion_id; }
    public void setCriterion_id(Integer criterion_id) { this.criterion_id = criterion_id; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
}
