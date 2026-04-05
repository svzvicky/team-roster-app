import { createRouter, createWebHistory } from 'vue-router'
import MembersView from '../views/MembersView.vue'

const routes = [
  { path: '/', redirect: '/members' },
  { path: '/members', component: MembersView, name: 'members' }
]

export default createRouter({
  history: createWebHistory(),
  routes
})