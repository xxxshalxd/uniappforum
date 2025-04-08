package com.lxd.forumbackend.news.controller;

import com.lxd.forumbackend.news.entity.NewsEntity;
import com.lxd.forumbackend.news.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping
    public List<NewsEntity> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/{id}")
    public NewsEntity getNewsById(@PathVariable Integer id) {
        return newsService.getNewsById(id);
    }

}
