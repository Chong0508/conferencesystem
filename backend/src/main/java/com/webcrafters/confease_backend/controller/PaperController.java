package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Author;
import com.webcrafters.confease_backend.model.Keyword;
import com.webcrafters.confease_backend.model.Paper;
import com.webcrafters.confease_backend.model.PaperKeyword;
import com.webcrafters.confease_backend.repository.AuthorRepository;
import com.webcrafters.confease_backend.repository.KeywordRepository;
import com.webcrafters.confease_backend.repository.PaperKeywordRepository;
import com.webcrafters.confease_backend.repository.PaperRepository;
import com.webcrafters.confease_backend.repository.TrackRepository;
import com.webcrafters.confease_backend.repository.UserRepository;

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
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorRepository authorRepository;

    private void populateSubmitterName(Paper paper) {
        if (paper.getSubmittedBy() != null) {
            userRepository.findById(paper.getSubmittedBy()).ifPresent(user -> {
                paper.setSubmitterName(user.getFirst_name()); 
            });
        }
    }

    private void populateKeywordsAndAuthor(Paper paper) {
        populateKeywords(paper);
        populateSubmitterName(paper);
    }

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
        papers.forEach(this::populateKeywordsAndAuthor); 
        return ResponseEntity.ok(papers);
    }

    @GetMapping("/author/{id}")
    public ResponseEntity<List<Paper>> getPapersByAuthor(@PathVariable("id") Long userId) {
        List<Paper> papers = paperRepository.findBySubmittedBy(userId);
        populateKeywordsForPapers(papers);  // ✅ Add keywords
        return ResponseEntity.ok(papers);
    }

// Inside PaperController.java
@GetMapping("/{id}")
public ResponseEntity<Paper> getPaperById(@PathVariable Long id) {
    return paperRepository.findById(id).map(paper -> {
        populateKeywords(paper);
        
        // Fetch all authors for this paper
        List<Author> authors = authorRepository.findAuthorsByPaperId(id);
        // Map Author list to a String of names
        String allAuthorNames = authors.stream()
            .map(auth -> userRepository.findById(auth.getUser_id()).get().getFirst_name())
            .collect(Collectors.joining(", "));
            
        paper.setSubmitterName(allAuthorNames);
        return ResponseEntity.ok(paper);
    }).orElse(ResponseEntity.notFound().build());
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> updatePaper(
            @PathVariable Long id,
            @RequestPart("paperData") Paper paperDetails,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            return paperRepository.findById(id).map(paper -> {
                // 1. Update text fields
                paper.setTitle(paperDetails.getTitle());
                paper.setAbstractText(paperDetails.getAbstractText());
                paper.setTrackId(paperDetails.getTrackId());
                paper.setLastUpdated(LocalDateTime.now());

                // 2. Update file ONLY if a new one is provided
                if (file != null && !file.isEmpty()) {
                    try {
                        Path uploadDir = Paths.get("uploads/papers").toAbsolutePath().normalize();
                        Files.createDirectories(uploadDir);
                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
                        Path filePath = uploadDir.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        
                        paper.setSubmissionFile(filePath.toString());
                        paper.setFileType(file.getContentType());
                    } catch (IOException e) {
                        throw new RuntimeException("File storage failed: " + e.getMessage());
                    }
                }

                // 3. Update Keywords (Delete old links and add new ones)
                paperKeywordRepository.deleteByPaperId(id);
                if (paperDetails.getKeywords() != null) {
                    for (String kwName : paperDetails.getKeywords()) {
                        Keyword kw = keywordRepository.findByKeywordIgnoreCase(kwName.trim())
                                .orElseGet(() -> {
                                    Keyword newKw = new Keyword();
                                    newKw.setKeyword(kwName.trim());
                                    return keywordRepository.save(newKw);
                                });

                        PaperKeyword pk = new PaperKeyword();
                        pk.setPaper_id(id);
                        pk.setKeyword_id(kw.getKeyword_id());
                        paperKeywordRepository.save(pk);
                    }
                }

                paperRepository.save(paper);
                return ResponseEntity.ok(Map.of("message", "Paper updated successfully"));
            }).orElse(ResponseEntity.notFound().build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Update failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletePaper(@PathVariable Long id) {
        return paperRepository.findById(id).map(paper -> {
            // 1. Delete associated keywords in link table first
            paperKeywordRepository.deleteByPaperId(id);
            
            // 2. Delete the physical file (Optional but recommended)
            try {
                Files.deleteIfExists(Paths.get(paper.getSubmissionFile()));
            } catch (Exception e) {
                System.err.println("Could not delete file: " + e.getMessage());
            }

            // 3. Delete from DB
            paperRepository.delete(paper);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}