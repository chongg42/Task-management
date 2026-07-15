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
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String action;

    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "projects_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "notifications_id")
    private Notification notification;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}