package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {
    // This fixes the error in image_bc7581.png
    // It allows searching by the full User entity object
    List<Paper> findBySubmittedBy(User submittedBy);

    // If your controller passes a Long ID, add this one too:
    List<Paper> findBySubmittedBy(Long userId);
}