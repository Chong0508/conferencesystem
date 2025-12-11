package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.ReviewScore;
import com.webcrafters.confease_backend.model.ReviewScoreId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewScoreRepository extends JpaRepository<ReviewScore, ReviewScoreId> {
}
