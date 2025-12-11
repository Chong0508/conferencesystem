package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "discussion")
public class Discussion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discussion_id;
    private Long paper_id;
    private Long participant_id;
    @Column(columnDefinition = "TEXT")
    private String message;
    private Timestamp posted_at;

    // Getters and Setters
    public Long getDiscussion_id() { return discussion_id; }
    public void setDiscussion_id(Long discussion_id) { this.discussion_id = discussion_id; }

    public Long getPaper_id() { return paper_id; }
    public void setPaper_id(Long paper_id) { this.paper_id = paper_id; }

    public Long getParticipant_id() { return participant_id; }
    public void setParticipant_id(Long participant_id) { this.participant_id = participant_id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Timestamp getPosted_at() { return posted_at; }
    public void setPosted_at(Timestamp posted_at) { this.posted_at = posted_at; }
}
