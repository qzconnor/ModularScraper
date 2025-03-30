<script setup lang="ts">
import {LayoutGrid, LucideFolderOpen} from 'lucide-vue-next'
import {Separator} from '@/components/ui/separator'
import SidebarItem from '@/components/SidebarItem.vue'
function openModuleFolder() {
    window.api.openModuleFolder()
}

</script> 

<template>
    <div class="h-full w-16 flex flex-col items-center">
        <RouterLink to="/" class="px-3 py-5 flex items-center justify-center" >
            <LayoutGrid class="w-9 hover:scale-110 cursor-pointer" />
        </RouterLink>
        <Separator class="w-2/4 dark:bg-neutral-100 bg-neutral-800" />
        <div class="flex flex-col gap-3 items-center p-4">
            <SidebarItem 
                label="Open module folder" 
                @click="openModuleFolder"
            >
                <LucideFolderOpen class="w-9" />
            </SidebarItem>
  
        </div>
    </div>
</template>

<style scoped>
.box {
    @apply bg-neutral-600 shadow-lg rounded-xl w-11 h-11 flex items-center justify-center;
}
</style>
