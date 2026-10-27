package com.example.quanlycongviec.Entity;

import java.util.concurrent.TimeUnit;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Khởi tạo Builder pattern chuẩn
@RedisHash("Token") // Nên đổi tên keyspace rõ nghĩa thay vì "RedisHash"
public class Token {
    @Id
    private String jwtId;

    @TimeToLive(unit = TimeUnit.DAYS)
    private Long expiredTime;
}
