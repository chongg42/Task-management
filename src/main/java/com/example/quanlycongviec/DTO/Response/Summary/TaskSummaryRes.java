package com.example.quanlycongviec.DTO.Response.Summary;

import com.example.quanlycongviec.Entity.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskSummaryRes {
    private Integer id;
    private String title;
    private TaskStatus status;
    
}
