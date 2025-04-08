package com.lxd.forumbackend.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class corConfig implements WebMvcConfigurer {
    // 重写WebMvcConfigurer接口的addCorsMappings方法，用于添加跨域配置。
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 设置允许跨域的路径,"/**" 表示所有的请求路径都允许跨域。
        registry.addMapping("/**")
// 设置允许跨域请求的域名,"*" 表示允许所有域名的请求。
                .allowedOriginPatterns("*")
// 是否允许证书,常用于需要认证信息的请求。
                .allowCredentials(true)
// 设置允许的方法,"*" 表示允许所有HTTP方法，如GET、POST、PUT、DELETE等。
                .allowedMethods("*")
// 设置允许的header属性请求头，"*" 表示允许所有请求头。
                .allowedHeaders("*")
// 跨域允许时间,3600秒即1小时
                .maxAge(3600);
    }

}
