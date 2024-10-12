<template>
    <FullCalendar ref="fullCalendar" :options="calendarOptions" @dateClick="handleDateClick" @eventClick="handleEventClick" class="mt-6" /> 

    <!-- イベント作成・編集モーダル -->
    <EventModal
        v-if="showEventModal"
        :event="selectedEvent"
        :existingEvents="events"
        @close="showEventModal = false"
        @save="saveEvent"
        @delete="deleteEvent"
    />
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import axios from "axios";
import EventModal from "./EventModal.vue";

export default {
    components: {
        FullCalendar,
        EventModal,
    },
    data() {
        return {
            events: [], // イベントリスト
            selectedEvents: [], // 選択された日のイベントリスト
            selectedEvent: null, // 選択されたイベント
            showEventModal: false, // イベント詳細モーダルの表示状態
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: "dayGridMonth",
                locale: jaLocale,
                headerToolbar: {
                    start: "prev",
                    center: "title",
                    end: "next",
                },
                selectable: true,
                contentHeight: 600,
                events: this.fetchEvents,
                dateClick: this.handleDateClick,
                eventClick: this.handleEventClick,
            },
        };
    },
    methods: {
        async fetchEvents(fetchInfo, successCallback, failureCallback) {
            try {
                const { start, end } = fetchInfo;
                const response = await axios.get("/calendar", {
                    params: {
                        start: start.toISOString(),
                        end: end.toISOString(),
                    },
                });
                console.log(response.data);
                const events = response.data.map((event) => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.start).toISOString(),  // ISO形式に変換
                    end: new Date(event.end).toISOString(),      // ISO形式に変換
                    room: event.room,
                    room_id: event.room_id,
                    booking_id: event.booking_id,
                    participants: event.participants,
                    allDay: event.allDay || false,
                }));
                successCallback(events);
            } catch (error) {
                failureCallback(error);
            }
        },

        // 更新後のイベント再取得メソッド
        async updateEvents() {
            try {
                // カレンダーの表示範囲を取得
                const calendarApi = this.$refs.fullCalendar.getApi();
                const view = calendarApi.view; // 現在のビュー（例: 月、週）
                const fetchInfo = {
                    start: view.activeStart, // 現在のビューの開始日
                    end: view.activeEnd      // 現在のビューの終了日
                };

                // カレンダーの最新データを取得して反映
                this.fetchEvents(
                    fetchInfo, // 取得した表示範囲をfetchInfoとして渡す
                    (events) => { // successCallback
                        this.events = events; // カレンダーのイベントを更新
                        calendarApi.refetchEvents(); // 再描画
                    },
                    (error) => { // failureCallback
                        console.error("Error fetching events:", error);
                    }
                );
            } catch (error) {
                console.error("Error updating events:", error);
            }
        },

        handleDateClick(dateInfo) {
            const dateClicked = dateInfo.dateStr;
            const defaultStartTime = `${dateClicked}T08:00`; // デフォルトの開始時刻
            const defaultEndTime = `${dateClicked}T09:00`; // デフォルトの終了時刻

            this.selectedEvent = {
                start: defaultStartTime,
                end: defaultEndTime,
                title: "",
                room: "",
                room_id: "",
                booking_id: "",
                participants: [],
            };
            this.showEventModal = true; // 新規予約モーダルを表示
        },
        handleEventClick(eventInfo) {
            const eventStart = new Date(eventInfo.event.start);
            const eventEnd = new Date(eventInfo.event.end);

            // JSTに変換する（UTCに9時間を加算）
            const adjustedStart = new Date(eventStart.getTime() + (9 * 60 * 60 * 1000));
            const adjustedEnd = new Date(eventEnd.getTime() + (9 * 60 * 60 * 1000));

            this.selectedEvent = {
                id: eventInfo.event.id,
                title: eventInfo.event.title,
                start: adjustedStart.toISOString().substring(0, 16),
                end: adjustedEnd.toISOString().substring(0, 16),
                room: eventInfo.event.extendedProps.room,
                room_id: eventInfo.event.extendedProps.room_id,
                booking_id: eventInfo.event.extendedProps.booking_id,
                participants: eventInfo.event.extendedProps.participants,
            };
            this.showEventModal = true; // イベント編集モーダルを表示
        },
        saveEvent(eventData) {
            if (eventData.id) {
                this.updateEvent(eventData);
            } else {
                this.createEvent(eventData);
            }
        },
        async createEvent(eventData) {
            try {
                // POSTリクエスト用にeventDataを変換
                const formattedData = {
                    room_id: eventData.room_id,
                    start_time: eventData.start,
                    end_time: eventData.end,
                    user_id: localStorage.getItem('user_id'),
                    event_title: eventData.title,
                    participants: eventData.participants || [],
                };
                await axios.post("/bookings", formattedData);
                
                // 更新が成功したタイミングでアラートを表示
                alert("イベントが追加されました！");
                this.showEventModal = false;

                // カレンダーの最新データを取得して反映し、再描画
                this.updateEvents();

            } catch (error) {
                console.error("Error creating event:", error);
            }
        },
        // イベントの更新処理
        async updateEvent(eventData) {
            
            try {
                // PUTリクエスト用にeventDataを変換
                const formattedData = {
                    room_id: eventData.room_id,
                    start_time: eventData.start,
                    end_time: eventData.end,
                    event_title: eventData.title,
                    participants: eventData.participants || [],
                };
                console.log(formattedData);
                // データをPUTリクエストで送信
                await axios.put(`/bookings/${eventData.booking_id}`, formattedData);

                // 更新が成功したタイミングでアラートを表示
                alert("イベントが更新されました！");
                this.showEventModal = false;

                // カレンダーの最新データを取得して反映し、再描画
                this.updateEvents();

            } catch (error) {
                console.error("Error updating event:", error);
                alert("イベントの更新に失敗しました。");
            }
        },
        deleteEvent(eventData) {
            if (!eventData.booking_id) {
                return;
            }
            // APIを通じてイベントを削除
            axios.delete(`/bookings/${eventData.booking_id}`)
                .then(() => {
                // 削除が成功したらローカルのイベントリストから削除
                this.events = this.events.filter(event => event.id !== eventData.id);
                alert("イベントが削除されました");
                this.showEventModal = false; // モーダルを閉じる
                // カレンダーの最新データを取得して反映し、再描画
                this.updateEvents();
            })
            .catch(error => {
                console.error("Error deleting event:", error);
                alert("イベントの削除に失敗しました。");
            });
        },
    },
    mounted() {
        // カレンダーの初期データを取得
        this.updateEvents();
    }
};
</script>
