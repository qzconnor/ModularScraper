<script setup lang="ts">
import {LayoutGrid} from 'lucide-vue-next'
import {Separator} from '@/components/ui/separator'
</script> 

<template>
    <div class="h-full w-16 flex flex-col items-center">
        <RouterLink to="/" class="p-3 flex items-center justify-center" >
            <LayoutGrid class="w-9 hover:scale-110 cursor-pointer" />
        </RouterLink>
        <Separator class="w-2/4 dark:bg-neutral-100 bg-neutral-800" />
        <div>

        </div>
    </div>
</template>

<style scoped>

</style>
