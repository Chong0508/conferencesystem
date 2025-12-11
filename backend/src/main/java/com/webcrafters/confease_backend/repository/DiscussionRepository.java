package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
}
