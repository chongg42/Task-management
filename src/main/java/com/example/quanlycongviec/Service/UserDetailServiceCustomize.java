package com.example.quanlycongviec.Service;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.quanlycongviec.DTO.CustomUserDetails;
import com.example.quanlycongviec.Entity.User;
import com.example.quanlycongviec.Repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailServiceCustomize implements UserDetailsService {
    private final UserRepo userRepo;

    @Override   
    public  UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user=userRepo.findByEmail(email).orElseThrow(()->new RuntimeException("Không thấy user nào "));
        return new CustomUserDetails(user);
     }

}
