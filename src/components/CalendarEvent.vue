<template>
    <FullCalendar 
        :options="calendarOptions" 
    />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import jaLocale from '@fullcalendar/core/locales/ja'
import axios from 'axios' // APIコールのためにaxiosを使用

export default {
    components: {
        FullCalendar
    },
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                locale: jaLocale,
                headerToolbar: {
                    start: "prev",
                    center: "title",
                    end: "next"
                },
                selectable: true,
                contentHeight: 600,
                events: this.fetchEvents, // 関数としてイベントを設定
            },
        }
    },
    methods: {
        async fetchEvents(fetchInfo,successCallback, failureCallback) {
            console.log("fetchEvents called");
            try {
                const { start, end } = fetchInfo;
                const response = await axios.get('/calendar', {
                    params: {
                        start: start.toISOString(),
                        end: end.toISOString()
                    }
                });
                
                // 取得したデータをFullCalendarの形式に変換してコールバックに渡す
                const events = response.data.map(event => ({
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    allDay: event.allDay || false
                }));
                console.log(events);
                successCallback(events);
            } catch (error) {
                console.error("Error fetching events:", error);
                failureCallback(error); // エラー時に失敗コールバックを呼び出す
            }
        }
    }
}
</script>

<style scoped>
    .fc-scroller {
        overflow-y: hidden !important;
    }
</style>