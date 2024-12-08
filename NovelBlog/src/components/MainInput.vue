<script>
export default {
    name: 'MainInput',
    emits: ['update:modelValue'],
    props: {
        modelValue: {
            type: String,
        },
    },
}
</script>

<template>
    <input
        class="w-full p-2 border border-gray-500 rounded read-only:bg-gray-200"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    >
</template>