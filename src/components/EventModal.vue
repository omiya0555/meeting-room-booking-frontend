<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50" @click.self="close">
        <div class="bg-white p-6 rounded-lg shadow-lg w-100">
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

                <label class="text-gray-800 text-sm">期間</label>
                <div class="flex">
                    <input type="datetime-local" v-model="eventData.start" required
                    class="w-full p-2 mb-4 border rounded" />
                    <span class="h-9 my-auto">～</span>
                    <input type="datetime-local" v-model="eventData.end" required 
                    class="w-full p-2 mb-4 border rounded" />
                </div>
                <div class="flex justify-between mt-4">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        保存
                    </button>
                    <button type="button" @click="close"
                        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
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
            rooms: { ...this.room } // 部屋のデータを格納するプロパティ
        };
    },
    computed: {
        isEdit() {
            return !!this.event.id;
        },
    },
    created() {
        // コンポーネントが作成されたときに部屋情報を取得
        this.fetchRooms();
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
        submitForm() {
            console.log("submitted");
            // バリデーションを行い、イベントの重複を防ぐ
            const overlap = this.existingEvents.some(ev => {
                return ev.room_id === this.eventData.room_id &&
                    ((ev.start < this.eventData.end && ev.end > this.eventData.start));
            });
            
            if (overlap) {
                alert("重複するイベントがあります。");
                console.log("overlaped");
                return;
            }
            this.$emit("save", this.eventData);
        },
        close() {
            this.$emit("close");
        },
    },
};
</script>