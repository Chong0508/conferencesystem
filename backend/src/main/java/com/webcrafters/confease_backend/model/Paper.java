package com.webcrafters.confease_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "paper")
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paper_id")
    private Long paperId;

    @JsonProperty("trackId")
    @Column(name = "track_id")
    private Long trackId;

    @JsonProperty("conferenceId") 
    @Column(name = "conference_id") 
    private Long conferenceId;

    private String title;

    @JsonProperty("abstract") // Matches the 'abstract' key in your Angular paperData object
    @Column(name = "paper_abstract", columnDefinition = "TEXT")
    private String abstractText;


    // We use @JsonProperty("fileName") so it maps from your Angular 'fileName'
    @JsonProperty("fileName")
    @Column(name = "submission_file")
    private String submissionFile;

    @Column(name = "file_type")
    private String fileType;

    private Integer version;

    @Column(name = "plagiarism_score")
    private Double plagiarismScore;

    private String status;

    @JsonProperty("authorId")
    @Column(name = "submitted_by")
    private Long submittedBy;

    @JsonProperty("submittedAt") 
    @Column(name = "submitted_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime submittedAt;

    @JsonProperty("lastUpdated")
    @Column(name = "last_updated")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastUpdated;

    @Transient
    @JsonProperty("keywordIds")
    private List<Long> keywordIds;

    @Transient
    private List<String> keywords; 

    @Transient
    private String submitterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", insertable = false, updatable = false)
    private Track track;

    public Paper() {}

    // Getters / Setters
    public Long getPaperId() { return paperId; }
    public void setPaperId(Long paperId) { this.paperId = paperId; }

    public Long getTrackId() { return trackId; }
    public void setTrackId(Long trackId) { this.trackId = trackId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAbstractText() { return abstractText; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }

    public String getSubmissionFile() { return submissionFile; }
    public void setSubmissionFile(String submissionFile) { this.submissionFile = submissionFile; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public Double getPlagiarismScore() { return plagiarismScore; }
    public void setPlagiarismScore(Double plagiarismScore) { this.plagiarismScore = plagiarismScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(Long submittedBy) { this.submittedBy = submittedBy; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public List<Long> getKeywordIds() { return keywordIds; }
    public void setKeywordIds(List<Long> keywordIds) { this.keywordIds = keywordIds; }

    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }

    public String getSubmitterName() { return submitterName; }
    public void setSubmitterName(String submitterName) { this.submitterName = submitterName; }

    public Long getConferenceId() { return conferenceId; }
    public void setConferenceId(Long conferenceId) { this.conferenceId = conferenceId; }
}