package com.procore.task.demo.repository;

import com.procore.task.demo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Spring Data JPA will automatically provide methods like findAll, findById, save, deleteById.
    // The soft-delete logic defined in the Task entity will be applied automatically.
}
