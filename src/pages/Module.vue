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
  import { ModuleInstanceWithoutExecute } from 'sharedtypes';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router'
  import { z } from 'zod'
  import { jsonSchemaToZod } from "json-schema-to-zod";
  import { AutoForm } from '@/components/ui/auto-form'

  const route = useRoute()

  const module = ref<ModuleInstanceWithoutExecute | null>(null)
  const formSchema = ref<any>(null)
  const dialogOpen = ref(false)

  function parseToZod(schema: any) {
    const temp = jsonSchemaToZod(schema, { module: "none" })
    console.log(temp)
    return new Function('z', `return ${temp}`)(z)
  }

  onMounted(async () => {
    module.value = await window.api.getModule(route.params.name as string | undefined)
    
    if (module.value?.schema) {
      const zodSchema = parseToZod(module.value.schema)
      formSchema.value = zodSchema
    }
  })

  async function onSubmit(data: any) {
    dialogOpen.value = false // Close the dialog after submission
    await window.api.runModule(route.params.name as string, data)
  }
</script>

<template>
  <SmallMenu />
  <div class="mt-3 flex flex-col gap-4">
    <div class="flex justify-between items-center bg-neutral-200 dark:bg-neutral-800 p-4 rounded-lg shadow-md">
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-bold">{{ module?.name }}</h1>
        <p class="text-sm italic text-neutral-400">{{ module?.description }}</p>
      </div>
    
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button :disabled="!module?.schema || !formSchema">
            Execute
          </Button>
        </DialogTrigger>
        
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>More data needed</DialogTitle>
            <DialogDescription>
              Input the data needed to execute the module
            </DialogDescription>
          </DialogHeader>

          <AutoForm v-if="formSchema" :schema="formSchema" @submit="onSubmit">
            <DialogFooter class="mt-4">
              <Button type="submit">
                Execute
              </Button>
            </DialogFooter>
          </AutoForm>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
</style>
