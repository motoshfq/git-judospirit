document.addEventListener('DOMContentLoaded', function() {
    // Находим все элементы галереи и модальное окно
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalCaption = document.querySelector('.modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentIndex = 0;
    
    // Функция для открытия модального окна с указанным индексом
    function openModal(index) {
        const item = galleryItems[index];
        const image = item.querySelector('.gallery-image');
        const title = item.getAttribute('data-title');
        
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = title;
        
        galleryModal.classList.add('open');
        currentIndex = index;
        
        // Предотвращаем прокрутку страницы при открытом модальном окне
        document.body.style.overflow = 'hidden';
    }
    
    // Функция для закрытия модального окна
    function closeModal() {
        galleryModal.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    // Функция для перехода к предыдущему изображению
    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModal();
    }
    
    // Функция для перехода к следующему изображению
    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateModal();
    }
    
    // Функция для обновления содержимого модального окна
    function updateModal() {
        const item = galleryItems[currentIndex];
        const image = item.querySelector('.gallery-image');
        const title = item.getAttribute('data-title');
        
        // Анимация смены изображения
        modalImage.style.opacity = '0';
        modalCaption.style.opacity = '0';
        
        setTimeout(() => {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modalCaption.textContent = title;
            
            modalImage.style.opacity = '1';
            modalCaption.style.opacity = '1';
        }, 300);
    }
    
    // Добавляем обработчики событий для открытия модального окна
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openModal(index);
        });
        
        // Анимация при появлении элементов галереи
        if (IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });
            
            observer.observe(item);
        } else {
            item.classList.add('visible');
        }
    });
    
    // Обработчики для кнопок модального окна
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', prevImage);
    modalNext.addEventListener('click', nextImage);
    
    // Закрытие по клику вне изображения
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeModal();
        }
    });
    
    // Обработчики для клавиатуры
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('open')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Добавляем CSS анимации
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .gallery-item {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .gallery-item.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .modal-image {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            
            .modal-caption {
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            
            @media (prefers-reduced-motion: reduce) {
                .gallery-item, .modal-image, .modal-caption {
                    transition: none;
                }
            }
        </style>
    `);
}); 