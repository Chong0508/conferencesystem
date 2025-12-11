package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaperKeywordRepository extends JpaRepository<PaperKeyword, PaperKeywordId> {
}
