/**
 * Основной JavaScript файл для главной страницы
 */

document.addEventListener('DOMContentLoaded', function() {

    // Удаляем создание мобильного меню, так как оно уже есть в HTML
    // и оставляем только функциональность
    
    // Инициализация мобильного меню (универсальная для всех страниц)
    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sideNav = document.querySelector('.side-nav');
        const menuOverlay = document.getElementById('menu-overlay');
        
        if (mobileMenuToggle && sideNav && menuOverlay) {
            // Функция для переключения меню
            function toggleMenu() {
                sideNav.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            }
            
            // Очищаем существующие обработчики, чтобы избежать дублирования
            mobileMenuToggle.removeEventListener('click', toggleMenu);
            menuOverlay.removeEventListener('click', toggleMenu);
            
            // Добавляем новые обработчики
            mobileMenuToggle.addEventListener('click', toggleMenu);
            menuOverlay.addEventListener('click', toggleMenu);
            
            // Закрытие меню при клике на ссылку
            const navLinks = document.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (sideNav.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            });
            
            // Закрытие меню при нажатии клавиши Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && sideNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
            
            // Устанавливаем правильное начальное состояние меню
            if (window.innerWidth > 992) {
                sideNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    }

    // Инициализируем мобильное меню при загрузке страницы
    initMobileMenu();
    
    // Также инициализируем меню при изменении размера окна
    window.addEventListener('resize', function() {
        initMobileMenu();
    });
    

    // Инициализация слайдера событий
    initEventSlider();

    // Анимация при прокрутке
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.post-card, .event-card, .section-title, .hero, .newsletter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            // Добавляем класс для анимации
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    };
    
    // Добавляем стили для анимации
    const addAnimationStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .post-card.animate-on-scroll:nth-child(2) {
                transition-delay: 0.2s;
            }
            
            .post-card.animate-on-scroll:nth-child(3) {
                transition-delay: 0.4s;
            }
            
            .event-card.animate-on-scroll:nth-child(2) {
                transition-delay: 0.2s;
            }
            
            .event-card.animate-on-scroll:nth-child(3) {
                transition-delay: 0.4s;
            }
        `;
        document.head.appendChild(style);
    };
    
    addAnimationStyles();
    animateOnScroll();

    // Форма подписки
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Здесь будет отправка данных на сервер
                // Для демонстрации просто показываем сообщение
                const formContainer = this.parentElement;
                
                // Сохраняем оригинальное содержимое
                const originalContent = formContainer.innerHTML;
                
                // Заменяем на сообщение об успехе
                formContainer.innerHTML = `
                    <div class="success-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3>Спасибо за подписку!</h3>
                        <p>Вы успешно подписались на нашу рассылку.</p>
                    </div>
                `;
                
                // Добавляем стили для сообщения
                const style = document.createElement('style');
                style.textContent = `
                    .success-message {
                        text-align: center;
                        animation: fadeIn 0.5s ease;
                    }
                    
                    .success-message svg {
                        margin: 0 auto 1rem;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
                
                // Восстанавливаем форму через 5 секунд
                setTimeout(() => {
                    formContainer.innerHTML = originalContent;
                    
                    // Повторно добавляем обработчик события
                    const newForm = formContainer.querySelector('.newsletter-form');
                    if (newForm) {
                        newForm.addEventListener('submit', arguments.callee);
                    }
                }, 5000);
            }
        });
    }

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Динамический год в футере
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }

    // Инициализация модального окна для просмотра изображений
    initImageModal();
});

/**
 * Инициализация слайдера событий
 */
function initEventSlider() {
    const slider = document.querySelector('.events-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    // Обработчик для кнопки "Предыдущий"
    prevBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: -350,
            behavior: 'smooth'
        });
    });
    
    // Обработчик для кнопки "Следующий"
    nextBtn.addEventListener('click', function() {
        slider.scrollBy({
            left: 350,
            behavior: 'smooth'
        });
    });
    
    // Обновление состояния кнопок при прокрутке
    slider.addEventListener('scroll', updateButtonStates);
    
    // Обновление состояния кнопок при изменении размера окна
    window.addEventListener('resize', updateButtonStates);
    
    // Начальное обновление состояния кнопок
    updateButtonStates();
    
    /**
     * Обновление состояния кнопок в зависимости от положения слайдера
     */
    function updateButtonStates() {
        // Проверяем, можно ли прокрутить влево
        if (slider.scrollLeft <= 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        // Проверяем, можно ли прокрутить вправо
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
}

// Делаем функцию доступной глобально
window.initEventSlider = initEventSlider;

/**
 * Инициализация модального окна для просмотра изображений
 */
function initImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    
    // Добавляем обработчики событий для всех изображений в вариациях техники
    const variationImages = document.querySelectorAll('.variation-image, .gallery-item');
    
    variationImages.forEach(imageContainer => {
        imageContainer.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
            }
        });
    });
    
    // Закрытие модального окна при клике на крестик
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие модального окна при клике вне изображения
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
    }
} 