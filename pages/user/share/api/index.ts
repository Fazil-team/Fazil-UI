import {service} from "assets/utils/request";

export const load_all_shares = (page_size: any, current_page: any, sort: any)=>{
    return new Promise((resolve,reject)=>{
        service.get(`/stream/shares?page_size=${page_size}&current_page=${current_page}&sort=${sort}`).then(res=>{
            resolve(res.data.data);
        })
    })
}