<script>
export default {
    name: 'UserProfileData',
    props: {
        user: {
            type: Object,
            required: true,
        }
    }
}
</script>

<template>
    <p 
        class="mb-4"
        :class="{
            'italic': !user.bio,
        }"
    >
        {{ user.bio || 'Esta es la biografía del usuario...' }}
    </p>

    <dl>
        <dt class="font-bold">Email</dt>
        <dd class="mb-2">{{ user.email }}</dd>
        <dt class="font-bold">Nombre de Usuario</dt>
        <dd 
            class="mb-2" 
            :class="{
                'italic': !user.displayName,
            }"
        >{{ user.displayName || 'No especificado' }}</dd>
        <dt class="font-bold">Social</dt>
        <dd 
            class="mb-2"
            :class="{
                'italic': !user.social,
            }"
        >{{ user.social || 'No especificado' }}</dd>
    </dl>
</template>