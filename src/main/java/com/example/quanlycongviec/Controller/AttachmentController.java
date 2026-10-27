package com.example.quanlycongviec.Controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.quanlycongviec.AOP.TrackActivity;
import com.example.quanlycongviec.DTO.Response.AttachmentRes;
import com.example.quanlycongviec.Service.AttachmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequestMapping("api/files")
@RestController
@RequiredArgsConstructor
public class AttachmentController {
    @Value("${storage.upload-dir}")
    private String dir;
    private final AttachmentService attachmentService;
     @TrackActivity(action = "UPLOAD-ATTACHMENT",resource   = "FILE")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile[] file) {
        // TODO: process POST request
        if (file == null || file.length <= 0) {
            return ResponseEntity.badRequest().body("File rong");
        }
        try {
            // Tao thu muc neu chua ton tai
            File directory = new File(dir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            for (MultipartFile multipartFile : file) {
                String fileName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
                Path path = Paths.get(dir + fileName);
                Files.copy(multipartFile.getInputStream(), path);
            }
        } catch (Exception e) {
            // TODO: handle exception
              throw new RuntimeException(e);
        }
        return null;
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resource> getFile(@PathVariable Integer id) {
        try {
            AttachmentRes attachment=attachmentService.findById(id);
            String filename=attachment.getStoredFileName();
            String storageName=attachment.getOriginalFileName();
            if(filename==null){
                return ResponseEntity.notFound().build();
            }
            Path filePath = Paths.get(dir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            // 2. Kiểm tra xem file có tồn tại và đọc được không
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // 3. Tự động đoán định dạng file (contentType) như image/jpeg,
            // application/pdf...
              // mặc định nếu không đoán được đây là file nhị phân
              String contentType="";
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException e) {
                // Không log hoặc log nhẹ nhàng vì file vẫn tồn tại
            }
            if(contentType ==null||contentType.isBlank()){
                contentType = "application/octet-stream";
            }
            
            // 4. Trả file về cho Client
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    // Dòng dưới này giúp trình duyệt hiểu là  bắt buộc tải xuống (attachment) thay vì
                    //  hiển thị trực tiếp (inline)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + storageName + "\"")
                    .body(resource);
        } catch (Exception e) {
             e.printStackTrace(); // tạm thời, để xem exception là gì
            return ResponseEntity.internalServerError().build();
        }
    }

}
