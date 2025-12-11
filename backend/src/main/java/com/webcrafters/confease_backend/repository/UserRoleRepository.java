package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
}
