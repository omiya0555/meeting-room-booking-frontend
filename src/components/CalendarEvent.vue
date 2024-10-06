    <script>
    import FullCalendar from '@fullcalendar/vue3'
    import dayGridPlugin from '@fullcalendar/daygrid'

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
                    events: [
                    { title: 'event 1', date: '2019-04-01' },
                    { title: 'event 2', date: '2019-04-02' }
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