package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    @Query("SELECT r FROM Role r WHERE r.role_name = :roleName")
    Role findByRoleName(@Param("roleName") String roleName);
}
