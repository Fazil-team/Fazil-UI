import Vue from 'vue'
import pdf from 'vue-pdf'
Vue.component('PDFComponent', pdf)
export default function ({ app, redirect }, inject) {
    inject('pdf', pdf);
}
