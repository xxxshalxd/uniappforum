package com.lxd.forumbackend.communicate.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("comments")
public class commentEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String content;
    //    @TableField(strategy = FieldStrategy.NOT_NULL)
    private Integer postId;
    //    @TableField(strategy = FieldStrategy.NOT_NULL)
    private Integer userId;


    @TableField(exist = false)
    private postEntity post; // 添加帖子关联
    @TableField(exist = false)
    private communicateUserEntity user; // 添加用户关联


    //    用于帖子管理
    @TableField(exist = false)
    private String username; // 用户名
    @TableField(exist = false)
    private String postTitle; // 帖子标题

    // 用来做多级评论
    private Integer parentId;

}
