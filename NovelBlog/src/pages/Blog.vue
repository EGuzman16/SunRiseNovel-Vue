<script>
import { getPosts } from '../services/blog';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            posts: [],
            currentPage: 1,
            postsPerPage: 6,
            isAdmin: false, 
        };
    },

    computed: {
        paginatedPosts() {
            const start = (this.currentPage - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;
            return this.posts.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.posts.length / this.postsPerPage);
        },
    },

    async created() {
        this.loadPosts();
        this.checkAdminStatus();
    },

    methods: {
        loadPosts() {
            // Intentar cargar datos desde LocalStorage
            const localData = localStorage.getItem('posts');
            if (localData) {
                this.posts = JSON.parse(localData);
            } else {
                // Si no hay datos en LocalStorage, cargar desde la API
                this.fetchPosts();
            }
        },

        async fetchPosts() {
            try {
                this.posts = await getPosts();
                this.posts.forEach(post => {
                    if (post.createdAt) {
                        const date = new Date(post.createdAt);
                        if (!isNaN(date)) {
                            post.createdAt = date;
                        } else {
                            console.error('Invalid date:', post.createdAt);
                            post.createdAt = null;
                        }
                    } else {
                        console.error('Undefined date:', post.createdAt);
                        post.createdAt = null;
                    }
                });
            } catch (error) {
                console.error('Error fetching posts:', error);
                alert('Error fetching posts: ' + error.message);
            }
        },

        async checkAdminStatus() {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const db = getFirestore();
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        this.isAdmin = userDoc.data().role === 'admin';
                    }
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        },

        formatDate(date) {
            return Intl.DateTimeFormat('es-ES', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }).format(date).replace(',', '');
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    },
};
</script>

<template>
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-2xl font-bold mb-4 text-violet-950">Publicaciones</h1>
        <router-link v-if="isAdmin" to="/create" class="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">Crear nueva publicación</router-link>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="post in paginatedPosts" :key="post.id" class="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                <img :src="post.imageUrl" alt="Imagen de la publicación" class="w-full h-48 object-cover" v-if="post.imageUrl" />
                <div class="p-4">
                    <router-link :to="`/post/${post.id}`">
                        <h2 class="text-xl font-bold mb-2">{{ post.title }}</h2>
                    </router-link>
                    <p class="text-gray-600 mb-4">{{ formatDate(post.createdAt) }}</p>
                    <div v-if="isAdmin" class="flex justify-end">
                        <router-link :to="`/edit/${post.id}`" class="mr-4 text-green-900"><i class="fas fa-pencil-alt"></i></router-link>
                        <router-link :to="`/delete/${post.id}`" class="text-red-900"><i class="fas fa-trash"></i></router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-4 flex justify-center items-center">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded mr-2">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded ml-2">Siguiente</button>
        </div>
    </div>
</template>