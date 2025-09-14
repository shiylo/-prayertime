document.addEventListener('DOMContentLoaded', function() {
            const getTimesBtn = document.getElementById('get-times');
            const citySelect = document.getElementById('city-select');
            const methodSelect = document.getElementById('method-select');
            const prayerTimesContainer = document.getElementById('prayer-times-container');
            
            // Обработчик нажатия кнопки
            getTimesBtn.addEventListener('click', function() {
                const city = citySelect.value;
                const method = methodSelect.value;
                
                // Показываем сообщение о загрузке
                prayerTimesContainer.innerHTML = '<div class="loading">Загрузка данных...</div>';
                
                // Получаем данные о времени намазов
                getPrayerTimes(city, method);
            });
            
            // Функция для получения времени намазов из API
            function getPrayerTimes(city, method) {
                // Формируем URL для запроса
                const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Russia&method=${method}`;
                
                // Используем fetch API для получения данных
                fetch(url)
                    .then(response => {
                        // Проверяем, что ответ успешный
                        if (!response.ok) {
                            throw new Error('Ошибка сети');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Извлекаем нужные данные из ответа
                        const timings = data.data.timings;
                        const date = data.data.date.gregorian.date;
                        
                        // Обновляем интерфейс
                        updatePrayerTimes(timings, city, date);
                    })
                    .catch(error => {
                        // Обрабатываем ошибки
                        prayerTimesContainer.innerHTML = `
                            <div class="loading">
                                Ошибка при получении данных: ${error.message}<br>
                                Попробуйте еще раз или проверьте подключение к интернету.
                            </div>
                        `;
                    });
            }
            
            // Функция для обновления отображения времени намазов
            function updatePrayerTimes(timings, city, date) {
                // Определяем порядок и русские названия намазов
                const prayers = [
                    { key: 'Fajr', name: 'Фаджр' },
                    { key: 'Sunrise', name: 'Восход' },
                    { key: 'Dhuhr', name: 'Зухр' },
                    { key: 'Asr', name: 'Аср' },
                    { key: 'Maghrib', name: 'Магриб' },
                    { key: 'Isha', name: 'Иша' }
                ];
                
                // Формируем HTML для отображения
                let html = `
                    <h2 style="text-align: center; margin-bottom: 20px; color: var(--primary-color);">
                        Время намазов для ${city} на ${date}
                    </h2>
                    <div class="prayer-times">
                `;
                
                // Добавляем карточки для каждого намаза
                prayers.forEach(prayer => {
                    html += `
                        <div class="prayer-card">
                            <div class="prayer-name">${prayer.name}</div>
                            <div class="prayer-time">${timings[prayer.key]}</div>
                        </div>
                    `;
                });
                
                html += `</div>`;
                
                // Обновляем контейнер
                prayerTimesContainer.innerHTML = html;
            }
        });