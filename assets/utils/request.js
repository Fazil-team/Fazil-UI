import request from 'axios'
import * as msg from '~/assets/utils/message'
import {useLayoutStore} from "~/store/UseLayoutStore";
import {storeToRefs} from "pinia";
import {navigateTo} from "#app/composables/router";
import {baseURL} from "assets/config/network.js";
import {useRouter} from "#app";

export const service = request.create({
    baseURL: baseURL
})


service.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("Authorization")
    return config
})

service.interceptors.response.use(
    (res) => {
        if(res.data instanceof Blob){
            return res
        }
        if(res.data?.code === 1){
            msg.err(res.data?.msg)
        }
        if (res.data?.code === 2) {
            const router = useRouter();
            if(router.currentRoute.value.path == '/share'){
                return res;
            }else{
                storeToRefs(useLayoutStore()).layout.value = 'login'
                msg.err(res.data.msg)
            }
        } else if (res.data?.code === 3) {
            msg.warn('权限不足')
            navigateTo('/')
        } else if (res.data?.code === 200) {
            return res
        } else {
            Promise.reject(err)
        }
    }, (err) => {
        if(err.code == "ERR_CANCELED"){
            return
        }
        msg.err('错误: '+err.message)
        Promise.reject(err)
    }
)
