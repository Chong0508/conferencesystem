package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "registration")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registration_id;
    private Long user_id;
    private Long conference_id;
    private String registration_type;
    private Boolean early_bird;
    private String payment_status;
    private Timestamp registered_at;

    // Getters and Setters
    public Long getRegistration_id() { return registration_id; }
    public void setRegistration_id(Long registration_id) { this.registration_id = registration_id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public Long getConference_id() { return conference_id; }
    public void setConference_id(Long conference_id) { this.conference_id = conference_id; }

    public String getRegistration_type() { return registration_type; }
    public void setRegistration_type(String registration_type) { this.registration_type = registration_type; }

    public Boolean getEarly_bird() { return early_bird; }
    public void setEarly_bird(Boolean early_bird) { this.early_bird = early_bird; }

    public String getPayment_status() { return payment_status; }
    public void setPayment_status(String payment_status) { this.payment_status = payment_status; }

    public Timestamp getRegistered_at() { return registered_at; }
    public void setRegistered_at(Timestamp registered_at) { this.registered_at = registered_at; }
}
