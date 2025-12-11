package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "author")
public class Author {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long author_id;
    private Long paper_id;
    private Long user_id;
    private Integer author_order;
    private Boolean is_corresponding;

    // Getters and Setters
    public Long getAuthor_id() { return author_id; }
    public void setAuthor_id(Long author_id) { this.author_id = author_id; }

    public Long getPaper_id() { return paper_id; }
    public void setPaper_id(Long paper_id) { this.paper_id = paper_id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public Integer getAuthor_order() { return author_order; }
    public void setAuthor_order(Integer author_order) { this.author_order = author_order; }

    public Boolean getIs_corresponding() { return is_corresponding; }
    public void setIs_corresponding(Boolean is_corresponding) { this.is_corresponding = is_corresponding; }
}
