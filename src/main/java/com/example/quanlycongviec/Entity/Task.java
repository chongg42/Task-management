package com.example.quanlycongviec.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.quanlycongviec.Entity.enums.TaskStatus;

@Entity
@Table(name = "task")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private Boolean deleted;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column
    private Integer progress;

    @ManyToOne
    @JoinColumn(name = "projects_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "comments_id")
    private Comment comment;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "task_tag", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TaskAssignees> taskAssignees;
}