import { useEffect, useMemo, useState } from 'react';

// Расширенный список мест (включая компьютерные клубы с обновленными ценами)
const placesData = [
  {
    id: 'cyber-cyberarena',
    type: 'cyber',
    name: 'CyberArena Tashkent',
    name_en: 'CyberArena Tashkent',
    description: 'Современный киберспортивный клуб с топовым железом RTX 4080, VIP-комнатами и PS5.',
    description_en: 'Modern esports club with RTX 4080 GPUs, VIP rooms, and PS5 consoles.',
    address: 'ул. Амира Тимура, 108, Ташкент',
    address_en: '108 Amir Timur str., Tashkent',
    price: 'от 12 000 UZS/час (Standart) до 22 000 UZS/час (VIP)',
    maps_query: 'CyberArena Tashkent Amir Timur',
    phone: '+998 71 200 00 11'
  },
  {
    id: 'cyber-gamerzone',
    type: 'cyber',
    name: 'Gamer Zone Cyber Club',
    name_en: 'Gamer Zone Cyber Club',
    description: 'Уютный компьютерный клуб с комфортными креслами, мощными ПК (RTX 3070) и паровыми автоматоми.',
    description_en: 'Cozy gaming lounge with RTX 3070 PCs and comfortable gaming chairs.',
    address: 'ул. Шота Руставели, 45, Ташкент',
    address_en: '45 Shota Rustaveli str., Tashkent',
    price: 'от 10 000 UZS/час (Standart) до 18 000 UZS/час (VIP)',
    maps_query: 'Gamer Zone Shota Rustaveli Tashkent',
    phone: '+998 90 123 45 67'
  },
  {
    id: 'cyber-colizeum',
    type: 'cyber',
    name: 'Colizeum Cyber Lounge',
    name_en: 'Colizeum Cyber Lounge',
    description: 'Сетевой премиум-клуб: киберспортивные мониторы 240Hz, топовая периферия, буткемпы для команд.',
    description_en: 'Premium esports arena: 240Hz monitors, top gear, team bootcamps.',
    address: 'Ц-1, ул. Узбекистанская Овози, 21, Ташкент',
    address_en: '21 Uzbekistan Ovozi str., Tashkent',
    price: 'от 15 000 UZS/час (Standart) до 25 000 UZS/час (Bootcamp)',
    maps_query: 'Colizeum Tashkent C1',
    phone: '+998 95 000 11 22'
  },
  {
    id: 'cyber-major',
    type: 'cyber',
    name: 'Major Esports Arena',
    name_en: 'Major Esports Arena',
    description: 'Просторная арена на Чиланзаре. Мощные ПК, плотные ночные пакеты и зона с консолями PS5.',
    description_en: 'Spacious arena in Chilanzar. Powerful PCs, overnight packages and PS5 zone.',
    address: 'кв-л Чиланзар-3, ул. Гагарина, 12, Ташкент',
    address_en: '12 Gagarin str., Chilanzar, Tashkent',
    price: 'от 11 000 UZS/час (Standart) до 20 000 UZS/час (VIP)',
    maps_query: 'Major Esports Chilanzar Tashkent',
    phone: '+998 93 555 44 33'
  },
  {
    id: 'hotel-hyatt',
    type: 'hotel',
    name: 'Hyatt Regency Tashkent',
    name_en: 'Hyatt Regency Tashkent',
    description: 'Пятизвёздочный отель в самом центре города рядом со сквером Амира Тимура.',
    description_en: '5-star hotel in the heart of Tashkent near Amir Timur Square.',
    address: 'ул. Навои, 1A, Ташкент',
    address_en: '1A Navoi str., Tashkent',
    price: 'от $180 / ночь',
    maps_query: 'Hyatt Regency Tashkent Navoi',
    phone: '+998 71 207 12 34'
  },
  {
    id: 'market-chorsu',
    type: 'market',
    name: 'Базар Чорсу (Chorsu Bazaar)',
    name_en: 'Chorsu Bazaar',
    description: 'Исторический восточный базар под огромным синим куполом. Сувениры, специи, сухофрукты и обжорный ряд.',
    description_en: 'Historic Eastern bazaar under a massive blue dome. Spices, dried fruits, souvenirs & street food.',
    address: 'ул. Заркайнар, 48, Ташкент',
    address_en: '48 Zarkaynar str., Tashkent',
    price: 'Вход свободный',
    maps_query: 'Chorsu Bazaar Tashkent Zarkaynar',
    phone: '+998 71 242 00 00'
  }
];

const translations = {
  ru: {
    nav: { about: 'О продукте', places: 'Места', eat: 'Must Eat', souvenirs: 'Сувениры', phrasebook: 'Разговорник', rates: 'Курс', language: 'RU' },
    hero: {
      headline: 'Полезный путеводитель по Ташкенту: где жить, что посмотреть и где вкусно поесть.',
      description: 'Foreigner.uz собирает лучшие отели, рестораны, рынки, клиники, компьютерные клубы и узбекский разговорник с озвучкой.',
      action: 'Посмотреть места',
      contact: 'Написать на почту',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'Что нового',
      subtitle: 'Полный набор справочной информации для любого туриста в Ташкенте.',
    },
    cards: {
      places: { title: 'Лучшие точки в Ташкенте', description: 'Найди отели, рынки, рестораны, компьютерные клубы и полезные сервисы рядом с тобой.', accent: 'Места' },
      currency: { title: 'Курс валют', description: 'Актуальный курс USD, EUR, RUB и CNY обновляется автоматически.', accent: 'Курс' },
      bot: { title: 'Помощник в Telegram', description: 'Бот поможет ответить на вопросы и даст подсказку по Ташкенту в реальном времени.', accent: 'Бот' },
    },
    rate: {
      title: 'Курсы валют ЦБ РУз & Калькулятор',
      subtitle: 'Актуальный курс и мгновенный конвертер UZS, USD, EUR, RUB и CNY.',
      loaded: 'Обновлено',
      tip: 'Лучше обменивать деньги в проверенных банках или банкоматах, чтобы получить выгодный курс.',
      refresh: 'Обновить курс',
      error: 'Не удалось загрузить курс. Попробуйте позже.',
      calcTitle: '🧮 Конвертер валют',
      amountLabel: 'Сумма:',
      fromLabel: 'Из:',
      toLabel: 'В:',
      resultLabel: 'Итого:',
    },
    places: { title: 'Полезные места', subtitle: 'Отели, компьютерные клубы, клиники, рынки и заведения для отдыха.', google: 'Google Maps', taxi: 'Яндекс Go', location: 'Адрес', share: 'Поделиться местом' },
    favorites: { title: 'Избранное и план поездки', subtitle: 'Сохраняй места и собирай короткий маршрут на день.', empty: 'Пока нет сохранённых мест', emptyHint: 'Нажми ❤️ на любом месте, чтобы собрать маршрут.', ready: 'Сохранено', show: 'Показать избранное', clear: 'Очистить', planTitle: 'Короткий маршрут', stepLabel: 'Шаг' },
    mustVisit: { title: 'Что стоит посетить', subtitle: 'Лучшие точки Ташкента для прогулок, шопинга и впечатлений.' },
    routes: { title: 'Маршруты', subtitle: 'Готовые варианты для дня и вечера.' },
    download: { pre: 'Скоро в вашем телефоне', title: 'Откройте приложение и получите маршрут, который делает поездку проще и ярче.', text: 'Мы создаём продукт для тех, кто хочет увидеть больше, не тратя время на хаотичный поиск.' },
    planner: {
      title: 'Готовый маршрут для Ташкента',
      subtitle: 'Выбери сценарий под свой темп: быстрый день, полноценный день или выходной.',
      vibeLabel: 'Выбери формат:',
      modes: { quick: 'Быстрый день', full: 'Полный день', weekend: 'Выходной' },
      resultTitle: 'Средний маршрут на день',
      resultDesc: 'Подходит и для одного дня, и для нескольких дней в городе — можно легко растянуть или сократить.',
      stepLabel: 'Шаг',
      maps: 'Карты',
      taxi: 'Такси',
      call: 'Позвонить',
    },
    faq: {
      title: 'Памятка туристу',
      subtitle: 'Важная информация для комфортного пребывания в городе.',
      metroTitle: '🚇 Оплата Метро',
      metroDesc: 'Можно оплачивать прямо на турникете банковскими картами (Visa, Mastercard, Humo, Uzcard) или NFC-телефоном. Наличными в кассе покупается бумажный QR-билет (1700 UZS).',
      restTitle: '🍽️ Чаевые и сервис',
      restDesc: 'В большинстве ресторанов в чек автоматически добавляется 10–15% за обслуживание (Service Charge). Дополнительные чаевые оставлять не обязательно.',
    },
    weather: {
      title: '☀️ Погода в Ташкенте',
      loading: 'Загрузка погоды...',
      temp: 'Температура:',
      wind: 'Ветер:',
      humidity: 'Влажность:',
    },
    mustEat: {
      title: '🍲 Must Eat в Ташкенте',
      subtitle: 'Главные блюда узбекской кухни и легендарные места, где их стоит попробовать.',
      tipTitle: '💡 Лайфхак по Плову:',
      tipDesc: 'Плов в Ташкенте варят с утра и едят на обед! Лучшее время для посещения ошхоны — с 11:30 до 13:30. После 14:00 самого вкусного плова может уже не остаться.',
    },
    phrasebook: {
      title: '🗣️ Узбекский разговорник туриста',
      subtitle: 'Фразы, которые вызовут уважение местных. Нажмите 🔊 для озвучки!',
      listenBtn: '🔊 Озвучить',
    },
    souvenirs: {
      title: '🏺 Что везти из Узбекистана (Сувениры)',
      subtitle: 'Лучшие подарки и места, где их покупать выгодно.',
      whereLabel: '📍 Где покупать:',
    }
  },
  en: {
    nav: { about: 'About', places: 'Places', eat: 'Must Eat', souvenirs: 'Souvenirs', phrasebook: 'Phrasebook', rates: 'Rates', language: 'EN' },
    hero: {
      headline: 'Handy travel guide for Tashkent: where to stay, what to see and where to eat authentic food.',
      description: 'Foreigner.uz collects top hotels, restaurants, markets, gaming clubs, souvenirs and an Uzbek phrasebook with audio in one place.',
      action: 'Browse places',
      contact: 'Send email',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: { title: 'What’s new', subtitle: 'A complete reference for every tourist in Tashkent.' },
    cards: {
      places: { title: 'Best spots in Tashkent', description: 'Find hotels, markets, restaurants, gaming lounges and useful services near you.', accent: 'Places' },
      currency: { title: 'Exchange rates', description: 'The USD, EUR, RUB, and CNY rates are updated daily automatically.', accent: 'Rate' },
      bot: { title: 'Telegram assistant', description: 'The bot helps answer questions and gives tips about Tashkent in real time.', accent: 'Bot' },
    },
    rate: {
      title: 'CBU Exchange Rates & Converter',
      subtitle: 'Live rates and instant converter for UZS, USD, EUR, RUB and CNY.',
      loaded: 'Updated',
      tip: 'It is better to exchange money at trusted banks or ATMs for a good rate.',
      refresh: 'Refresh rate',
      error: 'Failed to load rates. Please try again later.',
      calcTitle: '🧮 Currency Converter',
      amountLabel: 'Amount:',
      fromLabel: 'From:',
      toLabel: 'To:',
      resultLabel: 'Result:',
    },
    places: { title: 'Useful places', subtitle: 'Hotels, gaming lounges, clinics, markets and places to relax.', google: 'Google Maps', taxi: 'Yandex Go', location: 'Address', share: 'Share link' },
    favorites: { title: 'Saved places & trip plan', subtitle: 'Save places you like and build a quick day plan.', empty: 'No saved places yet', emptyHint: 'Tap ❤️ on any place to start building your route.', ready: 'Saved', show: 'Show favorites', clear: 'Clear', planTitle: 'Quick route', stepLabel: 'Step' },
    mustVisit: { title: 'Must visit', subtitle: 'Top Tashkent spots for shopping, sightseeing and experiences.' },
    routes: { title: 'Routes', subtitle: 'Ready-made day and evening options.' },
    download: { pre: 'Soon on your phone', title: 'Open the app and get a route that makes your trip easier and brighter.', text: 'We are building the product for those who want to see more without wasting time on chaotic search.' },
    planner: {
      title: 'Ready-made route for Tashkent',
      subtitle: 'Pick a format that matches your pace: quick day, full day, or weekend.',
      vibeLabel: 'Choose a format:',
      modes: { quick: 'Quick day', full: 'Full day', weekend: 'Weekend' },
      resultTitle: 'Balanced day plan',
      resultDesc: 'Works for a single day or for several days in the city — easy to stretch or shorten.',
      stepLabel: 'Step',
      maps: 'Maps',
      taxi: 'Taxi',
      call: 'Call',
    },
    faq: {
      title: 'Tourist Survival Guide',
      subtitle: 'Essential info for a seamless stay in the city.',
      metroTitle: '🚇 Metro Payment',
      metroDesc: 'Pay directly at turnstiles with bank cards (Visa, Mastercard, Humo, Uzcard) or phone NFC. Cash can buy a QR paper ticket at ticket desks (1700 UZS).',
      restTitle: '🍽️ Tipping & Service Charge',
      restDesc: 'Most restaurants include a 10–15% service charge directly in the bill. Extra tipping is optional.',
    },
    weather: { title: '☀️ Tashkent Live Weather', loading: 'Loading weather...', temp: 'Temperature:', wind: 'Wind:', humidity: 'Humidity:' },
    mustEat: {
      title: '🍲 Must Eat in Tashkent',
      subtitle: 'Essential Uzbek dishes and iconic spots where you must try them.',
      tipTitle: '💡 Plov Pro Tip:',
      tipDesc: 'Plov is cooked fresh daily and served for lunch! Prime time to visit Plov Centers is 11:30 AM – 1:30 PM. After 2:00 PM the best batches are usually sold out.',
    },
    phrasebook: {
      title: '🗣️ Uzbek Tourist Phrasebook',
      subtitle: 'Phrases to impress locals and help at markets. Click 🔊 to pronounce!',
      listenBtn: '🔊 Play Sound',
    },
    souvenirs: { title: '🏺 What to bring from Uzbekistan (Souvenirs)', subtitle: 'Best authentic gifts and best places to buy them.', whereLabel: '📍 Where to buy:' }
  }
};

// ИСПРАВЛЕННЫЙ РАЗГОВОРНИК (Фраза Bu nima? означает "Что это?")
const PHRASEBOOK_LIST = [
  { uzbek: 'Salom! Assalomu alaykum!', translit: 'Salom! Assalomu alaykum!', ru: 'Здравствуйте!', en: 'Hello!', zh: '你好！' },
  { uzbek: 'Rahmat!', translit: 'Rahmat!', ru: 'Спасибо!', en: 'Thank you!', zh: '谢谢！' },
  { uzbek: 'Bu nima?', translit: 'Bu nima?', ru: 'Что это?', en: 'What is this?', zh: '这是什么？' },
  { uzbek: 'Bu qancha turadi?', translit: 'Bu qancha turadi?', ru: 'Сколько это стоит?', en: 'How much is this?', zh: '这个多少钱？' },
  { uzbek: 'Bir oz arzonroq bo\'lmasa?', translit: 'Bir oz arzonroq bo\'lmasa?', ru: 'Можно немного дешевле?', en: 'Could you make it a bit cheaper?', zh: '能便宜一点吗？' },
  { uzbek: 'Bu juda mazali!', translit: 'Bu juda mazali!', ru: 'Очень вкусно!', en: 'It is very tasty!', zh: '非常好吃！' },
  { uzbek: 'Hisobni olib bering, iltimos.', translit: 'Hisobni olib bering, iltimos.', ru: 'Принесите счёт, пожалуйста.', en: 'Please bring the bill.', zh: '请给我结账。' },
  { uzbek: 'Xayr, salomat bo\'ling!', translit: 'Xayr, salomat bo\'ling!', ru: 'До свидания, будьте здоровы!', en: 'Goodbye, take care!', zh: '再见，保重！' }
];

const MUST_EAT_LIST = [
  {
    id: 'plov-beshqozon',
    rank: '🏆 №1 PLOV CENTER',
    dish: { ru: 'Ташкентский Плов (Besh Qozon)', en: 'Tashkent Plov (Besh Qozon)' },
    spot: 'Центр Плова (Besh Qozon)',
    address: { ru: 'ул. Ифтихор, 1 (около Телебашни)', en: 'Iftikhor str. 1 (near TV Tower)' },
    desc: {
      ru: 'Легендарный центр плова №1 в Узбекистане. Огромные казаны, свежее мясо, перепелиные яйца и казы.',
      en: 'The #1 legendary Plov Center in Uzbekistan. Huge cauldrons, fresh meat, quail eggs, and kazy.'
    },
    rating: '4.9',
    query: 'Besh Qozon Tashkent'
  },
  {
    id: 'plov-kamolon',
    rank: '🥈 №2 PLOV CENTER',
    dish: { ru: 'Камолон Ош (Kamolon Osh)', en: 'Kamolon Plov (Kamolon Osh)' },
    spot: 'Kamolon Osh',
    address: { ru: 'ул. Самарканд Дарвоза', en: 'Samarqand Darvoza str.' },
    desc: {
      ru: 'Традиционный ташкентский плов для ценителей. Нежнейшее мясо и насыщенный вкус.',
      en: 'Traditional Tashkent Plov for true foodies. Tender meat and rich flavor.'
    },
    rating: '4.8',
    query: 'Kamolon Osh Tashkent'
  }
];

const categoryFilters = [
  { key: 'all', label: { ru: 'Всё', en: 'All' } },
  { key: 'favorites', label: { ru: '❤️ Избранное', en: '❤️ Favorites' } },
  { key: 'cyber', label: { ru: '🖥️ Компьютерные клубы', en: '🖥️ Gaming Clubs' } },
  { key: 'hotels', label: { ru: '🏨 Отели', en: '🏨 Hotels' } },
  { key: 'shopping', label: { ru: '🛍️ Рынки и ТЦ', en: '🛍️ Markets & Malls' } },
];

function mapsUrl(place) {
  const query = encodeURIComponent(place.maps_query || `${place.name} ${place.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function yandexTaxiUrl(place) {
  const searchStr = encodeURIComponent(`Ташкент ${place.name} ${place.address}`);
  return `https://yandex.ru/maps/?text=${searchStr}`;
}

function speakText(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=uz&client=tw-ob`;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'uz-UZ';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    });
  } catch (e) {
    console.error('TTS Audio Error:', e);
  }
}

export default function App() {
  const [language, setLanguage] = useState('ru');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  // ФУНКЦИЯ КОПИРОВАНИЯ И ШЕРИНГА ССЫЛКИ, КОТОРАЯ СНАЧАЛА ВЕДЕТ НА ВАШ САЙТ
  const sharePlaceLink = async (placeId) => {
    // Генерация ссылки вашего сайта с якорем/хэшем
    const currentSiteUrl = window.location.origin + window.location.pathname;
    const directUrl = `${currentSiteUrl}#place-${placeId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Foreigner.uz — Путеводитель',
          text: 'Посмотри это место в Ташкенте!',
          url: directUrl,
        });
      } else {
        await navigator.clipboard.writeText(directUrl);
        alert(`Ссылка скопирована! При переходе открывается ваш сайт прямо на этом месте: ${directUrl}`);
      }
    } catch (e) {
      console.error('Share error:', e);
    }
  };

  const t = (path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], translations[language] || translations.ru) || path;
  };

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return placesData.filter((place) => {
      const matchesCategory =
        activeCategory === 'all'
          ? true
          : activeCategory === 'favorites'
          ? favorites.includes(place.id)
          : place.type === activeCategory;

      const matchesSearch =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, favorites, searchQuery]);

  // Скролл к конкретному месту при загрузке ссылки с хэшем (#place-id)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#place-')) {
      const targetId = hash.replace('#place-', '');
      setTimeout(() => {
        const el = document.getElementById(`place-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.border = '2px solid #fbbf24';
        }
      }, 500);
    }
  }, []);

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <nav className="nav container">
          <a href="#top" className="brand">Foreigner.uz</a>
          <div className="nav-links">
            <a href="#must-eat">{t('nav.eat')}</a>
            <a href="#phrasebook">{t('nav.phrasebook')}</a>
            <a href="#places">{t('nav.places')}</a>
            <button type="button" className="lang-toggle" onClick={() => setLanguage(l => l === 'ru' ? 'en' : 'ru')}>
              🌐 {t('nav.language')}
            </button>
          </div>
        </nav>

        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow">TASTKENT GUIDE</p>
            <h1>{t('hero.headline')}</h1>
            <p className="lead">{t('hero.description')}</p>
          </div>
        </div>
      </header>

      <main>
        {/* РАЗГОВОРНИК ТУРИСТА С ИСПРАВЛЕНИЕМ BU NIMA? */}
        <section id="phrasebook" className="section container">
          <div className="section-title">
            <p className="eyebrow">🗣️ TOURIST PHRASEBOOK</p>
            <h2>{t('phrasebook.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('phrasebook.subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {PHRASEBOOK_LIST.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '18px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fbbf24' }}>{item.uzbek}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>[{item.translit}]</div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => speakText(item.uzbek)}
                    style={{ background: 'rgba(251, 191, 36, 0.2)', border: '1px solid #fbbf24', color: '#fbbf24', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🔊
                  </button>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', fontSize: '0.9rem' }}>
                  <div style={{ color: '#e2e8f0' }}>🇷🇺 <strong>RU:</strong> {item.ru}</div>
                  <div style={{ color: '#e2e8f0' }}>🇬🇧 <strong>EN:</strong> {item.en}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* СПИСОК МЕСТ И КОМПЬЮТЕРНЫХ КЛУБОВ С НОВЫМИ ЦЕНАМИ И ШЕРИНГОМ ССЫЛОК */}
        <section id="places" className="section container">
          <div className="section-title">
            <p className="eyebrow">📍 LOCATIONS</p>
            <h2>{t('places.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('places.subtitle')}</p>
          </div>

          {/* Фильтры и поиск */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {categoryFilters.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`btn ${activeCategory === cat.key ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat.label[language] || cat.label.ru}
              </button>
            ))}
          </div>

          <div className="card-grid">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                id={`place-${place.id}`}
                className="detail-panel"
                style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '20px', borderRadius: '18px', transition: 'all 0.3s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {place.type === 'cyber' ? '🖥️ Компьютерный клуб' : place.type}
                  </span>
                  <button onClick={() => toggleFavorite(place.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                    {favorites.includes(place.id) ? '❤️' : '🤍'}
                  </button>
                </div>

                <h3 style={{ color: '#fff', margin: '0 0 8px' }}>{language === 'en' ? place.name_en : place.name}</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '12px' }}>{language === 'en' ? place.description_en : place.description}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 6px' }}>📍 <strong>Адрес:</strong> {language === 'en' ? place.address_en : place.address}</p>
                <p style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', margin: '0 0 16px' }}>💰 <strong>Цены:</strong> {place.price}</p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a href={mapsUrl(place)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary small" style={{ textDecoration: 'none' }}>
                    📍 {t('places.google')}
                  </a>
                  <a href={yandexTaxiUrl(place)} target="_blank" rel="noopener noreferrer" className="btn btn-primary small" style={{ textDecoration: 'none', background: '#f59e0b', color: '#000', border: 'none', fontWeight: 'bold' }}>
                    🚖 {t('places.taxi')}
                  </a>
                  <button onClick={() => sharePlaceLink(place.id)} className="btn btn-secondary small" style={{ cursor: 'pointer' }}>
                    🔗 {t('places.share')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}