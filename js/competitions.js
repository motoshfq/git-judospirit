document.addEventListener('DOMContentLoaded', function() {
    // Находим все карточки соревнований
    const competitionCards = document.querySelectorAll('.competition-card');
    
    // Добавляем анимацию появления при скролле
    if (IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, Array.from(competitionCards).indexOf(entry.target) * 150); // Задержка для каждой следующей карточки
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        competitionCards.forEach((card) => {
            observer.observe(card);
        });
    } else {
        // Для браузеров без поддержки IntersectionObserver
        competitionCards.forEach((card) => {
            card.classList.add('visible');
        });
    }
    
    // Добавляем обработчики событий для эффектов при наведении и клике
    competitionCards.forEach((card) => {
        // Эффект блеска при наведении
        card.addEventListener('mouseenter', function() {
            this.querySelector('.competition-badge').style.transform = 'rotate(360deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.competition-badge').style.transform = 'rotate(0deg)';
        });
        
        // Делаем карточки кликабельными - можно использовать для будущего функционала
        card.addEventListener('click', function() {
            // Здесь можно добавить логику для открытия модального окна с детальной информацией
            // или перенаправления на страницу с информацией о конкретном турнире
            
            // Пример: анимация "пульса" при клике
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
        });
    });
    
    // Добавляем стили для анимаций
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .competition-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease, border-color 0.3s ease;
            }
            
            .competition-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .competition-badge {
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s ease;
            }
            
            .competition-card.pulse {
                animation: pulse 0.5s ease;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.03); }
                100% { transform: scale(1); }
            }
            
            @media (prefers-reduced-motion: reduce) {
                .competition-card, .competition-badge {
                    transition: none;
                    animation: none;
                }
            }
        </style>
    `);
}); 