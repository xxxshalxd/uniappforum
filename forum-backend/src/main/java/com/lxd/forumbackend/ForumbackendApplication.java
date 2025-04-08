package com.lxd.forumbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
//@EnableTransactionManagement
public class ForumbackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForumbackendApplication.class, args);
    }

}
