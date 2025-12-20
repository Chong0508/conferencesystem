package com.webcrafters.confease_backend.initializer;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        try {
            System.out.println("🚀 System check: Verifying user table...");
            
            long userCount = userRepository.count();
            System.out.println(">>> Current user count: " + userCount);
            
            if (userCount == 0) {
                System.out.println(">>> Database is empty - creating System Admin...");
                
                User systemAdmin = new User();
                // DON'T SET user_id manually - let database auto-generate it
                systemAdmin.setFirst_name("System");
                systemAdmin.setLast_name("Admin");
                systemAdmin.setEmail("admin@test.com");
                systemAdmin.setPassword_hash("admin123"); // TODO: Hash this properly
                systemAdmin.setCategory("Admin");
                systemAdmin.setIs_email_verified(true);
                systemAdmin.setCreated_at(new Timestamp(System.currentTimeMillis()));
                systemAdmin.setUpdated_at(new Timestamp(System.currentTimeMillis()));
                
                User savedAdmin = userRepository.save(systemAdmin);
                System.out.println("✅ System Admin created successfully with ID: " + savedAdmin.getUser_id());
            } else {
                System.out.println(">>> Database already has " + userCount + " users");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize admin: " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception - let app continue
        }
    }
}