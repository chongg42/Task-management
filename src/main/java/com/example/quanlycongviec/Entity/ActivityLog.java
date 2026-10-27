package com.example.quanlycongviec.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String action;

    private String resource;
    private String description;

    @Column(name = "created_at", updatable = false)
    @org.hibernate.annotations.CreationTimestamp // Tự động điền thời gian khi insert
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id")
    private User user;
    private Integer resourceId;
     
   private Integer projectId; 
    @Column(length = 20)
    private String status;
}