package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/keywords")
public class KeywordController {

    @Autowired
    private KeywordRepository keywordRepository;

    // Get all keywords
    @GetMapping
    public ResponseEntity<List<Keyword>> getAllKeywords() {
        List<Keyword> keywords = keywordRepository.findAll();
        return ResponseEntity.ok(keywords);
    }

    // Get keyword by ID
    @GetMapping("/{id}")
    public ResponseEntity<Keyword> getKeywordById(@PathVariable Integer id) {
        Optional<Keyword> keyword = keywordRepository.findById(id);
        if (keyword.isPresent()) {
            return ResponseEntity.ok(keyword.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new keyword
    @PostMapping
    public ResponseEntity<Keyword> createKeyword(@RequestBody Keyword keyword) {
        Keyword savedKeyword = keywordRepository.save(keyword);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedKeyword);
    }

    // Update an existing keyword
    @PutMapping("/{id}")
    public ResponseEntity<Keyword> updateKeyword(@PathVariable Integer id, @RequestBody Keyword keywordDetails) {
        Optional<Keyword> optionalKeyword = keywordRepository.findById(id);
        if (optionalKeyword.isPresent()) {
            Keyword keyword = optionalKeyword.get();
            // Update fields
            keyword.setKeyword(keywordDetails.getKeyword());

            Keyword updatedKeyword = keywordRepository.save(keyword);
            return ResponseEntity.ok(updatedKeyword);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a keyword
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKeyword(@PathVariable Integer id) {
        if (keywordRepository.existsById(id)) {
            keywordRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}