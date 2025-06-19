import {service} from '@/assets/utils/request.js'
import {success} from "assets/utils/message";

export const checkConnect = (data) => {
    return new Promise(r => {
        service.post('/expansion/check_connect', data).then(res => {
            success("连接成功！")
            r(res)
        })
    })
}

export const newStorage = (data) => {
    return new Promise(r => {
        service.post('/expansion', data).then(res => {
            success("创建成功！")
            r(res)
        })
    })
}

export const all = (current_page, page_size) => {
    return new Promise(r => {
        service.get(`/expansion?page_size=${page_size}&current_page=${current_page}`).then(res => {
            r(res.data.data)
        })
    })
}

export const del = (id)=>{
    return new Promise(r => {
        service.delete(`/expansion/${id}`).then(res => {
            success("删除成功！")
            r(res)
        })
    })
}

export const change = (data)=>{
    return new Promise(r => {
        service.put(`/expansion`,data).then(res => {
            success("修改成功！")
            r(res)
        })
    })
}
