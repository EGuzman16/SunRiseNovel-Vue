<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Crear Comunidad</h1>
    <form @submit.prevent="crearComunidad" enctype="multipart/form-data">
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
        <input type="file" id="imagen" @change="handleFileUpload" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">Crear</button>
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
        imagen: null
      }
    };
  },
  methods: {
    handleFileUpload(event) {
      this.comunidad.imagen = event.target.files[0];
    },
    async crearComunidad() {
      const formData = new FormData();
      formData.append('nombre', this.comunidad.nombre);
      formData.append('web', this.comunidad.web);
      formData.append('imagen', this.comunidad.imagen);

      try {
        const response = await fetch('/api/index.php?insertar', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          alert('Comunidad creada exitosamente');
          this.$router.push('/comunidades');
        } else {
          alert('Error al crear la comunidad');
        }
      } catch (error) {
        console.error('Error al crear la comunidad:', error);
      }
    }
  }
};
</script>

