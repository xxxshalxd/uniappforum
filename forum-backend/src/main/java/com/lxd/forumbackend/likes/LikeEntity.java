package com.lxd.forumbackend.likes;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("likes")
public class LikeEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer postId;
    private Integer userId;
    private Boolean isActive;

}
