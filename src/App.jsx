import { useMemo, useState } from 'react';
import placesData from '../data/places.json';

const highlightCards = [
  {
    id: 'places',
    title: 'Лучшие места рядом',
    description: 'Исторические улицы, красивые локации и скрытые точки, которые хочется увидеть вживую.',
    accent: 'Погулять',
  },
  {
    id: 'food',
    title: 'Где вкусно поесть',
    description: 'Уютные кафе, местная кухня и рестораны с атмосферой для настоящего отдыха.',
    accent: 'Поесть',
  },
  {
    id: 'evening',
    title: 'Куда пойти вечером',
    description: 'Подборка мест для яркого вечера: прогулка, десерт, музыка и живое настроение.',
    accent: 'Вечером',
  },
];

const citySpots = [
  {
    title: 'Старый город',
    tag: 'История',
    text: 'Тёплая атмосфера, узкие улицы, красивые виды и ощущение настоящего путешествия.',
  },
  {
    title: 'Кофейня в сердце района',
    tag: 'Еда',
    text: 'Идеально для перерыва, десерта и хорошего начала дня.',
  },
  {
    title: 'Ночной обзорный маршрут',
    tag: 'Вечер',
    text: 'Город в свете, красивый маршрут и настроение, которое хочется сохранить.',
  },
];

const routes = [
  {
    id: 'day',
    title: 'Маршрут на день',
    subtitle: 'От прогулки до вкусного обеда',
    items: ['Утро — кофе и уютная прогулка', 'День — культурные точки и фотолокации', 'Вечер — ужин и спокойный маршрут'],
  },
  {
    id: 'evening',
    title: 'Маршрут на вечер',
    subtitle: 'Лёгкий, атмосферный и яркий',
    items: ['Светлые улицы и прогулка', 'Десерт или чай', 'Тёплая атмосфера в любимом месте'],
  },
];

export default function App() {
  const [activeCard, setActiveCard] = useState(highlightCards[0].id);
  const [activeRoute, setActiveRoute] = useState(routes[0].id);

  const selectedCard = useMemo(
    () => highlightCards.find((card) => card.id === activeCard),
    [activeCard],
  );

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === activeRoute),
    [activeRoute],
  );

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <nav className="nav container">
          <a href="#top" className="brand">Foreigner.uz</a>
          <div className="nav-links">
            <a href="#about">О продукте</a>
            <a href="#routes">Маршруты</a>
            <a href="#download">Скачать</a>
          </div>
        </nav>

        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow">Умный гид для туристов в Узбекистане</p>
            <h1>Не просто места. А готовый день, который хочется пережить.</h1>
            <p className="lead">
              Foreigner.uz показывает туристу лучшие маршруты, интересные локации и уютные места для еды — чтобы каждый день был простым и ярким.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn btn-primary">Начать</a>
              <a href="mailto:acapelonso@gmail.com" className="btn btn-secondary">Связаться на почту</a>
              <a href="https://t.me/foreigneruz_bot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Telegram @foreigneruz_bot</a>
            </div>
          </div>

          <div className="hero-panel">
            <h3>Сегодня для тебя</h3>
            <p>Готовые варианты для прогулки, обеда и вечера — всё в одном месте.</p>
            <div className="hero-list">
              <div>Быстрый выбор без лишних действий</div>
              <div>Рекомендации под настроение</div>
              <div>Маршруты на день и вечер</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section container">
          <div className="section-title">
            <p className="eyebrow">Что даёт сервис</p>
            <h2>Туристу нужен не просто список мест — ему нужен хороший опыт.</h2>
          </div>

          <div className="card-grid">
            {highlightCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className={`info-card ${activeCard === card.id ? 'active' : ''}`}
                onClick={() => setActiveCard(card.id)}
              >
                <span className="tag">{card.accent}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </button>
            ))}
          </div>

          <div className="detail-panel">
            <h3>{selectedCard.title}</h3>
            <p>{selectedCard.description}</p>
          </div>
        </section>

        <section className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">Места</p>
            <h2>Отели, рестораны и кофейни — всё в одном месте.</h2>
          </div>

          <div className="places-grid">
            {placesData.map((place) => (
              <article key={place.id} className="place-card">
                <span className="tag">{place.type}</span>
                <h4>{place.name}</h4>
                <p className="muted">{place.price_level} · ⭐ {place.rating}</p>
                <p>{place.description}</p>
                <p className="address">{place.address}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section container">
          <div className="section-title">
            <p className="eyebrow">Рекомендации</p>
            <h2>Надёжные предложения, которые хочется попробовать прямо сейчас.</h2>
          </div>

          <div className="spot-grid">
            {citySpots.map((spot) => (
              <article key={spot.title} className="spot-card">
                <span className="tag">{spot.tag}</span>
                <h3>{spot.title}</h3>
                <p>{spot.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="routes" className="section container">
          <div className="section-title">
            <p className="eyebrow">Маршруты</p>
            <h2>Готовые варианты для дня и вечера.</h2>
          </div>

          <div className="route-buttons">
            {routes.map((route) => (
              <button
                key={route.id}
                type="button"
                className={`route-btn ${activeRoute === route.id ? 'active' : ''}`}
                onClick={() => setActiveRoute(route.id)}
              >
                {route.title}
              </button>
            ))}
          </div>

          <div className="route-card">
            <h3>{selectedRoute.title}</h3>
            <p>{selectedRoute.subtitle}</p>
            <ul>
              {selectedRoute.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="download" className="section section-alt container cta-block">
          <div>
            <p className="eyebrow">Скоро в вашем телефоне</p>
            <h2>Откройте приложение и получите маршрут, который делает поездку проще и ярче.</h2>
            <p>Мы создаём продукт для тех, кто хочет увидеть больше, не тратя время на хаотичный поиск.</p>
          </div>
          <div className="download-actions">
            <a href="mailto:acapelonso@gmail.com" className="btn btn-primary">Написать на почту</a>
            <a href="https://t.me/foreigneruz_bot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Telegram @foreigneruz_bot</a>
          </div>
        </section>
      </main>
    </div>
  );
}
