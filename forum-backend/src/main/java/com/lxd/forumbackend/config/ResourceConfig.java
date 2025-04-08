package com.lxd.forumbackend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;




@Configuration
public class ResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/static/img/**")
            .addResourceLocations("file:D:/Desktop/uniappforum/forum-uniapp/static/img/")
            .resourceChain(true);
    WebMvcConfigurer.super.addResourceHandlers(registry);
    }
}
