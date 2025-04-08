package com.lxd.forumbackend.communicate.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lxd.forumbackend.communicate.entity.postEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PostService extends IService<postEntity> {
   List<postEntity> getByUserId(Integer userId);

   IPage<postEntity> getByPageWithUser(IPage<postEntity> page, String title);


}
