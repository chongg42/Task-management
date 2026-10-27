package com.example.quanlycongviec.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.quanlycongviec.Entity.enums.ProjectStatus;

@Entity
@Table(name = "projects")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private String name;

  private String description;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  private Boolean deleted;

  @Enumerated(EnumType.STRING)
  private ProjectStatus status;

  private LocalDateTime dueDate;

  private LocalDateTime startDate;
  @ManyToMany(mappedBy = "memberProject")
  private Set<User> members;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by", nullable = false)
  private User owner;

  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Task> tasks = new HashSet<>();

  // @OneToMany(mappedBy = "project")
  // private Set<Attachment> attachments = new HashSet<>();

  // @OneToMany(mappedBy = "project")
  // private Set<ActivityLog> activityLogs = new HashSet<>();
}
