package com.lxd.forumbackend.likes;

import com.baomidou.mybatisplus.extension.service.IService;
import com.lxd.forumbackend.communicate.entity.postEntity;

import java.util.List;

public interface LikeService extends IService<LikeEntity> {
    boolean checkLike(Integer postId, Integer userId);
    void toggleLike(Integer postId, Integer userId);
    int getLikeCount(Integer postId);


//    获取用户点赞过的帖子
    List<postEntity> getLikedPostsByUserId(Integer userId);

}



