package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.ReviewAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewAssignmentRepository extends JpaRepository<ReviewAssignment, Long> {
}
