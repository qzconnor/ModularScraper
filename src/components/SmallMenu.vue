<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next"
</script>
<template>
    <div class="flex">
        <RouterLink
            to="/" 
            class="flex items-center justify-center gap-2 text-neutral-700 dark:text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-3 rounded-lg cursor-pointer">
            <ArrowLeft class="w-3 h-3" />
            <p class="text-sm font-bold">Back</p>
        </RouterLink>
    </div>
</template>