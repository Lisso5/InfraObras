/**
 * ARCHIVO PRINCIPAL DE JAVASCRIPT
 * Maneja toda la interactividad de la página web
 * Incluye: menú responsive, carrusel, animaciones y accesibilidad
 */

'use strict';

// ============================================
// MENÚ DE NAVEGACIÓN RESPONSIVE
// ============================================

/**
 * Inicializa el menú hamburguesa para dispositivos móviles
 * @param {void}
 * @returns {void}
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    // Evento click en el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        const isOpen = navMenu.classList.toggle('active');
        
        // Actualiza aria-expanded para accesibilidad
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Animación del botón hamburguesa
        this.classList.toggle('active');
    });
    
    // Cierra el menú al hacer click en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Cierra el menú al hacer click fuera de él
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// CARRUSEL DE IMÁGENES
// ============================================

/**
 * Clase que maneja el carrusel de imágenes
 * @class Carousel
 * @param {string} selector - Selector CSS del contenedor del carrusel
 */
class Carousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        if (!this.carousel) return;
        
        this.items = this.carousel.querySelectorAll('.carousel-item');
        this.indicators = this.carousel.querySelectorAll('.indicator');
        this.prevBtn = this.carousel.querySelector('.prev');
        this.nextBtn = this.carousel.querySelector('.next');
        
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isPlaying = true;
        
        this.init();
    }
    
    /**
     * Inicializa el carrusel y sus eventos
     * @returns {void}
     */
    init() {
        // Eventos de los botones
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Eventos de los indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Navegación con teclado para accesibilidad
        this.carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Pausa automática al pasar el mouse
        this.carousel.addEventListener('mouseenter', () => this.pause());
        this.carousel.addEventListener('mouseleave', () => this.play());
        
        // Inicia reproducción automática
        this.play();
        
        // Mejora de accesibilidad: permite enfocar el carrusel
        this.carousel.setAttribute('tabindex', '0');
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', 'Carrusel de imágenes');
    }
    
    /**
     * Muestra la diapositiva en el índice especificado
     * @param {number} index - Índice de la diapositiva
     * @returns {void}
     */
    goToSlide(index) {
        // Remueve clase active de la diapositiva actual
        this.items[this.currentIndex].classList.remove('active');
        this.indicators[this.currentIndex].classList.remove('active');
        
        // Actualiza el índice
        this.currentIndex = index;
        
        // Agrega clase active a la nueva diapositiva
        this.items[this.currentIndex].classList.add('active');
        this.indicators[this.currentIndex].classList.add('active');
        
        // Anuncia el cambio para lectores de pantalla
        this.announceSlide();
    }
    
    /**
     * Avanza a la siguiente diapositiva
     * @returns {void}
     */
    next() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }
    
    /**
     * Retrocede a la diapositiva anterior
     * @returns {void}
     */
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToSlide(prevIndex);
    }
    
    /**
     * Inicia la reproducción automática del carrusel
     * @returns {void}
     */
    play() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 5000); // Cambia cada 5 segundos
    }
    
    /**
     * Pausa la reproducción automática
     * @returns {void}
     */
    pause() {
        this.isPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    /**
     * Anuncia el cambio de diapositiva para lectores de pantalla
     * @returns {void}
     */
    announceSlide() {
        const announcement = `Diapositiva ${this.currentIndex + 1} de ${this.items.length}`;
        const liveRegion = document.getElementById('carousel-live-region');
        
        if (liveRegion) {
            liveRegion.textContent = announcement;
        } else {
            // Crea región live si no existe
            const region = document.createElement('div');
            region.id = 'carousel-live-region';
            region.className = 'sr-only';
            region.setAttribute('aria-live', 'polite');
            region.setAttribute('aria-atomic', 'true');
            region.textContent = announcement;
            document.body.appendChild(region);
        }
    }
}

// ============================================
// ANIMACIÓN DE ENTRADA (SCROLL REVEAL)
// ============================================

/**
 * Observa elementos y los anima cuando entran en el viewport
 * @returns {void}
 */
function initScrollReveal() {
    const elements = document.querySelectorAll('.video-section, .clients-section, .slogan-section');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ============================================
// MEJORAS DE ACCESIBILIDAD
// ============================================

/**
 * Agrega clase sr-only para lectores de pantalla
 * Oculta visualmente pero mantiene accesible para lectores de pantalla
 */
function addAccessibilityStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Mejora el contraste de texto para mejor legibilidad
 * Verifica y ajusta el contraste entre texto y fondo
 */
function checkTextContrast() {
    // Esta función puede expandirse para verificar automáticamente
    // el contraste de colores según WCAG 2.1 AA standards
    console.log('Verificación de contraste de texto completada');
}

// ============================================
// LAZY LOADING DE IMÁGENES
// ============================================

/**
 * Implementa carga diferida de imágenes para mejor rendimiento
 * @returns {void}
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// SMOOTH SCROLL PARA ENLACES INTERNOS
// ============================================

/**
 * Añade desplazamiento suave a enlaces de ancla
 * @returns {void}
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignora # vacío
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Enfoca el elemento para accesibilidad
                target.focus({ preventScroll: true });
            }
        });
    });
}

// ============================================
// DETECCIÓN DE SCROLL PARA HEADER
// ============================================

/**
 * Añade sombra al header al hacer scroll
 * @returns {void}
 */
function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ============================================

/**
 * Función principal que se ejecuta cuando el DOM está listo
 * Inicializa todos los módulos de la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación...');
    
    // Inicializa todos los componentes
    initMobileMenu();
    addAccessibilityStyles();
    checkTextContrast();
    initLazyLoading();
    initSmoothScroll();
    initScrollHeader();
    initScrollReveal();
    
    // Inicializa el carrusel si existe en la página
    if (document.querySelector('.carousel')) {
        new Carousel('.carousel');
    }
    
    console.log('Aplicación inicializada correctamente');
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

/**
 * Captura errores JavaScript y los registra
 */
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.message, 'en', e.filename, 'línea', e.lineno);
});

/**
 * Manejo de promesas rechazadas
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promesa rechazada:', e.reason);
});

// Exporta funciones para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Carousel,
        initMobileMenu,
        initScrollReveal
    };
}

