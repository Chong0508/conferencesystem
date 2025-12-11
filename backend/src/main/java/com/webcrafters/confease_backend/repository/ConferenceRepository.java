package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConferenceRepository extends JpaRepository<Conference, Long> {
}
