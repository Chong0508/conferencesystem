package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.ReviewerApplication;
import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.repository.ReviewerApplicationRepository;
import com.webcrafters.confease_backend.repository.RoleRepository;
import com.webcrafters.confease_backend.repository.UserRepository;
import com.webcrafters.confease_backend.repository.UserRoleRepository;
import com.webcrafters.confease_backend.service.ReviewerService;

// Correct Spring Framework Imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // Use Spring Transactional
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ReviewerApplicationRepository applicationRepository;

    @Autowired
    private ReviewerService reviewerService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ==========================================
    // 1. USER MANAGEMENT
    // ==========================================

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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
            if (user.getPassword_hash() == null || user.getPassword_hash().length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration failed: Password must be at least 8 characters."));
            }

            if (userRepository.count() == 0) {
                initializeSystemAdmin();
            }
            
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered."));
            }
            
            if (user.getCategory() == null || user.getCategory().isEmpty()) {
                user.setCategory("Author");
            }
            
            user.setPassword_hash(passwordEncoder.encode(user.getPassword_hash()));
            user.setCreated_at(new Timestamp(System.currentTimeMillis()));
            user.setUpdated_at(new Timestamp(System.currentTimeMillis()));
            
            User savedUser = userRepository.saveAndFlush(user);
            assignUserRole(savedUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Registration successful!"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    private void assignUserRole(User user) {
        Role role = roleRepository.findByRoleName(user.getCategory());
        if (role != null) {
            UserRole userRole = new UserRole();
            userRole.setUser_id(user.getUser_id());
            userRole.setRole_id(role.getRole_id());
            userRole.setAssigned_at(new Timestamp(System.currentTimeMillis()));
            userRoleRepository.save(userRole);
        }
    }

    @DeleteMapping("/{id}")
    @Transactional // Ensures both deletions happen as one atomic unit
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            // 1. Manually handle the child relationship in UserRole
            // We search by user_id field (or whatever your repo method is named)
            UserRole existingRoleLink = userRoleRepository.findByUserId(id);
            if (existingRoleLink != null) {
                userRoleRepository.delete(existingRoleLink);
            }

            // 2. Delete the actual user record
            userRepository.delete(user);

            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found.")));
    }

    private void initializeSystemAdmin() {
        User systemAdmin = new User();
        systemAdmin.setFirst_name("System");
        systemAdmin.setLast_name("Admin");
        systemAdmin.setEmail("admin@test.com");
        systemAdmin.setPassword_hash(passwordEncoder.encode("admin123456"));
        systemAdmin.setCategory("Super Admin");
        systemAdmin.setIs_email_verified(true);
        systemAdmin.setCreated_at(new Timestamp(System.currentTimeMillis()));
        systemAdmin.setUpdated_at(new Timestamp(System.currentTimeMillis()));
        
        User savedAdmin = userRepository.saveAndFlush(systemAdmin);
        assignUserRole(savedAdmin);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword_hash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", user.getUser_id());
        userData.put("firstName", user.getFirst_name());
        userData.put("role", user.getCategory());
        
        return ResponseEntity.ok(Map.of("message", "Login successful", "user", userData));
    }

    // ==========================================
    // 2. REVIEWER APPLICATIONS
    // ==========================================

    @PostMapping("/apply-reviewer")
    public ResponseEntity<?> handleReviewerApplication(
            @RequestParam("userId") Long userId,
            @RequestParam("educationLevel") String educationLevel,
            @RequestParam("reason") String reason,
            @RequestParam("evidence") MultipartFile file) {
    
        try {
            Path directoryPath = Paths.get("/app/uploads/evidence").toAbsolutePath().normalize();
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            String fileName = "evidence_" + userId + "_" + System.currentTimeMillis() + ".pdf";
            Path filePath = directoryPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            ReviewerApplication app = new ReviewerApplication();
            app.setUserId(userId);
            app.setEducationLevel(educationLevel);
            app.setReason(reason);
            app.setEvidencePath(filePath.toString());
            app.setSubmittedAt(new Timestamp(System.currentTimeMillis())); 
            
            applicationRepository.save(app);
            return ResponseEntity.ok(Map.of("success", true, "message", "Application submitted!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "File Error: " + e.getMessage()));
        }
    }

    @GetMapping("/applications/evidence/{fileName}")
    public ResponseEntity<Resource> downloadEvidence(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("/app/uploads/evidence").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/applications")
    public List<ReviewerApplication> getApplications() {
        return applicationRepository.findAll();
    }

    @PostMapping("/applications/{appId}/process")
    @Transactional
    public ResponseEntity<?> processApplication(@PathVariable Long appId, @RequestParam String status) {
        ReviewerApplication app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String normalizedStatus = status.toUpperCase();
        app.setStatus(normalizedStatus);

        // 1. Setup Kuala Lumpur Time (UTC+8)
        java.time.ZonedDateTime klNow = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Kuala_Lumpur"));
        java.sql.Timestamp klTimestamp = java.sql.Timestamp.from(klNow.toInstant());

        if ("APPROVED".equals(normalizedStatus)) {
            User user = userRepository.findById(app.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Role reviewerRole = roleRepository.findByRoleName("Reviewer");
            if (reviewerRole == null) {
                throw new RuntimeException("Reviewer role not found in system");
            }
            
            // 2. Update Role Mappings (Remove old role, assign Reviewer role)
            UserRole existingLink = userRoleRepository.findByUserId(app.getUserId());
            if (existingLink != null) {
                userRoleRepository.delete(existingLink);
            }

            UserRole newLink = new UserRole();
            newLink.setUser_id(app.getUserId());
            newLink.setRole_id(reviewerRole.getRole_id());
            newLink.setAssigned_at(klTimestamp); // ✅ KL Time
            userRoleRepository.save(newLink);

            // 3. Update User Category
            user.setCategory("Reviewer");
            userRepository.save(user);

            // 4. Create Reviewer Entry based on your specific Reviewer Model
            com.webcrafters.confease_backend.model.Reviewer reviewerEntry = new com.webcrafters.confease_backend.model.Reviewer();
            
            reviewerEntry.setUser_id(user.getUser_id());
            
            // Use education level or a default for expertise_area based on application data
            reviewerEntry.setExpertise_area(app.getEducationLevel() != null ? app.getEducationLevel() : "General");
            
            // Set a default maximum paper limit for new reviewers
            reviewerEntry.setMax_papers(5); 
            
            reviewerService.create(reviewerEntry);
            
            // Optional: Update application reason to include approval log
            app.setReason(app.getReason() + " | Approved at: " + 
                klNow.format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + " (KL)");
        }

        return ResponseEntity.ok(app);
    }

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}