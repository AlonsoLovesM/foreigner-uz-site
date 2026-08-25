const buttons = document.querySelectorAll('.info-card');
const detailPanel = document.getElementById('detail-panel');
const routeButtons = document.querySelectorAll('.route-btn');
const routeCard = document.getElementById('route-card');

// Глобальный массив для хранения всех мест
let globalPlaces = [];

// ==========================================
// 1. ДАННЫЕ ВСЕХ МЕСТ (НОВЫЕ КАТЕГОРИИ ДОБАВЛЕНЫ)
// ==========================================
const placesData = [
  // ===== СПА-САЛОНЫ =====
  {
    id: 'spa-1',
    name: 'Asia Spa & Hammam',
    type: 'СПА-салон',
    price_level: '$$$',
    rating: 4.9,
    description: 'Традиционный восточный хаммам с массажем и уходом за телом.',
    address: 'ул. Амира Темура, 45, Ташкент',
    hours: '10:00-23:00',
    map_url: 'https://yandex.ru/maps/?text=Asia+Spa+Ташкент'
  },
  {
    id: 'spa-2',
    name: 'Tashkent Palace Spa',
    type: 'СПА-салон',
    price_level: '$$$',
    rating: 4.7,
    description: 'Премиум-спа с бассейном, сауной и процедурами на любой вкус.',
    address: 'ул. Шота Руставели, 12, Ташкент',
    hours: '09:00-22:00',
    map_url: 'https://yandex.ru/maps/?text=Tashkent+Palace+Spa'
  },
  {
    id: 'spa-3',
    name: 'Oriental Relax Spa',
    type: 'СПА-салон',
    price_level: '$$',
    rating: 4.5,
    description: 'Уютный спа-салон с тайским массажем и ароматерапией.',
    address: 'ул. Мукимий, 78, Ташкент',
    hours: '10:00-21:00',
    map_url: 'https://yandex.ru/maps/?text=Oriental+Relax+Spa+Ташкент'
  },

  // ===== ТРЕНАЖЕРНЫЕ ЗАЛЫ =====
  {
    id: 'gym-1',
    name: 'IronFit Gym',
    type: 'Тренажерный зал',
    price_level: '$$',
    rating: 4.8,
    description: 'Круглосуточный зал с новейшим оборудованием и зоной кроссфита.',
    address: 'ул. Буюк Турон, 23, Ташкент',
    hours: '00:00-24:00',
    map_url: 'https://yandex.ru/maps/?text=IronFit+Gym+Ташкент'
  },
  {
    id: 'gym-2',
    name: 'BodyLab Fitness',
    type: 'Тренажерный зал',
    price_level: '$$$',
    rating: 4.9,
    description: 'Элитный фитнес-клуб с бассейном, сауной и групповыми тренировками.',
    address: 'ул. Тараса Шевченко, 56, Ташкент',
    hours: '06:00-23:00',
    map_url: 'https://yandex.ru/maps/?text=BodyLab+Fitness+Ташкент'
  },
  {
    id: 'gym-3',
    name: 'Street Workout Park',
    type: 'Тренажерный зал',
    price_level: '$',
    rating: 4.3,
    description: 'Открытая площадка с турниками и брусьями для воркаута.',
    address: 'парк им. Алишера Навои, Ташкент',
    hours: '06:00-22:00',
    map_url: 'https://yandex.ru/maps/?text=Street+Workout+Park+Ташкент'
  },

  // ===== ТОРГОВО-РАЗВЛЕКАТЕЛЬНЫЕ ЦЕНТРЫ =====
  {
    id: 'mall-1',
    name: 'Next Mall',
    type: 'ТРЦ',
    price_level: '$$$',
    rating: 4.7,
    description: 'Современный ТРЦ с магазинами, кинотеатром и фуд-кортом.',
    address: 'ул. Шахрисабзская, 5, Ташкент',
    hours: '10:00-22:00',
    map_url: 'https://yandex.ru/maps/?text=Next+Mall+Ташкент'
  },
  {
    id: 'mall-2',
    name: 'Samarkand Darvoza',
    type: 'ТРЦ',
    price_level: '$$',
    rating: 4.5,
    description: 'ТРЦ с восточным колоритом, бутиками и детским развлекательным центром.',
    address: 'ул. Самарканд дарвоза, 1, Ташкент',
    hours: '10:00-21:00',
    map_url: 'https://yandex.ru/maps/?text=Samarkand+Darvoza+Ташкент'
  },
  {
    id: 'mall-3',
    name: 'Mega Planet',
    type: 'ТРЦ',
    price_level: '$$$',
    rating: 4.8,
    description: 'Крупнейший ТРЦ с ледовым катком, боулингом и зоной аттракционов.',
    address: 'ул. Авиаторов, 12, Ташкент',
    hours: '10:00-23:00',
    map_url: 'https://yandex.ru/maps/?text=Mega+Planet+Ташкент'
  },

  // ===== ЧАСТНЫЕ ШКОЛЫ =====
  {
    id: 'school-1',
    name: 'International School of Tashkent',
    type: 'Частная школа',
    price_level: '$$$$',
    rating: 4.9,
    description: 'Англоязычная школа с международным бакалавриатом (IB).',
    address: 'ул. Тинчлик, 34, Ташкент',
    hours: '08:00-17:00',
    map_url: 'https://yandex.ru/maps/?text=International+School+of+Tashkent'
  },
  {
    id: 'school-2',
    name: 'EduSchool Uzbekistan',
    type: 'Частная школа',
    price_level: '$$$',
    rating: 4.6,
    description: 'Частная школа с углублённым изучением английского и IT.',
    address: 'ул. Фараби, 2, Ташкент',
    hours: '08:30-18:00',
    map_url: 'https://yandex.ru/maps/?text=EduSchool+Uzbekistan+Ташкент'
  },
  {
    id: 'school-3',
    name: 'Alpha School',
    type: 'Частная школа',
    price_level: '$$$',
    rating: 4.4,
    description: 'Школа с фокусом на математику и естественные науки.',
    address: 'ул. Катта Лаккун, 17, Ташкент',
    hours: '08:00-17:30',
    map_url: 'https://yandex.ru/maps/?text=Alpha+School+Ташкент'
  },

  // ===== УНИВЕРСИТЕТЫ =====
  {
    id: 'uni-1',
    name: 'Westminster International University',
    type: 'Университет',
    price_level: '$$$$',
    rating: 4.8,
    description: 'Британский университет в Ташкенте, бакалавриат и магистратура.',
    address: 'ул. Истикбол, 12, Ташкент',
    hours: '08:30-18:00',
    map_url: 'https://yandex.ru/maps/?text=Westminster+International+University+Ташкент'
  },
  {
    id: 'uni-2',
    name: 'Tashkent State University of Economics',
    type: 'Университет',
    price_level: '$',
    rating: 4.2,
    description: 'Государственный экономический университет, один из лучших в Узбекистане.',
    address: 'ул. Ислама Каримова, 49, Ташкент',
    hours: '08:00-17:00',
    map_url: 'https://yandex.ru/maps/?text=Tashkent+State+University+of+Economics'
  },
  {
    id: 'uni-3',
    name: 'Inha University in Tashkent',
    type: 'Университет',
    price_level: '$$$$',
    rating: 4.7,
    description: 'Технический университет с программами на английском языке.',
    address: 'ул. Амира Темура, 24, Ташкент',
    hours: '08:30-18:00',
    map_url: 'https://yandex.ru/maps/?text=Inha+University+in+Tashkent'
  }
];

// ==========================================
// 2. ТЕКСТОВЫЕ БЛОКИ (RU / UZ / EN)
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
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Вспомогательная функция: проверяет, открыто ли заведение прямо сейчас
function isOpenNow(hoursString) {
  if (!hoursString) return true;
  if (hoursString === "00:00-24:00") return true;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [start, end] = hoursString.split('-');
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
    if (currentMinutes < startMinutes) {
      return (currentMinutes + 24 * 60) <= endMinutes;
    }
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

// ==========================================
// 3. ЗАГРУЗКА И ОТРИСОВКА ВСЕХ МЕСТ (ИЗ КОДА)
// ==========================================
function loadPlaces() {
  const container = document.getElementById('places-list');
  if (!container) return;

  // Используем данные из кода (placesData)
  globalPlaces = placesData.map((p, index) => {
    const placeId = p.id || (p.name ? slugify(p.name) : `place-${index}`);
    const mapUrl = p.map_url || `https://yandex.ru/maps/?text=${encodeURIComponent(p.maps_query || p.name)}`;
    return { ...p, unique_id: placeId, map_url: mapUrl };
  });

  container.innerHTML = globalPlaces.map(p => {
    const nameHtml = `<a href="${p.map_url}" target="_blank" style="color: inherit; text-decoration: underline;">📍 ${p.name}</a>`;
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

  checkUrlForPlace();
}

// ==========================================
// 4. ФУНКЦИЯ КОПИРОВАНИЯ ССЫЛКИ
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
// 5. ПОИСК МЕСТА ПО ССЫЛКЕ И АВТО-СКРОЛЛ
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
// 6. ИНИЦИАЛИЗАЦИЯ РУЛЕТКИ И ФИЛЬТРА
// ==========================================
function initExtraFeatures() {
  const openCheckbox = document.getElementById('open-now-checkbox');
  if (openCheckbox) {
    openCheckbox.addEventListener('change', () => {
      const cards = document.querySelectorAll('.place-card');
      cards.forEach(card => {
        const placeId = card.id.replace('card-', '');
        const place = globalPlaces.find(p => p.unique_id === placeId);
        if (openCheckbox.checked) {
          card.style.display = (place && !isOpenNow(place.hours)) ? 'none' : 'block';
        } else {
          card.style.display = 'block';
        }
      });
    });
  }

  const randomBtn = document.getElementById('random-place-btn');
  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      if (!globalPlaces || globalPlaces.length === 0) return;
      const randomIndex = Math.floor(Math.random() * globalPlaces.length);
      const randomPlace = globalPlaces[randomIndex];
      const cardElement = document.getElementById(`card-${randomPlace.unique_id}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardElement.style.transition = 'all 0.3s ease';
        cardElement.style.transform = 'scale(1.03)';
        cardElement.style.outline = '3px solid #ff9900';
        setTimeout(() => {
          cardElement.style.transform = 'scale(1)';
          cardElement.style.outline = 'none';
        }, 1200);
      }
    });
  }
}

// ==========================================
// 7. АВТО-КУРС ВАЛЮТ (USD и EUR от ЦБ РУз)
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

// ==========================================
// 8. ЗАПУСК
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadPlaces();
  fetchRates();
  initExtraFeatures();
});