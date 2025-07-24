package com.procore.task.demo.service;

import com.procore.task.demo.model.Task;
import com.procore.task.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Task createTask(Task task) {
        // In a real application, you might add more complex logic here,
        // such as generating a unique task number or validating input.
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(Long taskId, Task taskDetails) {
        // Find the existing task, then update its properties from the request body.
        return taskRepository.findById(taskId).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setNumber(taskDetails.getNumber());
            task.setStatus(taskDetails.getStatus());
            task.setPriority(taskDetails.getPriority());
            task.setAssignee(taskDetails.getAssignee());
            task.setDescription(taskDetails.getDescription());
            task.setDescriptionRichText(taskDetails.getDescriptionRichText());
            task.setDueDate(taskDetails.getDueDate());
            return taskRepository.save(task);
        });
    }

    public boolean deleteTask(Long taskId) {
        // The repository's delete method will trigger the soft-delete logic
        // defined in the Task entity.
        return taskRepository.findById(taskId).map(task -> {
            taskRepository.delete(task);
            return true;
        }).orElse(false);
    }
}

