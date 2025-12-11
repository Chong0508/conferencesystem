package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Track;
import com.webcrafters.confease_backend.service.TrackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@CrossOrigin(origins = "*")
public class TrackController {

    private final TrackService service;

    public TrackController(TrackService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Track>> getAllTracks() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Track> getTrackById(@PathVariable Long id) {
        Track track = service.getById(id);
        if (track != null) return ResponseEntity.ok(track);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Track> createTrack(@RequestBody Track track) {
        return ResponseEntity.status(201).body(service.create(track));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Track> updateTrack(@PathVariable Long id, @RequestBody Track track) {
        Track updated = service.update(id, track);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrack(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
