document.addEventListener("DOMContentLoaded", function () {
    // Función para abrir y cerrar el menú
const menu = document.querySelector(".menu");
const openMenuBtn = document.querySelector(".open-menu");
const closeMenuBtn = document.querySelector(".close-menu");

function toggleMenu() {
    menu.classList.toggle("menu_opened");}

    openMenuBtn.addEventListener("click", toggleMenu);
    closeMenuBtn.addEventListener("click", toggleMenu);

    // Función para resaltar el enlace del menú según la sección visible
const menuLinks = document.querySelectorAll('.menu a[href^="#"]');

    const observer = new IntersectionObserver(
            (entries) => {
        entries.forEach((entry) => {
            const id = entry.target.getAttribute("id");
            const menuLink = document.querySelector(`.menu a[href="#${id}"]`);

        if (entry.isIntersecting) {
                document.querySelector(".menu a.selected").classList.remove("selected");
                menuLink.classList.add("selected");
        }
        });
        },
    { rootMargin: "-30% 0px -70% 0px" }
    );

    menuLinks.forEach((menuLink) => {
        menuLink.addEventListener("click", function () {
            menu.classList.remove("menu_opened");
    });

    const hash = menuLink.getAttribute("href");
    const target = document.querySelector(hash);
    if (target) {
        observer.observe(target);
    }
    });

// Inicializar el carousel
     const carouselElement = document.getElementById('carouselExampleIndicators');
     const carousel = new bootstrap.Carousel(carouselElement, {
         interval: 4000 // Intervalo de cambio de diapositivas en milisegundos
    });

    // Función para desplazarse a una sección específica al hacer clic en un enlace del menú
    function scrollToSection(sectionId) {
       const section = document.querySelector(sectionId);
        section.scrollIntoView({ behavior: 'smooth' });
    }
}); 
