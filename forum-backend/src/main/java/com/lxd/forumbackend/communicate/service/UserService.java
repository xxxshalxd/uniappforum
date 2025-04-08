package com.lxd.forumbackend.communicate.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lxd.forumbackend.communicate.entity.communicateUserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


public interface UserService extends IService<communicateUserEntity> {



    boolean existsByUsername(String username);
    IPage<communicateUserEntity> listByPage(Page<communicateUserEntity> page);


}
