import { ModuleInstance } from 'sharedtypes';
import { onMounted, ref } from 'vue';
export default function () {
    const modules = ref<Omit<ModuleInstance, 'execute'>[]>([]);
    
    onMounted(async () => {
        const [loadedModules] = await window.api.getModules();
        modules.value = loadedModules
    });

    window.api.onModuleUpdated(async () => {
        const [loadedModules] = await window.api.getModules();
        modules.value = loadedModules
    });

    return modules;

}