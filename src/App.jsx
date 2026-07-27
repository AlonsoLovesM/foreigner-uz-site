import { useMemo, useState } from 'react';

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

  const selectedCard = useMemo(() => highlightCards.find((card) => card.id === activeCard), [activeCard]);
  const selectedRoute = useMemo(() => routes.find((route) => route.id === activeRoute), [activeRoute]);

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="nav">
          <div className="brand">Foreigner.uz</div>
          <div className="nav-links">
            <a href="#about">О продукте</a>
            <a href="#routes">Маршруты</a>
            <a href="#download">Скачать</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Умный гид для туристов в Узбекистане</p>
            <h1>Не просто места. А правильный день, который хочется пережить.</h1>
            <p className="lead">
              Foreigner.uz помогает туристу быстро понять, где погулять, где вкусно поесть и куда пойти вечером — без хаоса и бессмысленных поисков.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn btn-primary">Открыть приложение</a>
              <a href="#routes" className="btn btn-secondary">Смотреть маршруты</a>
            </div>
          </div>

          <div className="hero-panel">
            <h3>Сегодня для тебя</h3>
            <p>Лучшие места рядом, рекомендации по настроению и готовые маршруты на день и вечер.</p>
            <ul>
              <li>Быстрый выбор без лишних действий</li>
              <li>Рекомендации под настроение</li>
              <li>Маршруты на день и вечер</li>
            </ul>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section">
          <div className="section-title">
            <p className="eyebrow">Почему это важно</p>
            <h2>Туристу нужен не просто список мест — ему нужен хороший опыт.</h2>
          </div>

          <div className="card-grid">
            {highlightCards.map((card) => (
              <button
                key={card.id}
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

        <section className="section section-alt">
          <div className="section-title">
            <p className="eyebrow">Лучшие места рядом</p>
            <h2>Надёжные рекомендации, которые хочется попробовать прямо сейчас.</h2>
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

        <section id="routes" className="section">
          <div className="section-title">
            <p className="eyebrow">Маршруты</p>
            <h2>Готовые варианты для дня и вечера.</h2>
          </div>

          <div className="route-buttons">
            {routes.map((route) => (
              <button
                key={route.id}
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

        <section id="download" className="section cta-block">
          <div>
            <p className="eyebrow">Скоро в вашем телефоне</p>
            <h2>Откройте приложение и получите маршрут, который делает поездку проще и ярче.</h2>
            <p>
              Мы делаем продукт для тех, кто хочет увидеть больше, не тратя время на хаотичный поиск.
            </p>
          </div>
          <a href="mailto:hello@foreigner.uz" className="btn btn-primary">Связаться с нами</a>
        </section>
      </main>
    </div>
  );
}
