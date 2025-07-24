package com.procore.task.demo.service;

import com.procore.task.demo.model.Comment;
import com.procore.task.demo.repository.CommentRepository;
import com.procore.task.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Comment> getCommentsByTaskId(Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }

    public boolean taskExists(Long taskId) {
        return taskRepository.existsById(taskId);
    }

    public Optional<Comment> createComment(Long taskId, Comment comment) {
        // Find the parent task first. If it exists, associate the comment and save it.
        return taskRepository.findById(taskId).map(task -> {
            comment.setTask(task);
            return commentRepository.save(comment);
        });
    }

    public Optional<Comment> updateComment(Long commentId, Comment commentDetails) {
        return commentRepository.findById(commentId).map(comment -> {
            comment.setUserName(commentDetails.getUserName());
            comment.setComment(commentDetails.getComment());
            return commentRepository.save(comment);
        });
    }

    public boolean deleteComment(Long commentId) {
        return commentRepository.findById(commentId).map(comment -> {
            commentRepository.delete(comment);
            return true;
        }).orElse(false);
    }
}
