
import { createRouter, createWebHistory } from "vue-router";

// 定义一个数组
const routes = [

    {
        path: "/login",
        name: "login",
        component: () => import("../views/login.vue"),
    },
    {
        path: "/",
        component: () => import("../views/index.vue"),
        name: 'Home',
        redirect: '/posts',

        children: [


            {
                path: "/posts",
                component: () => import("../views/posts.vue"),
                name: 'Posts'
            },
            {
                path: '/users',
                name: 'Users',
                component: () => import('../views/users.vue')
            },
            {
                path: '/comments',
                name: 'Comments',
                component: () => import('../views/comments.vue'),
            },
            {
                path: '/news',
                name: 'News',
                component: () => import('../views/news.vue')
            },
            {
                path: '/affairs',
                name: 'Affairs',
                component: () => import('../views/affairs.vue')
            }

        ]


    },



]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})