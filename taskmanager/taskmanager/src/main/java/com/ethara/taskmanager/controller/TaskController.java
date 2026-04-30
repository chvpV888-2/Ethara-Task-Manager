package com.ethara.taskmanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ethara.taskmanager.model.Task;
import com.ethara.taskmanager.repository.TaskRepository;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // 1. GET ALL TASKS
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    // 2. CREATE NEW TASK
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        if (task.getStatus() == null) {
            task.setStatus("PENDING"); // Naya task hamesha pending
        }
        return ResponseEntity.ok(taskRepository.save(task));
    }

    // 3. UPDATE TASK STATUS (Member ye call karega)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(request.get("status"));
        taskRepository.save(task);
        return ResponseEntity.ok("Status Updated");
    }
}