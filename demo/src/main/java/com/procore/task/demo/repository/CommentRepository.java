package com.procore.task.demo.repository;

import com.procore.task.demo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Custom query to find all comments for a specific task ID
    List<Comment> findByTaskId(Long taskId);
}
