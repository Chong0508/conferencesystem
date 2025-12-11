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
        Optional<Paper> optionalPaper = paperRepository.findById(id);
        if (optionalPaper.isPresent()) {
            Paper paper = optionalPaper.get();
            // Update fields
            paper.setTrack_id(paperDetails.getTrack_id());
            paper.setTitle(paperDetails.getTitle());
            paper.setAbstractText(paperDetails.getAbstractText());
            paper.setSubmission_file(paperDetails.getSubmission_file());
            paper.setFile_type(paperDetails.getFile_type());
            paper.setVersion(paperDetails.getVersion());
            paper.setPlagiarism_score(paperDetails.getPlagiarism_score());
            paper.setStatus(paperDetails.getStatus());
            paper.setSubmitted_by(paperDetails.getSubmitted_by());
            // Note: submitted_at and last_updated are typically not updated manually, as they are timestamps

            Paper updatedPaper = paperRepository.save(paper);
            return ResponseEntity.ok(updatedPaper);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a paper
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