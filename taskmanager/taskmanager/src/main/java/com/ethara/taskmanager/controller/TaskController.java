package com.ethara.taskmanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethara.taskmanager.dto.TaskRequest;
import com.ethara.taskmanager.model.Task;
import com.ethara.taskmanager.service.TaskService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 1. GET ALL TASKS
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // 2. CREATE NEW TASK (Ab ye properly TaskRequest DTO aur TaskService use karega)
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        // Ye TaskService tumhare IDs ko actual Project aur User objects mein convert kar dega
        Task createdTask = taskService.createTask(request);
        return ResponseEntity.ok(createdTask);
    }

    // 3. UPDATE TASK STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Task updatedTask = taskService.updateTaskStatus(id, request.get("status"));
        return ResponseEntity.ok(updatedTask);
    }
}