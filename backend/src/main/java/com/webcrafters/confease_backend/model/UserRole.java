package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "user_role")
@IdClass(UserRoleId.class)
public class UserRole {

    @Id
    private Long user_id;
    @Id
    private Integer role_id;
    private Timestamp assigned_at;

    // Getters and Setters
    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public Integer getRole_id() { return role_id; }
    public void setRole_id(Integer role_id) { this.role_id = role_id; }

    public Timestamp getAssigned_at() { return assigned_at; }
    public void setAssigned_at(Timestamp assigned_at) { this.assigned_at = assigned_at; }
}
