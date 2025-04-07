import {defineNuxtConfig} from 'nuxt/config';
import Components from 'unplugin-vue-components/vite';
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers';
// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    router: {
        options: {
            hashMode: true
        }
    },
    app: {
        pageTransition: {name: 'page', mode: 'out-in'},
        head: {
            title: '正在初始化。。。'
        },
        baseURL: '/ui'
    },
    css: [
        '/assets/css/main.scss',
        '@/assets/icon/iconfont.css'
    ],
    build: {
        transpile: process.env.NODE_ENV === 'production' ? ['naive-ui', 'vueuc', '@css-render/vue3-ssr', '@juggle/resize-observer', 'date-fns', '@css-render/plugin-bem',] : ['@juggle/resize-observer']
    },
    vite: {
        plugins: [
            Components({
                dts: true,
                resolvers: [NaiveUiResolver()], // Automatically register all components in the `components` directory
            }),
        ],
    },
    modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'arco-design-nuxt-module', '@nuxtjs/tailwindcss'],
    piniaPersistedstate: {
        storage: 'sessionStorage',
    },
    plugins: [],
    compatibilityDate: '2024-07-16',
})