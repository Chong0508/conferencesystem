package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Session;
import com.webcrafters.confease_backend.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionService service;

    public SessionController(SessionService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        Session session = service.getById(id);
        if (session != null) return ResponseEntity.ok(session);
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Session> createSession(@RequestBody Session session) {
        return ResponseEntity.status(201).body(service.create(session));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Session> updateSession(@PathVariable Long id, @RequestBody Session session) {
        Session updated = service.update(id, session);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
