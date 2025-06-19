import {service} from "assets/utils/request";
import {warn_dialog} from "assets/utils/message";

export const load_rec = (page_size: any, current_page: any, sort: any) => {
    return new Promise(r => {
        service.get(`/stream/rec?page_size=${page_size}&current_page=${current_page}&sort=${sort}`).then(res => {
            r(res.data.data)
        })
    })
}

export const real_del = (id: any) => {
    return new Promise(r => {
        warn_dialog("警告", "您确定要彻底删除该文件吗").then(() => {
            service.delete(`/stream/real_del?file_id=${id}`).then(res => {
                r(res)
            })
        }).catch(e=>{
            r(e)
            Promise.reject("取消删除")
        })
    })
}

export const unMove = (id: any) => {
    return new Promise(r => {
        service.put(`/stream/unmove_to_storage?file_id=${id}`).then(res => {
            r(res)
        })
    })
}