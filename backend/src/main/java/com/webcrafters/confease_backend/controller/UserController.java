package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
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
                    existingUser.setPassword_hash(updatedUser.getPassword_hash());
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
}