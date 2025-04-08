package com.lxd.forumbackend.communicate.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lxd.forumbackend.communicate.entity.communicateUserEntity;
import com.lxd.forumbackend.communicate.entity.postEntity;
import com.lxd.forumbackend.communicate.mapper.postMapper;
import com.lxd.forumbackend.communicate.mapper.userMapper;
import com.lxd.forumbackend.communicate.service.PostService;
import com.lxd.forumbackend.communicate.service.UserService;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl extends ServiceImpl<postMapper, postEntity> implements PostService {
    @Autowired
    private postMapper postMapper;


    @Override
    public List<postEntity> getByUserId(Integer userId) {
        return postMapper.selectByUserId(userId);
    }

    @Override
    public IPage<postEntity> getByPageWithUser(IPage<postEntity> page, String title) {
        return postMapper.selectPageWithUser(page, title);
    }


}
