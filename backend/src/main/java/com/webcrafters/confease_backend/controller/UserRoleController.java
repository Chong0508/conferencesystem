package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.model.UserRoleId;
import com.webcrafters.confease_backend.service.UserRoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-roles")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    // GET all user roles
    @GetMapping
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        return ResponseEntity.ok(userRoleService.getAll());
    }

    // GET a user role by composite ID
    @GetMapping("/by-id")
    public ResponseEntity<UserRole> getUserRoleById(@RequestBody UserRoleId id) {
        try {
            UserRole userRole = userRoleService.getById(id);
            return ResponseEntity.ok(userRole);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST create a new user role
    @PostMapping
    public ResponseEntity<UserRole> createUserRole(@RequestBody UserRole userRole) {
        UserRole created = userRoleService.create(userRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT update an existing user role
    @PutMapping
    public ResponseEntity<UserRole> updateUserRole(@RequestBody UserRole userRoleDetails) {
        UserRoleId id = new UserRoleId(userRoleDetails.getUser_id(), userRoleDetails.getRole_id());
        try {
            UserRole existing = userRoleService.getById(id);

            // Update fields
            existing.setUser_id(userRoleDetails.getUser_id());
            existing.setRole_id(userRoleDetails.getRole_id());
            existing.setAssigned_at(userRoleDetails.getAssigned_at());

            UserRole updated = userRoleService.update(id, existing);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE a user role
    @DeleteMapping
    public ResponseEntity<Void> deleteUserRole(@RequestBody UserRoleId id) {
        try {
            userRoleService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
