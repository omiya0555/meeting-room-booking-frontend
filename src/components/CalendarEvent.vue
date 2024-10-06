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
        <h1>Demo App</h1>
        <FullCalendar :options='calendarOptions' />
    </template>