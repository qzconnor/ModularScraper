<script setup lang="ts">
  // import {Button} from '@/components/ui/button'
  import useModules from '@/composables/useModules';
  import {Input} from '@/components/ui/input';
  import {Button} from '@/components/ui/button';
  import { refDebounced } from '@vueuse/core'
  import { ref } from 'vue';
  import { computed } from 'vue';
  import { Ban } from "lucide-vue-next"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
  } from '@/components/ui/tooltip'
  const modules = useModules()

  const search = ref('')
  const debounced = refDebounced(search, 1000)



  const filteredModules = computed(() => {
    return modules.value.filter(module => module.name.toLowerCase().includes(debounced.value.toLowerCase()))
  })

</script> 

<template>
<div class="flex flex-col gap-4">
  <div class="flex justify-between items-center">
  <div class="flex gap-3">
    <TooltipProvider>
      <Input placeholder="Search modules" v-model:model-value="search" class="w-60 select-none" />
      <Tooltip>
        <TooltipTrigger as-child>
          <Button @click="search = debounced = ''" variant="ghost" class="h-9 w-9 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-600 cursor-pointer">
            <Ban class="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent :side="'bottom'">
          <p>Clear</p>
        </TooltipContent>
      </Tooltip>
    
    </TooltipProvider>
  </div>
  <h1 class="text-xs text-neutral-500 font-bold">
    Loaded <span class="underline text-primary"> {{ modules.length }}</span> module(s)
  </h1>
 </div>
  <div 
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <RouterLink
      :to="`/module/${module.name}`"
      v-for="module in filteredModules"
      :key="module.name"
      class="drag-none flex items-center gap-4 p-4 border rounded-lg shadow-md bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-600 cursor-pointer"
    >
      <div v-if="module.icon">
        <img :src="module.icon" class="w-10 h-10 rounded-lg" />
      </div>
      <div>
      <div class="flex gap-2 items-center">
        <h2 class="text-lg font-bold">{{ module.name }}</h2>
        <span class="text-sm text-neutral-400">{{ module.version }}</span>
      </div>
      <p class="text-sm text-neutral-400">{{ module.description }}</p>
     </div>
    </RouterLink>
  </div>

</div>
</template>

<style scoped>
  	
</style>
