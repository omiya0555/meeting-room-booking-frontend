    <!-- <script>
    import FullCalendar from '@fullcalendar/vue3'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import jaLocale from "@fullcalendar/core/locales/ja";

    export default {
        components: {
            FullCalendar // make the <FullCalendar> tag available
        },
        data: function () {
            return {
                calendarEvents: [],
                calendarOptions: {
                    plugins: [dayGridPlugin],
                    initialView: 'dayGridMonth',
                    dateClick: this.handleDateClick,
                    locale: jaLocale,
                    headerToolbar: {
                        start: "prev",
                        center: "title",
                        end: "next"
                    },
                    contentHeight: 600,
                    events: [
                    { title: 'event 1', date: '2024-10-01' },
                    { title: 'event 2', date: '2024-10-02' },
                    { title: 'event 3', date: '2024-10-15'},
                    ]
                }
            }
        }
    }
</script>

<template>
    <FullCalendar class="w-7/8 max-w-4xl m-auto max-w-840" :options='calendarOptions' />
</template>

<style scoped>
    .fc-scroller {
        overflow-y: hidden !important;
    }
</style> -->
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