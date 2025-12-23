package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    
    // Explicitly define the query to avoid the underscore naming conflict
    @Query("SELECT a FROM Author a WHERE a.paper_id = :paperId")
    List<Author> findAuthorsByPaperId(@Param("paperId") Long paperId);
}