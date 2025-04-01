<script setup lang="ts">
  // import {Button} from '@/components/ui/button'
  import useModules from '@/composables/useModules';
  const modules = useModules()

</script> 

<template>
<div class="flex flex-col gap-4">
  <div class="flex justify-end">
  <h1 class="text-sm text-zinc-600 font-bold">
    Loaded <span class="underline"> {{ modules.length }}</span> module(s)
  </h1>
 </div>
  <div 
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <RouterLink
      :to="`/module/${module.name}`"
      v-for="module in modules"
      :key="module.name"
      class="flex items-center gap-4 p-4 border rounded-lg shadow-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-600 cursor-pointer"
    >
      <div v-if="module.icon">
        <img :src="module.icon" class="w-10 h-10 rounded-lg" />
      </div>
     <div>
      <h2 class="text-lg font-bold">{{ module.name }}</h2>
      <p class="text-sm text-neutral-400">{{ module.description }}</p>
     </div>
    </RouterLink>
  </div>

</div>
</template>

<style scoped>
  	
</style>
