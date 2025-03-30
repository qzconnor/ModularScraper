import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialogstate", {
    state: () => ({
        dialogs: {} as Record<string, { isOpen: boolean; data: any }>
    }),

    actions: {
        data(id: string) {
            return this.dialogs[id].data
        },
        isDialogOpen(id: string) {
            return this.dialogs[id]?.isOpen || false;
        },
        openDialog(id: string, data: any = {}) {
            this.dialogs[id] = { isOpen: true, data };
        },
        closeDialog(id: string) {
            if (this.dialogs[id]) {
                this.dialogs[id].isOpen = false;
                delete this.dialogs[id];
            }
        },
        closeAllDialogs() {
            this.dialogs = {};
        }
    }
});