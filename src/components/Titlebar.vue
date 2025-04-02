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
  <div class="w-full fixed top-0 h-9 bg-transparent pl-4 flex items-center justify-end titlebar">
    <div class="absolute text-sm font-semibold flex justify-center items-center w-full h-full z-100">
        {{ title }}
    </div>
    <div class="relative flex gap-6 items-center justify-center titlebar-ignore">
        <div>
            <slot />
        </div>
        <Separator orientation="vertical" class="h-4 dark:bg-neutral-500 bg-neutral-800" />
        <div class="flex items-center justify-center">
            <div 
                class="h-9 w-9 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer"
                @click="minimize" >
                <Minus class="w-4 h-4" />
            </div>
            <div 
                class="h-9 w-9 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer" 
                @click="toggleMaximize" >
                <Minimize2 v-if="isMaximized" class="w-4 h-4"/>
                <Maximize2 v-else class="w-4 h-4" />
            </div>
            <div 
                class="group h-9 w-9 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer"
                @click="close">
                <X class="w-4 h-4 group-hover:text-red-500" />
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

</style>
