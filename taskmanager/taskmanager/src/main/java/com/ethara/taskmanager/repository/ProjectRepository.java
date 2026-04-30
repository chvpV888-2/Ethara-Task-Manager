package com.ethara.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ethara.taskmanager.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // JpaRepository already gives us save(), findAll(), findById(), and delete() for free!
}