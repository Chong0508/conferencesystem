package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.ReviewerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewerApplicationRepository extends JpaRepository<ReviewerApplication, Long> {

    // Find all applications submitted by a specific user
    List<ReviewerApplication> findByUserId(Long userId);

    // Find applications based on their current status (e.g., PENDING)
    List<ReviewerApplication> findByStatus(String status);
}