package com.lxd.forumbackend.affairs.controller;


import com.lxd.forumbackend.affairs.entity.affairEntity;
import com.lxd.forumbackend.affairs.service.affairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affair")
public class affairController {
    @Autowired
    private affairService affairService;

    @GetMapping
    public List<affairEntity> getAllAffairs(){
        return affairService.list();
    }

    @GetMapping("/{id}")
    public affairEntity getAffairById(@PathVariable Integer id){
        return affairService.getById(id);
    }


}
