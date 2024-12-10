<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Editar Comunidad</h1>
      <form @submit.prevent="editarComunidad">
        <div class="mb-4">
          <label for="nombre" class="block text-gray-700">Nombre</label>
          <input type="text" id="nombre" v-model="comunidad.nombre" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
        </div>
        <div class="mb-4">
          <label for="web" class="block text-gray-700">Web</label>
          <input type="url" id="web" v-model="comunidad.web" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
        </div>
        <div class="mb-4">
          <label for="imagen" class="block text-gray-700">Imagen</label>
          <input type="text" id="imagen" v-model="comunidad.imagen" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Guardar Cambios</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        comunidad: {
          nombre: '',
          web: '',
          imagen: ''
        }
      };
    },
    created() {
      this.cargarComunidad();
    },
    methods: {
      async cargarComunidad() {
        const id = this.$route.params.id; // Asume que el ID de la comunidad se pasa como parámetro de la ruta
        try {
          const response = await fetch(`/api/index.php?consultar=${id}`);
          const data = await response.json();
          if (data.length > 0) {
            this.comunidad = data[0];
          } else {
            alert('Comunidad no encontrada');
            this.$router.push('/comunidades');
          }
        } catch (error) {
          console.error('Error al cargar la comunidad:', error);
        }
      },
      async editarComunidad() {
        const id = this.$route.params.id; // Asume que el ID de la comunidad se pasa como parámetro de la ruta
        try {
          const response = await fetch(`/api/index.php?actualizar=${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, ...this.comunidad })
          });
          if (response.ok) {
            alert('Comunidad actualizada exitosamente');
            this.$router.push('/comunidades');
          } else {
            alert('Error al actualizar la comunidad');
          }
        } catch (error) {
          console.error('Error al actualizar la comunidad:', error);
        }
      }
    }
  };
  </script>
 