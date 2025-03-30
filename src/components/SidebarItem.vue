<script setup lang="ts">
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,	
    TooltipTrigger
  } from '@/components/ui/tooltip'

defineProps<{
    label: string
}>();

const emits = defineEmits<{
    (e: 'click'): void
}>();

</script> 

<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <div class="box hover:scale-110 cursor-pointer" @click="emits('click')">
                    <slot />
            </div>
            </TooltipTrigger>
            <TooltipContent :side="'right'" :side-offset="8">
                <p>{{label}}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<style scoped>
.box {
    @apply  bg-background dark:bg-neutral-600 shadow-lg rounded-xl w-11 h-11 flex items-center justify-center;
}
</style>
