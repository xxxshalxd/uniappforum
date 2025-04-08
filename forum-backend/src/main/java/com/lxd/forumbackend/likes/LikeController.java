package com.lxd.forumbackend.likes;


import com.lxd.forumbackend.communicate.entity.postEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("/toggle")
    public Result toggleLike(@RequestBody Map<String, Integer> body) {
        try {
            Integer postId = body.get("postId");
            Integer userId = body.get("userId");
            likeService.toggleLike(postId, userId);
            boolean isLiked = likeService.checkLike(postId, userId);
            return Result.success( "点赞状态已更新",isLiked);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error( "点赞失败", e.getMessage());
        }
    }

    @GetMapping("/count")
    public Result getLikeCount(@RequestParam Integer postId) {
        int count = likeService.getLikeCount(postId);
        return Result.success( "点赞数量", count);
    }


    @GetMapping("/posts")
    public Result getLikedPostsByUserId(@RequestParam Integer userId) {
        try {
            List<postEntity> likedPosts = likeService.getLikedPostsByUserId(userId);
            if (likedPosts.isEmpty()) {
                return Result.success("没有点赞的帖子", likedPosts);
            }
            return Result.success("点赞过的帖子", likedPosts);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取点赞帖子失败", e.getMessage());
        }
    }
}
