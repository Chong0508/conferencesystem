package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {
    List<Paper> findBySubmittedBy(Long submittedBy);
}