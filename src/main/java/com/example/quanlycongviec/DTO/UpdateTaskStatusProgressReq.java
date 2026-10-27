package com.example.quanlycongviec.DTO;

import com.example.quanlycongviec.Entity.enums.TaskStatus;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateTaskStatusProgressReq {

    private TaskStatus status;

    @Min(value = 0, message = "Tiến độ tối thiểu là 0%")
    @Max(value = 100, message = "Tiến độ tối đa là 100%")
    private Integer progress;
}