package com.example.quanlycongviec.Service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.Response.UserRes;

import com.example.quanlycongviec.Mapper.UserMap;
import com.example.quanlycongviec.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service // Chỉ giữ lại @Service, BỎ HOÀN TOÀN @SpringBootApplication
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;
    private final UserMap userMap;

    public List<UserRes> findAllById(List<Integer> id) {
        
        return userRepo.findAllById(id).stream().map(u->userMap.toUserRes(u)).collect(Collectors.toList());
    }

    public UserRes findByEmail(String email) {
        return userMap.toUserRes(userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User không tồn tại")));
    }
}