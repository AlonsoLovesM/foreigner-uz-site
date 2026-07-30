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
    rate: {
      title: 'Курсы валют ЦБ РУз & Калькулятор',
      subtitle: 'Актуальный курс и мгновенный конвертер UZS, USD и EUR.',
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
      title: '🚇 Интерактивная Карта Метро Ташкента',
      subtitle: 'Нажмите на любую станцию или пересадочный узел на схеме!',
      legendTitle: '📌 Пересадочные узлы:',
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
    rate: {
      title: 'CBU Exchange Rates & Converter',
      subtitle: 'Live rates and instant converter for UZS, USD and EUR.',
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
      title: '🚇 Tashkent Interactive Metro Map',
      subtitle: 'Click any station or transfer hub on the map below!',
      legendTitle: '📌 Transfer Hubs:',
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
    rate: {
      title: 'MB Valyuta kurslari & Kalkulyator',
      subtitle: 'Jonli kurslar va UZS, USD hamda EUR tekor kalkulyatori.',
      loaded: 'Yangilandi',
      tip: 'Valyutani qulay kursda almashtirish uchun ishonchli banklar va bankomatlardan foydalaning.',
      refresh: 'Kursni yangilash',
      error: 'Kursni yuklab bo‘lmadi. Keyinroq urinib ko‘ring.',
      calcTitle: '🧮 Valyuta kalkulyatori',
      amountLabel: 'Miqdor:',
      fromLabel: 'Dan:',
      toLabel: 'Ga:',
      resultLabel: 'Natija:',
    },
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
      title: '🚇 Toshkent Metropoliteni Interaktiv Xaritasi',
      subtitle: 'Tafsilotlar uchun istalgan bekat yoki o‘tish joyini bosing!',
      legendTitle: '📌 O‘tish tugunlari:',
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

// ПОЛНАЯ БАЗА СТАНЦИЙ МЕТРО ТАШКЕНТА (ПОДЗЕМКА + НАДЗЕМКА + ПЕРЕСАДКИ)
const FULL_METRO_STATIONS = [
  // 🔴 Чиланзарская линия (Красная)
  { id: 'chinar', name: 'Чинар (14-Бекат)', line: '🔴 Чиланзарская (Сергели)', x: 100, y: 390, isInterchange: false, info: 'Конечная Сергелийской надземной ветки.' },
  { id: 'olmazor', name: 'Олмазор', line: '🔴 Чиланзарская', x: 180, y: 340, isInterchange: true, interchangeWith: 'Кипчак', info: '🔄 Пересадка на Кольцевую надземную линию (Станция Кипчак).' },
  { id: 'chilonzor', name: 'Чиланзар', line: '🔴 Чиланзарская', x: 230, y: 310, isInterchange: false, info: 'Крупный жилой массив, торговые ряды и кафе.' },
  { id: 'mirzo_ulugbek', name: 'Мирзо Улугбек', line: '🔴 Чиланзарская', x: 280, y: 280, isInterchange: false, info: 'Стадион Бунёдкор и парк Гафура Гуляма.' },
  { id: 'novza', name: 'Новза', line: '🔴 Чиланзарская', x: 330, y: 250, isInterchange: false, info: 'Мечеть Новза и торговые комплексы.' },
  { id: 'milliy_bog', name: 'Миллий Бог', line: '🔴 Чиланзарская', x: 370, y: 230, isInterchange: false, info: 'Национальный парк Узбекистана, Magic City.' },
  { id: 'pakhtakor', name: 'Пахтакор', line: '🔴 Чиланзарская', x: 410, y: 210, isInterchange: true, interchangeWith: 'Алишер Навои', info: '🔄 ПЕРЕСАДКА на Узбекистанскую (синюю) линию! Рядом Tashkent City Mall и стадион.' },
  { id: 'amir_timur', name: 'Амир Тимур Хиёбони', line: '🔴 Чиланзарская', x: 470, y: 210, isInterchange: true, interchangeWith: 'Юнус Раджаби', info: '🔄 ПЕРЕСАДКА на Юнусабадскую (зелёную) линию! Центр города, Сквер, Отель Узбекистан.' },
  { id: 'khamid_olimjon', name: 'Хамид Олимджан', line: '🔴 Чиланзарская', x: 530, y: 210, isInterchange: false, info: 'Площадь Х.Олимджана, жилые высотки.' },
  { id: 'pushkin', name: 'Пушкин', line: '🔴 Чиланзарская', x: 580, y: 210, isInterchange: false, info: 'Старый город, парковые зоны.' },
  { id: 'buyuk_ipak_yuli', name: 'Буюк Ипак Йули', line: '🔴 Чиланзарская', x: 640, y: 210, isInterchange: false, info: 'Конечная красной линии, выезд на Чирчик и Газалкент.' },

  // 🔵 Узбекистанская линия (Синяя)
  { id: 'beruni', name: 'Беруни', line: '🔵 Узбекистанская', x: 250, y: 110, isInterchange: false, info: 'ВУЗгородок, Национальный Университет (НУУз).' },
  { id: 'tinchlik', name: 'Тинчлик', line: '🔵 Узбекистанская', x: 300, y: 130, isInterchange: false, info: 'Тихий жилой район, автосалоны.' },
  { id: 'chorsu', name: 'Чорсу', line: '🔵 Узбекистанская', x: 350, y: 160, isInterchange: false, info: '🛒 Знаменитый Базар Чорсу, старый город, сувениры, восточные сладости.' },
  { id: 'gofur_gulom', name: 'Гафур Гулям', line: '🔵 Узбекистанская', x: 380, y: 180, isInterchange: false, info: 'Цирк, типография.' },
  { id: 'navoi', name: 'Алишер Навои', line: '🔵 Узбекистанская', x: 410, y: 190, isInterchange: true, interchangeWith: 'Пахтакор', info: '🔄 ПЕРЕСАДКА на Чиланзарскую (красную) линию! Самая красивая резная станция.' },
  { id: 'kosmonavtlar', name: 'Космонавтов', line: '🔵 Узбекистанская', x: 470, y: 270, isInterchange: false, info: 'Интерьер в стиле космоса, МВД, Интерпол, парк Голубые купола.' },
  { id: 'oybek', name: 'Ойбек', line: '🔵 Узбекистанская', x: 510, y: 310, isInterchange: true, interchangeWith: 'Мингурик', info: '🔄 ПЕРЕСАДКА на Юнусабадскую (зелёную) линию (Мингурик). ФармИнститут.' },
  { id: 'tashkent', name: 'Ташкент (Вокзал)', line: '🔵 Узбекистанская', x: 560, y: 340, isInterchange: false, info: '🚆 Главный Северный Железнодорожный Вокзал (Скоростные поезда Афрасиаб).' },
  { id: 'mashinasozlar', name: 'Машиностроителей', line: '🔵 Узбекистанская', x: 620, y: 340, isInterchange: false, info: 'Заводской район, электроаппарат.' },
  { id: 'dustlik', name: 'Дустлик', line: '🔵 Узбекистанская', x: 680, y: 340, isInterchange: true, interchangeWith: 'Технопарк', info: '🔄 ПЕРЕСАДКА на Надземную Кольцевую линию (Станция Технопарк).' },

  // 🟢 Юнусабадская линия (Зелёная)
  { id: 'turkiston', name: 'Туркистон', line: '🟢 Юнусабадская', x: 470, y: 50, isInterchange: false, info: 'Север Юнусабада, ТРЦ Mega Planet.' },
  { id: 'yunusobod', name: 'Юнусабад', line: '🟢 Юнусабадская', x: 470, y: 90, isInterchange: false, info: 'Юнусабадский базар и теннисный корт.' },
  { id: 'shahriston', name: 'Шахристан', line: '🟢 Юнусабадская', x: 470, y: 120, isInterchange: false, info: 'Река Бозсу, выезд на обводную.' },
  { id: 'bodomzor', name: 'Бодомзор', line: '🟢 Юнусабадская', x: 470, y: 150, isInterchange: false, info: '📺 Ташкентская Телебашня, Узэкспоцентр, Аквапарк.' },
  { id: 'minor', name: 'Минор', line: '🟢 Юнусабадская', x: 470, y: 175, isInterchange: false, info: '🕌 Белоснежная мечеть Минор и набережная канала Анхор.' },
  { id: 'yunus_rajabi', name: 'Юнус Раджаби', line: '🟢 Юнусабадская', x: 470, y: 195, isInterchange: true, interchangeWith: 'Амир Тимур', info: '🔄 ПЕРЕСАДКА на Чиланзарскую (красную) линию! Самая глубокая станция.' },
  { id: 'mingurik', name: 'Мингурик', line: '🟢 Юнусабадская', x: 510, y: 330, isInterchange: true, interchangeWith: 'Ойбек', info: '🔄 ПЕРЕСАДКА на Узбекистанскую (синюю) линию (Ойбек). Рядом Северный Вокзал.' },

  // 🩵 Кольцевая Надземная линия (Голубая / 30-летия Независимости)
  { id: 'technopark', name: 'Технопарк (1-Бекат)', line: '🩵 Кольцевая Надземная', x: 700, y: 340, isInterchange: true, interchangeWith: 'Дустлик', info: '🔄 ПЕРЕСАДКА на синюю линию (Дустлик). Начало надземного кольца.' },
  { id: 'yashnobod', name: 'Яшнабад (2-Бекат)', line: '🩵 Кольцевая Надземная', x: 700, y: 390, isInterchange: false, info: 'Яшнабадский район, эстакадный пролёт.' },
  { id: 'tuzel', name: 'Тузель (3-Бекат)', line: '🩵 Кольцевая Надземная', x: 670, y: 430, isInterchange: false, info: 'Массив Тузель, рынок.' },
  { id: 'quyliq', name: 'Куйлюк (7-Бекат)', line: '🩵 Кольцевая Надземная', x: 500, y: 440, isInterchange: false, info: '🛒 Крупный вещевой и продуктовый рынок Куйлюк, ТРЦ Compass.' },
  { id: 'kipchak', name: 'Кипчак (12-Бекат)', line: '🩵 Кольцевая Надземная', x: 180, y: 365, isInterchange: true, interchangeWith: 'Олмазор', info: '🔄 ПЕРЕСАДКА на красную ветку (Олмазор). Соединение с Сергели.' },
];

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

export default function App() {
  const [language, setLanguage] = useState('ru');
  const [activeCard, setActiveCard] = useState('places');
  const [activeRoute, setActiveRoute] = useState(routeCards[0].id);
  const [activeCategory, setActiveCategory] = useState('all');

  const [usdRate, setUsdRate] = useState(null);
  const [eurRate, setEurRate] = useState(null);
  const [rateUpdated, setRateUpdated] = useState('');
  const [rateError, setRateError] = useState(false);

  // Калькулятор Валют
  const [calcAmount, setCalcAmount] = useState(100);
  const [calcFrom, setCalcFrom] = useState('USD');
  const [calcTo, setCalcTo] = useState('UZS');

  // Выбранная станция на схеме Метро (по умолчанию Пахтакор)
  const [selectedMetroStation, setSelectedMetroStation] = useState(FULL_METRO_STATIONS[6]);

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
      console.warn('Не удалось загрузить с ЦБ РУз', e);
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
      console.error('Резервный API недоступен', err);
    }

    setRateError(true);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calculatedResult = useMemo(() => {
    if (!usdRate || !eurRate || !calcAmount || Number.isNaN(Number(calcAmount))) return '—';

    const ratesInUzs = { UZS: 1, USD: usdRate, EUR: eurRate };
    const amountInUzs = calcAmount * ratesInUzs[calcFrom];
    const result = amountInUzs / ratesInUzs[calcTo];

    return calcTo === 'UZS' 
      ? Math.round(result).toLocaleString('ru-RU') 
      : result.toFixed(2).toLocaleString('en-US');
  }, [calcAmount, calcFrom, calcTo, usdRate, eurRate]);

  const routeItems = selectedRoute?.items || [];

  return (
    <div className="page-shell">
      <header className="hero" id="top">
        <nav className="nav container">
          <a href="#top" className="brand">Foreigner.uz</a>
          
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

        {/* FULL VECTOR METRO MAP SECTION */}
        <section className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">🚇 FULL INTERACTIVE METRO</p>
            <h2>{t('metro.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '8px' }}>{t('metro.subtitle')}</p>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.15)', padding: '24px', borderRadius: '24px' }}>
            
            {/* SVG MAP CONTAINER */}
            <div style={{ position: 'relative', overflowX: 'auto', background: '#070d1e', padding: '24px', borderRadius: '16px', border: '1px solid #ffffff15' }}>
              <svg viewBox="0 0 780 480" style={{ width: '100%', minWidth: '680px', height: 'auto' }}>
                {/* LINE PATHS */}
                {/* Red Line */}
                <path d="M 100 390 L 180 340 L 410 210 L 640 210" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Blue Line */}
                <path d="M 250 110 L 410 190 L 470 270 L 560 340 L 680 340" fill="none" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Green Line */}
                <path d="M 470 50 L 470 210 L 510 330" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Ring Line (Elevated) */}
                <path d="M 680 340 L 700 340 L 700 390 L 670 430 L 500 440 L 180 365" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="8,4" strokeLinecap="round" strokeLinejoin="round" />

                {/* TRANSFER CONNECTOR DASHES */}
                {/* Pakhtakor ↔ Navoi */}
                <line x1="410" y1="210" x2="410" y2="190" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                {/* Amir Timur ↔ Yunus Rajabi */}
                <line x1="470" y1="210" x2="470" y2="195" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                {/* Oybek ↔ Mingurik */}
                <line x1="510" y1="310" x2="510" y2="330" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                {/* Olmazor ↔ Kipchak */}
                <line x1="180" y1="340" x2="180" y2="365" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                {/* Dustlik ↔ Technopark */}
                <line x1="680" y1="340" x2="700" y2="340" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />

                {/* STATIONS CIRCLES & LABELS */}
                {FULL_METRO_STATIONS.map((st) => {
                  const isSelected = selectedMetroStation?.id === st.id;
                  return (
                    <g key={st.id} onClick={() => setSelectedMetroStation(st)} style={{ cursor: 'pointer' }}>
                      {/* Outer Golden Ring for Interchange */}
                      {st.isInterchange && (
                        <circle cx={st.x} cy={st.y} r={isSelected ? 13 : 10} fill="none" stroke="#fbbf24" strokeWidth="3" />
                      )}
                      
                      {/* Station Dot */}
                      <circle
                        cx={st.x}
                        cy={st.y}
                        r={isSelected ? 8 : (st.isInterchange ? 6 : 5)}
                        fill={isSelected ? '#10b981' : '#ffffff'}
                        stroke="#000000"
                        strokeWidth="2"
                      />
                      
                      {/* Station Name Label */}
                      <text
                        x={st.x}
                        y={st.y - (st.isInterchange ? 14 : 10)}
                        fill={isSelected ? '#10b981' : '#f8fafc'}
                        fontSize={isSelected ? '12' : '10'}
                        fontWeight={isSelected || st.isInterchange ? 'bold' : 'normal'}
                        textAnchor="middle"
                      >
                        {st.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* MAP LEGEND */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', fontSize: '0.85rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 Чиланзарская</span>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>🔵 Узбекистанская</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>🟢 Юнусабадская</span>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>🩵 Кольцевая Надземная</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🟡 Двойной круг = Пересадка</span>
              </div>
            </div>

            {/* DYNAMIC CARD FOR SELECTED STATION */}
            {selectedMetroStation && (
              <div style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(251, 191, 36, 0.6)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.3rem' }}>
                    🚇 Станция: {selectedMetroStation.name}
                  </h3>
                  <span style={{ background: '#ffffff22', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', color: '#fff' }}>
                    {selectedMetroStation.line}
                  </span>
                </div>
                
                <p style={{ color: '#e2e8f0', fontSize: '1rem', marginTop: '10px', lineHeight: '1.5' }}>
                  {selectedMetroStation.info}
                </p>

                {selectedMetroStation.isInterchange && (
                  <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b98144', padding: '10px 14px', borderRadius: '10px', color: '#34d399', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    🔄 Пересадочный узел на станцию «{selectedMetroStation.interchangeWith}»
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

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

        {/* RATES & CURRENCY CONVERTER CALCULATOR */}
        <section id="rates" className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">💰 CURRENCY & CONVERTER</p>
            <h2>{t('rate.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('rate.subtitle')}</p>
          </div>
          
          <div className="rate-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="rate-card">
              <span className="eyebrow">USD & EUR → UZS</span>
              <h3 className="rate-value" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.4rem', margin: '16px 0' }}>
                <div>💵 <b>USD:</b> {usdRate ? `${formatRate(usdRate, language)} sum` : rateError ? t('rate.error') : '...'}</div>
                <div>💶 <b>EUR:</b> {eurRate ? `${formatRate(eurRate, language)} sum` : rateError ? t('rate.error') : '...'}</div>
              </h3>
              <p>{rateError ? '' : `${t('rate.loaded')}: ${rateUpdated}`}</p>
              <button type="button" className="btn btn-secondary small" onClick={fetchRates} style={{ marginTop: '12px' }}>
                {t('rate.refresh')}
              </button>
            </div>

            <div className="rate-card" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '24px', borderRadius: '16px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.2rem', color: '#fbbf24' }}>{t('rate.calcTitle')}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>{t('rate.amountLabel')}</label>
                  <input 
                    type="number" 
                    value={calcAmount} 
                    onChange={(e) => setCalcAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(0,0,0,0.4)',
                      color: '#fff',
                      fontSize: '1.1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>{t('rate.fromLabel')}</label>
                    <select 
                      value={calcFrom} 
                      onChange={(e) => setCalcFrom(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: '#222',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="USD">💵 USD</option>
                      <option value="EUR">💶 EUR</option>
                      <option value="UZS">🇺🇿 UZS</option>
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#ccc', marginBottom: '6px' }}>{t('rate.toLabel')}</label>
                    <select 
                      value={calcTo} 
                      onChange={(e) => setCalcTo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: '#222',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="UZS">🇺🇿 UZS</option>
                      <option value="USD">💵 USD</option>
                      <option value="EUR">💶 EUR</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.5)', padding: '14px', borderRadius: '10px', border: '1px dashed rgba(251, 191, 36, 0.4)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#aaa', display: 'block' }}>{t('rate.resultLabel')}</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
                    {calculatedResult} {calcTo}
                  </div>
                </div>
              </div>
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