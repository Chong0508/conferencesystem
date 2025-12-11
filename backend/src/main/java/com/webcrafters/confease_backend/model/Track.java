package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "track")
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long track_id;
    private Long conference_id;
    private String name;
    private Long chair_id;
    @Column(columnDefinition = "TEXT")
    private String description;

    // Getters and Setters
    public Long getTrack_id() { return track_id; }
    public void setTrack_id(Long track_id) { this.track_id = track_id; }

    public Long getConference_id() { return conference_id; }
    public void setConference_id(Long conference_id) { this.conference_id = conference_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getChair_id() { return chair_id; }
    public void setChair_id(Long chair_id) { this.chair_id = chair_id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
