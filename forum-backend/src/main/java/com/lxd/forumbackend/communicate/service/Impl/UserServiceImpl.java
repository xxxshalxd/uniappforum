package com.lxd.forumbackend.communicate.service.Impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lxd.forumbackend.communicate.entity.communicateUserEntity;
import com.lxd.forumbackend.communicate.mapper.userMapper;
import com.lxd.forumbackend.communicate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl extends ServiceImpl<userMapper, communicateUserEntity> implements UserService {
    @Autowired
    private userMapper userMapper;


    @Override
    public IPage<communicateUserEntity> listByPage(Page<communicateUserEntity> page) {
        return baseMapper.selectPage(page, null);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userMapper.selectCount(new QueryWrapper<communicateUserEntity>().eq("username", username)) > 0;
    }

}
