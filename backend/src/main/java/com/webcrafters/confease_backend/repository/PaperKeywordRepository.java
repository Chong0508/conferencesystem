package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaperKeywordRepository extends JpaRepository<PaperKeyword, PaperKeywordId> {
  @Modifying
    @Transactional
    @Query("DELETE FROM PaperKeyword pk WHERE pk.paper_id = :paperId")
    void deleteByPaperId(@Param("paperId") Long paperId);
}
