<script>
import { getRecommendation, getComments, addComment } from '../services/recommendation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../services/firebase';

export default {
    data() {
        return {
            id: '',
            title: '',
            date: '',
            synopsis: '',
            link: '',
            imageUrl: '',  
            comments: [],
            newComment: '',
            user: null,
            isModalOpen: false,  
        };
    },
    async created() {
        try {
            this.id = this.$route.params.id;
            const recommendation = await getRecommendation(this.id);
            this.title = recommendation.title;
            this.date = recommendation.date;
            this.synopsis = recommendation.synopsis;
            this.link = recommendation.link;
            this.imageUrl = recommendation.imageUrl;  
            this.comments = await getComments(this.id);
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user;
                }
            });
        } catch (error) {
            console.error('Error loading recommendation:', error);
        }
    },

    methods: {
        async submitComment() {
            if (this.newComment.trim() !== '' && this.user) {
                console.log(this.user.email); 
                await addComment(this.id, { text: this.newComment, user: this.user.displayName, userEmail: this.user.email, avatarUrl: this.user.photoURL });
                this.newComment = '';
                this.comments = await getComments(this.id);
            }
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        },
    },
}
</script>

<template>
    <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold mb-4 text-center text-violet-950">{{ title }}</h1>
        <p class="mb-4">{{ date }}</p>
        <img :src="imageUrl" alt="Imagen de la recomendación" class="w-48 h-72 object-cover mb-4 mx-auto cursor-pointer" v-if="imageUrl" @click="openModal" />
        <p class="mb-4">{{ synopsis }}</p>
        <p class="mb-4"><a :href="link" target="_blank" class="text-blue-500 underline">Ver más</a></p>

        <div class="mb-4">
            <router-link to="/recommendations" class="py-2 px-4 bg-gray-500 text-white rounded">Volver al listado de recomendaciones</router-link>
        </div>

        <div class="comments">
            <h2>Comentarios</h2>
            <div v-for="comment in comments" :key="comment.id" class="flex items-center mb-2">
                <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img 
                        v-if="comment.avatarUrl" 
                        :src="comment.avatarUrl" 
                        alt="Avatar" 
                        class="w-full h-full object-cover" 
                    />
                    <svg v-else class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <p><strong>{{ comment.userEmail }}</strong>: {{ comment.text }}</p>
            </div>
            <input v-model="newComment" placeholder="Escribe un comentario..." />
            <button 
                @click="submitComment" 
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Enviar
            </button>
        </div>

     <!-- Modal -->
     <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div class="relative bg-white p-4 rounded-lg" style="width: 350px; height: 500px;">
                <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <img :src="imageUrl" alt="Imagen de la recomendación" class="w-full h-auto object-cover" />
            </div>
        </div>
    </div>
</template>

