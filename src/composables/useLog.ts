import { onMounted, ref } from 'vue';
export default function (name: string) {
    const log = ref<string[]>([]);
    
    onMounted(async () => {
        log.value = await window.api.getLog(name);
    });

    window.api.onLogUpdated(name,async () => {
        log.value = await window.api.getLog(name);
    });

    return log;

}