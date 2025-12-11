package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.Role;
import com.webcrafters.confease_backend.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService; // use constructor injection

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAll(); // use getAll()
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id) {
        try {
            Role role = roleService.getById(id); // use getById()
            return new ResponseEntity<>(role, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role saved = roleService.create(role); // use create()
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Integer id, @RequestBody Role roleDetails) {
        try {
            Role updated = roleService.update(id, roleDetails); // use update()
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        try {
            roleService.delete(id); // use delete()
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
