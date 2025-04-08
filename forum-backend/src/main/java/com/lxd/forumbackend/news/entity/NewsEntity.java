package com.lxd.forumbackend.news.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;


import java.util.Date;


@Data
@TableName("news")
public class NewsEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String title;
    private String image;
    @TableField("updateDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updateDate;
    private String details;
}
