import { useEffect, useMemo, useState } from 'react';
import placesData from '../data/places.json';

const translations = {
  ru: {
    nav: { about: 'О продукте', places: 'Места', rates: 'Курс', language: 'EN' },
    hero: {
      headline: 'Полезный путеводитель по Ташкенту: где жить, что посмотреть и где обменять деньги.',
      description: 'Foreigner.uz собирает лучшие отели, рестораны, рынки, клиники, АЗС и достопримечательности в одном приложении.',
      action: 'Посмотреть места',
      contact: 'Написать на почту',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'Что нового',
      subtitle: 'Полный набор справочной информации для любого туриста в Ташкенте.',
    },
    cards: {
      places: { title: 'Лучшие точки в Ташкенте', description: 'Найди отели, рынки, рестораны, обменные пункты и полезные сервисы рядом с тобой.', accent: 'Места' },
      currency: { title: 'Курс доллара', description: 'Актуальный курс USD → UZS обновляется каждый день автоматически.', accent: 'Курс' },
      bot: { title: 'Помощник в Telegram', description: 'Бот поможет ответить на вопросы и даст подсказку по Ташкенту в реальном времени.', accent: 'Бот' },
    },
    rate: { title: 'Курс валют', subtitle: 'Актуальный курс доллара в узбекских сумах.', loaded: 'Обновлено', tip: 'Лучше обменивать деньги в проверенных пунктах или банкоматах, чтобы получить выгодный курс.', refresh: 'Обновить курс', error: 'Не удалось загрузить курс. Попробуйте позже.' },
    places: { title: 'Полезные места', subtitle: 'Отели, обмен, клиники, рынки и заведения для отдыха.', google: 'Показать на Google Maps', location: 'Адрес' },
    mustVisit: { title: 'Что стоит посетить', subtitle: 'Лучшие точки Ташкента для прогулок, шопинга и впечатлений.' },
    routes: { title: 'Маршруты', subtitle: 'Готовые варианты для дня и вечера.' },
    download: { pre: 'Скоро в вашем телефоне', title: 'Откройте приложение и получите маршрут, который делает поездку проще и ярче.', text: 'Мы создаём продукт для тех, кто хочет увидеть больше, не тратя время на хаотичный поиск.' },
  },
  en: {
    nav: { about: 'About', places: 'Places', rates: 'Rate', language: 'RU' },
    hero: {
      headline: 'Handy travel guide for Tashkent: where to stay, what to see and where to exchange money.',
      description: 'Foreigner.uz collects top hotels, restaurants, markets, clinics, gas stations and attractions in one place.',
      action: 'Browse places',
      contact: 'Send email',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'What’s new',
      subtitle: 'A complete reference for every tourist in Tashkent.',
    },
    cards: {
      places: { title: 'Best spots in Tashkent', description: 'Find hotels, markets, restaurants, exchange offices and useful services near you.', accent: 'Places' },
      currency: { title: 'Dollar rate', description: 'The USD → UZS rate is updated daily automatically.', accent: 'Rate' },
      bot: { title: 'Telegram assistant', description: 'The bot helps answer questions and gives tips about Tashkent in real time.', accent: 'Bot' },
    },
    rate: { title: 'Exchange rate', subtitle: 'The current dollar rate in Uzbek soums.', loaded: 'Updated', tip: 'It is better to exchange money at trusted offices or ATMs for a good rate.', refresh: 'Refresh rate', error: 'Failed to load the rate. Please try again later.' },
    places: { title: 'Useful places', subtitle: 'Hotels, exchange, clinics, markets and places to relax.', google: 'Open in Google Maps', location: 'Address' },
    mustVisit: { title: 'Must visit', subtitle: 'Top Tashkent spots for shopping, sightseeing and experiences.' },
    routes: { title: 'Routes', subtitle: 'Ready-made day and evening options.' },
    download: { pre: 'Soon on your phone', title: 'Open the app and get a route that makes your trip easier and brighter.', text: 'We are building the product for those who want to see more without wasting time on chaotic search.' },
  },
};

const routeCards = [
  {
    id: 'day',
    title: { ru: 'Дневной маршрут', en: 'Day route' },
    subtitle: { ru: 'Прогулка, рынок и вкусный обед.', en: 'Walk, market and a tasty lunch.' },
    items: [
      { ru: 'Утро: Чорсу и местные завтраки', en: 'Morning: Chorsu and local breakfast' },
      { ru: 'День: Tashkent City Mall и шопинг', en: 'Day: Tashkent City Mall and shopping' },
      { ru: 'Вечер: ужин в ресторане с видом', en: 'Evening: dinner with a view' },
    ],
  },
  {
    id: 'evening',
    title: { ru: 'Вечерний маршрут', en: 'Evening route' },
    subtitle: { ru: 'Атмосфера, подсветка и лёгкие развлечения.', en: 'Atmosphere, lights and easy entertainment.' },
    items: [
      { ru: 'Ночной Magic City в огнях', en: 'Magic City at night with lights' },
      { ru: 'Коктейли в уютном баре', en: 'Cocktails in a cozy bar' },
      { ru: 'Панорамный вид с телебашни', en: 'Panoramic view from the TV tower' },
    ],
  },
];

const categoryFilters = [
  { key: 'all', label: { ru: 'Всё', en: 'All' } },
  { key: 'hotels', label: { ru: 'Отели', en: 'Hotels' } },
  { key: 'food', label: { ru: 'Еда', en: 'Food' } },
  { key: 'finance', label: { ru: 'Банки & обмен', en: 'Banks & exchange' } },
  { key: 'health', label: { ru: 'Медицина', en: 'Health' } },
  { key: 'shopping', label: { ru: 'Шопинг', en: 'Shopping' } },
  { key: 'gas', label: { ru: 'АЗС', en: 'Gas stations' } },
  { key: 'sights', label: { ru: 'Достопримечательности', en: 'Sights' } },
];

const categoryGroups = {
  all: ['hotel', 'restaurant', 'cafe', 'bank', 'exchange', 'clinic', 'pharmacy', 'market', 'mall', 'gas', 'sight'],
  hotels: ['hotel'],
  food: ['restaurant', 'cafe'],
  finance: ['bank', 'exchange'],
  health: ['clinic', 'pharmacy'],
  shopping: ['market', 'mall'],
  gas: ['gas'],
  sights: ['sight'],
};

const typeLabels = {
  hotel: { ru: 'Отель', en: 'Hotel' },
  restaurant: { ru: 'Ресторан', en: 'Restaurant' },
  cafe: { ru: 'Кафе', en: 'Cafe' },
  exchange: { ru: 'Обмен', en: 'Exchange' },
  bank: { ru: 'Банк / банкомат', en: 'Bank / ATM' },
  clinic: { ru: 'Клиника', en: 'Clinic' },
  pharmacy: { ru: 'Аптека', en: 'Pharmacy' },
  market: { ru: 'Рынок', en: 'Market' },
  mall: { ru: 'ТЦ / торговый центр', en: 'Mall' },
  gas: { ru: 'АЗС', en: 'Gas Station' },
  sight: { ru: 'Достопримечательность', en: 'Sight' },
};

function formatRate(value, language) {
  if (!value && value !== 0) return '—';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  return Math.round(numeric).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US');
}

function getTranslatedText(text, language) {
  if (!text) return '';
  if (typeof text === 'object') {
    return text[language] || text.ru || '';
  }
  return text;
}

function getPlaceField(place, field, language) {
  return place[`${field}_${language}`] || place[field] || '';
}

function getTypeLabel(place, language) {
  const typeKey = place.type || place.type_en?.toLowerCase();
  return typeLabels[typeKey]?.[language] || place[`${typeKey}_${language}`] || place.type_en || place.type || '';
}

function mapsUrl(place, language) {
  const queryValue = place.maps_query || `${getPlaceField(place, 'name', language)} ${getPlaceField(place, 'address', language)}`;
  const query = encodeURIComponent(queryValue.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default function App() {
  const [language, setLanguage] = useState('ru');
  const [activeCard, setActiveCard] = useState('places');
  const [activeRoute, setActiveRoute] = useState(routeCards[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateUpdated, setRateUpdated] = useState('');
  const [rateError, setRateError] = useState(false);

  const t = (path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], translations[language]) || path;
  };

  const selectedCard = useMemo(
    () => translations[language].cards[activeCard],
    [activeCard, language],
  );

  const selectedRoute = useMemo(
    () => routeCards.find((route) => route.id === activeRoute),
    [activeRoute],
  );

  const filteredPlaces = useMemo(() => {
    const types = categoryGroups[activeCategory] || categoryGroups.all;
    return placesData.filter((place) => types.includes(place.type));
  }, [activeCategory]);

  const mustVisitPlaces = useMemo(
    () => placesData.filter((place) => place.type === 'sight' || place.type === 'mall'),
    [],
  );

  const fetchRate = async () => {
    setRateError(false);

    const sources = [
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
      'https://open.er-api.com/v6/latest/USD',
    ];

    for (const url of sources) {
      try {
        const response = await fetch(url);
        const result = await response.json();

        if (result?.usd?.uzs) {
          setExchangeRate(result.usd.uzs);
          setRateUpdated(result.date || new Date().toISOString());
          setRateError(false);
          return;
        }

        if (result?.rates?.UZS) {
          setExchangeRate(result.rates.UZS);
          setRateUpdated(result.time_last_update_utc || new Date().toISOString());
          setRateError(false);
          return;
        }
      } catch (error) {
        console.warn(`Не удалось получить курс из ${url}`, error);
      }
    }

    setRateError(true);
  };

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const routeItems = selectedRoute?.items || [];

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <nav className="nav container">
          <a href="#top" className="brand">Foreigner.uz</a>
          <div className="nav-links">
            <a href="#about">{t('nav.about')}</a>
            <a href="#places">{t('nav.places')}</a>
            <a href="#rates">{t('nav.rates')}</a>
            <button type="button" className="lang-toggle" onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}>
              {t('nav.language')}
            </button>
          </div>
        </nav>

        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow">{getTranslatedText(selectedCard.accent, language)}</p>
            <h1>{t('hero.headline')}</h1>
            <p className="lead">{t('hero.description')}</p>
            <div className="hero-actions">
              <a href="#places" className="btn btn-primary">{t('hero.action')}</a>
              <a href="mailto:acapelonso@gmail.com" className="btn btn-secondary">{t('hero.contact')}</a>
              <a href="https://t.me/foreigneruz_bot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('hero.telegram')}</a>
            </div>
          </div>

          <div className="hero-panel">
            <h3>{t('about.title')}</h3>
            <p>{t('about.subtitle')}</p>
            <div className="hero-list">
              <div>{language === 'ru' ? 'Сервисы и советы для туристов' : 'Services and tips for tourists'}</div>
              <div>{language === 'ru' ? 'Актуальный курс доллара' : 'Live dollar rate'}</div>
              <div>{language === 'ru' ? 'План маршрута на день и вечер' : 'Day and evening routes'}</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section container">
          <div className="section-title">
            <p className="eyebrow">{t('about.title')}</p>
            <h2>{t('about.subtitle')}</h2>
          </div>

          <div className="card-grid">
            {Object.entries(translations[language].cards).map(([key, card]) => (
              <button
                key={key}
                type="button"
                className={`info-card ${activeCard === key ? 'active' : ''}`}
                onClick={() => setActiveCard(key)}
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

        <section id="rates" className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">{t('rate.title')}</p>
            <h2>{t('rate.subtitle')}</h2>
          </div>
          <div className="rate-panel">
            <div className="rate-card">
              <span className="eyebrow">USD → UZS</span>
              <h3 className="rate-value">
                {exchangeRate ? `${formatRate(exchangeRate, language)} ${language === 'ru' ? 'сум' : 'UZS'}` : rateError ? t('rate.error') : '...'}
              </h3>
              <p>{rateError ? '' : `${t('rate.loaded')}: ${rateUpdated ? new Date(rateUpdated).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US') : t('rate.loaded')}`}</p>
              <button type="button" className="btn btn-secondary small" onClick={fetchRate}>{t('rate.refresh')}</button>
            </div>
            <div className="rate-card">
              <span className="eyebrow">{language === 'ru' ? 'Совет' : 'Tip'}</span>
              <p>{t('rate.tip')}</p>
            </div>
          </div>
        </section>

        <section id="places" className="section container">
          <div className="section-title">
            <p className="eyebrow">{t('places.title')}</p>
            <h2>{t('places.subtitle')}</h2>
          </div>

          <div className="category-buttons">
            {categoryFilters.map((category) => (
              <button
                key={category.key}
                type="button"
                className={`category-btn ${activeCategory === category.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.key)}
              >
                {getTranslatedText(category.label, language)}
              </button>
            ))}
          </div>

          <div className="places-grid">
            {filteredPlaces.map((place) => (
              <article key={place.id} className="place-card">
                <span className="badge">{getTypeLabel(place, language)}</span>
                <h4>
                  
                    href={mapsUrl(place, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="place-name-link"
                    title={t('places.google')}
                  >
                    {getPlaceField(place, 'name', language)}
                  </a>
                </h4>
                <p className="muted">{(place.average_check || place.price_level) ? `${place.average_check || place.price_level} · ` : ''}⭐ {place.rating}</p>
                <p>{getPlaceField(place, 'description', language)}</p>
                <p className="address"><strong>{t('places.location')}:</strong> {getPlaceField(place, 'address', language)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">{t('mustVisit.title')}</p>
            <h2>{t('mustVisit.subtitle')}</h2>
          </div>

          <div className="must-visit-grid">
            {mustVisitPlaces.map((place) => (
              <article key={place.id} className="spot-card sight-card">
                <span className="badge-secondary">{getTypeLabel(place, language)}</span>
                <h3>
                  
                    href={mapsUrl(place, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="place-name-link"
                    title={t('places.google')}
                  >
                    {getPlaceField(place, 'name', language)}
                  </a>
                </h3>
                <p>{getPlaceField(place, 'description', language)}</p>
                <p className="address"><strong>{t('places.location')}:</strong> {getPlaceField(place, 'address', language)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="routes" className="section container">
          <div className="section-title">
            <p className="eyebrow">{t('routes.title')}</p>
            <h2>{t('routes.subtitle')}</h2>
          </div>

          <div className="route-buttons">
            {routeCards.map((route) => (
              <button
                key={route.id}
                type="button"
                className={`route-btn ${activeRoute === route.id ? 'active' : ''}`}
                onClick={() => setActiveRoute(route.id)}
              >
                {getTranslatedText(route.title, language)}
              </button>
            ))}
          </div>

          <div className="route-card">
            <h3>{getTranslatedText(selectedRoute.title, language)}</h3>
            <p>{getTranslatedText(selectedRoute.subtitle, language)}</p>
            <ul>
              {routeItems.map((item) => (
                <li key={item[language]}>{getTranslatedText(item, language)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="download" className="section section-alt container cta-block">
          <div>
            <p className="eyebrow">{t('download.pre')}</p>
            <h2>{t('download.title')}</h2>
            <p>{t('download.text')}</p>
          </div>
          <div className="download-actions">
            <a href="mailto:acapelonso@gmail.com" className="btn btn-primary">{t('hero.contact')}</a>
            <a href="https://t.me/foreigneruz_bot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('hero.telegram')}</a>
          </div>
        </section>
      </main>
    </div>
  );
}
