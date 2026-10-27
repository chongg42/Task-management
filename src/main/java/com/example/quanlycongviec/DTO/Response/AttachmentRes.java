package com.example.quanlycongviec.DTO.Response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AttachmentRes {
    private Integer id;
    private String fileUrl; 
    private String originalFileName;
    private String storedFileName;
    private Integer fileSize;
    private LocalDateTime uploadAt;
}
