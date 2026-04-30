package com.ethara.taskmanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ethara.taskmanager.dto.ProjectRequest;
import com.ethara.taskmanager.model.Project;
import com.ethara.taskmanager.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // Create a new project
    public Project createProject(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        
        return projectRepository.save(project);
    }

    // Get a list of all projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}