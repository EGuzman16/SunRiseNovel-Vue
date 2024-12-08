<script>
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import { subscribeToAuth } from '../services/auth';
import { saveChatMessage, subscribeToChatMessages } from '../services/chat';

export default {
    name: "Chat",
    components: { MainH1, Loader, MainLabel, MainButton, MainInput },
    data: () => {
        return {
            messages: [],
            loadingMessages: true,
            unsubscribeFromChat: () => {},

            newMessage: {
                content: '',
            },

            authUser: {
                id: null,
                email: null,
                avatarUrl: null,  
            },
            unsubscribeFromAuth: () => {},
        }
    },
    methods: {
        sendMessage() {
            saveChatMessage({
                userId: this.authUser.id,
                email: this.authUser.email,
                content: this.newMessage.content,
                avatarUrl: this.authUser.avatarUrl,  
            });
            this.newMessage.content = '';
        },

        /**
         * Transforma un objeto Date a un string con formato "DD/MM/AAAA HH:mm".
         * 
         * @param {Date} date 
         * @returns {string}
         */
        formatDate(date) {
            return Intl.DateTimeFormat('es-ES', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit',  
            }).format(date).replace(',', '');
        },

        userRoute(id) {
            return id !== this.authUser.id ?
                `/usuario/${id}` :
                '/perfil';
        }
    },
    mounted() {
        this.unsubscribeFromChat = subscribeToChatMessages(newMessages => {
            this.messages = newMessages;
            this.loadingMessages = false;
        });

        this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
            this.authUser = newUserData;
        });
    },
    unmounted() {
        this.unsubscribeFromAuth();
        this.unsubscribeFromChat();
    }
}
</script>

<template>
    <MainH1>Chat Global</MainH1>

    <div class="flex gap-4">
        <section class="w-3/4">
            <h2 class="sr-only">Lista de Mensajes</h2>

            <div class="min-h-[400px] p-4 border border-gray-300 rounded">
                <ul v-if="!loadingMessages">
                    <li 
                        v-for="message in messages"
                        v-bind:key="message.id"
                        class="mb-2 flex items-center"
                    >
                        <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img 
                                v-if="message.avatarUrl" 
                                :src="message.avatarUrl" 
                                alt="Avatar" 
                                class="w-full h-full object-cover" 
                            />
                            <svg v-else class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div>
                            <p>
                                <router-link 
                                    class="text-blue-600 underline"
                                    :to="userRoute(message.userId)"
                                >
                                    <b>{{ message.email }}</b>
                                </router-link> 
                                escribió:
                            </p>
                            <p>{{ formatDate(message.created_at) }} - {{ message.content }} </p>
                        </div>
                    </li>
                </ul>
                <Loader v-else />
            </div>
        </section> 
        <section class="w-1/4">
            <form 
                action="#"
                @submit.prevent="sendMessage"
            >
                <div class="mb-3">
                    <span class="block mb-2">Email</span>
                    <span>{{ authUser.email }}</span>
                </div>
                <div class="mb-3">
                    <MainLabel for="message">Mensaje</MainLabel>
                    <textarea
                        id="message"
                        class="w-full p-2 border border-gray-500 rounded"
                        v-model="newMessage.content"
                    ></textarea>
                </div>
                <MainButton 
                    type="submit"
                />
            </form>
        </section>
    </div>
</template>