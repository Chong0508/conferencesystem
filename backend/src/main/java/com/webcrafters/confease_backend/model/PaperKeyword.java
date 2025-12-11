package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "paper_keyword")
@IdClass(PaperKeywordId.class)
public class PaperKeyword {

    @Id
    private Long paper_id;
    @Id
    private Integer keyword_id;

    // Getters and Setters
    public Long getPaper_id() { return paper_id; }
    public void setPaper_id(Long paper_id) { this.paper_id = paper_id; }

    public Integer getKeyword_id() { return keyword_id; }
    public void setKeyword_id(Integer keyword_id) { this.keyword_id = keyword_id; }
}
