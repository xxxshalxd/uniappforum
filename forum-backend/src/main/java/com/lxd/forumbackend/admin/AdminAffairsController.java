package com.lxd.forumbackend.admin;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.affairs.entity.affairEntity;
import com.lxd.forumbackend.affairs.service.affairService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/affairs")
public class AdminAffairsController {
    @Autowired
    private affairService affairService;

    //分页

    @GetMapping
    public IPage<affairEntity> getAllAffairs(@RequestParam(defaultValue = "1") Integer page,
                                             @RequestParam(defaultValue = "10") Integer size, @RequestParam(required = false) String title) {
        Page<affairEntity> pagination = new Page<>(page, size);
        QueryWrapper<affairEntity> queryWrapper = new QueryWrapper<>();
        if (title != null && !title.isEmpty()) {
            queryWrapper.like("newsTitle", title);
            // 根据标题搜索
        }
        return affairService.page(pagination, queryWrapper);
    }

    // 根据ID获取

    @GetMapping("/{id}")
    public affairEntity getAffairsById(@PathVariable Integer id) {

        return affairService.getById(id);
    }

    // 创建

    @PostMapping
    public affairEntity createAffairs(@RequestBody affairEntity affairs) {
        affairService.save(affairs);
        return affairs;
    }

    // 更新

    @PutMapping("/{id}")
    public affairEntity updateAffairs(@PathVariable Integer id, @RequestBody affairEntity affairs) {
        affairs.setId(id);
        affairService.updateById(affairs);
        return affairs;
    }

    // 删除

    @DeleteMapping("/{id}")
    public void deleteAffairs(@PathVariable Integer id) {
        affairService.removeById(id);
    }


}
