package com.lxd.forumbackend.admin.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//用来接收前端传过来的登录验证信息

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String username;
    private String password;
    private String code;
}
