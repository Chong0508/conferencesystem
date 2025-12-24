package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.*;
import com.webcrafters.confease_backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @Autowired private PaperRepository paperRepository;
    @Autowired private KeywordRepository keywordRepository;
    @Autowired private PaperKeywordRepository paperKeywordRepository;
    @Autowired private TrackRepository trackRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuthorRepository authorRepository;
    @Autowired private ReviewRepository reviewRepository;

    // Explicitly use the absolute path that matches Docker volume mapping
    private final Path rootLocation = Paths.get("/app/uploads/papers");

    private void populateSubmitterName(Paper paper) {
        if (paper.getSubmittedBy() != null) {
            userRepository.findById(paper.getSubmittedBy()).ifPresent(user -> {
                // ✅ CHANGE: Combine First Name and Last Name
                String fullName = user.getFirst_name() + " " + user.getLast_name();
                paper.setSubmitterName(fullName); 
            });
        }
    }

    private void populateKeywordsAndAuthor(Paper paper) {
        populateKeywords(paper);
        populateSubmitterName(paper);
    }

    private void populateKeywords(Paper paper) {
        List<String> keywords = keywordRepository.findKeywordsByPaperId(paper.getPaperId());
        paper.setKeywords(keywords);
    }

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
        populateKeywordsForPapers(papers);
        return ResponseEntity.ok(papers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paper> getPaperById(@PathVariable Long id) {
        return paperRepository.findById(id).map(paper -> {
            populateKeywords(paper);
            List<Author> authors = authorRepository.findAuthorsByPaperId(id);
            
            // ✅ CHANGE: Ensure names are collected as Full Names
            String allAuthorNames = authors.stream()
                .map(auth -> userRepository.findById(auth.getUser_id())
                    .map(u -> u.getFirst_name() + " " + u.getLast_name()) // Combine here too
                    .orElse("Unknown"))
                .collect(Collectors.joining(", "));
                
            paper.setSubmitterName(allAuthorNames);
            return ResponseEntity.ok(paper);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<?> createPaper(
            @RequestPart("paperData") Paper paper,
            @RequestPart("file") MultipartFile file) {

        try {
            ZoneId klZone = ZoneId.of("Asia/Kuala_Lumpur");
            LocalDateTime nowKL = ZonedDateTime.now(klZone).toLocalDateTime();
            paper.setSubmittedAt(nowKL);
            paper.setLastUpdated(nowKL);

            if (paper.getTrackId() == null || !trackRepository.existsById(paper.getTrackId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid track ID"));
            }

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "File is required"));
            }

            // ✅ FIXED: Ensure directory exists using the absolute rootLocation
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }

            String storedFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            Path filePath = rootLocation.resolve(storedFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            paper.setSubmissionFile(storedFileName); 
            paper.setFileType(file.getContentType());

            Paper savedPaper = paperRepository.save(paper);

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
                paper.setTitle(paperDetails.getTitle());
                paper.setAbstractText(paperDetails.getAbstractText());
                paper.setTrackId(paperDetails.getTrackId());
                paper.setLastUpdated(LocalDateTime.now());

                if (file != null && !file.isEmpty()) {
                    try {
                        // ✅ FIXED: Use absolute rootLocation for updates
                        if (!Files.exists(rootLocation)) Files.createDirectories(rootLocation);
                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
                        Path filePath = rootLocation.resolve(fileName);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        
                        paper.setSubmissionFile(fileName);
                        paper.setFileType(file.getContentType());
                    } catch (IOException e) {
                        throw new RuntimeException("File storage failed during update: " + e.getMessage());
                    }
                }

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
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Update failed: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletePaper(@PathVariable Long id) {
        return paperRepository.findById(id).map(paper -> {
            // 1. Find all reviews associated with this paper
            // We update them to 'Deleted by Admin' so the history remains
            List<Review> reviews = reviewRepository.findAll().stream()
                    .filter(r -> r.getAssignment_id().equals(id))
                    .collect(Collectors.toList());
            
            for (Review r : reviews) {
                r.setRecommendation("Deleted by Admin");
                // You could also set overall_score to 0 or null if desired
                reviewRepository.save(r);
            }

            // 2. Clean up paper-specific metadata (Keywords)
            paperKeywordRepository.deleteByPaperId(id);

            // 3. Delete the physical file from storage
            try {
                Path filePath = rootLocation.resolve(paper.getSubmissionFile()).normalize();
                Files.deleteIfExists(filePath);
            } catch (Exception e) {
                System.err.println("File deletion failed: " + e.getMessage());
            }

            // 4. Delete the Paper record
            paperRepository.delete(paper);
            
            return ResponseEntity.ok(Map.of("message", "Paper deleted. Associated reviews preserved and marked as Deleted by Admin."));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ FIXED: Download mapping now uses the absolute rootLocation to prevent 404 after session resets
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadManuscript(@PathVariable String fileName) {
        try {
            Path filePath = rootLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                System.err.println("FILE NOT FOUND AT: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}