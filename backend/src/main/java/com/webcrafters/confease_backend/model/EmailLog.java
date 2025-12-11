package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "email_log")
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long email_id;
    private Long recipient_id;
    private String recipient_email;
    private String subject;
    @Column(columnDefinition = "TEXT")
    private String body;
    private String status;
    private Long sent_by;
    private Timestamp sent_at;
    private Timestamp delivered_at;

    // Getters and Setters
    public Long getEmail_id() { return email_id; }
    public void setEmail_id(Long email_id) { this.email_id = email_id; }

    public Long getRecipient_id() { return recipient_id; }
    public void setRecipient_id(Long recipient_id) { this.recipient_id = recipient_id; }

    public String getRecipient_email() { return recipient_email; }
    public void setRecipient_email(String recipient_email) { this.recipient_email = recipient_email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getSent_by() { return sent_by; }
    public void setSent_by(Long sent_by) { this.sent_by = sent_by; }

    public Timestamp getSent_at() { return sent_at; }
    public void setSent_at(Timestamp sent_at) { this.sent_at = sent_at; }

    public Timestamp getDelivered_at() { return delivered_at; }
    public void setDelivered_at(Timestamp delivered_at) { this.delivered_at = delivered_at; }
}
