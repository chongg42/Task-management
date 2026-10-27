package com.example.quanlycongviec.Repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.quanlycongviec.Entity.Attachment;

import java.util.List;
import java.util.Optional;



public interface AttachmentRepo extends JpaRepository<Attachment,Integer>{
       Set<Attachment> findAllByProjectIdAndIsDeletedFalse(Integer projectId);
       Optional<Attachment> findById(Integer id);
       // Set<Attachment> findAllByIdIn(List<Integer>id);
}
