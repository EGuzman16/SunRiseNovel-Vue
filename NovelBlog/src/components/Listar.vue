<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Lista de Comunidades</h1>
    <div class="mb-4">
      <router-link to="/comunidades/crear" class="bg-blue-500 text-white px-4 py-2 rounded-md">Crear Comunidad</router-link>
    </div>
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b text-center">ID</th>
          <th class="py-2 px-4 border-b text-center">Nombre</th>
          <th class="py-2 px-4 border-b text-center">Web</th>
          <th class="py-2 px-4 border-b text-center">Imagen</th>
          <th class="py-2 px-4 border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comunidad in comunidades" :key="comunidad.ID" class="text-center">
          <td class="py-2 px-4 border-b items-center">{{ comunidad.ID }}</td>
          <td class="py-2 px-4 border-b items-center">{{ comunidad.nombre }}</td>
          <td class="py-2 px-4 border-b items-center">{{ comunidad.web }}</td>
          <td class="py-2 px-4 border-b items-center">
            <img :src="`/server/${comunidad.imagen}`" alt="Imagen" class="w-16 h-16 object-cover mx-auto">
          </td>
          <td class="py-2 px-4 mt-6 border-b flex justify-center items-center space-x-2">
            <router-link :to="`/comunidades/editar/${comunidad.ID}`" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">Editar</router-link>
            <button @click="borrarComunidad(comunidad.ID)" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comunidades: []
    };
  },
  created() {
    this.fetchComunidades();
  },
  methods: {
    async fetchComunidades() {
      try {
        const response = await fetch('/api/index.php');
        const data = await response.json();
        this.comunidades = data;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    },
    async borrarComunidad(id) {
      try {
        const response = await fetch(`/api/index.php?borrar=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          this.comunidades = this.comunidades.filter(comunidad => comunidad.ID !== id);
          alert('Comunidad borrada exitosamente');
        } else {
          alert('Error al borrar la comunidad');
        }
      } catch (error) {
        console.error('Error al borrar la comunidad:', error);
      }
    }
  }
};
</script>

 