package com.lxd.forumbackend.communicate.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lxd.forumbackend.communicate.entity.communicateUserEntity;
import com.lxd.forumbackend.communicate.service.UserService;
import com.lxd.forumbackend.likes.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class userController {
    @Autowired
    private UserService userService;

    @GetMapping("/getName")
    public ResponseEntity<communicateUserEntity> getUserById(@RequestParam("id") Integer id) {
        communicateUserEntity user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody communicateUserEntity user) {
        communicateUserEntity existingUser = userService.getOne(new QueryWrapper<communicateUserEntity>().eq("username", user.getUsername()));
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.status(401).body("用户名或密码错误");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody communicateUserEntity user) {
        boolean exists = userService.getOne(new QueryWrapper<communicateUserEntity>().eq("username", user.getUsername())) != null;
        if (exists) {
            return ResponseEntity.status(409).body("用户已经存在");
        }
        user.setIsAdmin("0");   //默认新创建的用户都是普通用户
        userService.save(user);

        return ResponseEntity.ok(user);
    }



}

