package com.example.quanlycongviec.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
public class Attachment extends BaseEntity {
 
    @Column(name = "file_url", nullable = false, length = 450)
    private String fileUrl;
 
    @Column(name = "file_name", length = 255)
    private String fileName;
 
    @Column(name = "file_size")
    private Integer fileSize;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private User user;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projects_id")
    private Project project;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;
 
    @Column(name = "upload_at")
    private LocalDateTime uploadAt;
}
