package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Schedule;
import com.webcrafters.confease_backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Get all schedules
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return ResponseEntity.ok(schedules);
    }

    // Get schedule by ID
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Optional<Schedule> schedule = scheduleRepository.findById(id);
        if (schedule.isPresent()) {
            return ResponseEntity.ok(schedule.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new schedule
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        Schedule savedSchedule = scheduleRepository.save(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSchedule);
    }

    // Update an existing schedule
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule scheduleDetails) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            Schedule schedule = optionalSchedule.get();
            // Update fields
            schedule.setSession_id(scheduleDetails.getSession_id());
            schedule.setRoom_id(scheduleDetails.getRoom_id());
            schedule.setStart_time(scheduleDetails.getStart_time());
            schedule.setEnd_time(scheduleDetails.getEnd_time());

            Schedule updatedSchedule = scheduleRepository.save(schedule);
            return ResponseEntity.ok(updatedSchedule);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}