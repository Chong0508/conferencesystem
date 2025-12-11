package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "`user`")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    private String email;
    private String password_hash;
    private String first_name;
    private String last_name;
    private String affiliation;
    private String country;
    private String category;
    private String orcid;
    private String profile_picture;
    private Boolean is_email_verified;
    private Timestamp created_at;
    private Timestamp updated_at;

    // Getters and Setters
    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword_hash() { return password_hash; }
    public void setPassword_hash(String password_hash) { this.password_hash = password_hash; }

    public String getFirst_name() { return first_name; }
    public void setFirst_name(String first_name) { this.first_name = first_name; }

    public String getLast_name() { return last_name; }
    public void setLast_name(String last_name) { this.last_name = last_name; }

    public String getAffiliation() { return affiliation; }
    public void setAffiliation(String affiliation) { this.affiliation = affiliation; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOrcid() { return orcid; }
    public void setOrcid(String orcid) { this.orcid = orcid; }

    public String getProfile_picture() { return profile_picture; }
    public void setProfile_picture(String profile_picture) { this.profile_picture = profile_picture; }

    public Boolean getIs_email_verified() { return is_email_verified; }
    public void setIs_email_verified(Boolean is_email_verified) { this.is_email_verified = is_email_verified; }

    public Timestamp getCreated_at() { return created_at; }
    public void setCreated_at(Timestamp created_at) { this.created_at = created_at; }

    public Timestamp getUpdated_at() { return updated_at; }
    public void setUpdated_at(Timestamp updated_at) { this.updated_at = updated_at; }
}
