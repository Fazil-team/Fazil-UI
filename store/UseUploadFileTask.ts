import {defineStore} from "pinia";
import {ref, type Ref, type UnwrapRef} from 'vue'

type UPLOAD_TASK = {
    file_name: string,
    percent: number,
    status: false
}

export const useUploadTaskStore = defineStore('useDownloadStore', () => {
    const task = ref([])

    return {task}
})
