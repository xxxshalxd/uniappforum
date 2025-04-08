package com.lxd.forumbackend.communicate.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lxd.forumbackend.communicate.entity.commentEntity;

import java.util.List;

public interface CommentService extends IService<commentEntity> {
    List<commentEntity> listByPostId(Integer postId);


    // 用于获取评论列表及其作者和所属帖子信息
    IPage<commentEntity> getByPageWithUserAndPost(String content, IPage<commentEntity> page);

    //    多级评论获取用户名和标题等信息
    commentEntity getSubComments(Integer Id);
}
