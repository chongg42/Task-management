package com.example.quanlycongviec.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.quanlycongviec.Entity.ActivityLog;


public interface ActivityLogRepo extends JpaRepository<ActivityLog,Integer> {
    // public List<ActivityLog> findByProjectId(Integer id);
    @Query("Select a from ActivityLog a where (a.resource= 'PROJECT' and a.resourceId=:projectId) or (a.resource='TASK' and a.resourceId in(select t.id from Task t where t.project.id=:projectId )) ORDER BY a.createdAt DESC ")
        List<ActivityLog> findByProjectId(Integer projectId);
}
