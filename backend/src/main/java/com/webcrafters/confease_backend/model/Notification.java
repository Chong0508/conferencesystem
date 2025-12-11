package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notification_id;
    private Long user_id;
    @Column(columnDefinition = "TEXT")
    private String message;
    private String type;
    private Boolean is_read;
    private Timestamp sent_at;

    // Getters and Setters
    public Long getNotification_id() { return notification_id; }
    public void setNotification_id(Long notification_id) { this.notification_id = notification_id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Boolean getIs_read() { return is_read; }
    public void setIs_read(Boolean is_read) { this.is_read = is_read; }

    public Timestamp getSent_at() { return sent_at; }
    public void setSent_at(Timestamp sent_at) { this.sent_at = sent_at; }
}
