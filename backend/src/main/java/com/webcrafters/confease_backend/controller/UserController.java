package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/users")
@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET /users — list all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET /users/{id} — view user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /users — add a new user
    @PostMapping
public ResponseEntity<?> createUser(@RequestBody User user) {
    try {
        // 1. Check for Duplicate Email
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Email is already registered."));
        }

        // 2. Set default values for missing fields to avoid SQL errors
        if (user.getIs_email_verified() == null) user.setIs_email_verified(false);
        if (user.getCreated_at() == null) user.setCreated_at(new java.sql.Timestamp(System.currentTimeMillis()));

        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        
    } catch (Exception e) {
        // This will print the exact SQL error in your Java console
        e.printStackTrace(); 
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Server Error: " + e.getMessage()));
    }
}

    // PUT /users/{id} — update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id, @RequestBody User updatedUser) {

        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setEmail(updatedUser.getEmail());
                    if(updatedUser.getPassword_hash() != null) {
                        existingUser.setPassword_hash(updatedUser.getPassword_hash());
                    }
                    existingUser.setFirst_name(updatedUser.getFirst_name());
                    existingUser.setLast_name(updatedUser.getLast_name());
                    existingUser.setAffiliation(updatedUser.getAffiliation());
                    existingUser.setCountry(updatedUser.getCountry());
                    existingUser.setCategory(updatedUser.getCategory());
                    existingUser.setOrcid(updatedUser.getOrcid());
                    existingUser.setProfile_picture(updatedUser.getProfile_picture());
                    existingUser.setIs_email_verified(updatedUser.getIs_email_verified());
                    existingUser.setCreated_at(updatedUser.getCreated_at());
                    existingUser.setUpdated_at(updatedUser.getUpdated_at());

                    userRepository.save(existingUser);
                    return ResponseEntity.ok(existingUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ==================================================
    // 2. NEW MAPPING (ADD THIS FOR LOGIN)
    // ==================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
        // Log the incoming request to verify Angular is sending data
        System.out.println("Login attempt for email: " + loginRequest.getEmail());

        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and Password are required"));
        }

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "User not found"));
        }

        // Check password (matching the field name in your Model)
        if (user.getPassword_hash() != null && user.getPassword_hash().equals(loginRequest.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            
            // Map the user fields to the CamelCase names Angular expects
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUser_id());
            userData.put("firstName", user.getFirst_name());
            userData.put("role", user.getCategory());
            
            response.put("user", userData);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));

    } catch (Exception e) {
        e.printStackTrace(); // This will show the exact error in your Java console
        return ResponseEntity.status(500).body(Map.of("message", "Internal Server Error: " + e.getMessage()));
    }
}

    // Helper class to read the JSON { "email": "...", "password": "..." }
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}