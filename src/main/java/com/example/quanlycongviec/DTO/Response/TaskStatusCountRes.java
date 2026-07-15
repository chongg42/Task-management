package com.example.quanlycongviec.DTO.Response;

import com.example.quanlycongviec.Entity.list.TaskStatus;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class TaskStatusCountRes {
    private TaskStatus taskStatus;
    private long count;
}
