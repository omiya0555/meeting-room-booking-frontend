<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" @click.self="close">
        <div class="bg-white p-6 rounded-lg shadow-lg w-100 relative">
            <button @click="confirmDelete" class="absolute top-0 right-0 mt-2 mr-2 text-red-500">
                削除
            </button>
            <h3 class="text-xl font-semibold mb-4">{{ isEdit ? 'イベント編集' : '新規イベント作成' }}</h3>
            <form @submit.prevent="submitForm">

                <label class="text-gray-800 text-sm">タイトル</label>
                <input v-model="eventData.title" placeholder="イベントタイトル" required
                    class="w-full p-2 mb-4 border rounded" />

                <label class="text-gray-800 text-sm">会議室</label>
                <select v-model="eventData.room_id" class="w-full p-2 mb-4 border rounded" required>
                    <option v-for="room in rooms" :key="room.id" :value="room.id">
                        <span class="text-sm">
                            {{ room.room_name }}
                        </span>
                    </option>
                </select>

                <label class="text-gray-800 text-sm mb-2 block">参加者</label>
                <div class="w-full p-2 mb-4 border rounded flex justify-start">
                    <div v-for="user in users" :key="user.id" class="flex items-center">
                        <!-- チェックボックス -->
                        <template v-if="user.id !== loginUserId">
                            <input
                                type="checkbox"
                                :id="'user-' + user.id"
                                :value="user.id"
                                v-model="selectedParticipants"
                                class="mr-2"
                            />
                            <label :for="'user-' + user.id" class="text-sm mr-8">{{ user.name }}</label>
                        </template>
                    </div>
                </div>

                <label class="text-gray-800 text-sm">期間</label>
                <div class="flex">
                    <input type="datetime-local" v-model="eventData.start" required class="w-full p-2 mb-4 border rounded" />
                    <span class="h-9 my-auto">～</span>
                    <input type="datetime-local" v-model="eventData.end" required class="w-full p-2 mb-4 border rounded" />
                </div>
                <div class="flex justify-between mt-4">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">保存</button>
                    <button type="button" @click="close" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        キャンセル
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: {
        event: Object,
        existingEvents: Array,
    },
    data() {
        return {
            eventData: { ...this.event }, // 既存のイベントデータをコピー
            rooms: [], // 部屋のデータを格納するプロパティ
            users: [],
            loginUserId: localStorage.getItem('user_id'),
            selectedParticipants: [], // 選択された参加者
        };
    },
    computed: {
        isEdit() {
            return !!this.event.id;
        },
    },
    created() {
        // コンポーネントが作成されたときに各情報を取得
        this.fetchRooms();
        this.fetchUsers();
        if (this.isEdit) {
            this.selectedParticipants = this.event.participants.map(p => p.user_id); // 既存の参加者を初期化
        }
    },
    methods: {
        async fetchRooms() {
            try {
                const response = await axios.get("/room");
                this.rooms = response.data; // 部屋情報を保存
            } catch (error) {
                console.error("部屋情報の取得に失敗しました", error);
            }
        },
        async fetchUsers() {
            try {
                const response = await axios.get("/users");
                this.users = response.data; // ユーザー情報を保存
            } catch (error) {
                console.error("ユーザー情報の取得に失敗しました", error);
            }
        },
        submitForm() {
            // バリデーション
            const overlap = this.existingEvents.some(ev => {

                if (ev.id === this.eventData.id) {
                    return false; // 同じイベントは無視
                }

                const eventStart = new Date(ev.start);
                const eventEnd = new Date(ev.end);
                const inputStart = new Date(this.eventData.start);
                const inputEnd = new Date(this.eventData.end);

                // 部屋が同じで、イベントが部分的または完全に重複しているか確認
                return ev.room_id === this.eventData.room_id && (
                    (inputStart < eventEnd && inputEnd > eventStart) || // 開始時間が既存のイベント期間に含まれる場合
                    (inputEnd > eventStart && inputStart < eventEnd) || // 終了時間が既存のイベント期間に含まれる場合
                    (inputStart <= eventStart && inputEnd >= eventEnd)  // 新しいイベントが既存のイベントを完全に含む場合
                );
            });

            if (overlap) {
                alert("重複するイベントがあります。");
                console.log("overlaped");
                return;
            }
            
            this.$emit('save', this.eventData);
        },
        close() {
            this.$emit("close");
        },
            // 削除の確認と実行
        confirmDelete() {
            if (confirm('このイベントを削除してよろしいですか？')) {
                this.$emit('delete', this.eventData); // 親コンポーネントに削除の通知
            }
        }
    },
};
</script>
