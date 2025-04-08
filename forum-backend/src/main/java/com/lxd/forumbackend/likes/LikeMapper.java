package com.lxd.forumbackend.likes;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lxd.forumbackend.communicate.entity.postEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface LikeMapper extends BaseMapper<LikeEntity> {
    @Select("SELECT COUNT(*) FROM likes WHERE post_id = #{postId} AND is_active = 1")
    int selectLikeCountByPostId(@Param("postId") int postId);


    @Select("SELECT p.id, p.title, p.imagePath, p.content, p.user_id " +
            "FROM posts p " +
            "INNER JOIN likes l ON p.id = l.post_id " +
            "WHERE l.user_id = #{userId} AND l.is_active = 1")
    List<postEntity> getLikedPostsByUserId(@Param("userId") Integer userId);
}
