package com.lxd.forumbackend.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.communicate.entity.commentEntity;
import com.lxd.forumbackend.communicate.entity.postEntity;
import com.lxd.forumbackend.communicate.mapper.postMapper;
import com.lxd.forumbackend.communicate.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {
    @Autowired
    private PostService postService;

    // 获取所有帖子

    @GetMapping
    public IPage<postEntity> getAllPosts(@RequestParam(defaultValue = "1") Integer page,
                                         @RequestParam(defaultValue = "10") Integer size,@RequestParam(required = false) String title) {
        Page<postEntity> pagination = new Page<>(page, size);
       return postService.getByPageWithUser(pagination, title);
    }

    // 根据ID获取帖子

    @GetMapping("/{id}")
    public postEntity getPostById(@PathVariable(name="id") Integer id) {
        return postService.getById(id);
    }



    // 创建帖子

    @PostMapping
    public postEntity createPost(@RequestBody postEntity post) {
        postService.save(post);
        return post;
    }

    // 更新帖子

    @PutMapping("/{id}")
    public postEntity updatePost(@PathVariable Integer id, @RequestBody postEntity post) {
        post.setId(id);
        postService.updateById(post);
        return post;
    }

    // 删除帖子

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Integer id) {
        postService.removeById(id);
    }
}
