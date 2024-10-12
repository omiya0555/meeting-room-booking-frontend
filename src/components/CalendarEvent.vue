<template>
    <div class="flex justify-center my-6">
        <button class="bg-blue-400 w-32 mt-4 p-2 rounded-sm hover:bg-blue-600 transition">
            申請
        </button>
    </div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions" @dateClick="handleDateClick" @eventClick="handleEventClick" />    <!-- イベント一覧モーダル -->
    <EventListModal
        v-if="showEventListModal"
        :events="selectedEvents"
        @close="showEventListModal = false"
        @edit="openEditModal"
        @new="openNewReservationModal"
    />
    <!-- イベント作成・編集モーダル -->
    <EventModal
        v-if="showEventModal"
        :event="selectedEvent"
        :existingEvents="events"
        @close="showEventModal = false"
        @save="saveEvent"
    />
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import axios from "axios";

import EventListModal from "./EventListModal.vue";
import EventModal from "./EventModal.vue";

export default {
    components: {
        FullCalendar,
        EventListModal,
        EventModal,
    },
    data() {
        return {
            events: [], // イベントリスト
            selectedEvents: [], // 選択された日のイベントリスト
            selectedEvent: null, // 選択されたイベント
            showEventListModal: false, // イベント一覧モーダルの表示状態
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
                editable: true,
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
                const events = response.data.map((event) => ({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    room: event.room,
                    room_id: event.room_id,
                    booking_id: event.booking_id,
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
                        console.log("Events fetched successfully:", events);
                        this.events = events; // カレンダーのイベントを更新

                        // カレンダーの再描画
                        calendarApi.refetchEvents();
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
            };
            this.showEventModal = true; // イベント編集モーダルを表示
        },
        openNewReservationModal(date) {
            this.selectedEvent = { start: date, end: date, title: "", room: "" };
            this.showEventModal = true;
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
                const response = await axios.post("/calendar", eventData);
                this.events.push(response.data);
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
                    event_title: eventData.title
                };
                // データをPUTリクエストで送信
                await axios.put(`/bookings/${eventData.booking_id}`, formattedData);

                // 更新が成功したらローカルのイベントデータも更新
                const index = this.events.findIndex((event) => event.id === eventData.id);
                if (index !== -1) this.$set(this.events, index, formattedData);

                // 更新が成功したタイミングでアラートを表示
                alert("イベントが更新されました！");
                this.showEventModal = false;

                // カレンダーの最新データを取得して反映し、再描画
                this.updateEvents();

            } catch (error) {
                console.error("Error updating event:", error);
                alert("イベントの更新に失敗しました。");
            }
        }
    },
};
</script>
