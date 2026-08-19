const buttons = document.querySelectorAll('.info-card');
const detailPanel = document.getElementById('detail-panel');
const routeButtons = document.querySelectorAll('.route-btn');
const routeCard = document.getElementById('route-card');

// Глобальный массив для хранения всех 800+ мест
let globalPlaces = [];

// ==========================================
// 1. ТЕКСТОВЫЕ БЛОКИ (RU / UZ / EN)
// ==========================================
const detailContent = {
  places: {
    title: 'Лучшие места рядом',
    text: 'Мы показываем места, которые действительно хочется увидеть, а не просто те, что есть в каталогах.',
  },
  food: {
    title: 'Где вкусно поесть',
    text: 'Подборка уютных кафе, ресторанов и локальных точек, где хочется задержаться чуть дольше.',
  },
  evening: {
    title: 'Куда пойти вечером',
    text: 'Атмосферные места для прогулки, десерта, музыки и красивого завершения дня.',
  },
};

const routeContent = {
  day: {
    title: 'Маршрут на день',
    subtitle: 'От прогулки до вкусного обеда.',
    items: ['Утро — кофе и уютная прогулка', 'День — культурные точки и фотолокации', 'Вечер — ужин и спокойный маршрут'],
  },
  evening: {
    title: 'Маршрут на вечер',
    subtitle: 'Лёгкий, атмосферный и яркий.',
    items: ['Светлые улицы и прогулка', 'Десерт или чай', 'Тёплая атмосфера в любимом месте'],
  },
};

// Переключатели табов
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    const content = detailContent[button.dataset.target];
    if (content) {
      detailPanel.innerHTML = `<h3>${content.title}</h3><p>${content.text}</p>`;
    }
  });
});

routeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    routeButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    const content = routeContent[button.dataset.route];
    if (content) {
      routeCard.innerHTML = `
        <h3>${content.title}</h3>
        <p>${content.subtitle}</p>
        <ul>
          ${content.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }
  });
});

// Вспомогательная функция: делает из любого названия рабочий ID (slug)
function slugify(text) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Заменяет пробелы на -
    .replace(/[^\w\u0400-\u04FF\-]+/g, '') // Удаляет спецсимволы
    .replace(/\-\-+/g, '-');        // Заменяет двойные дефисы
}

// ==========================================
// 2. ЗАГРУЗКА И ОТРИСОВКА ВСЕХ 800+ МЕСТ
// ==========================================
async function loadPlaces() {
  try {
    const res = await fetch('data/places.json');
    if (!res.ok) throw new Error('Failed to load places');
    
    const rawPlaces = await res.json();
    const container = document.getElementById('places-list');
    if (!container) return;
    
    // Проходимся по всей базе: если ID нет, создаем его автоматически из имени
    globalPlaces = rawPlaces.map((p, index) => {
      const placeId = p.id || (p.name ? slugify(p.name) : `place-${index}`);
      return { ...p, unique_id: placeId };
    });

    // Отрисовываем абсолютно все карточки
    container.innerHTML = globalPlaces.map(p => {
      // Если у места есть map_url, делаем заголовок ссылкой на карты
      const nameHtml = p.map_url 
        ? `<a href="${p.map_url}" target="_blank" style="color: inherit; text-decoration: underline;">📍 ${p.name}</a>`
        : p.name;

      const type = p.type ? p.type.toUpperCase() : 'МЕСТО';
      const price = p.price_level ? ` · ${p.price_level}` : '';
      const rating = p.rating ? ` · ⭐ ${p.rating}` : '';

      return `
        <article class="place-card" id="card-${p.unique_id}">
           <h4>${nameHtml}</h4>
           <p class="muted">${type}${price}${rating}</p>
           <p>${p.description || ''}</p>
           <p class="address">${p.address || ''}</p>
           
           <button class="share-btn" onclick="sharePlace('${p.unique_id}')">🔗 Поделиться</button>
        </article>
      `;
    }).join('');

    // Проверяем, перешел ли кто-то по ссылке вида ?place=ИМЯ
    checkUrlForPlace();

  } catch (e) {
    console.error('Error loading places', e);
  }
}

// ==========================================
// 3. ФУНКЦИЯ КОПИРОВАНИЯ ССЫЛКИ НА ТВОЙ САЙТ
// ==========================================
function sharePlace(placeId) {
  const shareUrl = `${window.location.origin}${window.location.pathname}?place=${encodeURIComponent(placeId)}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    alert(`Ссылка на место скопирована!\n\n${shareUrl}`);
  }).catch(err => {
    console.error('Ошибка копирования:', err);
  });
}

// ==========================================
// 4. ПОИСК МЕСТА ПО ССЫЛКЕ И АВТО-СКРОЛЛ
// ==========================================
function checkUrlForPlace() {
  const urlParams = new URLSearchParams(window.location.search);
  const placeId = urlParams.get('place');

  if (placeId) {
    const targetPlace = globalPlaces.find(p => p.unique_id === placeId);
    
    if (targetPlace) {
      setTimeout(() => {
        const cardElement = document.getElementById(`card-${targetPlace.unique_id}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cardElement.style.transition = 'all 0.5s ease';
          cardElement.style.outline = '2px solid #007bff';
          cardElement.style.boxShadow = '0 0 15px rgba(0, 123, 255, 0.5)';
        }
      }, 400);
    }
  }
}

// ==========================================
// 5. АВТО-КУРС ВАЛЮТ (USD и EUR от ЦБ РУз)
// ==========================================
window.currentRates = { USD: 12800, EUR: 13900 };

async function fetchRates() {
  try {
    const response = await fetch('https://cbu.uz/ru/arkhiv-kursov-valyut/json/');
    const data = await response.json();

    const usdData = data.find(item => item.Ccy === 'USD');
    const eurData = data.find(item => item.Ccy === 'EUR');

    if (usdData) window.currentRates.USD = parseFloat(usdData.Rate);
    if (eurData) window.currentRates.EUR = parseFloat(eurData.Rate);

    const usdElem = document.getElementById('usd-rate-val');
    const eurElem = document.getElementById('eur-rate-val');

    if (usdElem) usdElem.textContent = `${window.currentRates.USD.toLocaleString()} UZS`;
    if (eurElem) eurElem.textContent = `${window.currentRates.EUR.toLocaleString()} UZS`;
  } catch (error) {
    console.error('Ошибка получения курса:', error);
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  loadPlaces();
  fetchRates();
});