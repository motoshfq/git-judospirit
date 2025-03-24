document.addEventListener('DOMContentLoaded', function() {
    // Получаем все табы (и десктопные, и мобильные)
    const terminologyTabs = document.querySelectorAll('.terminology-tab');
    const terminologyCategories = document.querySelectorAll('.terminology-category');
    
    // Функция для синхронизации активных табов между десктопом и мобильным
    function syncActiveTabs(category) {
        // Убираем active со всех табов
        terminologyTabs.forEach(tab => {
            if (tab.getAttribute('data-category') === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    // Функция для адаптации табов в сетке на мобильных устройствах
    function adjustTabGrid() {
        if (window.innerWidth <= 768) {
            const mobileTabsContainer = document.querySelector('.mobile-tabs');
            if (!mobileTabsContainer) return;
            
            const mobileTabs = mobileTabsContainer.querySelectorAll('.terminology-tab');
            const containerWidth = mobileTabsContainer.offsetWidth;
            
            // Для мобильных устройств устанавливаем сетку из 3 элементов в ряду
            const tabWidth = Math.floor((containerWidth / 3) - 4);
            
            mobileTabs.forEach(tab => {
                if (window.innerWidth <= 380) {
                    tab.style.width = `${tabWidth}px`;
                } else {
                    tab.style.width = `${tabWidth}px`;
                }
            });
        }
    }
    
    // Вызываем функцию при загрузке страницы
    adjustTabGrid();
    
    // И при изменении размера окна
    window.addEventListener('resize', adjustTabGrid);
    
    // Добавляем обработчики событий для каждой вкладки
    terminologyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Получаем категорию, которую нужно отобразить
            const categoryToShow = this.getAttribute('data-category');
            
            // Синхронизируем активные табы между десктопом и мобильной версией
            syncActiveTabs(categoryToShow);
            
            // Убираем класс active со всех категорий
            terminologyCategories.forEach(category => category.classList.remove('active'));
            
            // Находим соответствующий контейнер и показываем его
            const activeCategory = document.getElementById(`${categoryToShow}-terms`);
            if (activeCategory) {
                activeCategory.classList.add('active');
            }
            
            // Прокручиваем до начала секции с контентом, если мы не в верхней части
            const contentTop = document.querySelector('.terminology-content').getBoundingClientRect().top;
            if (contentTop < 80) { // учитываем возможный фиксированный хедер
                const offset = 60; // отступ сверху
                const y = window.scrollY + contentTop - offset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    });
    
    // Добавляем обработчик для закрытия анимации на мобильных устройствах (для экономии ресурсов)
    let isMobile = window.innerWidth <= 768;
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if ((window.innerWidth <= 768) !== isMobile) {
                isMobile = window.innerWidth <= 768;
                // Обновляем состояние для мобильных устройств
                updateMobileState();
            }
        }, 250);
    });
    
    function updateMobileState() {
        if (isMobile) {
            // Удаляем сложную анимацию на мобильных устройствах для производительности
            document.querySelectorAll('.term-card').forEach(card => {
                card.style.transitionDelay = '0ms';
                card.classList.add('visible');
            });
        }
    }
    
    // Анимация для карточек терминов только на десктопе
    const termCards = document.querySelectorAll('.term-card');
    
    if (!isMobile) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        termCards.forEach((card, index) => {
            // Добавляем небольшую задержку для каждой карточки для эффекта каскада
            card.style.transitionDelay = `${index * 40}ms`;
            observer.observe(card);
        });
    } else {
        // На мобильных устройствах показываем все карточки сразу без задержки
        termCards.forEach(card => {
            card.style.transitionDelay = '0ms';
            card.classList.add('visible');
        });
    }
    
    // Добавляем класс для CSS анимации
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .term-card {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .term-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (max-width: 768px) {
                .term-card {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .terminology-tabs {
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }
                
                .mobile-tabs .terminology-tab {
                    border-radius: 4px !important;
                    margin: 2px !important;
                }
            }
        </style>
    `);
}); 