package com.ethara.taskmanager.controller;

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

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        try {
            userService.registerUser(request);
            return ResponseEntity.ok("User registered successfully! Welcome to the team.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

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

    // THE ULTIMATE DB NUKE HACK (Foreign Key bypass ke sath)
    @GetMapping("/clear-users")
    @Transactional
    public ResponseEntity<String> clearUsers(@Autowired EntityManager em) {
        // 1. Constraints ko temporarily disable karo
        em.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();
        
        // 2. Saari tables completely saaf karo
        em.createNativeQuery("TRUNCATE TABLE tasks").executeUpdate();
        em.createNativeQuery("TRUNCATE TABLE projects").executeUpdate();
        em.createNativeQuery("TRUNCATE TABLE users").executeUpdate();
        
        // 3. Constraints wapas on kar do
        em.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();
        
        return ResponseEntity.ok("SAB KUCH SAAF! Database ekdum fresh ho gaya.");
    }
}