package com.webcrafters.confease_backend.model;

import java.io.Serializable;
import java.util.Objects;

public class UserRoleId implements Serializable {
    private Long user_id;
    private Integer role_id;

    public UserRoleId() {}

    public UserRoleId(Long user_id, Integer role_id) {
        this.user_id = user_id;
        this.role_id = role_id;
    }

    // Hibernate uses these to differentiate between different link records
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserRoleId that = (UserRoleId) o;
        return Objects.equals(user_id, that.user_id) && 
               Objects.equals(role_id, that.role_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user_id, role_id);
    }
}