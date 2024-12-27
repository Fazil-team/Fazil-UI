import {service} from "assets/utils/request";

export const load_all_shares = ()=>{
    return new Promise((resolve,reject)=>{
        service.get(`/stream/shares`).then(res=>{
            resolve(res.data.data);
        })
    })
}