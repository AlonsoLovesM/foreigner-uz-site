import { useEffect, useMemo, useState } from 'react';
import placesData from '../data/places.json';

const translations = {
  ru: {
    nav: { about: 'О продукте', places: 'Места', rates: 'Курс', language: 'RU' },
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
      currency: { title: 'Курс валют', description: 'Актуальный курс USD и EUR обновляется каждый день автоматически.', accent: 'Курс' },
      bot: { title: 'Помощник в Telegram', description: 'Бот поможет ответить на вопросы и даст подсказку по Ташкенту в реальном времени.', accent: 'Бот' },
    },
    rate: { title: 'Курсы валют ЦБ РУз', subtitle: 'Актуальный курс доллара и евро в узбекских сумах.', loaded: 'Обновлено', tip: 'Лучше обменивать деньги в проверенных банках или банкоматах, чтобы получить выгодный курс.', refresh: 'Обновить курс', error: 'Не удалось загрузить курс. Попробуйте позже.' },
    places: { title: 'Полезные места', subtitle: 'Отели, обмен, клиники, рынки и заведения для отдыха.', google: 'Google Maps', taxi: 'Яндекс Go', location: 'Адрес' },
    mustVisit: { title: 'Что стоит посетить', subtitle: 'Лучшие точки Ташкента для прогулок, шопинга и впечатлений.' },
    routes: { title: 'Маршруты', subtitle: 'Готовые варианты для дня и вечера.' },
    download: { pre: 'Скоро в вашем телефоне', title: 'Откройте приложение и получите маршрут, который делает поездку проще и ярче.', text: 'Мы создаём продукт для тех, кто хочет увидеть больше, не тратя время на хаотичный поиск.' },
    faq: {
      title: 'Памятка туристу',
      subtitle: 'Важная информация для комфортного пребывания в городе.',
      metroTitle: '🚇 Оплата Метро',
      metroDesc: 'Можно оплачивать прямо на турникете банковскими картами (Visa, Mastercard, Humo, Uzcard) или NFC-телефоном. Наличными в кассе покупается бумажный QR-билет (1700 UZS).',
      restTitle: '🍽️ Чаевые и сервис',
      restDesc: 'В большинстве ресторанов в чек автоматически добавляется 10–15% за обслуживание (Service Charge). Дополнительные чаевые оставлять не обязательно.',
    },
    metro: {
      title: '🚇 Схема и Линии Метро Ташкента',
      subtitle: 'Нажмите на карту, чтобы открыть во весь экран (как в Telegram)',
      legendTitle: '📌 Условные обозначения на карте:',
      linesTitle: '🔴 Линии метрополитена:',
    }
  },
  en: {
    nav: { about: 'About', places: 'Places', rates: 'Rates', language: 'EN' },
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
      currency: { title: 'Exchange rates', description: 'The USD and EUR rates are updated daily automatically.', accent: 'Rate' },
      bot: { title: 'Telegram assistant', description: 'The bot helps answer questions and gives tips about Tashkent in real time.', accent: 'Bot' },
    },
    rate: { title: 'CBU Exchange rates', subtitle: 'The current dollar and euro rates in Uzbek soums.', loaded: 'Updated', tip: 'It is better to exchange money at trusted banks or ATMs for a good rate.', refresh: 'Refresh rate', error: 'Failed to load rates. Please try again later.' },
    places: { title: 'Useful places', subtitle: 'Hotels, exchange, clinics, markets and places to relax.', google: 'Google Maps', taxi: 'Yandex Go', location: 'Address' },
    mustVisit: { title: 'Must visit', subtitle: 'Top Tashkent spots for shopping, sightseeing and experiences.' },
    routes: { title: 'Routes', subtitle: 'Ready-made day and evening options.' },
    download: { pre: 'Soon on your phone', title: 'Open the app and get a route that makes your trip easier and brighter.', text: 'We are building the product for those who want to see more without wasting time on chaotic search.' },
    faq: {
      title: 'Tourist Survival Guide',
      subtitle: 'Essential info for a seamless stay in the city.',
      metroTitle: '🚇 Metro Payment',
      metroDesc: 'Pay directly at turnstiles with bank cards (Visa, Mastercard, Humo, Uzcard) or phone NFC. Cash can buy a QR paper ticket at ticket desks (1700 UZS).',
      restTitle: '🍽️ Tipping & Service Charge',
      restDesc: 'Most restaurants include a 10–15% service charge directly in the bill. Extra tipping is optional.',
    },
    metro: {
      title: '🚇 Tashkent Metro Map & Lines',
      subtitle: 'Click the map to view in full screen (like Telegram)',
      legendTitle: '📌 Map Legend & Symbols:',
      linesTitle: '🔴 Metro Lines:',
    }
  },
  uz: {
    nav: { about: 'Haqida', places: 'Joylar', rates: 'Kurs', language: 'UZ' },
    hero: {
      headline: 'Toshkent bo‘ylab qulay qo‘llanma: qayerda yashash, nimani ko‘rish va valyutani almashtirish.',
      description: 'Foreigner.uz eng yaxshi mehmonxonalar, restoranlar, bozorlar, klinikalar va diqqatga sazovor joylarni bitta ilovada jamlaydi.',
      action: 'Joylar bilan tanishish',
      contact: 'Pochtaga yozish',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'Yangiliklar',
      subtitle: 'Toshkentdagi har bir sayyoh uchun to‘liq ma’lumotlar to‘plami.',
    },
    cards: {
      places: { title: 'Toshkentdagi eng yaxshi joylar', description: 'Yaqiningizdagi mehmonxonalar, bozorlar, restoranlar va foydali xizmatlarni toping.', accent: 'Joylar' },
      currency: { title: 'Valyuta kursi', description: 'AQSh dollari va Yevro kursi har kuni avtomatik yangilanadi.', accent: 'Kurs' },
      bot: { title: 'Telegram yordamchi', description: 'Bot savollarga javob beradi va real vaqt rejimida Toshkent bo‘yicha maslahat beradi.', accent: 'Bot' },
    },
    rate: { title: 'MB Valyuta kurslari', subtitle: 'AQSh dollari va Yevro kursi so‘mda.', loaded: 'Yangilandi', tip: 'Valyutani qulay kursda almashtirish uchun ishonchli banklar va bankomatlardan foydalaning.', refresh: 'Kursni yangilash', error: 'Kursni yuklab bo‘lmadi. Keyinroq urinib ko‘ring.' },
    places: { title: 'Foydali joylar', subtitle: 'Mehmonxonalar, valyuta ayirboshlash, klinikalar va hordiq chiqarish maskanlari.', google: 'Google Maps', taxi: 'Yandex Go', location: 'Manzil' },
    mustVisit: { title: 'Tashrif buyurish shart', subtitle: 'Toshkentdagi sayr, xarid va taassurotlar uchun eng yaxshi maskanlar.' },
    routes: { title: 'Yo‘nalishlar', subtitle: 'Kunduzgi va kechki tayyor yo‘nalishlar.' },
    download: { pre: 'Tez orada telefoningizda', title: 'Ilovani oching va safaringizni yorqinroq qiladigan marshrutni oling.', text: 'Biz vaqtingizni bekorga sarflamasdan ko‘proq narsani ko‘rishingiz uchun mahsulot yaratmoqdamiz.' },
    faq: {
      title: 'Sayyohlar uchun eslatma',
      subtitle: 'Shaharda qulay harakatlanish uchun muhim ma\'lumotlar.',
      metroTitle: '🚇 Metro to‘lovi',
      metroDesc: 'Bank kartalari (Visa, Mastercard, Humo, Uzcard) yoki telefon NFC orqali to‘g‘ridan-to‘g‘ri turniketda to‘lash mumkin. Naqd pulga kassada QR-chipta sotib olinadi (1700 so‘m).',
      restTitle: '🍽️ Xizmat haqi va choypuli',
      restDesc: 'Aksariyat restoranlarda hisob-kitobga 10–15% xizmat haqi avtomatik qo‘shiladi. Qo‘shimcha choypuli qoldirish ixtiyoriy.',
    },
    metro: {
      title: '🚇 Toshkent Metropoliteni Xaritasi',
      subtitle: 'To‘liq ekranda ochish uchun xaritaga bosing (Telegram kabi)',
      legendTitle: '📌 Xaritasidagi shartli belgilar:',
      linesTitle: '🔴 Metro yo‘nalishlari:',
    }
  },
};

const routeCards = [
  {
    id: 'day',
    title: { ru: 'Дневной маршрут', en: 'Day route', uz: 'Kunduzgi yo‘nalish' },
    subtitle: { ru: 'Прогулка, рынок и вкусный обед.', en: 'Walk, market and a tasty lunch.', uz: 'Sayr, bozor va mazali tushlik.' },
    items: [
      { ru: 'Утро: Чорсу и местные завтраки', en: 'Morning: Chorsu and local breakfast', uz: 'Ertalab: Chorsu va mahalliy nonushta' },
      { ru: 'День: Tashkent City Mall и шопинг', en: 'Day: Tashkent City Mall and shopping', uz: 'Kunduzi: Tashkent City Mall va xaridlar' },
      { ru: 'Вечер: ужин в ресторане с видом', en: 'Evening: dinner with a view', uz: 'Kechqurun: chiroyli manzarali restoranda kechki ovqat' },
    ],
  },
  {
    id: 'evening',
    title: { ru: 'Вечерний маршрут', en: 'Evening route', uz: 'Kechki yo‘nalish' },
    subtitle: { ru: 'Атмосфера, подсветка и лёгкие развлечения.', en: 'Atmosphere, lights and easy entertainment.', uz: 'Muhit, chiroqlar va yengil hordiq.' },
    items: [
      { ru: 'Ночной Magic City в огнях', en: 'Magic City at night with lights', uz: 'Tungi chiroqlar ichidagi Magic City' },
      { ru: 'Коктейли в уютном баре', en: 'Cocktails in a cozy bar', uz: 'Shinam barda kokteyllar' },
      { ru: 'Панорамный вид с телебашни', en: 'Panoramic view from the TV tower', uz: 'Teleminoradan panoramali manzara' },
    ],
  },
];

const categoryFilters = [
  { key: 'all', label: { ru: 'Всё', en: 'All', uz: 'Barchasi' } },
  { key: 'favorites', label: { ru: '❤️ Избранное', en: '❤️ Favorites', uz: '❤️ Tanlanganlar' } },
  { key: 'hotels', label: { ru: 'Отели', en: 'Hotels', uz: 'Mehmonxonalar' } },
  { key: 'food', label: { ru: 'Еда', en: 'Food', uz: 'Taomlar' } },
  { key: 'finance', label: { ru: 'Банки & обмен', en: 'Banks & exchange', uz: 'Banklar va almashtirish' } },
  { key: 'health', label: { ru: 'Медицина', en: 'Health', uz: 'Tibbiyot' } },
  { key: 'shopping', label: { ru: 'Шопинг', en: 'Shopping', uz: 'Xaridlar' } },
  { key: 'gas', label: { ru: 'АЗС', en: 'Gas stations', uz: 'AYQSH' } },
  { key: 'sights', label: { ru: 'Достопримечательности', en: 'Sights', uz: 'Diqqatga sazovor joylar' } },
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
  hotel: { ru: 'Отель', en: 'Hotel', uz: 'Mehmonxona' },
  restaurant: { ru: 'Ресторан', en: 'Restaurant', uz: 'Restoran' },
  cafe: { ru: 'Кафе', en: 'Cafe', uz: 'Kafe' },
  exchange: { ru: 'Обмен', en: 'Exchange', uz: 'Valyuta ayirboshlash' },
  bank: { ru: 'Банк / банкомат', en: 'Bank / ATM', uz: 'Bank / Bankomat' },
  clinic: { ru: 'Клиника', en: 'Clinic', uz: 'Klinika' },
  pharmacy: { ru: 'Аптека', en: 'Pharmacy', uz: 'Dorixona' },
  market: { ru: 'Рынок', en: 'Market', uz: 'Bozor' },
  mall: { ru: 'ТЦ / торговый центр', en: 'Mall', uz: 'Tashkiliy markaz' },
  gas: { ru: 'АЗС', en: 'Gas Station', uz: 'AYQSH' },
  sight: { ru: 'Достопримечательность', en: 'Sight', uz: 'Diqqatga sazovor joy' },
};

function formatRate(value, language) {
  if (!value && value !== 0) return '—';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '—';
  return Math.round(numeric).toLocaleString(language === 'en' ? 'en-US' : 'ru-RU');
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

function yandexTaxiUrl(place, language) {
  const name = getPlaceField(place, 'name', language) || 'Ташкент';
  const address = getPlaceField(place, 'address', language) || '';
  const searchStr = encodeURIComponent(`Ташкент ${name} ${address}`);
  return `https://yandex.ru/maps/?text=${searchStr}`;
}

// Прямая ссылка на загруженную тобой четкую схему метро Ташкента
const METRO_MAP_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Tashkent_Metro_Map_ru.svg/1280px-Tashkent_Metro_Map_ru.svg.png";

export default function App() {
  const [language, setLanguage] = useState('ru');
  const [activeCard, setActiveCard] = useState('places');
  const [activeRoute, setActiveRoute] = useState(routeCards[0].id);
  const [activeCategory, setActiveCategory] = useState('all');

  const [usdRate, setUsdRate] = useState(null);
  const [eurRate, setEurRate] = useState(null);
  const [rateUpdated, setRateUpdated] = useState('');
  const [rateError, setRateError] = useState(false);

  // Состояние полноэкранного просмотра карты метро (Telegram Lightbox)
  const [isMetroModalOpen, setIsMetroModalOpen] = useState(false);

  // Избранное
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('foreigner_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id];
      try {
        localStorage.setItem('foreigner_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return updated;
    });
  };

  const t = (path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], translations[language]) || path;
  };

  const toggleLanguage = () => {
    if (language === 'ru') setLanguage('en');
    else if (language === 'en') setLanguage('uz');
    else setLanguage('ru');
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
    if (activeCategory === 'favorites') {
      return placesData.filter((place) => favorites.includes(place.id));
    }
    const types = categoryGroups[activeCategory] || categoryGroups.all;
    return placesData.filter((place) => types.includes(place.type));
  }, [activeCategory, favorites]);

  const mustVisitPlaces = useMemo(
    () => placesData.filter((place) => place.type === 'sight' || place.type === 'mall'),
    [],
  );

  const fetchRates = async () => {
    setRateError(false);
    try {
      const response = await fetch('https://cbu.uz/ru/arkhiv-kursov-valyut/json/');
      if (!response.ok) throw new Error('CBU response error');
      const data = await response.json();

      const usd = data.find((item) => item.Ccy === 'USD');
      const eur = data.find((item) => item.Ccy === 'EUR');

      if (usd && eur) {
        setUsdRate(parseFloat(usd.Rate));
        setEurRate(parseFloat(eur.Rate));
        setRateUpdated(usd.Date || new Date().toLocaleDateString());
        return;
      }
    } catch (e) {
      console.warn('Не удалось загрузить с ЦБ РУз, пробуем резервный API', e);
    }

    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      if (data?.rates?.UZS) {
        setUsdRate(data.rates.UZS);
        const eurInUzs = data.rates.EUR ? (data.rates.UZS / data.rates.EUR) : 13800;
        setEurRate(eurInUzs);
        setRateUpdated(data.time_last_update_utc || new Date().toISOString());
        return;
      }
    } catch (err) {
      console.error('Резервный API также недоступен', err);
    }

    setRateError(true);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const routeItems = selectedRoute?.items || [];

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <nav className="nav container">
          <a href="#top" className="brand">Foreigner.uz</a>
          
          {/* SOS BUTTONS BANNER */}
          <div className="sos-bar" style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
            <a href="tel:1173" style={{ background: '#ef444422', color: '#f87171', border: '1px solid #ef444444', padding: '4px 10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              👮 1173
            </a>
            <a href="tel:103" style={{ background: '#dc262622', color: '#ef4444', border: '1px solid #dc262644', padding: '4px 10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              🚑 103
            </a>
            <a href="tel:112" style={{ background: '#ffffff11', color: '#ccc', border: '1px solid #ffffff22', padding: '4px 10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              🆘 112
            </a>
          </div>

          <div className="nav-links">
            <a href="#about">{t('nav.about')}</a>
            <a href="#places">{t('nav.places')}</a>
            <a href="#rates">{t('nav.rates')}</a>
            <button type="button" className="lang-toggle" onClick={toggleLanguage}>
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
              <div>{language === 'uz' ? 'Sayyohlar uchun xizmatlar va maslahatlar' : language === 'ru' ? 'Сервисы и советы для туристов' : 'Services and tips for tourists'}</div>
              <div>{language === 'uz' ? 'USD va EUR jonli kursi' : language === 'ru' ? 'Актуальный курс USD и EUR' : 'Live USD & EUR rates'}</div>
              <div>{language === 'uz' ? 'Kun va kech uchun marshrut rejasi' : language === 'ru' ? 'План маршрута на день и вечер' : 'Day and evening routes'}</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* TOURIST FAQ SECTION */}
        <section className="section container">
          <div className="section-title">
            <p className="eyebrow">💡 Foreigner.uz Survival Kit</p>
            <h2>{t('faq.title')}</h2>
          </div>

          <div className="card-grid" style={{ marginBottom: '24px' }}>
            <div className="detail-panel" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '16px' }}>
              <h3 style={{ color: '#fbbf24', marginTop: 0 }}>{t('faq.metroTitle')}</h3>
              <p style={{ color: '#ccc', fontSize: '0.95rem' }}>{t('faq.metroDesc')}</p>
            </div>
            <div className="detail-panel" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '16px' }}>
              <h3 style={{ color: '#fbbf24', marginTop: 0 }}>{t('faq.restTitle')}</h3>
              <p style={{ color: '#ccc', fontSize: '0.95rem' }}>{t('faq.restDesc')}</p>
            </div>
          </div>
        </section>

        {/* FULL TASHKENT METRO MAP SECTION */}
        <section className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">🚇 METRO GUIDE</p>
            <h2>{t('metro.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '8px' }}>{t('metro.subtitle')}</p>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '24px' }}>
            
            {/* CLICKABLE MAP WITH HOVER & ZOOM ICON */}
            <div 
              onClick={() => setIsMetroModalOpen(true)}
              style={{ 
                width: '100%', 
                cursor: 'zoom-in', 
                borderRadius: '16px', 
                marginBottom: '24px', 
                background: '#fff', 
                padding: '16px',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease',
              }}
              className="metro-img-container"
            >
              <span style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2
              }}>
                🔍 Нажмите для увеличения
              </span>
              <img 
                src={METRO_MAP_URL}
                alt="Схема Ташкентского Метрополитена" 
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>

            {/* LINES & INTERCHANGES LEGEND */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div>
                <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.1rem' }}>{t('metro.linesTitle')}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  <li style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🔴 <b>Чиланзарская линия</b> — Сквер, Чорсу, Сергели
                  </li>
                  <li style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🔵 <b>Узбекистанская линия</b> — Базар Чорсу, Вокзал, Космонавтов
                  </li>
                  <li style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🟢 <b>Юнусабадская линия</b> — Телебашня, Минор, Юнус Раджаби
                  </li>
                  <li style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🩵 <b>Кольцевая линия</b> — Технопарк, Куйлюк, Кипчак
                  </li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.1rem' }}>{t('metro.legendTitle')}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#ccc' }}>
                  <li>🔄 <b>Пересадочные узлы:</b> <i>Пахтакор ↔ Алишер Навои</i>, <i>Амир Тимур ↔ Юнус Раджаби</i>, <i>Ойбек ↔ Мингурик</i>.</li>
                  <li>🚆 <b>Вокзалы:</b> Станция «Ташкент» (Северный) и «Жанубий» (Южный).</li>
                  <li>🎫 <b>Стоимость проезда:</b> 1 700 UZS (оплата любой банковской картой или QR-билетом).</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* MODAL FULLSCREEN METRO LIGHTBOX (TELEGRAM STYLE) */}
        {isMetroModalOpen && (
          <div 
            onClick={() => setIsMetroModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '20px',
              cursor: 'zoom-out'
            }}
          >
            <button
              type="button"
              onClick={() => setIsMetroModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '25px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000
              }}
            >
              ✕
            </button>
            <img 
              src={METRO_MAP_URL}
              alt="Схема Метро Ташкента во весь экран" 
              onClick={(e) => e.stopPropagation()} // Чтобы клик по самой картинке не закрывал её случайно
              style={{
                maxWidth: '95%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 0 40px rgba(0,0,0,0.8)',
                cursor: 'default',
                background: '#fff',
                padding: '8px'
              }}
            />
          </div>
        )}

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
              <span className="eyebrow">USD & EUR → UZS</span>
              <h3 className="rate-value" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.4rem', margin: '12px 0' }}>
                <div>💵 <b>USD:</b> {usdRate ? `${formatRate(usdRate, language)} sum` : rateError ? t('rate.error') : '...'}</div>
                <div>💶 <b>EUR:</b> {eurRate ? `${formatRate(eurRate, language)} sum` : rateError ? t('rate.error') : '...'}</div>
              </h3>
              <p>{rateError ? '' : `${t('rate.loaded')}: ${rateUpdated}`}</p>
              <button type="button" className="btn btn-secondary small" onClick={fetchRates}>{t('rate.refresh')}</button>
            </div>
            <div className="rate-card">
              <span className="eyebrow">{language === 'uz' ? 'Maslahat' : language === 'ru' ? 'Совет' : 'Tip'}</span>
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
                {category.key === 'favorites' && favorites.length > 0 ? ` (${favorites.length})` : ''}
              </button>
            ))}
          </div>

          <div className="places-grid">
            {filteredPlaces.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                {activeCategory === 'favorites' 
                  ? (language === 'en' ? 'No saved places yet. Click ❤️ to add!' : language === 'uz' ? 'Hali saqlangan joylar yo‘q. Qo‘shish uchun ❤️ bosing!' : 'Пока нет сохранённых мест. Нажмите ❤️ на карточке, чтобы добавить!')
                  : '—'}
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isFav = favorites.includes(place.id);
                return (
                  <article key={place.id} className="place-card" style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(place.id)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        zIndex: 2
                      }}
                      title="Save to favorites"
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>

                    <span className="badge">{getTypeLabel(place, language)}</span>
                    <h4>{getPlaceField(place, 'name', language)}</h4>
                    <p className="muted">{(place.average_check || place.price_level) ? `${place.average_check || place.price_level} · ` : ''}⭐ {place.rating}</p>
                    <p>{getPlaceField(place, 'description', language)}</p>
                    <p className="address"><strong>{t('places.location')}:</strong> {getPlaceField(place, 'address', language)}</p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <a
                        href={mapsUrl(place, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary small"
                        style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                      >
                        📍 {t('places.google')}
                      </a>
                      <a
                        href={yandexTaxiUrl(place, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary small"
                        style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none' }}
                      >
                        🚖 {t('places.taxi')}
                      </a>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">{t('mustVisit.title')}</p>
            <h2>{t('mustVisit.subtitle')}</h2>
          </div>

          <div className="must-visit-grid">
            {mustVisitPlaces.map((place) => (
              <article key={place.id} className="spot-card sight-card" style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => toggleFavorite(place.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    zIndex: 2
                  }}
                >
                  {favorites.includes(place.id) ? '❤️' : '🤍'}
                </button>

                <span className="badge-secondary">{getTypeLabel(place, language)}</span>
                <h3>{getPlaceField(place, 'name', language)}</h3>
                <p>{getPlaceField(place, 'description', language)}</p>
                <p className="address"><strong>{t('places.location')}:</strong> {getPlaceField(place, 'address', language)}</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <a
                    href={mapsUrl(place, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary small"
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                  >
                    📍 {t('places.google')}
                  </a>
                  <a
                    href={yandexTaxiUrl(place, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary small"
                    style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none' }}
                  >
                    🚖 {t('places.taxi')}
                  </a>
                </div>
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
                <li key={item[language] || item.ru}>{getTranslatedText(item, language)}</li>
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