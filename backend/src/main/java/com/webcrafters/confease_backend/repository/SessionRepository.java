package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
}
