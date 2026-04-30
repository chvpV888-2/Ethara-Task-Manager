package com.ethara.taskmanager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.taskmanager.dto.AuthRequest;
import com.ethara.taskmanager.service.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {
    @org.springframework.beans.factory.annotation.Autowired
    private com.ethara.taskmanager.repository.UserRepository userRepository;

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        try {
            // Try to register the user
            userService.registerUser(request);
            return ResponseEntity.ok("User registered successfully! Welcome to the team.");
        } catch (Exception e) {
            // If user already exists, catch it and return a clean 400 Bad Request error
            // This PREVENTS the 403 Forbidden error!
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {
        try {
            String vipBadge = userService.loginUser(request);
            return ResponseEntity.ok(vipBadge);
        } catch (Exception e) {
            // YE LINE ASLI ERROR BATAEGI RAILWAY LOGS MEIN
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: " + e.getMessage());
        }
    }

@org.springframework.web.bind.annotation.GetMapping("/clear-users")
public org.springframework.http.ResponseEntity<String> clearUsers() {
    userRepository.deleteAll();
    return org.springframework.http.ResponseEntity.ok("Database saaf! Saare purane users delete ho gaye.");
}
}