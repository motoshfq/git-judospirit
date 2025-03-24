// Функционал галереи изображений
document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalCaption = document.querySelector('.modal-caption');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    let currentIndex = 0;
    let startX, startY, initialTouchDistance;
    let isScrollLocked = false;
    
    // Функция для открытия модального окна
    function openModal(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title');
        
        currentIndex = index;
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalCaption.textContent = title ? title.textContent : '';
        
        modal.classList.add('active');
        lockScroll();
        
        // Обновление кнопок навигации
        updateNavigationButtons();
    }
    
    // Функция для закрытия модального окна
    function closeModal() {
        modal.classList.remove('active');
        unlockScroll();
    }
    
    // Функция для навигации к предыдущему изображению
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModalContent();
    }
    
    // Функция для навигации к следующему изображению
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateModalContent();
    }
    
    // Обновление содержимого модального окна
    function updateModalContent() {
        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title');
        
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalCaption.textContent = title ? title.textContent : '';
        
        updateNavigationButtons();
    }
    
    // Обновление кнопок навигации
    function updateNavigationButtons() {
        prevBtn.style.display = galleryItems.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = galleryItems.length > 1 ? 'flex' : 'none';
    }
    
    // Блокировка прокрутки страницы
    function lockScroll() {
        if (isScrollLocked) return;
        
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        isScrollLocked = true;
    }
    
    // Разблокировка прокрутки страницы
    function unlockScroll() {
        if (!isScrollLocked) return;
        
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
        isScrollLocked = false;
    }
    
    // Обработчики событий для элементов галереи
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });
    
    // Обработчики событий для модального окна
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Закрытие модального окна при клике вне изображения
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Обработка клавиш клавиатуры
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Обработка событий касания для свайпов
    modalImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        // Если больше одного касания, сохраняем начальное расстояние для масштабирования
        if (e.touches.length === 2) {
            initialTouchDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });
    
    modalImage.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        // Предотвращаем прокрутку страницы при свайпе
        e.preventDefault();
    }, { passive: false });
    
    modalImage.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = endX - startX;
        const diffY = endY - startY;
        
        // Если вертикальное движение больше горизонтального, игнорируем
        if (Math.abs(diffY) > Math.abs(diffX)) {
            startX = null;
            startY = null;
            return;
        }
        
        // Минимальное расстояние для определения свайпа
        const threshold = 50;
        
        if (diffX > threshold) {
            prevImage(); // Свайп вправо - предыдущее изображение
        } else if (diffX < -threshold) {
            nextImage(); // Свайп влево - следующее изображение
        }
        
        startX = null;
        startY = null;
    });
    
    // Предотвращение масштабирования страницы при двойном тапе на мобильных
    modal.addEventListener('dblclick', (e) => {
        e.preventDefault();
    });
    
    // Инициализация при загрузке страницы
    updateNavigationButtons();
}); 