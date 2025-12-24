package com.webcrafters.confease_backend.initializer;

import com.webcrafters.confease_backend.model.*;
import com.webcrafters.confease_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Arrays;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private ScoreCriterionRepository scoreCriterionRepository;

    @Autowired
    private ReviewerRepository reviewerRepository; // Add this

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional 
    public void run(String... args) {
        try {
            // 1. Initialize Roles and Base Users
            if (roleRepository.count() == 0) {
                Role superAdminRole = new Role("Super Admin", "Manage all roles");
                Role adminRole = new Role("Admin", "Manage general users");
                Role authorRole = new Role("Author", "Submit papers");
                Role reviewerRole = new Role("Reviewer", "Review papers");
                
                roleRepository.saveAll(Arrays.asList(superAdminRole, adminRole, authorRole, reviewerRole));

                User superUser = createBaseUser("Super", "Admin", "superadmin@test.com", "super123456", "Super Admin");
                User generalAdmin = createBaseUser("General", "Admin", "admin@test.com", "admin123456", "Admin");
                
                userRepository.save(superUser);
                userRepository.save(generalAdmin);

                // Link Users to Roles
                linkUserToRole(superUser.getUser_id(), superAdminRole.getRole_id());
                linkUserToRole(generalAdmin.getUser_id(), adminRole.getRole_id());

                // 2. Make them also Reviewers in the reviewer table
                makeUserReviewer(superUser.getUser_id(), "System Management", 10);
                makeUserReviewer(generalAdmin.getUser_id(), "General Administration", 5);

                System.out.println("✅ Roles, Admin Users, and Reviewer profiles Initialized.");
            }

            // 3. Initialize Score Criteria
            if (scoreCriterionRepository.count() == 0) {
                ScoreCriterion c1 = new ScoreCriterion();
                c1.setName("Originality");
                c1.setDescription("Novelty of the research and contribution to the field.");

                ScoreCriterion c2 = new ScoreCriterion();
                c2.setName("Relevance");
                c2.setDescription("Alignment with the conference tracks and themes.");

                ScoreCriterion c3 = new ScoreCriterion();
                c3.setName("Quality");
                c3.setDescription("Technical soundness and rigor of the methodology.");

                ScoreCriterion c4 = new ScoreCriterion();
                c4.setName("Presentation");
                c4.setDescription("Clarity of writing, structure, and quality of figures/tables.");

                scoreCriterionRepository.saveAll(Arrays.asList(c1, c2, c3, c4));
                System.out.println("✅ Score Criteria (1-4) Initialized.");
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

    // Helper method to create Reviewer profile
    private void makeUserReviewer(Long userId, String area, Integer maxPapers) {
        Reviewer reviewer = new Reviewer();
        reviewer.setUser_id(userId);
        reviewer.setExpertise_area(area);
        reviewer.setMax_papers(maxPapers);
        reviewerRepository.save(reviewer);
    }

    private User createBaseUser(String first, String last, String email, String rawPassword, String category) {
        User user = new User();
        user.setFirst_name(first);
        user.setLast_name(last);
        user.setEmail(email);
        user.setPassword_hash(passwordEncoder.encode(rawPassword));
        user.setCategory(category); 
        user.setIs_email_verified(true);
        user.setCreated_at(new Timestamp(System.currentTimeMillis()));
        user.setUpdated_at(new Timestamp(System.currentTimeMillis()));
        return user;
    }
}