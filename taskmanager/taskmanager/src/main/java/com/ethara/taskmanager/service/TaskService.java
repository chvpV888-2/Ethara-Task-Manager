package com.ethara.taskmanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ethara.taskmanager.dto.TaskRequest;
import com.ethara.taskmanager.model.Project;
import com.ethara.taskmanager.model.Task;
import com.ethara.taskmanager.model.User;
import com.ethara.taskmanager.repository.ProjectRepository;
import com.ethara.taskmanager.repository.TaskRepository;
import com.ethara.taskmanager.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    // Spring hands us all three repositories so we can cross-check data!
    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Task createTask(TaskRequest request) {
        // 1. Verify the Project exists
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Error: Project not found!"));

        // 2. Verify the User exists
        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        // 3. Build the Task
        Task task = new Task();
        task.setTitle(request.getTitle());
        
        // MISSING DESCRIPTION FIX
        task.setDescription(request.getDescription());
        
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignee(assignee);
        task.setStatus("PENDING"); // New tasks always start as Pending (Ab String hai)

        // 4. Save it
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ENUM (TaskStatus) KO HATA KAR STRING KAR DIYA HAI
    public Task updateTaskStatus(Long taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Error: Task not found!"));
        
        task.setStatus(newStatus);
        return taskRepository.save(task);
    }
}