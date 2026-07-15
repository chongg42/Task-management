package com.example.quanlycongviec.Mapper;

import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.Entity.Task;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaskMap {
    // private final UserMap userMapper;


    public TaskRes toResponse(Task task) {

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
                // .members(
                //         task.getMembers()
                //                 .stream()
                //                 .map(userMapper::toResponse)
                //                 .toList())
                // .tags(
                //         task.getTags()
                //                 .stream()
                //                 .map(tagMapper::toResponse)
                //                 .toList())
                 .build();
    }

}
