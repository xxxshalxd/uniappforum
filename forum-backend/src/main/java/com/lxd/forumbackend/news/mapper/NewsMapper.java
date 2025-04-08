package com.lxd.forumbackend.news.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.lxd.forumbackend.news.entity.NewsEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NewsMapper extends BaseMapper<NewsEntity> {

}
