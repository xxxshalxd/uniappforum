package com.lxd.forumbackend.affairs.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor

@TableName("schoolaffairs")
public class affairEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;
    @TableField("newsTitle")
    private String newsTitle;
    @TableField("newsDate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date newsDate;

    @TableField("newsContent")
    private String newsContent;
}
