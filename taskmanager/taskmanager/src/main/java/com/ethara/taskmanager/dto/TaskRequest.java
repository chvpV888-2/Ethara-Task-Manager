package com.ethara.taskmanager.dto;

import java.time.LocalDate;

public class TaskRequest {
    private String title;
    private LocalDate dueDate;
    private Long projectId; // We only need the ID of the project from the frontend
    private Long assigneeId; 
    // We only need the ID of the user
    private String description;

public String getDescription() { return description; }
public void setDescription(String description) { this.description = description; }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    
}