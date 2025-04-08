package com.lxd.forumbackend.admin;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lxd.forumbackend.communicate.entity.commentEntity;
import com.lxd.forumbackend.communicate.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/comments")
public class AdminCommentController {
    @Autowired
    private CommentService commentService;
    // 获取所有评论
    @GetMapping
    public IPage<commentEntity> getAllComments(@RequestParam(defaultValue = "1") Integer page,
                                               @RequestParam(defaultValue = "10") Integer size, @RequestParam(required = false) String content) {
        Page<commentEntity> pagination = new Page<>(page, size);
//        QueryWrapper<commentEntity> queryWrapper = new QueryWrapper<>();
//        if (content != null && !content.isEmpty()) {
//            queryWrapper.like("content", content); // 根据内容搜索
//        }
//        return commentService.page(pagination, queryWrapper);

        return commentService.getByPageWithUserAndPost(content, pagination);
    }
    // 根据ID获取评论
    @GetMapping("/{id}")
    public commentEntity getCommentById(@PathVariable Integer id) {
        return commentService.getById(id);
    }

    // 创建评论

    @PostMapping
    public commentEntity createComment(@RequestBody commentEntity comment) {
        commentService.save(comment);
        return comment;
    }

    // 更新评论
    @PutMapping("/{id}")
    public commentEntity updateComment(@PathVariable Integer id, @RequestBody commentEntity comment) {
        comment.setId(id);
        commentService.updateById(comment);
        return comment;
    }

    // 删除评论
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Integer id) {
        commentService.removeById(id);
    }

}
