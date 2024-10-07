import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import AppHome from '@/components/AppHome.vue'; 
// ルート定義
const routes = [
    {
        path: "/login",
        name: "LoginForm",
        component: LoginForm,
    },
    {
        path: '/home',
        name: 'AppHome',
        component: AppHome, 
    },
];

// ルーターを作成
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ルーターをエクスポート
export default router;