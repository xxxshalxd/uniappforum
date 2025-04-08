package com.lxd.forumbackend.news.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lxd.forumbackend.news.entity.NewsEntity;
import com.lxd.forumbackend.news.mapper.NewsMapper;
import com.lxd.forumbackend.news.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NewsServiceImpl extends ServiceImpl<NewsMapper, NewsEntity> implements NewsService {
    @Autowired
    private NewsMapper newsMapper;




    @Transactional
    @Override
    public List<NewsEntity> getAllNews() {
        return newsMapper.selectList(null);
    }

    @Transactional
    @Override
    public NewsEntity getNewsById(Integer id) {
        return newsMapper.selectById(id);
    }

    @Transactional
    @Override
    public IPage<NewsEntity> getAllNewsByPage(Page<NewsEntity> page) {
        return newsMapper.selectPage(page, null);
    }
}
