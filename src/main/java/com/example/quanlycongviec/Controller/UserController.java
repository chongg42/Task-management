package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Entity.list.ProjectStatus;
import com.example.quanlycongviec.Entity.list.TaskStatus;
import com.example.quanlycongviec.Mapper.UserMap;
import com.example.quanlycongviec.Service.TaskService;
import com.example.quanlycongviec.Service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    // public final UserService nguoiDungService;
    public final TaskService taskService;
    private final UserService userService;
    // @GetMapping
    // public ResponseEntity<?> findById(@RequestParam int id) {
    //     User nguoiDung = nguoiDungService.findById(id);
    //     if (nguoiDung == null) {
    //         return ResponseEntity.status(404).body("Không tìm thấy người dùng");
    //     }
    //     return ResponseEntity.ok(UserMap.toResponse(nguoiDung)); // Trả về nguyên một Object dưới dạng JSON
    // }
    @GetMapping("/task/mytask")
   
    public ResponseEntity<?> getTask(@RequestParam(required = false) String key,
    @RequestParam(required = false) TaskStatus status,
    @RequestParam(required = false,defaultValue = "0") int page,
    @RequestParam(required = false,defaultValue = "6") int size,
    HttpSession session) {
        Pageable pageable=PageRequest.of(page,size,Sort.by("id").descending());
        return ResponseEntity.ok(taskService.findTaskByUser(key, status,(Integer) session.getAttribute("userID"), pageable));
    }
    @GetMapping("/project/myproject")
    public ResponseEntity<?> getProject(@RequestParam(required = false) String key,
    @RequestParam(required = false) ProjectStatus status,
    @RequestParam(required = false,defaultValue = "0") int page,
    @RequestParam(required = false,defaultValue = "6") int size,
    HttpSession session) {
         Pageable pageable=PageRequest.of(page,size,Sort.by("id").descending());
        return ResponseEntity.ok( userService.getAllProject(key, status, (Integer)session.getAttribute("userID"), pageable));
    }
    
     @GetMapping("/task/taskstatus")
    public ResponseEntity<?> countTaskByStatus(@RequestParam(required = false) String userId ,HttpSession session) {
        return ResponseEntity.ok(taskService.countTaskByStatus((Integer) session.getAttribute("userID")));

    }
}
