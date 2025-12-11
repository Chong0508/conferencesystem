package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "review_assignment")
public class ReviewAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assignment_id;
    private Long paper_id;
    private Long reviewer_id;
    private Timestamp assigned_at;
    private Date due_date;
    private String status;

    // Getters and Setters
    public Long getAssignment_id() { return assignment_id; }
    public void setAssignment_id(Long assignment_id) { this.assignment_id = assignment_id; }

    public Long getPaper_id() { return paper_id; }
    public void setPaper_id(Long paper_id) { this.paper_id = paper_id; }

    public Long getReviewer_id() { return reviewer_id; }
    public void setReviewer_id(Long reviewer_id) { this.reviewer_id = reviewer_id; }

    public Timestamp getAssigned_at() { return assigned_at; }
    public void setAssigned_at(Timestamp assigned_at) { this.assigned_at = assigned_at; }

    public Date getDue_date() { return due_date; }
    public void setDue_date(Date due_date) { this.due_date = due_date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
