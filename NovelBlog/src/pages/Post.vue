<script>
import { getPost, getComments, addComment } from '../services/blog';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../services/firebase';

export default {
    data() {
        return {
            id: '',
            title: '',
            date: '',
            text: '',
            imageUrl: '',  
            comments: [],
            newComment: '',
            user: null,
        };
    },
    async created() {
        try {
            this.id = this.$route.params.id;
            const post = await getPost(this.id);
            this.title = post.title;
            this.date = post.date;
            this.text = post.text;
            this.imageUrl = post.imageUrl; 
            this.comments = await getComments(this.id);
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user;
                }
            });
        } catch (error) {
            console.error('Error loading post:', error);
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
    },
}
</script>

<template>
    <div class="container mx-auto px-4 ">
        <h1 class="text-2xl font-bold mb-4 text-center text-violet-950">{{ title }}</h1>
        <p class="mb-4">{{ date }}</p>
        <img :src="imageUrl" alt="Imagen de la publicación" class="w-full h-auto mb-4" v-if="imageUrl" />
        <p class="mb-4">{{ text }}</p>

        <div class="mb-4">
            <router-link to="/blog" class="py-2 px-4 bg-gray-500 text-white rounded">Volver al listado de publicaciones</router-link>
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
    </div>
</template>