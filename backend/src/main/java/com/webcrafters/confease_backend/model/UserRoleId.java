package com.webcrafters.confease_backend.model;

import java.io.Serializable;

public class UserRoleId implements Serializable {
    private Long user_id;
    private Integer role_id;

    // Default constructor
    public UserRoleId(Long user_id, Integer role_id) {
        this.user_id = user_id;
        this.role_id = role_id;
    }

    // Getters and Setters
    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public Integer getRole_id() { return role_id; }
    public void setRole_id(Integer role_id) { this.role_id = role_id; }
}
