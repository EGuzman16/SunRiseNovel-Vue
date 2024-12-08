<script>
export default {
    name: 'MainButton',
}
</script>

<template>
    <button 
        class="transition py-2 px-4 rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white"
    >
        <slot>Enviar</slot>
    </button>
</template>