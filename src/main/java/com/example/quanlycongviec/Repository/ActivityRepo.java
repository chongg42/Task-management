package com.example.quanlycongviec.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.repository.query.Param;

import com.example.quanlycongviec.Entity.ActivityLog;


public interface ActivityRepo extends JpaRepository<ActivityLog,Integer> {
   
//    @Query("SELECT a FROM ActivityLog a WHERE " +
//            "(a.resource = 'PROJECT' AND a.resourceId = :projectId) OR " +
//            "(a.resourceId IN (SELECT t.id FROM Task t WHERE t.project.id = :projectId)) " +
//            "ORDER BY a.createdAt DESC")
    List<ActivityLog> findAllByProjectId(@Param("projectId") Integer projectId);

}
