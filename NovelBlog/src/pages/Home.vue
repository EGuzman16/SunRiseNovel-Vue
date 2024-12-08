<script>
import MainH1 from '../components/MainH1.vue';

export default {
    name: "Home",
    components: { MainH1 }
}
</script>

<template>
    <div>
        <header>
        <div class="h-[30vh] w-full bg-cover bg-center flex items-center justify-center"
            style="height:20rem; background-image: url('/img/header.jpg')">
            <h1 class="my-24 text-2xl md:text-6xl text-white font-bold text-center px-4 bg-violet-950 bg-opacity-50">
                ¡Bienvenido a SunriseNovel Social! <br>
                <span class="md:text-4xl">Acá vas a poder encontrarte con toda una comunidad de lectores.</span>
            </h1>
        </div>
    </header>

    <div class="flex flex-col md:flex-row justify-around mt-20 gap-2 md:gap-3">
    <div class="flex flex-col items-center mb-4 md:mb-0">
        <i class="fas fa-users text-4xl text-violet-500"></i>
        <h2 class="text-2xl font-bold mt-2 text-violet-950">Comunidad</h2>
        <p>Nuestra comunidad está dedicada a los apasionados lectores de novelas coreanas. Aquí, encontrarás un espacio donde compartir tus opiniones, descubrir nuevas obras y conectarte con otros entusiastas que comparten tu amor por estas emocionantes historias. Únete a nuestros foros y grupos de discusión para debatir sobre tus personajes y tramas favoritas, y forma parte de una comunidad vibrante y acogedora.</p>
    </div>
    <div class="flex flex-col items-center mb-4 md:mb-0">
        <i class="fas fa-blog text-4xl text-violet-500"></i>
        <h2 class="text-2xl font-bold mt-2 text-violet-950">Blog</h2>
        <p>Nuestro blog es tu fuente principal de noticias, reseñas y recomendaciones sobre las últimas y mejores novelas coreanas. Cada semana, exploramos nuevos títulos y compartimos análisis profundos de las tramas y personajes que capturan nuestra imaginación. Mantente al día con nuestras publicaciones para no perderte ninguna novedad en el mundo de la literatura coreana.</p>
    </div>
    <div class="flex flex-col items-center">
        <i class="fas fa-gamepad text-4xl text-violet-500"></i>
        <h2 class="text-2xl font-bold mt-2 text-violet-950">Diversión</h2>
        <p>Además de leer y discutir novelas, ofrecemos una variedad de actividades interactivas en nuestro chat para mantenerte entretenido. Participa en cuestionarios temáticos, retos de escritura y eventos en línea que pondrán a prueba tu conocimiento y creatividad. Descubre todo un mundo de entretenimiento pensado para que disfrutes al máximo de tu pasión por las novelas coreanas.</p>
    </div>
</div>

        <div class="flex flex-col md:flex-row mt-10 mx-auto max-w-screen-lg pt-12">
            <div class="w-full md:w-1/3 mb-4 md:mb-0">
                <img src="../../public/img/nosotros.jpg" alt="Sobre nosotros" class="w-full">
            </div>
            <div class="w-full md:w-1/2 pl-8">
                <h2 class="text-2xl font-bold text-violet-950">Sobre nosotros</h2>
                <p>En SunriseNovel, somos una comunidad apasionada por las novelas coreanas, especialmente aquellas del género rofan. Nuestra misión es proporcionar un espacio acogedor y vibrante donde los lectores puedan descubrir, discutir y disfrutar de sus historias favoritas. Creemos en el poder de la narrativa para conectar a las personas, y por eso hemos creado una plataforma que no solo ofrece una amplia selección de novelas, sino también herramientas para que los usuarios compartan sus experiencias y opiniones.</p>
<br>
                <p>Fundada por un grupo de entusiastas de la literatura coreana, Novelsunrise se dedica a promover tanto a autores consagrados como a nuevos talentos. Nos enorgullecemos de ofrecer contenido exclusivo, reseñas detalladas y una comunidad activa que participa en debates, eventos y actividades relacionadas con las novelas rofan. Ya sea que seas un lector veterano o nuevo en este fascinante mundo, Novelsunrise es el lugar perfecto para sumergirte en historias inolvidables y conectarte con otros amantes de la literatura.</p>
            </div>
        </div>
    </div>
</template>