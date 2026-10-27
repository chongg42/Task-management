package com.example.quanlycongviec.Controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quanlycongviec.Service.IActivitiLog;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivitiLogController {
    private final IActivitiLog iActivitiLog;

    @GetMapping
    public ResponseEntity<?> findByProjectId(@RequestParam(name = "id") Integer projectId) {
        return ResponseEntity.ok(iActivitiLog.findByProjectId(projectId));
    }

}
