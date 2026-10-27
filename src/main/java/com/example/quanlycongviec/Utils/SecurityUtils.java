package com.example.quanlycongviec.Utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.quanlycongviec.DTO.CustomUserDetails;
import java.util.Optional;

public final class SecurityUtils {

    // Prevent instantiation (không cho phép new lớp này)
    private SecurityUtils() {
        throw new UnsupportedOperationException("Utility class cannot be instantiated");
    }

    /**
     * Lấy CustomUserDetails từ SecurityContext
     */
    public static Optional<CustomUserDetails> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return Optional.of(userDetails);
        }

        return Optional.empty();
    }

    /**
     * Lấy trực tiếp Long ID của user đang đăng nhập.
     * Ném ngoại lệ nếu chưa đăng nhập.
     */
   public static Integer getCurrentUserId() {
    return getCurrentUserDetails()
            .map(userDetails -> userDetails.getUser().getId())
            .orElseThrow(() ->
                    new RuntimeException("Người dùng chưa đăng nhập hoặc token không hợp lệ!"));
}

    /**
     * Lấy ID dạng Integer (nếu Entity Project dùng Integer ID)
     */
    // public static Integer getCurrentUserIdAsInteger() {
    // return getCurrentUserId().intValue();
    // }
}
