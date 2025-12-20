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
        System.out.println("=== START createUser endpoint ===");
        
        long userCount = userRepository.count();
        System.out.println(">>> Current user count: " + userCount);
        
        // 3a. If DB empty → create System Admin FIRST with user_id = 1
        if (userCount == 0) {
            System.out.println(">>> Database is empty - creating System Admin...");
            
            User systemAdmin = new User();
            // Don't set user_id manually - let the database auto-generate
            systemAdmin.setFirst_name("System");
            systemAdmin.setLast_name("Admin");
            systemAdmin.setEmail("admin@test.com");
            systemAdmin.setPassword_hash("admin123");
            systemAdmin.setCategory("Admin");
            systemAdmin.setIs_email_verified(true);
            systemAdmin.setCreated_at(new Timestamp(System.currentTimeMillis()));
            systemAdmin.setUpdated_at(new Timestamp(System.currentTimeMillis()));
            
            System.out.println(">>> About to save System Admin...");
            User savedAdmin = userRepository.saveAndFlush(systemAdmin); // Use saveAndFlush
            System.out.println(">>> ✓ System Admin saved with ID: " + savedAdmin.getUser_id());
            System.out.println(">>> ✓ System Admin email: " + savedAdmin.getEmail());
            
            // Verify it was saved
            long afterAdminCount = userRepository.count();
            System.out.println(">>> User count after admin: " + afterAdminCount);
            
            if (afterAdminCount == 0) {
                System.err.println(">>> ✗✗✗ ADMIN WAS NOT SAVED! ✗✗✗");
            }
        } else {
            System.out.println(">>> Database already has " + userCount + " users - skipping admin creation");
        }
        
        // 3b. Check for duplicate email
        System.out.println(">>> Checking for duplicate email: " + user.getEmail());
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            System.out.println(">>> ✗ Duplicate email found!");
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Email is already registered."));
        }
        System.out.println(">>> ✓ No duplicate - proceeding with user creation");
        
        // 3c. Default role = Author
        if (user.getCategory() == null || user.getCategory().isEmpty()) {
            user.setCategory("Author");
        }
        
        // 3d. Set defaults
        if (user.getIs_email_verified() == null) user.setIs_email_verified(false);
        if (user.getCreated_at() == null) user.setCreated_at(new Timestamp(System.currentTimeMillis()));
        user.setUpdated_at(new Timestamp(System.currentTimeMillis()));
        
        System.out.println(">>> About to save user: " + user.getEmail());
        User savedUser = userRepository.saveAndFlush(user);
        System.out.println(">>> ✓ User saved with ID: " + savedUser.getUser_id());
        
        // Final verification
        long finalCount = userRepository.count();
        System.out.println(">>> FINAL user count in DB: " + finalCount);
        
        // Prepare response
        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", savedUser.getUser_id());
        userData.put("firstName", savedUser.getFirst_name());
        userData.put("lastName", savedUser.getLast_name());
        userData.put("email", savedUser.getEmail());
        userData.put("role", savedUser.getCategory());
        userData.put("avatarColor", savedUser.getCategory().equalsIgnoreCase("Admin") ? "dc3545" : "0d6efd");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", userCount == 0 ? 
            "System Admin and user created successfully" : 
            "Registration successful");
        response.put("user", userData);
        
        System.out.println("=== END createUser endpoint ===");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
    } catch (Exception e) {
        System.err.println("=== ✗✗✗ EXCEPTION in createUser ✗✗✗ ===");
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