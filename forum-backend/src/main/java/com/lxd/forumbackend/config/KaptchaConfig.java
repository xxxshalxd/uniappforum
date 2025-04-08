package com.lxd.forumbackend.config;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

//验证码的配置
@Configuration
public class KaptchaConfig {
    @Bean
    public DefaultKaptcha getDefaultKaptcha(){
//创建一个验证码的实例
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
//创建属性的实例
//        建了一个Properties对象。Properties是Java的一个类，用于处理属性文件
//       将属性存储为键值对。
        Properties properties = new Properties();
//设置属性
//设置边框
        properties.setProperty("kaptcha.border","yes");
//设置边框的颜色
        properties.setProperty("kaptcha.border.color","105,179,90");
//设置背景颜色
//背景颜色渐变开始
// properties.setProperty("kaptcha.background.clear.from","white");
//背景颜色渐变结束
//properties.setProperty("kaptcha.background.clear.to","white");
//字体颜色
        properties.setProperty("kaptcha.textproducer.font.color","blue");
//文字间隔
        properties.setProperty("kaptcha.textproducer.char.space","10");
//设置验证码的长度
        properties.setProperty("kaptcha.textproducer.char.length","4");
//设置图片的宽度
        properties.setProperty("kaptcha.image.width","200");
//设置图片的高度
        properties.setProperty("kaptcha.image.height","50");
//设置字体样式
        properties.setProperty("kaptcha.textproducer.font.names","楷体");
//设置字符串,验证码就是从这里面产生
        properties.setProperty("kaptcha.textproducer.char.string","0123456789abcdefghijkmn");
//设置去掉干扰线
//        properties.setProperty("kaptcha.noise.impl","com.google.code.kaptcha.impl.NoNoise");
//设置字体大小
        properties.setProperty("kaptcha.textproducer.font.size","35");
//将properties包装到配置中
//        创建了一个Config对象，并将Properties对象传递给它。Config类是kaptcha库中用来配置验证码生成器的。
        Config config = new Config(properties);
//将配置设置到创建的验证码实例defaultKaptcha
        //  将配置对象config设置到defaultKaptcha实例上。
        defaultKaptcha.setConfig(config);
//返回配置好的defaultKaptcha实例
        return defaultKaptcha;
    }



}
