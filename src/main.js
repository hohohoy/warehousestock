import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import $ from 'jquery'
Vue.prototype.$ = $
import {Calendar,Cell, Picker,DropdownMenu, DropdownItem,Field,CellGroup,DatetimePicker, Overlay,Notify,Search,Toast, Button,Skeleton } from 'vant';

Vue.use(Overlay).use( Button).use(Skeleton);
Vue.use(Cell).use(Calendar).use(Picker).use(DropdownMenu).use(DropdownItem).use(Field).use(CellGroup).use(DatetimePicker).use(Overlay).use(Notify).use(Search).use(Toast);
Vue.prototype.$axios = axios;

Vue.config.productionTip = false
Vue.prototype.getWarehouseData=function(val){
      for(let index in this.warehouseList){
        if(parseInt(this.warehouseList[index].tzid)==val){
          this.warehouseData=this.warehouseList[index].dbdata
        }
      }
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
