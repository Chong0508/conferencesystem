package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.repository.PaperRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/papers")
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
    public ResponseEntity<Paper> createPaper(@RequestBody Paper paper) {
        Paper savedPaper = paperRepository.save(paper);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPaper);
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