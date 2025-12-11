package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "score_criterion")
public class ScoreCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer criterion_id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;

    // Getters and Setters
    public Integer getCriterion_id() { return criterion_id; }
    public void setCriterion_id(Integer criterion_id) { this.criterion_id = criterion_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
