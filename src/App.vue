<script setup lang="ts">
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
  import Titlebar from '@/components/Titlebar.vue'
  import Sidebar from '@/components/Sidebar.vue'
  import {RouterView} from "vue-router"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '@/components/ui/tooltip'
</script> 

<template>
  <TooltipProvider>
    <Titlebar>
      <Tooltip>
        <TooltipTrigger as-child>
          <div style="display: inline-block;">
            <ThemeSwitcher />
          </div>
        </TooltipTrigger>
        <TooltipContent :side="'bottom'" :side-offset="8">
          <p>Theme switcher</p>
        </TooltipContent>
      </Tooltip>
    </Titlebar>
  </TooltipProvider>
  <div class="flex pt-9 w-full h-screen">
    <Sidebar />
    <div class="bg-background z-20 dark:shadow-[-3px_-3px_8px_1px_rgba(0,_0,_0,_0.3)] shadow-[-3px_-3px_8px_1px_rgba(0,_0,_0,_0.1)] w-full rounded-tl-xl p-4">
      <RouterView />
    </div>

  </div>
</template>

<style scoped>

</style>
