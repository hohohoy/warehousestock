import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'audit',
    component: () => import('../views/Audit/audit.vue'),
    meta: {
      isFlash: false,
      scrollPosition: 0
    }
  },
  {
    path: '/auditDetail',
    name: 'auditDetail',
    component: () => import('../views/Audit/auditDetail')
  }
]

const router = new VueRouter({
 // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router