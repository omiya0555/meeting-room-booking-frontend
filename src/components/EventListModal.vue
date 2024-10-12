<!-- <template>
    <div v-if="showEventListModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 class="text-xl font-semibold mb-4">Event List</h3>
            <ul class="space-y-2">
                <li v-for="event in events" :key="event.id" @click="selectEvent(event)"
                    class="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                    {{ event.title }} - {{ formatTime(event.start) }} to {{ formatTime(event.end) }}
                </li>
            </ul>
            <div class="mt-4 flex justify-end space-x-2">
                <button @click="closeModal"
                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Close</button>
                <button @click="createNewEvent" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add
                    New Event</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        showEventListModal: Boolean,
        events: Array,
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        selectEvent(event) {
            this.$emit('edit', event);
        },
        createNewEvent() {
            this.$emit('new');
        },
        formatTime(date) {
            return new Date(date).toLocaleTimeString();
        },
    },
};
</script>

<style scoped>
</style> -->
<template>
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 class="text-xl font-semibold mb-4">イベント一覧</h3>
            <ul>
                <li v-for="event in events" :key="event.id" class="p-2 cursor-pointer" @click="editEvent(event)">
                    {{ event.title }} ({{ formatTime(event.start) }} - {{ formatTime(event.end) }})
                </li>
            </ul>
            <div class="flex justify-between mt-4">
                <button @click="newEvent" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                    新規イベント
                </button>
                <button @click="close" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                    閉じる
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        events: Array,
    },
    methods: {
        editEvent(event) {
            this.$emit("edit", event);
        },
        newEvent() {
            this.$emit("new");
        },
        close() {
            this.$emit("close");
        },
        formatTime(date) {
            return new Date(date).toLocaleTimeString();
        },
    },
};
</script>