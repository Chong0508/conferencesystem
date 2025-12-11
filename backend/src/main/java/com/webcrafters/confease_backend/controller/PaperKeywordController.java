package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.model.PaperKeywordId;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paper-keywords")
public class PaperKeywordController {

    @Autowired
    private PaperKeywordRepository paperKeywordRepository;

    // Get all paper keywords
    @GetMapping
    public ResponseEntity<List<PaperKeyword>> getAllPaperKeywords() {
        List<PaperKeyword> paperKeywords = paperKeywordRepository.findAll();
        return ResponseEntity.ok(paperKeywords);
    }

    // Get paper keyword by composite ID (paper_id and keyword_id)
    @GetMapping("/{paperId}/{keywordId}")
    public ResponseEntity<PaperKeyword> getPaperKeywordById(@PathVariable Long paperId, @PathVariable Integer keywordId) {
        PaperKeywordId id = new PaperKeywordId();
        Optional<PaperKeyword> paperKeyword = paperKeywordRepository.findById(id);
        if (paperKeyword.isPresent()) {
            return ResponseEntity.ok(paperKeyword.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new paper keyword
    @PostMapping
    public ResponseEntity<PaperKeyword> createPaperKeyword(@RequestBody PaperKeyword paperKeyword) {
        PaperKeyword savedPaperKeyword = paperKeywordRepository.save(paperKeyword);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPaperKeyword);
    }

    // Update an existing paper keyword (since it's composite key, update might not change IDs)
    @PutMapping("/{paperId}/{keywordId}")
    public ResponseEntity<PaperKeyword> updatePaperKeyword(@PathVariable Long paperId, @PathVariable Integer keywordId, @RequestBody PaperKeyword paperKeywordDetails) {
        PaperKeywordId id = new PaperKeywordId();
        Optional<PaperKeyword> optionalPaperKeyword = paperKeywordRepository.findById(id);
        if (optionalPaperKeyword.isPresent()) {
            PaperKeyword paperKeyword = optionalPaperKeyword.get();
            // Since it's a composite key entity with no other fields, update might not be necessary
            // But if you add fields later, update them here
            PaperKeyword updatedPaperKeyword = paperKeywordRepository.save(paperKeyword);
            return ResponseEntity.ok(updatedPaperKeyword);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a paper keyword
    @DeleteMapping("/{paperId}/{keywordId}")
    public ResponseEntity<Void> deletePaperKeyword(@PathVariable Long paperId, @PathVariable Integer keywordId) {
        PaperKeywordId id = new PaperKeywordId();
        if (paperKeywordRepository.existsById(id)) {
            paperKeywordRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}