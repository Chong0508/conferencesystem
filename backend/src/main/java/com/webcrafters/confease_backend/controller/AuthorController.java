package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Author;
import com.webcrafters.confease_backend.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/author")
public class AuthorController {

    @Autowired
    private AuthorService service;

    @GetMapping
    public List<Author> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Author getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Author create(@RequestBody Author author) {
        return service.create(author);
    }

    @PutMapping("/{id}")
    public Author update(@PathVariable Long id, @RequestBody Author author) {
        return service.update(id, author);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}