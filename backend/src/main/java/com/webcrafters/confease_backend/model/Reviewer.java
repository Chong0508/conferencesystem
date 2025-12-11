package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reviewer")
public class Reviewer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewer_id;
    private Long user_id;
    private String expertise_area;
    private Integer max_papers;

    // Getters and Setters
    public Long getReviewer_id() { return reviewer_id; }
    public void setReviewer_id(Long reviewer_id) { this.reviewer_id = reviewer_id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public String getExpertise_area() { return expertise_area; }
    public void setExpertise_area(String expertise_area) { this.expertise_area = expertise_area; }

    public Integer getMax_papers() { return max_papers; }
    public void setMax_papers(Integer max_papers) { this.max_papers = max_papers; }
}
