package com.procore.task.demo.controller;

import com.procore.task.demo.model.Comment;
import com.procore.task.demo.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3001")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // GET all comments for a specific task
    @GetMapping("/tasks/{taskId}/comments")
    public ResponseEntity<List<Comment>> getCommentsByTaskId(@PathVariable(value = "taskId") Long taskId) {
        // First, check if the parent task even exists.
        if (!commentService.taskExists(taskId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(commentService.getCommentsByTaskId(taskId));
    }

    // POST a new comment to a task
    @PostMapping("/tasks/{taskId}/comments")
    public ResponseEntity<Comment> createComment(@PathVariable(value = "taskId") Long taskId,
                                                 @RequestBody Comment comment) {
        return commentService.createComment(taskId, comment)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT (update) an existing comment
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable(value = "commentId") Long commentId,
                                                 @RequestBody Comment commentDetails) {
        return commentService.updateComment(commentId, commentDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE a comment
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable(value = "commentId") Long commentId) {
        if (commentService.deleteComment(commentId)) {
            return ResponseEntity.ok().<Void>build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}


