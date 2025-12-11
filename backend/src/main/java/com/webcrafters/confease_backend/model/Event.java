package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long event_id;
    private Long conference_id;
    private String name;
    private Timestamp start_time;
    private Timestamp end_time;
    private String location;

    // Getters and Setters
    public Long getEvent_id() { return event_id; }
    public void setEvent_id(Long event_id) { this.event_id = event_id; }

    public Long getConference_id() { return conference_id; }
    public void setConference_id(Long conference_id) { this.conference_id = conference_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Timestamp getStart_time() { return start_time; }
    public void setStart_time(Timestamp start_time) { this.start_time = start_time; }

    public Timestamp getEnd_time() { return end_time; }
    public void setEnd_time(Timestamp end_time) { this.end_time = end_time; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
