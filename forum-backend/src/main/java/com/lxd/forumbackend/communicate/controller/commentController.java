package com.lxd.forumbackend.communicate.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.communicate.entity.commentEntity;
import com.lxd.forumbackend.communicate.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class commentController {
    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<commentEntity> getCommentsByPostId(@RequestParam Integer postId) {
        return commentService.listByPostId(postId);
    }

    @PostMapping
    public ResponseEntity<commentEntity> createComment(@RequestBody commentEntity comment) {
        commentService.save(comment);
        return ResponseEntity.ok(comment);
    }


    //    多级评论获取用户名和标题等信息
    @GetMapping("/withSubComments")
    public commentEntity getCommentsWithSubCommentsByPostId(@RequestParam Integer Id) {
      return commentService.getSubComments(Id);

    }
}
