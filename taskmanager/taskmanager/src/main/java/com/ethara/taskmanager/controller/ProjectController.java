package com.ethara.taskmanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.taskmanager.model.Project;
import com.ethara.taskmanager.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    // 1. GET ALL PROJECTS (New method for Frontend Dropdown)
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    // 2. CREATE NEW PROJECT (Admin Only)
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project projectRequest) {
        // Validation check
        if (projectRequest.getName() == null || projectRequest.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Project savedProject = projectRepository.save(projectRequest);
        return ResponseEntity.ok(savedProject);
    }
}