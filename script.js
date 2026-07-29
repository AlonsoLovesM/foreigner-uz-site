const buttons = document.querySelectorAll('.info-card');
const detailPanel = document.getElementById('detail-panel');
const routeButtons = document.querySelectorAll('.route-btn');
const routeCard = document.getElementById('route-card');

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

// ==========================================
// 2. ЗАГРУЗКА МЕСТ (с поддержкой Google Maps)
// ==========================================
async function loadPlaces() {
  try {
    const res = await fetch('data/places.json');
    if (!res.ok) throw new Error('Failed to load places');
    const places = await res.json();
    const container = document.getElementById('places-list');
    if (!container) return;
    
    container.innerHTML = places.map(p => {
      // Если у места есть map_url, делаем название кликабельным
      const nameHtml = p.map_url 
        ? `<a href="${p.map_url}" target="_blank" style="color: inherit; text-decoration: underline;">📍 ${p.name}</a>`
        : p.name;

      return `
        <article class="place-card">
           <h4>${nameHtml}</h4>
           <p class="muted">${p.type.toUpperCase()} · ${p.price_level} · ⭐ ${p.rating}</p>
           <p>${p.description}</p>
           <p class="address">${p.address}</p>
        </article>
      `;
    }).join('');
  } catch (e) {
    console.error('Error loading places', e);
  }
}

// ==========================================
// 3. АВТО-КУРС ВАЛЮТ (USD и EUR от ЦБ РУз)
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

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadPlaces();
  fetchRates();
});