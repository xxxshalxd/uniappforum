package com.lxd.forumbackend.communicate.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lxd.forumbackend.communicate.entity.postEntity;
import com.lxd.forumbackend.communicate.service.PostService;
import com.lxd.forumbackend.likes.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class postController {
    @Autowired
    private PostService postService;


    //用来获取发帖广场所有的帖子
    @GetMapping
    public List<postEntity> getAllPosts() {
        return postService.list();
    }

    //    用来获取特定用户发过的所有帖子
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<postEntity>> getAllPostsByUserId(@PathVariable Integer userId){
        List<postEntity> posts = postService.getByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public postEntity getPostById(@PathVariable Integer id) {
        return postService.getById(id);
    }

    @PostMapping
    public ResponseEntity<postEntity> createPost(@RequestBody postEntity post) {
//        System.out.println("yhx:"+post.toString());
         postService.save(post);

        return ResponseEntity.ok(post);
    }

    @GetMapping("/Search")
    public List searchPosts (@RequestParam String query){
        if(query != null && !query.isEmpty()){
            QueryWrapper<postEntity> wrapper = new QueryWrapper();
            wrapper.like("title",query).or().like("content",query);
            return postService.list(wrapper);
        }else {
            return postService.list();
        }

    }

    // 指定文件上传的保存路径
    private String uploadDir = "D://Desktop/uniappforum/forum-uniapp/static/img";



    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            String fileName = UUID.randomUUID().toString() + "." + getExtension(file);

            Path path = Paths.get(uploadDir + File.separator + fileName);
            file.transferTo(path);
            // 构建相对路径
            String relativePath = "../../static/img/" + fileName;
            response.put("filePath", relativePath);
//            response.put("filePath", path.toString());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String getExtension(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType.contains("image/jpeg")) {
            return "jpg";
        } else if (contentType.contains("image/png")) {
            return "png";
        } else {
            return "unknown";
        }
    }
}
