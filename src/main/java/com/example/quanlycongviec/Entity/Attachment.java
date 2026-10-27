package com.example.quanlycongviec.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.example.quanlycongviec.Entity.enums.AttachmentResource;

@Builder
@Entity
@Table(name = "attachments")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class Attachment extends BaseEntity {

    @Column(name = "file_url", nullable = false, length = 450)
    private String fileUrl;

    private String originalFileName; // Lưu tên gốc: "tailieu.pdf"
    private String storedFileName;

    @Column(name = "file_size")
    private Integer fileSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User user;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "projects_id")
    // private Project project;

    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "task_id")
    // private Task task;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false)
    private AttachmentResource resourceType;

    @Column(name = "resource_id", nullable = false)
    private Integer resourceId;
    // private String resource;
    // private int resourceId;
    private Boolean isDeleted;
    @Column(name = "upload_at")
    private LocalDateTime uploadAt;
}
