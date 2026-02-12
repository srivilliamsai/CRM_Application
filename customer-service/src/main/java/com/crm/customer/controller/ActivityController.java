package com.crm.customer.controller;

import com.crm.customer.entity.Activity;
import com.crm.customer.entity.Note;
import com.crm.customer.repository.ActivityRepository;
import com.crm.customer.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private NoteRepository noteRepository;

    // ============ Activities ============

    @GetMapping("/activities/customer/{customerId}")
    public ResponseEntity<List<Activity>> getActivitiesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(activityRepository.findByCustomerIdOrderByCreatedAtDesc(customerId));
    }

    @PostMapping("/activities")
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityRepository.save(activity));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ============ Notes ============

    @GetMapping("/notes/customer/{customerId}")
    public ResponseEntity<List<Note>> getNotesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(noteRepository.findByCustomerIdOrderByCreatedAtDesc(customerId));
    }

    @PostMapping("/notes")
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteRepository.save(note));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note note) {
        Note existing = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        existing.setContent(note.getContent());
        return ResponseEntity.ok(noteRepository.save(existing));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
