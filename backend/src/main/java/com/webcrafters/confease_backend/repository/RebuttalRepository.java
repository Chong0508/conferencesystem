package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Rebuttal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RebuttalRepository extends JpaRepository<Rebuttal, Long> {
}
