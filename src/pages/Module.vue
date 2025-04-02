<script setup lang="ts">
  import SmallMenu from '@/components/SmallMenu.vue';
  import { Button } from '@/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'
  import { ModuleInstanceWithoutExecute } from '../../sharedtypes';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router'
  import { z } from 'zod'
  import { jsonSchemaToZod } from "json-schema-to-zod";
  import { AutoForm } from '@/components/ui/auto-form'
  import { Loader2 } from 'lucide-vue-next'

  import useLog from '@/composables/useLog';
  import { watch, nextTick } from 'vue';


  const route = useRoute()

  const logs = useLog(route.params.name as string)

  const logsRef = ref<HTMLDivElement | null>(null)

  watch(logs, () => {
    nextTick(() => {
      logsRef.value?.scrollTo(0, logsRef.value?.scrollHeight)
    })
  })

  const module = ref<ModuleInstanceWithoutExecute | null>(null)
  const formSchema = ref<any>(null)
  const dialogOpen = ref(false)

  const loading = ref(false)

  function parseToZod(schema: any) {
    const temp = jsonSchemaToZod(schema, { module: "none" })
    return new Function('z', `return ${temp}`)(z)
  }


  onMounted(async () => {
    module.value = await window.api.getModule(route.params.name as string | undefined)
    
    window.api.onLoading(module.value?.name!, async (_event, state) => {
      loading.value = state
    })

    if (module.value?.schema) {
      const zodSchema = parseToZod(module.value.schema)
      formSchema.value = zodSchema
    }

    nextTick(() => {
      logsRef.value?.scrollTo(0, logsRef.value?.scrollHeight)
    })

  
  })

  async function onSubmit(data: any) {
    dialogOpen.value = false // Close the dialog after submission
    await window.api.runModule(route.params.name as string, data)
  }

  function clearLog() {
    window.api.clearLog(route.params.name as string)
    logs.value = []
  }

</script>

<template>
  <SmallMenu />
  <div class="mt-3 flex flex-col gap-2 h-[calc(100%-2.5rem)]">
    <div class="flex-none flex justify-between items-center bg-neutral-200 dark:bg-neutral-800 p-4 rounded-lg shadow-md">
      <div class="flex gap-4 items-center">
       <div v-if="module?.icon">
        <img :src="module?.icon" class="w-10 h-10 rounded-lg" />
       </div>
       <div class="flex flex-col">
        <div class="flex gap-2 items-center">
          <h1 class="text-xl font-bold">{{ module?.name }}</h1>
          <span class="text-sm text-neutral-400">{{ module?.version }}</span>
        </div>
        <p class="text-sm italic text-neutral-400">{{ module?.description }}</p>
       </div>
      </div>

      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button :disabled="(!module?.schema || !formSchema) || loading">
            <span v-if="loading" class="flex items-center gap-2">
              <Loader2  class="w-4 h-4 animate-spin" />
              Executing
            </span>
            <span v-else>Execute</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>More data needed</DialogTitle>
            <DialogDescription>
              Input the data needed to execute the module
            </DialogDescription>
          </DialogHeader>

          <AutoForm v-if="formSchema" :schema="formSchema" @submit="onSubmit" class="flex flex-col gap-4">
            <DialogFooter class="mt-4">
              <Button type="submit">
                Execute
              </Button>
            </DialogFooter>
          </AutoForm>
        </DialogContent>
      </Dialog>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex  gap-3">
        <h2 class="text-sm font-bold">Logs</h2>
        <p class="text-sm italic text-neutral-400">Real-time logs of the module execution</p>
      </div>
      <div>
        <Button variant="ghost" size="sm" @click="clearLog">Clear logs</Button>
      </div>
    </div>
    <div ref="logsRef" class="flex-1 bg-neutral-200 dark:bg-neutral-800 p-4 rounded-lg shadow-md overflow-auto">
        <pre v-if="logs.length > 0" v-for="(log, i) in logs" :key="i" class="text-sm text-neutral-700 dark:text-neutral-300 w-5/6 text-wrap">{{ log }}</pre>
        <div class="flex justify-center items-center h-full" v-else>
          <p class="text-sm italic text-neutral-400">No logs available</p>
        </div>
      </div>
  </div>
</template>

<style scoped>
</style>
