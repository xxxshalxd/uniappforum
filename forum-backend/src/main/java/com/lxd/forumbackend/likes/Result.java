package com.lxd.forumbackend.likes;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


//封装响应数据
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    private String message;

    private Integer code;
    private Object data;

    public static Result responseResult(String msg,Integer code, Object data){
        return new Result(msg,code, data);
    }

    //    成功
    public static Result success(){
        return responseResult("请求成功",200,null);
    }

    public static Result success(String msg){
        return responseResult(msg,200,null);
    }

    public static Result success(String msg,Object data){
        return responseResult(msg,200,data);
    }

    private static Result success(String msg,Integer code,Object data){
        return responseResult(msg,code,data);
    }
    //失败

    public static Result error(){
        return responseResult("请求失败！",500,null);
    }
    public static Result error(String msg){
        return responseResult(msg,500,null);
    }

    public static Result error(String msg,Object data){
        return responseResult(msg,500,data);
    }
    public static Result error(String msg,Integer code,Object data){
        return responseResult(msg,code,data);
    }

}