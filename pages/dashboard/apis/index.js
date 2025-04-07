import axios from 'axios'

import {service} from "assets/utils/request.js";

export const getHitokoto = ()=>{
    return new Promise(r=>{
        axios.get(`https://v1.hitokoto.cn/`).then(res=>{
            r(res)
        })
    })

}

export const load_last_file = ()=>{
    return new Promise(r=>{
        service.get(`/stream/last_file`).then(res=>{
            r(res)
        })
    })

}