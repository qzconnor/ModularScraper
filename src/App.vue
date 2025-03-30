<script setup lang="ts">
  import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
  import Titlebar from '@/components/Titlebar.vue'
  import {RouterView} from "vue-router"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '@/components/ui/tooltip'

  window.api.getModules().then((modules) => {
    console.log(modules);
  });
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
  <div class="w-full h-full">
    <RouterView />
  </div>
</template>

<style scoped>

</style>
