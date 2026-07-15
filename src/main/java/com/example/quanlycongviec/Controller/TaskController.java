package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quanlycongviec.Service.TaskService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/congviecs")
@RequiredArgsConstructor

public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<?> countTaskByStatus(@RequestParam(required = false) String userId) {
        return ResponseEntity.status(404).body("Không tìm thấy người dùng");

    }

}
