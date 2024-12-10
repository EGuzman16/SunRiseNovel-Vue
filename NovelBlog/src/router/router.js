import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Chat from '../pages/Chat.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import MyProfile from '../pages/MyProfile.vue';
import MyProfileEdit from '../pages/MyProfileEdit.vue';
import UserProfile from '../pages/UserProfile.vue';
import PrivateChat from '../pages/PrivateChat.vue';
import Blog from '../pages/Blog.vue';
import CreatePost from '../pages/CreatePost.vue';
import EditPost from '../pages/EditPost.vue';
import DeletePost from '../pages/DeletePost.vue';
import Post from '../pages/Post.vue';
import Recommendation from '../pages/Recommendation.vue';
import CreateRecommendation from '../pages/CreateRecommendation.vue';
import EditRecommendation from '../pages/EditRecommendation.vue';
import DeleteRecommendation from '../pages/DeleteRecommendation.vue';
import SingleRecommendation from '../pages/SingleRecommendation.vue';
import Comunidades from '../pages/Comunidades.vue';
import Listar from '../components/Listar.vue';
import Crear from '../components/Crear.vue';
import Editar from '../components/Editar.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/iniciar-sesion', component: Login },
  { path: '/registro', component: Register },
  { path: '/blog', component: Blog, meta: { requiresAuth: true } },
  { path: '/post/:id', component: Post, meta: { requiresAuth: true } },
  { path: '/create', component: CreatePost, meta: { requiresAuth: true } },
  { path: '/edit/:id', component: EditPost, meta: { requiresAuth: true } },
  { path: '/delete/:id', component: DeletePost, meta: { requiresAuth: true } },
  { path: '/recommendations', component: Recommendation, meta: { requiresAuth: true } },
  { path: '/recommendation/:id', component: SingleRecommendation, meta: { requiresAuth: true } },
  { path: '/create-recommendation', component: CreateRecommendation, meta: { requiresAuth: true } },
  { path: '/edit-recommendation/:id', component: EditRecommendation, meta: { requiresAuth: true } },
  { path: '/delete-recommendation/:id', component: DeleteRecommendation, meta: { requiresAuth: true } },
  { path: '/chat', component: Chat, meta: { requiresAuth: true } },
  { path: '/perfil', component: MyProfile, meta: { requiresAuth: true } },
  { path: '/perfil/editar', component: MyProfileEdit, meta: { requiresAuth: true } },
  { path: '/usuario/:id', component: UserProfile, meta: { requiresAuth: true } },
  { path: '/usuario/:id/chat', component: PrivateChat, meta: { requiresAuth: true } },
  {
    path: '/comunidades',
    component: Comunidades,
    children: [
      {
        path: '',
        name: 'Listar',
        component: Listar
      },
      {
        path: 'crear',
        name: 'Crear',
        component: Crear
      },
      {
        path: 'editar/:id',
        name: 'Editar',
        component: Editar
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;