package com.webcrafters.confease_backend.model;

import java.io.Serializable;

public class ReviewScoreId implements Serializable {
    private Long review_id;
    private Integer criterion_id;

    // Default constructor
    public ReviewScoreId() {}

    // Getters and Setters
    public Long getReview_id() { return review_id; }
    public void setReview_id(Long review_id) { this.review_id = review_id; }

    public Integer getCriterion_id() { return criterion_id; }
    public void setCriterion_id(Integer criterion_id) { this.criterion_id = criterion_id; }
}
