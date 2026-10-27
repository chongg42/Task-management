package com.example.quanlycongviec.Entity;

import java.time.LocalDateTime;

import org.javers.core.metamodel.annotation.ShallowReference;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "task_assignee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class TaskAssignees {

    @EmbeddedId
    private TaskAssigneeId id=new TaskAssigneeId();
    
@ShallowReference
    @ManyToOne
    @MapsId("usersId")
    @JoinColumn(name = "users_id")
    private User user;

    @ManyToOne
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
}
