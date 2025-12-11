package com.webcrafters.confease_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long room_id;
    private String name;
    private Integer capacity;
    private String location;

    // Getters and Setters
    public Long getRoom_id() { return room_id; }
    public void setRoom_id(Long room_id) { this.room_id = room_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
