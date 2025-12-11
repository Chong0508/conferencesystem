package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Event;
import com.webcrafters.confease_backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    // Get all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new event
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
    }

    // Update an existing event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            // Update fields
            event.setConference_id(eventDetails.getConference_id());
            event.setName(eventDetails.getName());
            event.setStart_time(eventDetails.getStart_time());
            event.setEnd_time(eventDetails.getEnd_time());
            event.setLocation(eventDetails.getLocation());

            Event updatedEvent = eventRepository.save(event);
            return ResponseEntity.ok(updatedEvent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}