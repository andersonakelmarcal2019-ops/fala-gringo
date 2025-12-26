document.addEventListener('DOMContentLoaded', () => {

    // Fade In Animation for Hero
    const fadeIns = document.querySelectorAll('.fade-in');
    fadeIns.forEach(el => {
        el.classList.add('visible');
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-next');
    const prevButton = document.querySelector('.carousel-prev');

    let currentSlideIndex = 0;

    const moveToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        const amountToMove = slides[index].offsetWidth * index;
        track.style.transform = `translateX(-${amountToMove}px)`;
        currentSlideIndex = index;
    };

    nextButton.addEventListener('click', () => {
        moveToSlide(currentSlideIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentSlideIndex - 1);
    });

    // Auto-play (optional, but keep it for premium feel)
    let autoPlayInterval = setInterval(() => {
        moveToSlide(currentSlideIndex + 1);
    }, 5000);

    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carouselContainer.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            moveToSlide(currentSlideIndex + 1);
        }, 5000);
    });

    // Handle window resize
    window.addEventListener('resize', () => moveToSlide(currentSlideIndex));

});
