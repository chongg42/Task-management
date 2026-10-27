package com.example.quanlycongviec.Service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.Request.LoginReq;
import com.example.quanlycongviec.DTO.Response.UserRes;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Mapper.UserMap;
import com.example.quanlycongviec.Repository.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final UserMap userMap;
    private final PasswordEncoder passwordEncoder;

    public List<UserRes> findAllById(List<Integer> id) {

        return userRepo.findAllById(id).stream().map(u -> userMap.toUserRes(u)).collect(Collectors.toList());
    }

    public UserRes findByEmail(String email) {
        return userMap
                .toUserRes(userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User không tồn tại")));
    }
    public UserRes findById(Integer id){
        return userMap
                .toUserRes(userRepo.findById(id).orElseThrow(() -> new RuntimeException("User không tồn tại")));
    }
    public void createUser(LoginReq loginReq) {
        // 1. Kiểm tra nếu email ĐÃ TỒN TẠI thì báo lỗi
        if (userRepo.existsByEmail(loginReq.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // 2. Nếu CHƯA TỒN TẠI thì  tạo và lưu user
        User user = User.builder()
                .email(loginReq.getEmail())
                .password(passwordEncoder.encode(loginReq.getPassword()))
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepo.save(user);
    }
}