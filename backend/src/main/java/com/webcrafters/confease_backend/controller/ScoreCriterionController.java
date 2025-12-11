package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.ScoreCriterion;
import com.webcrafters.confease_backend.repository.ScoreCriterionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/score-criteria")
public class ScoreCriterionController {

    @Autowired
    private ScoreCriterionRepository scoreCriterionRepository;

    // Get all score criteria
    @GetMapping
    public ResponseEntity<List<ScoreCriterion>> getAllScoreCriteria() {
        List<ScoreCriterion> scoreCriteria = scoreCriterionRepository.findAll();
        return ResponseEntity.ok(scoreCriteria);
    }

    // Get score criterion by ID
    @GetMapping("/{id}")
    public ResponseEntity<ScoreCriterion> getScoreCriterionById(@PathVariable Integer id) {
        Optional<ScoreCriterion> scoreCriterion = scoreCriterionRepository.findById(id);
        if (scoreCriterion.isPresent()) {
            return ResponseEntity.ok(scoreCriterion.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new score criterion
    @PostMapping
    public ResponseEntity<ScoreCriterion> createScoreCriterion(@RequestBody ScoreCriterion scoreCriterion) {
        ScoreCriterion savedScoreCriterion = scoreCriterionRepository.save(scoreCriterion);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedScoreCriterion);
    }

    // Update an existing score criterion
    @PutMapping("/{id}")
    public ResponseEntity<ScoreCriterion> updateScoreCriterion(@PathVariable Integer id, @RequestBody ScoreCriterion scoreCriterionDetails) {
        Optional<ScoreCriterion> optionalScoreCriterion = scoreCriterionRepository.findById(id);
        if (optionalScoreCriterion.isPresent()) {
            ScoreCriterion scoreCriterion = optionalScoreCriterion.get();
            // Update fields
            scoreCriterion.setName(scoreCriterionDetails.getName());
            scoreCriterion.setDescription(scoreCriterionDetails.getDescription());

            ScoreCriterion updatedScoreCriterion = scoreCriterionRepository.save(scoreCriterion);
            return ResponseEntity.ok(updatedScoreCriterion);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a score criterion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScoreCriterion(@PathVariable Integer id) {
        if (scoreCriterionRepository.existsById(id)) {
            scoreCriterionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}