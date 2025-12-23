package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
import com.webcrafters.confease_backend.repository.PaperRepository;
import com.webcrafters.confease_backend.repository.TrackRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/papers")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PaperController {

    @Autowired
    private PaperRepository paperRepository;

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private PaperKeywordRepository paperKeywordRepository;

    @Autowired
    private TrackRepository trackRepository;

    // ✅ Helper method to populate keywords for a paper
    private void populateKeywords(Paper paper) {
        List<String> keywords = keywordRepository.findKeywordsByPaperId(paper.getPaperId());
        paper.setKeywords(keywords);
    }

    // ✅ Helper method to populate keywords for multiple papers
    private void populateKeywordsForPapers(List<Paper> papers) {
        papers.forEach(this::populateKeywords);
    }

    @GetMapping
    public ResponseEntity<List<Paper>> getAllPapers() {
        List<Paper> papers = paperRepository.findAll();
        populateKeywordsForPapers(papers);  // ✅ Add keywords
        return ResponseEntity.ok(papers);
    }

    @GetMapping("/author/{id}")
    public ResponseEntity<List<Paper>> getPapersByAuthor(@PathVariable("id") Long userId) {
        List<Paper> papers = paperRepository.findBySubmittedBy(userId);
        populateKeywordsForPapers(papers);  // ✅ Add keywords
        return ResponseEntity.ok(papers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paper> getPaperById(@PathVariable Long id) {
        return paperRepository.findById(id)
                .map(paper -> {
                    populateKeywords(paper);  // ✅ Add keywords
                    return ResponseEntity.ok(paper);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Paper paper = paperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        File file = new File(paper.getSubmissionFile());
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Resource resource = new FileSystemResource(file);
        String contentType = paper.getFileType().equalsIgnoreCase("pdf") ? 
                            "application/pdf" : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> createPaper(
            @RequestPart("paperData") Paper paper,
            @RequestPart("file") MultipartFile file) {

        try {
            System.out.println(">>> Received paper: " + paper);
            System.out.println(">>> Received file: " + (file != null ? file.getOriginalFilename() : "null"));

            // 1. Timestamp (KL Timezone)
            ZoneId klZone = ZoneId.of("Asia/Kuala_Lumpur");
            LocalDateTime nowKL = ZonedDateTime.now(klZone).toLocalDateTime();
            paper.setSubmittedAt(nowKL);
            paper.setLastUpdated(nowKL);

            // 2. Validate Track
            if (paper.getTrackId() == null || !trackRepository.existsById(paper.getTrackId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid track"));
            }

            // 3. File Upload
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "File is required"));
            }

            Path uploadDir = Paths.get("uploads/papers").toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String storedFileName = System.currentTimeMillis() + "_" +
                    file.getOriginalFilename().replaceAll("\\s+", "_");
            Path filePath = uploadDir.resolve(storedFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            paper.setSubmissionFile(filePath.toString());
            paper.setFileType(file.getContentType());

            // 4. Save Paper to DB
            Paper savedPaper = paperRepository.save(paper);

            // 5. Handle Keywords
            if (paper.getKeywords() != null && !paper.getKeywords().isEmpty()) {
                for (String kwName : paper.getKeywords()) {
                    if (kwName == null || kwName.trim().isEmpty()) continue;

                    Keyword kw = keywordRepository.findByKeywordIgnoreCase(kwName.trim())
                            .orElseGet(() -> {
                                Keyword newKw = new Keyword();
                                newKw.setKeyword(kwName.trim());
                                return keywordRepository.save(newKw);
                            });

                    PaperKeyword pk = new PaperKeyword();
                    pk.setPaper_id(savedPaper.getPaperId());
                    pk.setKeyword_id(kw.getKeyword_id());
                    paperKeywordRepository.save(pk);
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Paper submitted successfully",
                    "paperId", savedPaper.getPaperId()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Submission failed: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paper> updatePaper(@PathVariable Long id, @RequestBody Paper paperDetails) {
        return paperRepository.findById(id).map(paper -> {
            paper.setTrackId(paperDetails.getTrackId());
            paper.setTitle(paperDetails.getTitle());
            paper.setAbstractText(paperDetails.getAbstractText());
            paper.setSubmissionFile(paperDetails.getSubmissionFile());
            paper.setFileType(paperDetails.getFileType());
            paper.setVersion(paperDetails.getVersion());
            paper.setPlagiarismScore(paperDetails.getPlagiarismScore());
            paper.setStatus(paperDetails.getStatus());
            paper.setSubmittedBy(paperDetails.getSubmittedBy());
            paper.setLastUpdated(LocalDateTime.now());
            
            Paper updatedPaper = paperRepository.save(paper);
            populateKeywords(updatedPaper);  // ✅ Add keywords
            return ResponseEntity.ok(updatedPaper);
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