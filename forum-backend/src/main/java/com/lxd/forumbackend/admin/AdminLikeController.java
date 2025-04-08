package com.lxd.forumbackend.admin;

import com.lxd.forumbackend.likes.LikeEntity;
import com.lxd.forumbackend.likes.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/likes")
public class AdminLikeController {
    @Autowired
    private LikeService likeService;

    // 获取所有点赞

    @GetMapping
    public List<LikeEntity> getAllLikes() {
        return likeService.list();
    }

    // 根据ID获取点赞

    @GetMapping("/{id}")
    public LikeEntity getLikeById(@PathVariable Integer id) {
        return likeService.getById(id);
    }

    // 创建点赞

    @PostMapping
    public LikeEntity createLike(@RequestBody LikeEntity like) {
        likeService.save(like);
        return like;
    }

    // 更新点赞

    @PutMapping("/{id}")
    public LikeEntity updateLike(@PathVariable Integer id, @RequestBody LikeEntity like) {
        like.setId(id);
        likeService.updateById(like);
        return like;
    }

    // 删除点赞

    @DeleteMapping("/{id}")
    public void deleteLike(@PathVariable Integer id) {
        likeService.removeById(id);
    }


}
