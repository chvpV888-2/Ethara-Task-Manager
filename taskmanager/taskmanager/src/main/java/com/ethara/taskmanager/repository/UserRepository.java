package com.ethara.taskmanager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ethara.taskmanager.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring magically turns this method name into a SQL query to find a user for logging in!
    Optional<User> findByUsername(String username);
}