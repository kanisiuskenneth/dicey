import VueRouter from 'vue-router'
import Home from './components/Home'
import Register from './components/Register'
import Detail from './components/Detail'
const routes = [
    {path: "/", component: Home},
    {path: "/service/new", component: Register},
    {path: "/service/:id", component: Detail},
    // {path: "/search", component: Search}
    // {path: "*", component: NotFound}
  ];

const router = new VueRouter({
  routes: routes,
  base: process.env.BASE_URL,
  mode: 'history',
});

export default router;
