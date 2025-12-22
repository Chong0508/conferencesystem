package com.webcrafters.confease_backend.initializer;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.model.UserRole;
import com.webcrafters.confease_backend.repository.UserRepository;
import com.webcrafters.confease_backend.repository.RoleRepository;
import com.webcrafters.confease_backend.repository.UserRoleRepository; // Ensure you have this repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional // Ensures all saves happen in one transaction
    public void run(String... args) {
        try {
            if (roleRepository.count() == 0) {
                // 1. Create Roles
                Role superAdminRole = new Role("Super Admin", "Manage all roles");
                Role adminRole = new Role("Admin", "Manage general users");
                Role authorRole = new Role("Author", "Submit papers");
                Role reviewerRole = new Role("Reviewer", "Review papers");
                
                roleRepository.saveAll(Arrays.asList(superAdminRole, adminRole, authorRole, reviewerRole));

                // 2. Create and Save Users
                User superUser = createBaseUser("Super", "Admin", "superadmin@test.com", "super123456", "Super Admin");
                User generalAdmin = createBaseUser("General", "Admin", "admin@test.com", "admin123456", "Admin");
                
                userRepository.save(superUser);
                userRepository.save(generalAdmin);

                // 3. Link Users to Roles in the UserRole table
                linkUserToRole(superUser.getUser_id(), superAdminRole.getRole_id());
                linkUserToRole(generalAdmin.getUser_id(), adminRole.getRole_id());
            }
        } catch (Exception e) {
            System.err.println("❌ Initialization Error: " + e.getMessage());
        }
    }

    private void linkUserToRole(Long userId, Integer roleId) {
        UserRole userRole = new UserRole();
        userRole.setUser_id(userId);
        userRole.setRole_id(roleId);
        userRole.setAssigned_at(new Timestamp(System.currentTimeMillis()));
        userRoleRepository.save(userRole);
    }

    private User createBaseUser(String first, String last, String email, String rawPassword, String category) {
        User user = new User();
        user.setFirst_name(first);
        user.setLast_name(last);
        user.setEmail(email);
        user.setPassword_hash(passwordEncoder.encode(rawPassword));
        user.setCategory(category); // Keeping your existing category field
        user.setIs_email_verified(true);
        user.setCreated_at(new Timestamp(System.currentTimeMillis()));
        user.setUpdated_at(new Timestamp(System.currentTimeMillis()));
        return user;
    }
}