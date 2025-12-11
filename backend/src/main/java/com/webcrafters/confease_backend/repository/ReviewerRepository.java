package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Reviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewerRepository extends JpaRepository<Reviewer, Long> {
}
