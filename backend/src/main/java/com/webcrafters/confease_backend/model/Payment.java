package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payment_id;
    private Long registration_id;
    private Double amount;
    private String currency;
    private String receipt_file;
    private String status;
    private Timestamp paid_at;

    // Getters and Setters
    public Long getPayment_id() { return payment_id; }
    public void setPayment_id(Long payment_id) { this.payment_id = payment_id; }

    public Long getRegistration_id() { return registration_id; }
    public void setRegistration_id(Long registration_id) { this.registration_id = registration_id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getReceipt_file() { return receipt_file; }
    public void setReceipt_file(String receipt_file) { this.receipt_file = receipt_file; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getPaid_at() { return paid_at; }
    public void setPaid_at(Timestamp paid_at) { this.paid_at = paid_at; }
}
