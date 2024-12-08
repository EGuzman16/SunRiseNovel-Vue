<script>
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            recommendations: [],
            currentPage: 1,
            recommendationsPerPage: 6,  
            isAdmin: false, 
        };
    },

    computed: {
        paginatedRecommendations() {
            const start = (this.currentPage - 1) * this.recommendationsPerPage;
            const end = start + this.recommendationsPerPage;
            return this.recommendations.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.recommendations.length / this.recommendationsPerPage);
        },
    },

    async created() {
        this.loadRecommendations();
        this.checkAdminStatus();
    },

    methods: {
        loadRecommendations() {
            // Intentar cargar datos desde LocalStorage
            const localData = localStorage.getItem('recommendations');
            if (localData) {
                this.recommendations = JSON.parse(localData);
            } else {
                // Si no hay datos en LocalStorage, cargar desde la API
                this.fetchRecommendations();
            }
        },

        async fetchRecommendations() {
            try {
                const response = await fetch('https://api.example.com/recommendations');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                this.recommendations = await response.json();
                // Guardar datos en LocalStorage
                localStorage.setItem('recommendations', JSON.stringify(this.recommendations));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                alert('Error fetching recommendations: ' + error.message);
            }
        },

        addRecommendation(recommendation) {
            this.recommendations.push(recommendation);
            localStorage.setItem('recommendations', JSON.stringify(this.recommendations));
        },

        deleteRecommendation(id) {
            this.recommendations = this.recommendations.filter(rec => rec.id !== id);
            localStorage.setItem('recommendations', JSON.stringify(this.recommendations));
        },

        updateRecommendation(updatedRecommendation) {
            const index = this.recommendations.findIndex(rec => rec.id === updatedRecommendation.id);
            if (index !== -1) {
                this.recommendations.splice(index, 1, updatedRecommendation);
                localStorage.setItem('recommendations', JSON.stringify(this.recommendations));
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
        <h1 class="text-2xl font-bold mb-4 text-violet-950">Recomendaciones</h1>
        <router-link v-if="isAdmin" to="/create-recommendation" class="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">Crear nueva recomendación</router-link>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="recommendation in paginatedRecommendations" :key="recommendation.id" class="bg-white shadow-md rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                <img :src="recommendation.imageUrl" alt="Imagen de la recomendación" class="w-full h-70 object-cover" v-if="recommendation.imageUrl" />
                <div class="p-4">
                    <router-link :to="`/recommendation/${recommendation.id}`">
                        <h2 class="text-xl font-bold mb-2">{{ recommendation.title }}</h2>
                    </router-link>
                    <p class="text-gray-600 mb-4">{{ formatDate(recommendation.createdAt) }}</p>
                    <div v-if="isAdmin" class="flex justify-end">
                        <router-link :to="`/edit-recommendation/${recommendation.id}`" class="mr-4 text-green-900"><i class="fas fa-pencil-alt"></i></router-link>
                        <router-link :to="`/delete-recommendation/${recommendation.id}`" class="text-red-900"><i class="fas fa-trash"></i></router-link>
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