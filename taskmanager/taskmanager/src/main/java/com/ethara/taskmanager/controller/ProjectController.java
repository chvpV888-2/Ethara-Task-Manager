package com.ethara.taskmanager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.taskmanager.dto.ProjectRequest;
import com.ethara.taskmanager.model.Project;
import com.ethara.taskmanager.service.ProjectService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects") // The base URL for project stuff
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // POST /api/projects -> Creates a new project
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectRequest request) {
        Project createdProject = projectService.createProject(request);
        return ResponseEntity.ok(createdProject);
    }

    // GET /api/projects -> Retrieves all projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
}