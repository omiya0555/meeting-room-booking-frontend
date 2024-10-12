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
<div class="inset-x-0 bottom-0 bg-gray-900 h-24">
    <hr class="mb-8"/>
    <span>test</span>
</div>
</template>

<script>
import CalendarEvent from '../components/CalendarEvent.vue';
import AppHeader from './AppHeader.vue';
export default {
    components: {
        AppHeader,
        CalendarEvent,
    }
};
</script>

<style>
</style>