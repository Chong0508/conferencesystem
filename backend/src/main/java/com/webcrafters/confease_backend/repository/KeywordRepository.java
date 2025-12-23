package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Keyword;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KeywordRepository extends JpaRepository<Keyword, Long> {
    Optional<Keyword> findByKeywordIgnoreCase(String keyword);

    @Query(value = "SELECT k.keyword_id FROM keyword k " +
                   "JOIN paper_keyword pk ON k.keyword_id = pk.keyword_id " +
                   "WHERE pk.paper_id = :paperId", nativeQuery = true)
    List<Long> findKeywordIdsByPaperId(@Param("paperId") Long paperId);

    @Query(value = "SELECT k.keyword FROM keyword k " +
                   "JOIN paper_keyword pk ON k.keyword_id = pk.keyword_id " +
                   "WHERE pk.paper_id = :paperId", nativeQuery = true)
    List<String> findKeywordsByPaperId(@Param("paperId") Long paperId);
}