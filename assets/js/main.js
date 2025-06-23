document.addEventListener('DOMContentLoaded', () => {
    // Lógica do Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNavUl = document.querySelector('.main-nav ul');

    if (mobileMenuBtn && mainNavUl) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNavUl.classList.toggle('active');
        });
    }

    // Inicialização do Carrossel Swiper.js
    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});