    <script>
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
                    contentHeight: 700,
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
</style>
