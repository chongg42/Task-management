package com.example.quanlycongviec.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.quanlycongviec.Entity.Token;

@Repository 
public interface TokenRepo extends CrudRepository<Token, String> {

}