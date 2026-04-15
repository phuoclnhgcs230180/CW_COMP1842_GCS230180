import Vue from 'vue';
import VueRouter from 'vue-router';

// Keep only one set of imports
// Note: If this file is in the components folder, use '../components/...'
const HelpdeskList = () => import('../components/HelpdeskList.vue');
const New = () => import('../components/New.vue');
const Edit = () => import('../components/Edit.vue');
const Register = () => import('../components/Register.vue'); 
const ChangePassword = () => import('../components/ChangePassword.vue');
const Messages = () => import('../components/Messages.vue');
const Login = () => import('../views/Login.vue');
const GuestHome = () => import('../views/GuestHome.vue');

Vue.use(VueRouter);

const routes = [
  { path: '/', component: GuestHome },
  { path: '/login', component: Login },
  { path: '/responses', component: HelpdeskList, meta: { requiresAuth: true } },
  { path: '/new', component: New, meta: { requiresAdmin: true } },
  { path: '/edit/:id', name: 'edit', component: Edit, meta: { requiresAdmin: true } },
  { path: '/register', component: Register, meta: { requiresAdmin: true } },
  { path: '/change-password', component: ChangePassword, meta: { requiresAuth: true } },
  { path: '/messages', component: Messages, meta: { requiresAuth: true } },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Route guard logic
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) return next('/login');
  if (to.meta.requiresAdmin && role !== 'admin') return next('/responses');
  next();
});

export default router;