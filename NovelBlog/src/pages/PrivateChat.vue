<script>
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import { sendPrivateChatMessage, subscribeToPrivateChat } from '../services/private-chat';
import { getUserProfileById } from '../services/user-profile';
import { subscribeToAuth } from '../services/auth';

export default {
    name: 'PrivateChat',
    components: { MainH1, Loader, MainButton },
    data() {
        return {
            authUser: {
                id: null,
                email: null,
            },
            unsubscribeFromAuth: () => {},

            user: {
                id: null,
                email: null,
            },
            loadingUser: false,

            messages: [],
            loadingMessages: false,
            unsubscribeFromChat: () => {},

            newMessage: {
                content: '',
            }
        }
    },
    methods: {
        handleSubmit() {
            sendPrivateChatMessage({
                senderId: this.authUser.id,
                receiverId: this.$route.params.id,
                content: this.newMessage.content,
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
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }).format(date).replace(',', '');
        },
    },
    async mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);

        this.loadingUser = true;
        this.user = await getUserProfileById(this.$route.params.id);
        this.loadingUser = false;

        this.loadingMessages = true;
        this.unsubscribeFromChat = subscribeToPrivateChat(
            this.authUser.id,
            this.$route.params.id,
            newMessages => {
                this.messages = newMessages;
                this.loadingMessages = false;
            }
        );
    },
    unmounted() {
        this.unsubscribeFromAuth();
        this.unsubscribeFromChat();
    }
}
</script>

<template>
    <Loader v-if="loadingUser" />
    <template v-else>
        <MainH1>Chat Privado con {{ user.email }}</MainH1>

        <section class="mb-4">
            <h2 class="sr-only">Lista de Mensajes</h2>

            <div class="min-h-[400px] p-4 border border-gray-300 rounded">
                <ul 
                    v-if="!loadingMessages"
                    class="flex flex-col items-start"
                >
                    <li 
                        v-for="message in messages"
                        class="p-2 mb-2 rounded"
                        :class="{
                            'bg-green-200': message.sender_id == authUser.id,
                            'self-end': message.sender_id == authUser.id,
                            'bg-gray-200': message.sender_id != authUser.id,
                        }"
                    >
                        <p v-if="message.created_at">{{ formatDate(message.created_at) }} - {{ message.content }}</p>
                        <p v-else>Enviando...</p>
                    </li>
                </ul>
                <Loader v-else />
            </div>
        </section>

        <section>
            <form 
                action="#"
                @submit.prevent="handleSubmit"
            >
                <h2 class="sr-only">Enviar Mensaje</h2>
                <div class="flex gap-4">
                    <textarea
                        id="message"
                        class="w-full p-2 border border-gray-500 rounded"
                        aria-label="Mensaje"
                        v-model="newMessage.content"
                    ></textarea>
                    <MainButton>Enviar</MainButton>
                </div>
            </form>
        </section>
    </template>
</template>