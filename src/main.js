import { createApp } from 'vue'
import App from './App.vue'
import router from './route'
import axios from 'axios'
import './assets/styles.css'

// AxiosのベースURLを設定
axios.defaults.baseURL = 'http://localhost/api';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`; // トークンをヘッダーに追加

// Vueアプリケーションの作成
const app = createApp(App);

// ルーターをアプリケーションに組み込む
app.use(router);

// アプリケーションのマウント
app.mount('#app');