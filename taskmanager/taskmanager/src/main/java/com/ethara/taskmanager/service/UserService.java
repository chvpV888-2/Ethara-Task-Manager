package com.ethara.taskmanager.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ethara.taskmanager.dto.AuthRequest;
import com.ethara.taskmanager.model.User;
import com.ethara.taskmanager.repository.UserRepository;
import com.ethara.taskmanager.util.JwtUtil;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // Bring in our Badge Maker!

    // Spring automatically injects these tools
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken!");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(request.getRole());

        return userRepository.save(newUser);
    }

    // NEW METHOD: The Login Logic
    public String loginUser(AuthRequest request) {
        // 1. Find the user in the database
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Check if the password they typed matches the scrambled password in the database
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        // 3. If everything is correct, print the VIP Badge (JWT) and return it!
        return jwtUtil.generateToken(user.getUsername(), user.getRole().name());
    }
}