package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Room;
import com.webcrafters.confease_backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // Get all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    // Get room by ID
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomRepository.findById(id);
        if (room.isPresent()) {
            return ResponseEntity.ok(room.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new room
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // Update an existing room
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            // Update fields
            room.setName(roomDetails.getName());
            room.setCapacity(roomDetails.getCapacity());
            room.setLocation(roomDetails.getLocation());

            Room updatedRoom = roomRepository.save(room);
            return ResponseEntity.ok(updatedRoom);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a room
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}