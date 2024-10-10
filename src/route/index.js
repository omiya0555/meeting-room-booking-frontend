import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import AppHome from '@/components/AppHome.vue'; 
// ルート定義
const routes = [
    {
        path: '/',
        name: 'AppHome',
        component: AppHome, 
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "LoginForm",
        component: LoginForm,
    },
];
// ルーターを作成
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ナビゲーションガード
router.beforeEach(( to, from, next ) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated){
        //認証されていない場合、ログインページにリダイレクト
        next({ name: 'LoginForm' });
    }else{
        next();
    }
});

// ルーターをエクスポート
export default router;