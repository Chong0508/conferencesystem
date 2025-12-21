package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/users")
@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private final org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder passwordEncoder = 
    new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

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

@PostMapping
@Transactional
public ResponseEntity<Map<String, Object>> createUser(@RequestBody User user) {
    try {        
        // 1. Password Security Check
        if (user.getPassword_hash() == null || user.getPassword_hash().length() < 8) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Registration failed: Password must be at least 8 characters."));
        }

        long userCount = userRepository.count();
        
        // 2. Automatic System Admin Initialization
        if (userCount == 0) {
            User systemAdmin = new User();
            systemAdmin.setFirst_name("System");
            systemAdmin.setLast_name("Admin");
            systemAdmin.setEmail("admin@test.com");
            systemAdmin.setPassword_hash(passwordEncoder.encode("admin123456"));
            systemAdmin.setCategory("Admin");
            systemAdmin.setIs_email_verified(true);
            systemAdmin.setCreated_at(new Timestamp(System.currentTimeMillis()));
            systemAdmin.setUpdated_at(new Timestamp(System.currentTimeMillis()));
            
            userRepository.save(systemAdmin);
        }
        
        // 3. Email Duplicate Check (Returns explicit error message to user)
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "This email (" + user.getEmail() + ") is already registered. Please use a different email or login."));
        }
        
        // 4. Set Category Defaults
        if (user.getCategory() == null || user.getCategory().isEmpty()) {
            user.setCategory("Author");
        }
        
        // 5. Set Timestamps and Security Defaults
        if (user.getIs_email_verified() == null) user.setIs_email_verified(false);
        if (user.getCreated_at() == null) user.setCreated_at(new Timestamp(System.currentTimeMillis()));
        user.setUpdated_at(new Timestamp(System.currentTimeMillis()));
        
        // 6. Hash Password and Persist
        String rawPassword = user.getPassword_hash();
        user.setPassword_hash(passwordEncoder.encode(rawPassword));
        User savedUser = userRepository.saveAndFlush(user);
        
        // 7. Prepare Clean Response
        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", savedUser.getUser_id());
        userData.put("firstName", savedUser.getFirst_name());
        userData.put("lastName", savedUser.getLast_name());
        userData.put("email", savedUser.getEmail());
        userData.put("role", savedUser.getCategory());
        userData.put("avatarColor", savedUser.getCategory().equalsIgnoreCase("Admin") ? "dc3545" : "0d6efd");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", userCount == 0 ? 
            "System initialized. Admin and your account created successfully!" : 
            "Registration successful!");
        response.put("user", userData);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "An unexpected error occurred during registration. Please try again."));
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
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and Password are required"));
        }

        User user = userRepository.findByEmail(loginRequest.getEmail());

        // 🔒 Combine both checks into one error message
        // If user is null OR password doesn't match, return "Invalid email or password"
        if (user == null || user.getPassword_hash() == null || 
            !org.mindrot.jbcrypt.BCrypt.checkpw(loginRequest.getPassword(), user.getPassword_hash())) {
            
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        // If we reach here, credentials are correct
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", user.getUser_id());
        userData.put("firstName", user.getFirst_name());
        userData.put("role", user.getCategory());
        
        response.put("user", userData);
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        // Keep this only for true system crashes (e.g., Database offline)
        return ResponseEntity.status(500).body(Map.of("message", "Server error. Please try again later."));
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