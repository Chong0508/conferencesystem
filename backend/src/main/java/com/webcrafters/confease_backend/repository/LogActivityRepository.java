package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.LogActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogActivityRepository extends JpaRepository<LogActivity, Long> {
}
