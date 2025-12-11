package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "keyword")
public class Keyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer keyword_id;
    private String keyword;

    // Getters and Setters
    public Integer getKeyword_id() { return keyword_id; }
    public void setKeyword_id(Integer keyword_id) { this.keyword_id = keyword_id; }

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
}
