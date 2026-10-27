package com.example.quanlycongviec.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.quanlycongviec.Entity.User;



public interface UserRepo extends JpaRepository<User, Integer> {
   
    Optional<User> findByEmail(String email);;
}
