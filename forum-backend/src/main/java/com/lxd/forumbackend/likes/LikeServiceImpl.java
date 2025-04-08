package com.lxd.forumbackend.likes;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lxd.forumbackend.communicate.entity.postEntity;
import com.lxd.forumbackend.communicate.mapper.postMapper;
import com.lxd.forumbackend.communicate.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;


@Service
public class LikeServiceImpl extends ServiceImpl<LikeMapper, LikeEntity> implements LikeService {
    @Autowired
    private LikeMapper likeMapper;

    @Autowired
    private PostService postService;


    @Override
    public boolean checkLike(Integer postId, Integer userId) {
        QueryWrapper<LikeEntity> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("post_id", postId).eq("user_id", userId).eq("is_active", true);
        return this.count(queryWrapper) > 0;
    }

    @Override
    public int getLikeCount(Integer postId) {
        return likeMapper.selectLikeCountByPostId(postId);
    }

    @Override
    public void toggleLike(Integer postId, Integer userId) {
      if (checkLike(postId, userId)) {
          this.remove(new QueryWrapper<LikeEntity>().eq("post_id", postId).eq("user_id", userId));  } else {
            LikeEntity likeEntity = new LikeEntity();
            likeEntity.setPostId(postId);
            likeEntity.setUserId(userId);
            likeEntity.setIsActive(true); // 设置为有效点赞
            this.save(likeEntity);
        }
    }


    @Override
    public List<postEntity> getLikedPostsByUserId(Integer userId) {
        return likeMapper.getLikedPostsByUserId(userId);
    }
}
