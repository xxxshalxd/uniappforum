package com.lxd.forumbackend.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.lxd.forumbackend.admin.login.LoginRequest;
import com.lxd.forumbackend.communicate.entity.communicateUserEntity;
import com.lxd.forumbackend.communicate.service.UserService;
import com.lxd.forumbackend.likes.Result;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    @Autowired
    private UserService userService;

    @Autowired
    private DefaultKaptcha defaultKaptcha;

    // 管理系统获取所有用户
    @GetMapping
    public IPage<communicateUserEntity> getAllUsers(@RequestParam(defaultValue = "1") Integer page,
                                                    @RequestParam(defaultValue = "10") Integer size, @RequestParam(required = false) String username) {
        Page<communicateUserEntity> pagination = new Page<>(page, size);
        if (username != null && !username.isEmpty()) {
            QueryWrapper<communicateUserEntity> queryWrapper = new QueryWrapper<>();
            queryWrapper.like("username", username);
            // 根据用户名搜索
            return userService.page(pagination, queryWrapper);
        } else {
            return userService.page(pagination);
        }
    }


    // 管理系统根据ID获取用户
    @GetMapping("/{id}")
    public communicateUserEntity getUserById(@PathVariable Integer id) {
        return userService.getById(id);
    }

    // 管理系统创建用户
    @PostMapping
    public communicateUserEntity createUser(@RequestBody communicateUserEntity user) {
        userService.save(user);
        return user;
    }

    // 管理系统更新用户
    @PutMapping("/{id}")
    public communicateUserEntity updateUser(@PathVariable Integer id, @RequestBody communicateUserEntity user) {
        user.setId(id);
        userService.updateById(user);
        return user;
    }

    // 管理系统删除用户
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.removeById(id);
    }

    @PostMapping("/getImage")
    public Result getImage(HttpServletRequest request) {
        //        在获取验证码之前，先获取Session对象
        HttpSession session = request.getSession();
//        生成验证码
//        调用DefaultKaptcha对象的createText方法生成验证码文本。
        String text = defaultKaptcha.createText();
        // 存储在Session中
        session.setAttribute("code", text);
        System.out.println("生成的验证码存储到session: " + text);
        System.out.println("生成验证码时的session ID: " + session.getId());
//        生成图片
        //       调用DefaultKaptcha对象的createImage方法，传入验证码文本，生成验证码图片。
        BufferedImage image = defaultKaptcha.createImage(text);
//创建了一个ByteArrayOutputStream对象，它是一个输出流，用于将图片数据写入一个字节数组。
        ByteArrayOutputStream outputStream = null;
        //       ctrl + alt+t 快捷方式来try catch
        try {
            outputStream = new ByteArrayOutputStream();
//           写入内存中
//        使用ImageIO类将BufferedImage对象写入ByteArrayOutputStream，格式为JPEG。
            ImageIO.write(image, "jpg", outputStream);
//转换为Base64编码
//        获取一个Base64编码器，用于将字节数据编码为Base64字符串。
            Base64.Encoder encoder = Base64.getEncoder();
//        将ByteArrayOutputStream中的字节数据编码为Base64字符串。
            String base64 = encoder.encodeToString(outputStream.toByteArray());
//   创建一个字符串，它是Base64编码的图片数据，前面加上了data:image/jpeg;base64 前缀。
//  这个前缀是HTML中用于嵌入Base64编码图片的标准格式。replaceAll("\r\n", "")用于移除Base64编码中的换行符，因为Base64编码的输出通常是多行的，而在HTML中需要单行。
            String str = "data:image/jpeg;base64," + base64.replaceAll("\r\n", "");
            return Result.success("验证码获取成功", str);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (outputStream != null) {
                    outputStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }


    @PostMapping("/login")
    public Result login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        HttpSession session = request.getSession();

        //       获取前端传过来的验证码
        String code1 = loginRequest.getCode();
//        获取Session
        String code2 = (String) session.getAttribute("code");

//判断Session中有无验证码
        if (StringUtils.isEmpty(code2)) {
            return Result.error("验证码过期");

        }
//        判断两个验证码是否相同
        if (!code2.equals(code1)) {
            return Result.error("验证码不正确");

        }


//查询条件
        QueryWrapper<communicateUserEntity> wrapper = new QueryWrapper<>();
        wrapper.lambda().eq(communicateUserEntity::getUsername, loginRequest.getUsername())
                .eq(communicateUserEntity::getPassword, loginRequest.getPassword());
        communicateUserEntity user = userService.getOne(wrapper);
        if (user == null) {
            return Result.error("用户名或密码不正确");

        }
        if (!"1".equals(user.getIsAdmin())) {
            return Result.error("非管理员账号，无权登录管理系统");
        }


        return Result.success("登录成功", user);
    }

}
