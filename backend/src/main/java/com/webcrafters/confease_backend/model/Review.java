package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long review_id;
    private Long assignment_id;
    private Long reviewer_id;
    private Double overall_score;
    @Column(columnDefinition = "TEXT")
    private String comments_to_author;
    @Column(columnDefinition = "TEXT")
    private String comments_to_chair;
    private String recommendation;
    private Integer round_number;
    private Date due_date;
    private String attachment;
    private Timestamp reviewed_at;

    // Getters and Setters
    public Long getReview_id() { return review_id; }
    public void setReview_id(Long review_id) { this.review_id = review_id; }

    public Long getAssignment_id() { return assignment_id; }
    public void setAssignment_id(Long assignment_id) { this.assignment_id = assignment_id; }

    public Long getReviewer_id() { return reviewer_id; }
    public void setReviewer_id(Long reviewer_id) { this.reviewer_id = reviewer_id; }

    public Double getOverall_score() { return overall_score; }
    public void setOverall_score(Double overall_score) { this.overall_score = overall_score; }

    public String getComments_to_author() { return comments_to_author; }
    public void setComments_to_author(String comments_to_author) { this.comments_to_author = comments_to_author; }

    public String getComments_to_chair() { return comments_to_chair; }
    public void setComments_to_chair(String comments_to_chair) { this.comments_to_chair = comments_to_chair; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public Integer getRound_number() { return round_number; }
    public void setRound_number(Integer round_number) { this.round_number = round_number; }

    public Date getDue_date() { return due_date; }
    public void setDue_date(Date due_date) { this.due_date = due_date; }

    public String getAttachment() { return attachment; }
    public void setAttachment(String attachment) { this.attachment = attachment; }

    public Timestamp getReviewed_at() { return reviewed_at; }
    public void setReviewed_at(Timestamp reviewed_at) { this.reviewed_at = reviewed_at; }
}
