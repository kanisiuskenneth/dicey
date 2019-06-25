import VueRouter from 'vue-router'
import Home from './components/Home'
import Register from './components/Register'
const routes = [
    {path: "/", component: Home},
    {path: "/service/new", component: Register}
    // {path: "*", component: NotFound}
  ];

const router = new VueRouter({
  routes: routes,
  base: process.env.BASE_URL,
  mode: 'history',
});

export default router;
