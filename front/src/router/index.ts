import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/LandingPageView.vue"), // c'est du lazy loading : ça permet de charger les composants seulement quand on en a besoin
    },
    {
      path: "/entreprise",
      name: "entreprise",
      component: () => import("../views/EntrepriseView.vue"),
    },
    {
      path: '/salon-domicile',
      name: 'salon-domicile',
      component: () => import("../views/SalonDomicileView.vue"), // Composant à afficher
    },
    {
      path: "/structure",
      name: "structure",
      component: () => import("../views/StructureView.vue"),
    },
    // {
    //   path: "/prestations",
    //   name: "prestations",
    //   component: () => import("../views/PrestationsView.vue"),
    // },
    {
      path: "/reservation",
      name: "reservation",
      component: () => import("../views/ReservationView.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/admin/login",
      name: "admin-login",
      component: () => import("../views/AdminLoginView.vue"),
    },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("../views/LoginView.vue"),
    // },
    {
      path: "/presentation",
      name: "presentation",
      component: () => import("../views/PresentationView.vue"),
    },
    {
      path: "/back-office",
      name: "back-office",
      component: () => import("../views/BackOfficeView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
