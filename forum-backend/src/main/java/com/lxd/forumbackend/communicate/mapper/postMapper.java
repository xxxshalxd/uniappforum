package com.lxd.forumbackend.communicate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.communicate.entity.postEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface postMapper extends BaseMapper<postEntity> {
    @Select("SELECT * FROM posts WHERE user_id = #{userId}")
    List<postEntity> selectByUserId(@Param("userId") Integer userId);




    @Select("SELECT p.*, u.username as username FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.title LIKE CONCAT('%', #{title}, '%')")
    IPage<postEntity> selectPageWithUser(IPage<postEntity> page, @Param("title") String title);



}
