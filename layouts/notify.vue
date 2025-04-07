<template>
  <div class="notify-content" ref="containerRef" id="scrollElement">

    <div class="top-card">
      <div class="title">公告标题</div>
    </div>
    <div class="detales"  ref="containerRef">
      <MdPreview :id="id" :modelValue="text" previewTheme="github"/>
      <div style="width: 400px;">
        <n-affix :top="60" :trigger-top="60" :listen-to="() => containerRef">
          <MdCatalog :editorId="id" :scrollElement="'.notify-content'" />
        </n-affix>
      </div>
    </div>
    <div class="back">
      <a-button type="primary" @click="jump_to_default">返回主页</a-button>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import {ArrowLeftOutlined} from "@vicons/antd";
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css';
import ArrowLeft from "~/layouts/icons/ArrowLeft.vue";
import {storeToRefs} from "pinia";
import {useLayoutStore} from "~/store/UseLayoutStore";

const layout = storeToRefs(useLayoutStore()).layout;

const jump_to_default = ()=>{
  layout.value = 'default'
}
const containerRef = ref()

const id = 'preview-only';
const text = ref('## 网站开发日志\n' +
    '### 计划\n' +
    '```markdown\n' +
    '#  1、用户登录注册\n' +
    '#  2、评论\n' +
    '#  3、是否原创\n' +
    '#  4、文章页脚\n' +
    '\n' +
    '```\n' +
    '### 2023-07-15\n' +
    '`首次上线`\n' +
    '> Nginx部署注意事项\n' +
    '~~~nginx\n' +
    '\n' +
    '#user  nobody;\n' +
    'worker_processes  1;\n' +
    '\n' +
    '#error_log  logs/error.log;\n' +
    '#error_log  logs/error.log  notice;\n' +
    '#error_log  logs/error.log  info;\n' +
    '\n' +
    '#pid        logs/nginx.pid;\n' +
    '\n' +
    '\n' +
    'events {\n' +
    '    worker_connections  1024;\n' +
    '}\n' +
    '\n' +
    '\n' +
    'http {\n' +
    '    include       mime.types;\n' +
    '    default_type  application/octet-stream;\n' +
    '\n' +
    '    #log_format  main  \'$remote_addr - $remote_user [$time_local] "$request" \'\n' +
    '    #                  \'$status $body_bytes_sent "$http_referer" \'\n' +
    '    #                  \'"$http_user_agent" "$http_x_forwarded_for"\';\n' +
    '\n' +
    '    #access_log  logs/access.log  main;\n' +
    '\n' +
    '    sendfile        on;\n' +
    '    #tcp_nopush     on;\n' +
    '\n' +
    '    #keepalive_timeout  0;\n' +
    '    keepalive_timeout  65;\n' +
    '\n' +
    '    #gzip  on;\n' +
    '\n' +
    '    server {\n' +
    '        listen       80;\n' +
    '        server_name  localhost;\n' +
    '\n' +
    '        #charset koi8-r;\n' +
    '\n' +
    '        #access_log  logs/host.access.log  main;\n' +
    '\n' +
    '        location / {\n' +
    '            root   html;\n' +
    '            index  index.html index.htm;\n' +
    '            try_files $uri $uri/ /index.html; # 必须要加否则会404 首先以文件查找，其次以目录查找，最后直接让index.html处理请求\n' +
    '        }\n' +
    '\n' +
    '        location = /api {\n' +
    '            proxy_pass http://192.168.1.204:8888/api;\n' +
    '        }\n' +
    '        #error_page  404              /404.html;\n' +
    '\n' +
    '        # redirect server error pages to the static page /50x.html\n' +
    '        #\n' +
    '        error_page   500 502 503 504  /50x.html;\n' +
    '        location = /50x.html {\n' +
    '            root html/index.html;\n' +
    '            try_files $uri $uri/ /index.html;\n' +
    '        }\n' +
    '\n' +
    '        # proxy the PHP scripts to Apache listening on 127.0.0.1:80\n' +
    '        #\n' +
    '        #location ~ \\.php$ {\n' +
    '        #    proxy_pass   http://127.0.0.1;\n' +
    '        #}\n' +
    '\n' +
    '        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000\n' +
    '        #\n' +
    '        #location ~ \\.php$ {\n' +
    '        #    root           html;\n' +
    '        #    fastcgi_pass   127.0.0.1:9000;\n' +
    '        #    fastcgi_index  index.php;\n' +
    '        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;\n' +
    '        #    include        fastcgi_params;\n' +
    '        #}\n' +
    '\n' +
    '        # deny access to .htaccess files, if Apache\'s document root\n' +
    '        # concurs with nginx\'s one\n' +
    '        #\n' +
    '        #location ~ /\\.ht {\n' +
    '        #    deny  all;\n' +
    '        #}\n' +
    '    }\n' +
    '\n' +
    '\n' +
    '    # another virtual host using mix of IP-, name-, and port-based configuration\n' +
    '    #\n' +
    '    #server {\n' +
    '    #    listen       8000;\n' +
    '    #    listen       somename:8080;\n' +
    '    #    server_name  somename  alias  another.alias;\n' +
    '\n' +
    '    #    location / {\n' +
    '    #        root   html;\n' +
    '    #        index  index.html index.htm;\n' +
    '    #    }\n' +
    '    #}\n' +
    '\n' +
    '\n' +
    '    # HTTPS server\n' +
    '    #\n' +
    '    #server {\n' +
    '    #    listen       443 ssl;\n' +
    '    #    server_name  localhost;\n' +
    '\n' +
    '    #    ssl_certificate      cert.pem;\n' +
    '    #    ssl_certificate_key  cert.key;\n' +
    '\n' +
    '    #    ssl_session_cache    shared:SSL:1m;\n' +
    '    #    ssl_session_timeout  5m;\n' +
    '\n' +
    '    #    ssl_ciphers  HIGH:!aNULL:!MD5;\n' +
    '    #    ssl_prefer_server_ciphers  on;\n' +
    '\n' +
    '    #    location / {\n' +
    '    #        root   html;\n' +
    '    #        index  index.html index.htm;\n' +
    '    #    }\n' +
    '    #}\n' +
    '\n' +
    '}\n' +
    '\n' +
    '~~~\n' +
    '!!!bug  BUG\n' +
    '  1、路由跳转不刷新问题(已修复)\n' +
    '  2、响应式图表问题(已修复)\n' +
    '!!!\n' +
    '\n' +
    '### 2023-07-26\n' +
    '!!!success  修复\n' +
    '  1、修复预览页面顶栏问题\n' +
    '  2、修改topBar\n' +
    '!!!\n' +
    '\n' +
    '### 2023-8-25\n' +
    '!!! example 计划\n' +
    '1、开始开发音乐播放器\n' +
    '!!!\n' +
    '\n' +
    '### 2024-06-11\n' +
    '!!! caution Title\n' +
    '1、开发完成音乐播放器\n' +
    '!!!\n');
const scrollElement = document.querySelector('#scrollElement');
</script>

<style lang="scss" scoped>
.notify-content{
  width: 100vw;
  height: 100vh;
  overflow: auto;
  .top-card{
    width: 100%;
    color: #000;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: 800;
    border-bottom: 1px solid #9698961A;
  }
  .detales{
    display: flex;
    justify-content: space-between;
    padding: 5rem 25rem 0 25rem;
  }
  .back{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
  }
}


:deep(.md-editor-catalog-indicator){
  display: none;
}
:deep(.md-editor-catalog-active > span){
  color: #387de3;
}
:deep(.md-editor-catalog-link span:hover) {
  color: #387de3;
}

@media (max-width: 1200px) {
  .notify-content{
    width: 100vw;
    height: 100vh;
    overflow: auto;
    .top-card{
      width: 100%;
      color: #000;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      font-weight: 800;
      border-bottom: 1px solid #9698961A;
    }
    .detales{
      display: flex;
      justify-content: space-between;
      padding: 5rem 1rem 0 1rem;
    }
  }
}
</style>
