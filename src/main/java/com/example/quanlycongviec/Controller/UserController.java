package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quanlycongviec.DTO.Request.LoginReq;
import com.example.quanlycongviec.DTO.Response.UserRes;

import com.example.quanlycongviec.Entity.enums.TaskStatus;
import com.example.quanlycongviec.Mapper.UserMap;
import com.example.quanlycongviec.Service.impl.TaskService;
import com.example.quanlycongviec.Service.impl.UserService;
import com.example.quanlycongviec.Utils.SecurityUtils;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    // public final UserService nguoiDungService;
    public final TaskService taskService;
    private final UserService userService;
    private final UserMap userMap;

    @GetMapping(params = "email")
    public ResponseEntity<?> findByEmail(@RequestParam(required = false) String email) {
        UserRes user = userService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy người dùng");
        }
        return ResponseEntity.ok(user); // Trả về nguyên một Object dưới dạng JSON
    }
    @GetMapping("/profile")
    public ResponseEntity<UserRes> getUser(){
        return ResponseEntity.ok(userService.findById(SecurityUtils.getCurrentUserId()));
    }
    @GetMapping(params = "ids")
    public List<UserRes> getUsers(@RequestParam List<Integer> ids) {
        return userService.findAllById(ids);
    }

    @GetMapping("/task/mytask")
    public ResponseEntity<?> getTask(@RequestParam(required = false) String key,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity
                .ok(taskService.findTaskByUser(key, status, SecurityUtils.getCurrentUserId(), pageable));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody LoginReq loginReq) {
        try {
            userService.createUser(loginReq);
            return ResponseEntity.ok("Tạo user thành công");
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Tạo user thất bại: " + e.getMessage());
        }
    }

}
