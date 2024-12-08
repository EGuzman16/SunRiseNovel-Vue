<script>
import { getRecommendation, deleteRecommendation } from '../services/recommendation';

export default {
    data() {
        return {
            id: this.$route.params.id,
            title: '',
            date: '',
        };
    },
    async created() {
        const recommendation = await getRecommendation(this.id);
        this.title = recommendation.title;
        this.date = recommendation.date;
    },
    methods: {
        async deleteRecommendation() {
            await deleteRecommendation(this.id);

            // Redirige al usuario a la lista de recomendaciones después de borrar la recomendación
            this.$router.push('/recommendations');
        },
    },
};
</script>

<template>
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-2xl font-bold mb-4 text-violet-950">Borrar Recomendación</h1>

        <p>¿Estás seguro de que deseas borrar la recomendación "{{ title }}" del {{ date }}?</p>

        <div class="mt-4">
            <button @click="deleteRecommendation" class="mr-2 py-2 px-4 bg-red-500 text-white rounded">Aceptar</button>
            <router-link to="/recommendations" class="py-2 px-4 bg-gray-500 text-white rounded">Rechazar</router-link>
        </div>
    </div>
</template>