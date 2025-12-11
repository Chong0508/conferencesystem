package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "schedule")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schedule_id;
    private Long session_id;
    private Long room_id;
    private Timestamp start_time;
    private Timestamp end_time;

    // Getters and Setters
    public Long getSchedule_id() { return schedule_id; }
    public void setSchedule_id(Long schedule_id) { this.schedule_id = schedule_id; }

    public Long getSession_id() { return session_id; }
    public void setSession_id(Long session_id) { this.session_id = session_id; }

    public Long getRoom_id() { return room_id; }
    public void setRoom_id(Long room_id) { this.room_id = room_id; }

    public Timestamp getStart_time() { return start_time; }
    public void setStart_time(Timestamp start_time) { this.start_time = start_time; }

    public Timestamp getEnd_time() { return end_time; }
    public void setEnd_time(Timestamp end_time) { this.end_time = end_time; }
}
