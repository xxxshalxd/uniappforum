package com.lxd.forumbackend.communicate.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("posts")
public class postEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String title;
    @TableField(value = "imagePath")
    private String imagePath;
    private String content;
    private Integer userId;
    @TableField(exist = false)
    private String username;  //管理系统用来存储用户名

    @TableField(exist = false)
    private communicateUserEntity user; // 添加用户关联

}
