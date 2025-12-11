package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Keyword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KeywordRepository extends JpaRepository<Keyword, Integer> {
}
