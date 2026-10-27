package com.example.quanlycongviec.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.example.quanlycongviec.Entity.enums.Gender;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String avatar;

    private LocalDate birthday;

    private String email;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "full_name")
    private String fullName;

    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private Boolean deleted;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "projects_member", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "project_id"))
    private Set<Project> memberProject;

    @OneToMany(mappedBy = "owner")
    private Set<Project> ownedProjects;

    @OneToMany(mappedBy = "user")
    private Set<Notification> notifications;

    @OneToMany(mappedBy = "user")
    private List<Attachment> attachments;

    @OneToMany(mappedBy = "user")
    private List<ActivityLog> activityLogs;

    @OneToMany(mappedBy = "createdBy")
    private List<Tag> tags;

    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

    @OneToMany(mappedBy = "user")
    private Set<TaskAssignees> taskAssignees;
}