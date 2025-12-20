package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/papers")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PaperController {

    @Autowired
    private PaperRepository paperRepository;

    // Get all papers
    @GetMapping
    public ResponseEntity<List<Paper>> getAllPapers() {
        List<Paper> papers = paperRepository.findAll();
        return ResponseEntity.ok(papers);
    }

    // Get paper by ID
    @GetMapping("/{id}")
    public ResponseEntity<Paper> getPaperById(@PathVariable Long id) {
        Optional<Paper> paper = paperRepository.findById(id);
        if (paper.isPresent()) {
            return ResponseEntity.ok(paper.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new paper
    @PostMapping
    public ResponseEntity<?> createPaper(@RequestBody Paper paper) {
    try {
        
        // ALWAYS set timestamps in backend
        paper.setSubmittedAt(LocalDateTime.now());
        paper.setLastUpdated(LocalDateTime.now());
        
        // Set defaults
        if (paper.getStatus() == null || paper.getStatus().isEmpty()) {
            paper.setStatus("Pending Review");
        }
        if (paper.getVersion() == null) {
            paper.setVersion(1);
        }
        
        Paper savedPaper = paperRepository.save(paper);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Paper submitted successfully");
        response.put("paper", savedPaper);
        response.put("paperId", savedPaper.getPaperId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        
    } catch (Exception e) {
        e.printStackTrace();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Failed to save paper: " + e.getMessage()));
    }
}

    // Update an existing paper
    @PutMapping("/{id}")
    public ResponseEntity<Paper> updatePaper(@PathVariable Long id, @RequestBody Paper paperDetails) {
        return paperRepository.findById(id).map(paper -> {
            // Updated to use your new Model method names
            paper.setTrackId(paperDetails.getTrackId());
            paper.setTitle(paperDetails.getTitle());
            paper.setAbstractText(paperDetails.getAbstractText());
            paper.setSubmissionFile(paperDetails.getSubmissionFile());
            paper.setFileType(paperDetails.getFileType());
            paper.setVersion(paperDetails.getVersion());
            paper.setPlagiarismScore(paperDetails.getPlagiarismScore());
            paper.setStatus(paperDetails.getStatus());
            paper.setSubmittedBy(paperDetails.getSubmittedBy());
            paper.setLastUpdated(java.time.LocalDateTime.now());
            
            return ResponseEntity.ok(paperRepository.save(paper));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaper(@PathVariable Long id) {
        if (paperRepository.existsById(id)) {
            paperRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}