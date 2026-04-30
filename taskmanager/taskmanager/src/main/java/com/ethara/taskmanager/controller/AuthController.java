package com.ethara.taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.taskmanager.dto.AuthRequest;
import com.ethara.taskmanager.model.User;
import com.ethara.taskmanager.repository.UserRepository;
import com.ethara.taskmanager.service.UserService;

import jakarta.persistence.EntityManager;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // 1. REGISTER NEW USER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        try {
            userService.registerUser(request);
            return ResponseEntity.ok("User registered successfully! Welcome to the team.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 2. LOGIN
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        try {
            String vipBadge = userService.loginUser(request);
            return ResponseEntity.ok(vipBadge);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: " + e.getMessage());
        }
    }

    // 3. GET ALL USERS (New method for Frontend Dropdown)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 4. DB NUKE (Testing ke liye)
    @GetMapping("/clear-users")
    @Transactional
    public ResponseEntity<String> clearUsers(@Autowired EntityManager em) {
        em.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();
        em.createNativeQuery("TRUNCATE TABLE tasks").executeUpdate();
        em.createNativeQuery("TRUNCATE TABLE projects").executeUpdate();
        em.createNativeQuery("TRUNCATE TABLE users").executeUpdate();
        em.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
        
        return ResponseEntity.ok("SAB KUCH SAAF! Database ekdum fresh ho gaya.");
    }
}