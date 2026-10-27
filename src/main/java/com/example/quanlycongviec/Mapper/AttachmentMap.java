package com.example.quanlycongviec.Mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.Request.AttachmentReq;
import com.example.quanlycongviec.DTO.Response.AttachmentRes;
import com.example.quanlycongviec.Entity.Attachment;

@Component
public class AttachmentMap {
    // public Attachment toEntity(AttachmentReq req) {

    //     if (req == null) {
    //         return null;
    //     }

    //     return Attachment.builder()
    //             .fileName(req.getFileName())
    //             .fileUrl(req.getFileUrl())
    //             .fileSize(req.getFileSize())
    //             .uploadAt(LocalDateTime.now())
    //             .build();
    // }

    public AttachmentRes toResponse(Attachment attachment) {

        if (attachment == null) {
            return null;
        }

        return AttachmentRes.builder()
                .id(attachment.getId())
                .originalFileName(attachment.getOriginalFileName())
                .storedFileName(attachment.getStoredFileName())
                .fileSize(attachment.getFileSize())
                .uploadAt(attachment.getUploadAt())
                .build();
    }
}
