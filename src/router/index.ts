import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteRecordRaw,
  NavigationGuardNext
} from 'vue-router'
import { getUserData } from '../request/apis'
import { useUserStore } from '../store/user';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layout/default.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('@/views/home/index.vue'),
      },
      {
        name: 'login',
        path: 'login',
        component: () => import('@/views/login.vue'),
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layout/work.vue'),
    children: [
      {
        name: 'work',
        path: 'work',
        meta: {
          title: '工作日報表'
        },
        component: () => import('@/views/work/add.vue'),
      },
      {
        name: 'contact',
        path: 'contact',
        meta: {
          title: '關係人資訊紀錄'
        },
        component: () => import('@/views/contact.vue'),
      },
      {
        name: 'profile',
        path: 'profile',
        meta: {
          title: '個人檔案'
        },
        component: () => import('@/views/profile.vue'),
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})


router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if(localStorage.getItem('token')) {
      try {
        const {data} = await getUserData()
        const user = useUserStore()
        user.data = data.data
        next()
      } catch(e) {
        next({ name: 'login' })
        localStorage.removeItem('token')
      }
      
    }
    next()
  }
)

export default router
