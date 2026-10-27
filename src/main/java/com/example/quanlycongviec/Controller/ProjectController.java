package com.example.quanlycongviec.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.Controller.AOP.TrackActivity;
import com.example.quanlycongviec.DTO.Request.ProjectReq;
import com.example.quanlycongviec.DTO.Response.ProjectRes;
import com.example.quanlycongviec.Entity.enums.ProjectStatus;
import com.example.quanlycongviec.Service.IProject;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;


@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    
    private final IProject iProject;
    @GetMapping("/{id}")
    public ProjectRes getProject(@PathVariable(required = true) Integer id) {
        return iProject.findById(id);
    }
      @GetMapping("/myproject")
    public ResponseEntity<?> getProject(@RequestParam(required = false) String key,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "5") int size,
            HttpSession session) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity
                .ok(iProject.getAllProject(key, status, (Integer) session.getAttribute("userID"), pageable));
    }

 

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @TrackActivity(action = "CREATE_PROJECT",resource   = "PROJECT",description = "tạo dự án mới")
    public ResponseEntity<?> createdProject(@RequestPart("project") ProjectReq projectReq, @RequestPart(value = "files", required = false) MultipartFile[] files,
            HttpSession session) {

        return ResponseEntity.ok(iProject.createdProject(projectReq, (Integer) session.getAttribute("userID"), files));
    }
    @PutMapping("/{id}")
    @TrackActivity(action = "UPDATE_PROJECT",resource  = "PROJECT",description = "cập nhật dự án")
    public ResponseEntity<?> updateProject (@PathVariable Integer id, @RequestPart("project") ProjectReq projectReq, @RequestPart(value = "files", required = false) MultipartFile[] files) {
        
        return ResponseEntity.ok(iProject.updateProject(id,projectReq,files));
    }
    @DeleteMapping("/{id}")
     @TrackActivity(action = "Xóa Dự Án",resource   = "PROJECT")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        iProject.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}


