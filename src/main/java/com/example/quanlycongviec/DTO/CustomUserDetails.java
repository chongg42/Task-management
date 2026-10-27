package com.example.quanlycongviec.DTO;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.quanlycongviec.Entity.User;

public class CustomUserDetails implements UserDetails {

    private final User user; // Entity User trong Database của bạn

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public boolean isProfileIncomplete() {
        // Kiểm tra xem các trường quan trọng có bị null không
        return user.getFullName() == null || user.getAvatar() == null || user.getBirthday() == null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return null;
    }

    @Override
    public String getPassword() {

        return user.getPassword();
    }

    @Override
    public String getUsername() {

        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {

        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {

        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {

        return UserDetails.super.isEnabled();
    }

}
