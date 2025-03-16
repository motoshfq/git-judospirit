document.addEventListener('DOMContentLoaded', function() {
    // Инициализация табов галереи
    initTabs('gallery-tab', 'gallery-content');
    
    // Инициализация табов видео
    initTabs('video-tab', 'video-content');
    
    // Функция для инициализации табов
    function initTabs(tabClass, contentClass) {
        const tabs = document.querySelectorAll('.' + tabClass);
        const contents = document.querySelectorAll('.' + contentClass);
        
        // Установка первого таба как активного по умолчанию
        if (tabs.length > 0 && contents.length > 0) {
            tabs[0].classList.add('active');
            contents[0].classList.add('active');
        }
        
        // Добавление обработчиков событий для табов
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Удаление активного класса со всех табов
                tabs.forEach(t => t.classList.remove('active'));
                
                // Добавление активного класса текущему табу
                this.classList.add('active');
                
                // Получение ID контента, связанного с табом
                const targetId = this.getAttribute('data-target');
                
                // Скрытие всех контентов
                contents.forEach(content => content.classList.remove('active'));
                
                // Отображение целевого контента
                document.getElementById(targetId).classList.add('active');
            });
        });
    }
    
    // Обработка модальных окон для изображений галереи
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close');
    
    if (galleryItems.length > 0 && modal && modalImg && closeBtn) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                modal.style.display = 'block';
                modalImg.src = this.src;
            });
        });
        
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
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
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Анимация появления элементов при прокрутке
    const animatedElements = document.querySelectorAll('.info-card, .gallery-item, blockquote, .social-button');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    }
    
    // Добавление класса для CSS анимации
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Проверка при загрузке и прокрутке
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Проверка при загрузке страницы
}); 