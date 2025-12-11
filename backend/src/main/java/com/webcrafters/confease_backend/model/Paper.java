package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "paper")
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paper_id;
    private Long track_id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String abstractText;
    private String submission_file;
    private String file_type;
    private Integer version;
    private Double plagiarism_score;
    private String status;
    private Long submitted_by;
    private Timestamp submitted_at;
    private Timestamp last_updated;

    // Getters and Setters
    public Long getPaper_id() { return paper_id; }
    public void setPaper_id(Long paper_id) { this.paper_id = paper_id; }

    public Long getTrack_id() { return track_id; }
    public void setTrack_id(Long track_id) { this.track_id = track_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAbstractText() { return abstractText; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }

    public String getSubmission_file() { return submission_file; }
    public void setSubmission_file(String submission_file) { this.submission_file = submission_file; }

    public String getFile_type() { return file_type; }
    public void setFile_type(String file_type) { this.file_type = file_type; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public Double getPlagiarism_score() { return plagiarism_score; }
    public void setPlagiarism_score(Double plagiarism_score) { this.plagiarism_score = plagiarism_score; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getSubmitted_by() { return submitted_by; }
    public void setSubmitted_by(Long submitted_by) { this.submitted_by = submitted_by; }

    public Timestamp getSubmitted_at() { return submitted_at; }
    public void setSubmitted_at(Timestamp submitted_at) { this.submitted_at = submitted_at; }

    public Timestamp getLast_updated() { return last_updated; }
    public void setLast_updated(Timestamp last_updated) { this.last_updated = last_updated; }
}
