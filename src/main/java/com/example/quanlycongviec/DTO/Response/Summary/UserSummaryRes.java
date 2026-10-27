package com.example.quanlycongviec.DTO.Response.Summary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserSummaryRes {
    private Integer id;
    private String fullName;
    private String avatar;
}
