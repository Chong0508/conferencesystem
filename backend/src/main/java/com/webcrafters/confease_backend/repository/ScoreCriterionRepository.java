package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.ScoreCriterion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreCriterionRepository extends JpaRepository<ScoreCriterion, Integer> {
}
