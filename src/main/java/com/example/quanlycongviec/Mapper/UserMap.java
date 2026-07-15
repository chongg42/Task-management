package com.example.quanlycongviec.Mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.quanlycongviec.DTO.Response.UserRes;
import com.example.quanlycongviec.Entity.User;


@Component
public class UserMap {

    public UserRes toUserRes(User user) {

        if (user == null) {
            return null;
        }

        return UserRes.builder()
                .id(user.getId())
                .avatar(user.getAvatar())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .build();
    }
    public Set<UserRes> toUserResSet(Set<User> users) {

    return users.stream()
            .map(this::toUserRes)
            .collect(Collectors.toSet());
}
}
