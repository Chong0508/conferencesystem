package com.webcrafters.confease_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "session")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long session_id;
    private Long event_id;
    private String title;
    private Long chair_id;

    @JsonProperty("start_time")
    private Timestamp start_time;

    @JsonProperty("end_time")
    private Timestamp end_time;
    private String venue;

    @JsonProperty("speaker")
    private String speaker_name;

    @JsonProperty("type")
    private String session_type;

    // Getters and Setters
    public Long getSession_id() { return session_id; }
    public void setSession_id(Long session_id) { this.session_id = session_id; }

    public Long getEvent_id() { return event_id; }
    public void setEvent_id(Long event_id) { this.event_id = event_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getChair_id() { return chair_id; }
    public void setChair_id(Long chair_id) { this.chair_id = chair_id; }

    public Timestamp getStart_time() { return start_time; }
    public void setStart_time(Timestamp start_time) { this.start_time = start_time; }

    public Timestamp getEnd_time() { return end_time; }
    public void setEnd_time(Timestamp end_time) { this.end_time = end_time; }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getSpeaker_name() {
        return speaker_name;
    }

    public void setSpeaker_name(String speaker_name) {
        this.speaker_name = speaker_name;
    }

    public String getSession_type() {
        return session_type;
    }

    public void setSession_type(String session_type) {
        this.session_type = session_type;
    }
}
