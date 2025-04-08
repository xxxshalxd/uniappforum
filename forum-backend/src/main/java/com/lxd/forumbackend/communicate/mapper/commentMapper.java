package com.lxd.forumbackend.communicate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.communicate.entity.commentEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface commentMapper extends BaseMapper<commentEntity> {


    @Select("SELECT c.* , u.id as 'user_id', u.username as 'username' " +
            "FROM comments c " +
            "INNER JOIN users u ON c.user_id = u.id " +
            "WHERE c.post_id = #{postId}")

    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "content", column = "content"),
            @Result(property = "postId", column = "post_id"),
            @Result(property = "userId", column = "user_id"),
            @Result(property = "user.id", column = "user_id"),
            @Result(property = "user.username", column = "username")
    })
    List<commentEntity> selectByPostIdWithUser(@Param("postId") Integer postId);


    //联合查询解决评论管理不显示所属帖子和作者的问题
    @Select("SELECT c.*, u.username as username, p.title as postTitle " +
            "FROM comments c " +
            "LEFT JOIN users u ON c.user_id = u.id " +
            "LEFT JOIN posts p ON c.post_id = p.id " +
            "WHERE c.content LIKE CONCAT('%', #{content}, '%') " +
            "OR p.title LIKE CONCAT('%', #{content}, '%')")
    IPage<commentEntity> selectCommentsWithUserAndPost(IPage<commentEntity> page, @Param("content") String content);



//    多级评论获取用户名和标题等信息
    @Select("SELECT c.* , u.username as username, p.title as postTitle " +
            "FROM comments c " +
            "LEFT JOIN users u ON c.user_id = u.id " +
            "LEFT JOIN posts p ON c.post_id = p.id " +
            "WHERE c.Id = #{Id}")
    commentEntity checkSubcommentDetails(@Param("Id") Integer Id);
}
