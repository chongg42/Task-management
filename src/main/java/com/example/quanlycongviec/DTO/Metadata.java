package com.example.quanlycongviec.DTO;

import com.example.quanlycongviec.Entity.enums.ResourceActivity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class Metadata {
    private ResourceActivity resource;
    private Object desc;
}
