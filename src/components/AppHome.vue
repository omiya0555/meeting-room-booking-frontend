<template>
<div class="grid grid-cols-5 grid-rows-[0.3fr_1fr_1fr_1fr_1fr_0.5fr] gap-0 auto-rows-auto ">
    <!-- header -->
    <div class="col-span-6 row-span-1 row-start-1">
        <AppHeader/>
    </div>

    <!-- main component (calendar) -->
    <div class="col-span-5 row-span-4 row-start-2 bg-white px-16 border">
        <CalendarEvent></CalendarEvent>
    </div>
</div>
<AppFooter></AppFooter>



</template>

<script>
import CalendarEvent from '../components/CalendarEvent.vue';
import AppFooter from './AppFooter.vue';
import AppHeader from './AppHeader.vue';
export default {
    components: {
        AppHeader,
        CalendarEvent,
        AppFooter,
    }
};
</script>

<style>
</style>