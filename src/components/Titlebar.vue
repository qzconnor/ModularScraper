<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { Separator } from "@/components/ui/separator";
// import { Button } from '@/components/ui/button'
import { Minimize2, Maximize2, Minus, X } from 'lucide-vue-next'
import { onMounted, ref } from 'vue';
const title = useTitle()

const isMaximized = ref(false);

onMounted(async () => {
    isMaximized.value = await window.api.isMaximized()
})

function toggleMaximize() {
    isMaximized.value = !isMaximized.value;
    window.api.toggleMaximize();
}

function minimize() {
    window.api.minimize();
}

function close() {
    window.api.close();
}

</script> 

<template>
  <div class="w-full h-9 bg-neutral-100 text-neutral-800 dark:text-neutral-300 dark:bg-neutral-800 px-4 flex items-center justify-between titlebar">
    <div class="text-sm font-semibold">
        {{ title }}
    </div>
    <div class="flex gap-6 items-center justify-center">
        <div>
            <slot />
        </div>
        <Separator orientation="vertical" class="h-4 dark:bg-neutral-300 bg-neutral-800" />
        <div class="flex gap-7 items-center justify-center">
            <Minus class="w-4 h-4 cursor-pointer" @click="minimize" />
            <Minimize2 v-if="isMaximized" class="w-4 h-4 cursor-pointer" @click="toggleMaximize" />
            <Maximize2 v-else class="w-4 h-4 cursor-pointer" @click="toggleMaximize" />
            <X class="w-4 h-4 cursor-pointer hover:text-red-500" @click="close" />
        </div>
    </div>
  </div>
</template>

<style scoped>

</style>
