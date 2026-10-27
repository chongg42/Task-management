package com.example.quanlycongviec.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.quanlycongviec.Entity.TaskAssigneeId;
import com.example.quanlycongviec.Entity.TaskAssignees;

public interface TaskAssigneeRepo extends JpaRepository<TaskAssignees, TaskAssigneeId> {
    public void deleteByTaskId(Integer id);
}
