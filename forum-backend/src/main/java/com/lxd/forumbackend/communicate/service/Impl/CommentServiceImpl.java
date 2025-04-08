package com.lxd.forumbackend.communicate.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lxd.forumbackend.communicate.entity.commentEntity;
import com.lxd.forumbackend.communicate.entity.communicateUserEntity;
import com.lxd.forumbackend.communicate.entity.postEntity;
import com.lxd.forumbackend.communicate.mapper.commentMapper;
import com.lxd.forumbackend.communicate.mapper.userMapper;
import com.lxd.forumbackend.communicate.service.CommentService;
import com.lxd.forumbackend.communicate.service.PostService;
import com.lxd.forumbackend.communicate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl extends ServiceImpl<commentMapper, commentEntity> implements CommentService {

    @Autowired
    private commentMapper commentMapper;


    @Override
    public List<commentEntity> listByPostId(Integer postId) {
        return commentMapper.selectByPostIdWithUser(postId);
    }

    @Override
    public IPage<commentEntity> getByPageWithUserAndPost(String content, IPage<commentEntity> page) {
        return commentMapper.selectCommentsWithUserAndPost(page, content);
    }


//    多级评论获取用户名和标题等信息
    @Override
    public commentEntity getSubComments(Integer Id) {
        return commentMapper.checkSubcommentDetails(Id);
    }
}
