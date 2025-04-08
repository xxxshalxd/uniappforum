package com.lxd.forumbackend.news.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lxd.forumbackend.news.entity.NewsEntity;

import java.util.List;


public interface NewsService extends IService<NewsEntity>{


List<NewsEntity> getAllNews();
NewsEntity getNewsById(Integer id);

//管理系统

    IPage<NewsEntity> getAllNewsByPage(Page<NewsEntity> page);
}
