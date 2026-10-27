package com.example.quanlycongviec.Mapper;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.TaskCompareDto;
import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.Entity.Task;

@Component

public class TaskMap {
    // private final UserMap userMapper;
    // private final ProjectMap projectMap;
    // public TaskMap(@Lazy ProjectMap projectMap) {
    // this.projectMap = projectMap;
    // }

    public TaskRes toResponse(Task task) {
        if (task == null) {
            return null;
        }
        // Cách 1: Dùng kiểm tra null đơn giản
        Set<Integer> assignees = (task.getTaskAssignees() != null)
                ? task.getTaskAssignees().stream()
                        .map(t->t.getUser().getId()) // Hoặc mapper tương ứng của bạn
                        .collect(Collectors.toSet())
                : Collections.emptySet(); // Hoặc new HashSet<>()
        return TaskRes.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .updateAt(task.getUpdateAt())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .createdAt(task.getCreatedAt())
                .assigneeIds(assignees)
                .progress(task.getProgress())
                // .tags(
                // task.getTags()
                // .stream()
                // .map(tagMapper::toResponse)
                // .toList())
                .build();
    }

    public Task toTask(TaskReq req) {

        if (req == null) {
            return null;
        }

        return Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .status(req.getStatus())
                .dueDate(req.getDueDate())
                .progress(req.getProgress())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public TaskCompareDto fromEntity(Task task) {

        // Safe mapping trong Transaction
        if (task.getTaskAssignees() == null) {
            task.setTaskAssignees(new HashSet<>());
        }
        return TaskCompareDto.builder()
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .progress(task.getProgress())
                .assigneeUserIds(task.getTaskAssignees().stream()
                        .map(assignee -> assignee.getUser().getId())
                        .collect(Collectors.toSet()))

                .build();
    }

}
