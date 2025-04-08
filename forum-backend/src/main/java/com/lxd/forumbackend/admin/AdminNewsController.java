package com.lxd.forumbackend.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.news.entity.NewsEntity;
import com.lxd.forumbackend.news.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/admin/news")
public class AdminNewsController {
    @Autowired
    private NewsService newsService;

    // 获取所有新闻（分页）

    @GetMapping
    public IPage<NewsEntity> getAllNews(@RequestParam(defaultValue = "1") Integer page,
                                        @RequestParam(defaultValue = "10") Integer size,  @RequestParam(required = false) String title) {
        Page<NewsEntity> pagination = new Page<>(page, size);
        QueryWrapper<NewsEntity> queryWrapper = new QueryWrapper<>();
        if (title != null && !title.isEmpty()) {
            queryWrapper.like("title", title);
            // 根据标题搜索
        }
        return newsService.page(pagination, queryWrapper);
    }




    // 根据ID获取新闻

    @GetMapping("/{id}")
    public NewsEntity getNewsById(@PathVariable Integer id) {
        return newsService.getById(id);
    }

    // 创建新闻

    @PostMapping
    public NewsEntity createNews(@RequestBody NewsEntity news) {
        newsService.save(news);
        return news;
    }

    // 更新新闻

    @PutMapping("/{id}")
    public NewsEntity updateNews(@PathVariable Integer id, @RequestBody NewsEntity news) {
        news.setId(id);
        newsService.updateById(news);
        return news;
    }

    // 删除新闻

    @DeleteMapping("/{id}")
    public void deleteNews(@PathVariable Integer id) {
        newsService.removeById(id);
    }


}

