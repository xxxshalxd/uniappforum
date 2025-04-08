package com.lxd.forumbackend.communicate.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("users")
public class communicateUserEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String username;
    private String password;
    @TableField(value = "isAdmin")
   private String isAdmin;

}
