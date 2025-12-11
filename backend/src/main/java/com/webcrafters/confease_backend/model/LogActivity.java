package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "log_activity")
public class LogActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long log_id;
    private Long user_id;
    private String action;
    @Column(columnDefinition = "TEXT")
    private String details;
    private Timestamp login_time;
    private Timestamp logout_time;

    // Getters and Setters
    public Long getLog_id() { return log_id; }
    public void setLog_id(Long log_id) { this.log_id = log_id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Timestamp getLogin_time() { return login_time; }
    public void setLogin_time(Timestamp login_time) { this.login_time = login_time; }

    public Timestamp getLogout_time() { return logout_time; }
    public void setLogout_time(Timestamp logout_time) { this.logout_time = logout_time; }
}
