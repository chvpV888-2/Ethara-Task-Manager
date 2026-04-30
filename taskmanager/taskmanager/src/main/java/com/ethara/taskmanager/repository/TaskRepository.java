package com.ethara.taskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ethara.taskmanager.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Finds all tasks for a specific project
    List<Task> findByProjectId(Long projectId);
    
    // Finds all tasks assigned to a specific user
    List<Task> findByAssigneeId(Long userId);
}