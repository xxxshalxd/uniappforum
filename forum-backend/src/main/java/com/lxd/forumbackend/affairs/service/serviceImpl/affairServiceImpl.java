package com.lxd.forumbackend.affairs.service.serviceImpl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lxd.forumbackend.affairs.entity.affairEntity;
import com.lxd.forumbackend.affairs.mapper.affairMapper;
import com.lxd.forumbackend.affairs.service.affairService;
import org.springframework.stereotype.Service;

@Service
public class affairServiceImpl extends ServiceImpl<affairMapper, affairEntity> implements affairService {
}
