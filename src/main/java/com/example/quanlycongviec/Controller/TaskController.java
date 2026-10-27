package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.DTO.Request.TaskReq;
import com.example.quanlycongviec.DTO.Response.TaskRes;
import com.example.quanlycongviec.Entity.enums.TaskStatus;
import com.example.quanlycongviec.Service.impl.TaskService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor

public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<?> countTaskByStatus(@RequestParam(required = false) String userId) {
        return ResponseEntity.status(404).body("Không tìm thấy người dùng");

    }

    @GetMapping("/status")
    public ResponseEntity<?> countTaskByStatus(@RequestParam(required = false) String userId, HttpSession session) {
        return ResponseEntity.ok(taskService.countTaskByStatus((Integer) session.getAttribute("userID")));

    }

    // @PatchMapping("/{id}")
    // public ResponseEntity<TaskRes> updateTaskPartial(
    //         @PathVariable Long id,
    //         @RequestBody TaskReq req) {
    // }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestPart("task") TaskStatus newStatus,
            @RequestPart(value = "files", required = false) MultipartFile files, HttpSession httpSession) {

        return ResponseEntity
                .ok(taskService.updateStatus(id, newStatus, files, (Integer) httpSession.getAttribute("userID")));
    }

    @GetMapping("/project/{id}")
    public ResponseEntity<?> findByProjectId(@RequestParam(required = false) String key,
            @RequestParam(required = false) TaskStatus status, @PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "5") Integer size,
            @RequestParam(required = false, defaultValue = "0") Integer page) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(taskService.findByProject(key, status, id, pageable));
    }

    @GetMapping(params = "projectId")
    public ResponseEntity<?> findAllByProjectId(@RequestParam Integer projectId) {

        return ResponseEntity.ok(taskService.findAllByProjectId(projectId));
    }

}
