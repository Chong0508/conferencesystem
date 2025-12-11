package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "rebuttal")
public class Rebuttal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rebuttal_id;
    private Long paper_id;
    private Long author_id;
    private Integer review_round;
    @Column(columnDefinition = "TEXT")
    private String content;
    private Timestamp submitted_at;

    // Getters and Setters
    public Long getRebuttal_id() { return rebuttal_id; }
    public void setRebuttal_id(Long rebuttal_id) { this.rebuttal_id = rebuttal_id; }

    public Long getPaper_id() { return paper_id; }
    public void setPaper_id(Long paper_id) { this.paper_id = paper_id; }

    public Long getAuthor_id() { return author_id; }
    public void setAuthor_id(Long author_id) { this.author_id = author_id; }

    public Integer getReview_round() { return review_round; }
    public void setReview_round(Integer review_round) { this.review_round = review_round; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Timestamp getSubmitted_at() { return submitted_at; }
    public void setSubmitted_at(Timestamp submitted_at) { this.submitted_at = submitted_at; }
}
