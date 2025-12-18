package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
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
        // 1. Find user by Email
        User user = userRepository.findByEmail(loginRequest.getEmail());

        // 2. Check if user exists AND password matches
        if (user != null && user.getPassword_hash().equals(loginRequest.getPassword())) {

            // 3. Return the user object (Frontend will save this to localStorage)
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid email or password");
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