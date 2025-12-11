package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "conference")
public class Conference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conference_id;
    private String title;
    private String acronym;
    private Date start_date;
    private Date end_date;
    private String location;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String website_url;
    private Date submission_deadline;
    private Date review_deadline;
    private Date rebuttal_deadline;
    private Date camera_ready_deadline;
    private Date registration_deadline;
    private Date late_submission_deadline;
    private String status;
    private Long created_by;
    private Timestamp created_at;

    // Getters and Setters
    public Long getConference_id() { return conference_id; }
    public void setConference_id(Long conference_id) { this.conference_id = conference_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAcronym() { return acronym; }
    public void setAcronym(String acronym) { this.acronym = acronym; }

    public Date getStart_date() { return start_date; }
    public void setStart_date(Date start_date) { this.start_date = start_date; }

    public Date getEnd_date() { return end_date; }
    public void setEnd_date(Date end_date) { this.end_date = end_date; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWebsite_url() { return website_url; }
    public void setWebsite_url(String website_url) { this.website_url = website_url; }

    public Date getSubmission_deadline() { return submission_deadline; }
    public void setSubmission_deadline(Date submission_deadline) { this.submission_deadline = submission_deadline; }

    public Date getReview_deadline() { return review_deadline; }
    public void setReview_deadline(Date review_deadline) { this.review_deadline = review_deadline; }

    public Date getRebuttal_deadline() { return rebuttal_deadline; }
    public void setRebuttal_deadline(Date rebuttal_deadline) { this.rebuttal_deadline = rebuttal_deadline; }

    public Date getCamera_ready_deadline() { return camera_ready_deadline; }
    public void setCamera_ready_deadline(Date camera_ready_deadline) { this.camera_ready_deadline = camera_ready_deadline; }

    public Date getRegistration_deadline() { return registration_deadline; }
    public void setRegistration_deadline(Date registration_deadline) { this.registration_deadline = registration_deadline; }

    public Date getLate_submission_deadline() { return late_submission_deadline; }
    public void setLate_submission_deadline(Date late_submission_deadline) { this.late_submission_deadline = late_submission_deadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCreated_by() { return created_by; }
    public void setCreated_by(Long created_by) { this.created_by = created_by; }

    public Timestamp getCreated_at() { return created_at; }
    public void setCreated_at(Timestamp created_at) { this.created_at = created_at; }
}
