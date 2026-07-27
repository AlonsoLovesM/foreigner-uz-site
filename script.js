const buttons = document.querySelectorAll('.info-card');
const detailPanel = document.getElementById('detail-panel');
const routeButtons = document.querySelectorAll('.route-btn');
const routeCard = document.getElementById('route-card');

const detailContent = {
  places: {
    title: 'Лучшие места рядом',
    text: 'Мы показываем места, которые действительно хочется увидеть, а не просто те, что просто есть в каталогах.',
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

// Load places (hotels, restaurants, cafes) from JSON and render
async function loadPlaces() {
  try {
    const res = await fetch('data/places.json');
    if (!res.ok) throw new Error('Failed to load places');
    const places = await res.json();
    const container = document.getElementById('places-list');
    if (!container) return;
    container.innerHTML = places.map(p => (
      `<article class="place-card">
         <h4>${p.name}</h4>
         <p class="muted">${p.type.toUpperCase()} · ${p.price_level} · ⭐ ${p.rating}</p>
         <p>${p.description}</p>
         <p class="address">${p.address}</p>
       </article>`
    )).join('');
  } catch (e) {
    console.error('Error loading places', e);
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  loadPlaces();
});
