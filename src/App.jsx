import { useEffect, useMemo, useState } from 'react';
import placesData from '../data/places.json';

const translations = {
  ru: {
    nav: { about: 'О продукте', places: 'Места', eat: 'Must Eat', souvenirs: 'Сувениры', phrasebook: 'Разговорник', rates: 'Курс', language: 'RU' },
    hero: {
      headline: 'Полезный путеводитель по Ташкенту: где жить, что посмотреть и где вкусно поесть.',
      description: 'Foreigner.uz собирает лучшие отели, рестораны, рынки, клиники, АЗС, сувениры и узбекский разговорник в одном месте.',
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
      stationLabel: '🚇 Станция:',
      transferLabel: '🔄 Пересадка на станцию',
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
      subtitle: 'Фразы, которые вызовут уважение местных и помогут на базаре или в такси.',
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
      description: 'Foreigner.uz collects top hotels, restaurants, markets, clinics, souvenirs and an Uzbek phrasebook in one place.',
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
      stationLabel: '🚇 Station:',
      transferLabel: '🔄 Transfer to station',
    },
    weather: {
      title: '☀️ Tashkent Live Weather',
      loading: 'Loading weather...',
      temp: 'Temperature:',
      wind: 'Wind:',
      humidity: 'Humidity:',
    },
    mustEat: {
      title: '🍲 Must Eat in Tashkent',
      subtitle: 'Essential Uzbek dishes and iconic spots where you must try them.',
      tipTitle: '💡 Plov Pro Tip:',
      tipDesc: 'Plov is cooked fresh daily and served for lunch! Prime time to visit Plov Centers is 11:30 AM – 1:30 PM. After 2:00 PM the best batches are usually sold out.',
    },
    phrasebook: {
      title: '🗣️ Uzbek Tourist Phrasebook',
      subtitle: 'Phrases to impress locals and help at markets or in taxis.',
    },
    souvenirs: {
      title: '🏺 What to bring from Uzbekistan (Souvenirs)',
      subtitle: 'Best authentic gifts and best places to buy them.',
      whereLabel: '📍 Where to buy:',
    }
  },
  uz: {
    nav: { about: 'Haqida', places: 'Joylar', eat: 'Taomlar', souvenirs: 'Esodaliklar', phrasebook: 'So‘zlashgich', rates: 'Kurs', language: 'UZ' },
    hero: {
      headline: 'Toshkent bo‘ylab qulay qo‘llanma: qayerda yashash, nimani ko‘rish va maza qilib ovqatlanish.',
      description: 'Foreigner.uz eng yaxshi mehmonxonalar, restoranlar, bozorlar, klinikalar, esdalik sovg‘alari va so‘zlashgichni bitta joyda jamlaydi.',
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
      subtitle: 'Jonli kurslar va UZS, USD hamda EUR tezkor kalkulyatori.',
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
      stationLabel: '🚇 Bekat:',
      transferLabel: '🔄 O‘tish bekati:',
    },
    weather: {
      title: '☀️ Toshkentdagi Ob-havo',
      loading: 'Ob-havo yuklanmoqda...',
      temp: 'Harorat:',
      wind: 'Shamoli:',
      humidity: 'Namlik:',
    },
    mustEat: {
      title: '🍲 Toshkentda Must Eat',
      subtitle: 'O‘zbek milliy taomlari va ularni tatib ko‘rish kerak bo‘lgan afsonaviy maskanlar.',
      tipTitle: '💡 Palov bo‘yicha maslahat:',
      tipDesc: 'Toshkentda palov ertalabdan damlanadi va tushlikda yeyiladi! Oshxonalarga borish uchun eng qulay vaqt — 11:30 dan 13:30 gacha. Soat 14:00 dan keyin palov tugab qolishi mumkin.',
    },
    phrasebook: {
      title: '🗣️ O‘zbekcha iboralar (Sayyohlar uchun)',
      subtitle: 'Bozorda yoki taksida asqotadigan eng kerakli iboralar.',
    },
    souvenirs: {
      title: '🏺 O‘zbekistondan nima olib ketish kerak',
      subtitle: 'Eng yaxshi esdalik sovg‘alari va ularni qulay narxda sotib olish joylari.',
      whereLabel: '📍 Qayerdan sotib olish kerak:',
    }
  },
};

const PHRASEBOOK_LIST = [
  { uzbek: "Assalomu alaykum!", translit: "Ассалому алайкум!", ru: "Здравствуйте!", en: "Hello / Peace be upon you!" },
  { uzbek: "Rahmat!", translit: "Рахмат!", ru: "Спасибо!", en: "Thank you!" },
  { uzbek: "Necha pul?", translit: "Неч пул?", ru: "Сколько стоит?", en: "How much is it?" },
  { uzbek: "Arzonroq qilib bering", translit: "Арзонрок килиб беринг", ru: "Сделайте скидку (подешевле)", en: "Can you give a discount?" },
  { uzbek: "Juda shirin!", translit: "Жуда ширин!", ru: "Очень вкусно!", en: "Very delicious!" },
  { uzbek: "Hisobni keltiring", translit: "Хисобни келтиринг", ru: "Принесите счёт", en: "Bring the bill, please" },
  { uzbek: "Xayr / Salomat bo'ling", translit: "Хайр / Саломат булинг", ru: "До свидания / Будьте здоровы", en: "Goodbye / Stay healthy" }
];

const SOUVENIRS_LIST = [
  {
    icon: "🏺",
    title: { ru: "Риштанская Керамика", en: "Rishtan Ceramics", uz: "Rishton Keramikasi" },
    desc: {
      ru: "Знаменитая сине-голубая ляган-посуда и пиалы ручной работы с узорами.",
      en: "Famous blue-and-turquoise handmade ceramic plates (lyagan) & tea cups.",
      uz: "O‘zbekistonning mashhur qo‘lda ishlangan ko‘k-havorang lagan va piyolalari."
    },
    where: "Chorsu Bazaar / Abulkasym Medrese"
  },
  {
    icon: "🧣",
    title: { ru: "Икат, Адрас и Сюзане", en: "Ikat & Suzani", uz: "Ikat, Adras va So‘zana" },
    desc: {
      ru: "Шёлковые ткани (адрас), шарфы и настенные вышитые полотна сюзане.",
      en: "Handwoven silk fabrics (Ikat/Adras), scarves, and embroidered Suzani wall hangings.",
      uz: "Ipak va paxta matolari (adras), ro‘mollar va qo‘lda tikilgan so‘zanalar."
    },
    where: "Chorsu Bazaar Art Alley"
  },
  {
    icon: "🌰",
    title: { ru: "Сухофрукты и Орехи", en: "Dry Fruits & Nuts", uz: "Quritilgan mevalar va yong‘oqlar" },
    desc: {
      ru: "Самаркандский изюм, курага, солёные косточки урюка (шондона) и миндаль.",
      en: "Samarkand raisins, dried apricots, salted apricot seeds (shondona) and almonds.",
      uz: "Samarqand mayizi, turshak, sho‘r dasta va bodomlar."
    },
    where: "Chorsu Bazaar (Row 3-4)"
  }
];

const routeCards = [
  {
    id: 'day',
    title: { ru: 'Дневной маршрут', en: 'Day route', uz: 'Kunduzgi yo‘nalish' },
    subtitle: { ru: 'Прогулка, рынок и вкусный обед.', en: 'Walk, market and a tasty lunch.', uz: 'Sayr, bozor va mazali tushlik.' },
    items: [
      { ru: 'Утро: Чорсу и местные завтраки', en: 'Morning: Chorsu and local breakfast', uz: 'Ertalab: Chorsu va mahalliy nonushta' },
      { ru: 'Обед: Настоящий Ташкентский плов в Besh Qozon', en: 'Lunch: Authentic Tashkent Plov at Besh Qozon', uz: 'Tushlik: Besh Qozonda haqiqiy Toshkent palovi' },
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
      { ru: 'Коктейли и сочный шашлык', en: 'Cocktails and juicy shashlik', uz: 'Kokteyllar va sersharbat shashlik' },
      { ru: 'Панорамный вид с телебашни', en: 'Panoramic view from the TV tower', uz: 'Teleminoradan panoramali manzara' },
    ],
  },
];

const MUST_EAT_LIST = [
  {
    id: 'plov-beshqozon',
    rank: '🏆 №1 PLOV CENTER',
    dish: { ru: 'Ташкентский Плов (Besh Qozon)', en: 'Tashkent Plov (Besh Qozon)', uz: 'Toshkent Palovi (Besh Qozon)' },
    spot: 'Центр Плова (Besh Qozon)',
    address: { ru: 'ул. Ифтихор, 1 (около Телебашни)', en: 'Iftikhor str. 1 (near TV Tower)', uz: 'Iftxor ko‘ch. 1 (Teleminora yonida)' },
    desc: {
      ru: 'Легендарный центр плова №1 в Узбекистане. Огромные казаны, свежее мясо, перепелиные яйца и казы.',
      en: 'The #1 legendary Plov Center in Uzbekistan. Huge cauldrons, fresh meat, quail eggs, and kazy.',
      uz: 'O‘zbekistondagi №1 afsonaviy osh markazi. Ulkan qozonlar, yangi go‘sht, bedana tuxumi va qazi.'
    },
    rating: '4.9',
    query: 'Besh Qozon Tashkent'
  },
  {
    id: 'plov-kamolon',
    rank: '🥈 №2 PLOV CENTER',
    dish: { ru: 'Камолон Ош (Kamolon Osh)', en: 'Kamolon Plov (Kamolon Osh)', uz: 'Kamolon Osh' },
    spot: 'Kamolon Osh',
    address: { ru: 'ул. Самарканд Дарвоза', en: 'Samarqand Darvoza str.', uz: 'Samarqand Darvoza ko‘ch.' },
    desc: {
      ru: 'Традиционный ташкентский плов для ценителей. Нежнейшее мясо и насыщенный вкус.',
      en: 'Traditional Tashkent Plov for true foodies. Tender meat and rich flavor.',
      uz: 'Chaqqon va shirin an’anaviy Toshkent oshining haqiqiy shinavandalari uchun.'
    },
    rating: '4.8',
    query: 'Kamolon Osh Tashkent'
  },
  {
    id: 'somsa',
    rank: '🥐 MUST TRY',
    dish: { ru: 'Тандырная Самса (Зафар / Сомсахона)', en: 'Tandoor Somsa', uz: 'Tandir Somsa' },
    spot: 'Центральные Самсахоны',
    address: { ru: 'Рынок Чорсу / ул. Чиланзар', en: 'Chorsu Bazaar / Chilanzar str.', uz: 'Chorsu bozori / Chilonzor' },
    desc: {
      ru: 'Хрустящее слоёное тесто прямо из тандыра с сочным рубленым мясом и луком.',
      en: 'Crispy tandoor somsa with juicy chopped meat and onions.',
      uz: 'Tandirdan uzilgan qat-qat va sersharbat to‘g‘ralgan go‘shtli somsa.'
    },
    rating: '4.8',
    query: 'Chorsu Somsa Tashkent'
  },
  {
    id: 'shashlik',
    rank: '🥩 MUST TRY',
    dish: { ru: 'Узбекский Шашлык (Молотый & Кусковой)', en: 'Uzbek Shashlik (Kebab)', uz: 'O‘zbek Shashligi' },
    spot: 'Chustiy / Кафе на Чиланзаре',
    address: { ru: 'Ташкент, ул. Гагарина', en: 'Gagarin str., Tashkent', uz: 'Gagarin ko‘ch., Toshkent' },
    desc: {
      ru: 'Ароматный шашлык на углях с маринованным луком и горячей лепёшкой.',
      en: 'Flavorful charcoal-grilled meat served with pickled onions and fresh flatbread.',
      uz: 'Ko‘mda pishirilgan xushbo‘y shashlik, pijoz va issiq non bilan.'
    },
    rating: '4.7',
    query: 'Shashlik Tashkent'
  }
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

const FULL_METRO_STATIONS = [
  // 🔴 Чиланзарская линия
  { id: 'chinar', name: { ru: 'Чинар (14-Бекат)', en: 'Chinar (Station 14)', uz: 'Chinor (14-Bekat)' }, line: { ru: '🔴 Чиланзарская (Сергели)', en: '🔴 Chilanzar Line (Sergeli)', uz: '🔴 Chilonzor yo‘nalishi' }, x: 100, y: 390, isInterchange: false, info: { ru: 'Конечная Сергелийской надземной ветки.', en: 'Terminus of the Sergeli elevated section.', uz: 'Sergeli yerusti yo‘nalishining oxirgi bekati.' } },
  { id: 'olmazor', name: { ru: 'Олмазор', en: 'Olmazor', uz: 'Olmazor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 180, y: 340, isInterchange: true, interchangeWith: 'Кипчак / Kipchak', info: { ru: '🔄 Пересадка на Кольцевую надземную линию (Станция Кипчак).', en: '🔄 Transfer to Circle Elevated Line (Kipchak Station).', uz: '🔄 Yerusti Halqa yo‘nalishiga o‘tish bekati (Qipchoq bekati).' } },
  { id: 'chilonzor', name: { ru: 'Чиланзар', en: 'Chilanzar', uz: 'Chilonzor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 230, y: 310, isInterchange: false, info: { ru: 'Крупный жилой массив, торговые ряды и кафе.', en: 'Large residential neighborhood, retail areas and cafes.', uz: 'Yirik turar-joy massivi, savdo qatorlari va kafelar.' } },
  { id: 'mirzo_ulugbek', name: { ru: 'Мирзо Улугбек', en: 'Mirzo Ulugbek', uz: 'Mirzo Ulug‘bek' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 280, y: 280, isInterchange: false, info: { ru: 'Стадион Бунёдкор и парк Гафура Гуляма.', en: 'Bunyodkor Stadium and Gafur Gulyam Park.', uz: 'Bunyodkor stadioni va G‘afur G‘ulom bog‘i.' } },
  { id: 'novza', name: { ru: 'Новза', en: 'Novza', uz: 'Novza' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 330, y: 250, isInterchange: false, info: { ru: 'Мечеть Новза и торговые комплексы.', en: 'Novza Mosque and shopping centers.', uz: 'Novza masjidi va savdo majmualari.' } },
  { id: 'milliy_bog', name: { ru: 'Миллий Бог', en: 'Milliy Bog', uz: 'Milliy Bog‘' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 370, y: 230, isInterchange: false, info: { ru: 'Национальный парк Узбекистана, Magic City.', en: 'National Park of Uzbekistan, Magic City theme park.', uz: 'O‘zbekiston Milliy bog‘i va Magic City.' } },
  { id: 'pakhtakor', name: { ru: 'Пахтакор', en: 'Pakhtakor', uz: 'Paxtakor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 410, y: 210, isInterchange: true, interchangeWith: 'Алишер Навои / Alisher Navoi', info: { ru: '🔄 ПЕРЕСАДКА на Узбекистанскую (синюю) линию! Рядом Tashkent City Mall.', en: '🔄 TRANSFER to Uzbekistan (Blue) Line! Next to Tashkent City Mall.', uz: '🔄 O‘zbekiston (ko‘k) yo‘nalishiga O‘TISH! Tashkent City Mall yonida.' } },
  { id: 'amir_timur', name: { ru: 'Амир Тимур Хиёбони', en: 'Amir Timur Square', uz: 'Amir Temur Xiyoboni' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 470, y: 210, isInterchange: true, interchangeWith: 'Юнус Раджаби / Yunus Rajabi', info: { ru: '🔄 ПЕРЕСАДКА на Юнусабадскую (зелёную) линию! Центр города, Сквер, Отель Узбекистан.', en: '🔄 TRANSFER to Yunusabad (Green) Line! City center, Square, Hotel Uzbekistan.', uz: '🔄 Yunusobod (yashil) yo‘nalishiga O‘TISH! Shahar markazi, Amir Temur xiyoboni.' } },
  { id: 'khamid_olimjon', name: { ru: 'Хамид Олимджан', en: 'Khamid Olimjan', uz: 'Hamid Olimjon' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 530, y: 210, isInterchange: false, info: { ru: 'Площадь Х.Олимджана, жилые высотки.', en: 'Kh. Olimjan Square and residential towers.', uz: 'H.Olimjon maydoni va baland turar-joylar.' } },
  { id: 'pushkin', name: { ru: 'Пушкин', en: 'Pushkin', uz: 'Pushkin' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 580, y: 210, isInterchange: false, info: { ru: 'Старый город, парковые зоны.', en: 'Historic district and park spaces.', uz: 'Eski shahar, bog‘lar zonalari.' } },
  { id: 'buyuk_ipak_yuli', name: { ru: 'Буюк Ипак Йули', en: 'Buyuk Ipak Yuli', uz: 'Buyuk Ipak Yo‘li' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi' }, x: 640, y: 210, isInterchange: false, info: { ru: 'Конечная красной линии, выезд на Чирчик и Газалкент.', en: 'Terminus of the Red Line, exit towards Chirchik and Gazalkent.', uz: 'Qizil yo‘nalishning oxirgi bekati, Chirchiq va G‘azalkentga chiqish.' } },

  // 🔵 Узбекистанская линия
  { id: 'beruni', name: { ru: 'Беруни', en: 'Beruni', uz: 'Beruniy' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 250, y: 110, isInterchange: false, info: { ru: 'ВУЗгородок, Национальный Университет (НУУз).', en: 'University Campus, National University (NUUz).', uz: 'Talabalar shaharchasi, O‘zbekiston Milliy Universiteti.' } },
  { id: 'tinchlik', name: { ru: 'Тинчлик', en: 'Tinchlik', uz: 'Tinchlik' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 300, y: 130, isInterchange: false, info: { ru: 'Тихий жилой район, автосалоны.', en: 'Quiet residential neighborhood, car dealerships.', uz: 'Sokin turar-joy hududi, avtosalonlar.' } },
  { id: 'chorsu', name: { ru: 'Чорсу', en: 'Chorsu', uz: 'Chorsu' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 350, y: 160, isInterchange: false, info: { ru: '🛒 Знаменитый Базар Чорсу, старый город, сувениры и восточные сладости.', en: '🛒 Famous Chorsu Bazaar, Old City, souvenirs and oriental sweets.', uz: '🛒 Mashhur Chorsu bozori, eski shahar, esdalik sovg‘alari va shirinliklar.' } },
  { id: 'gofur_gulom', name: { ru: 'Гафур Гулям', en: 'Gafur Gulyam', uz: 'G‘afur G‘ulom' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 380, y: 180, isInterchange: false, info: { ru: 'Ташкентский Цирк, полиграфический комплекс.', en: 'Tashkent Circus, publishing complexes.', uz: 'Toshkent sirk, matbaa majmuasi.' } },
  { id: 'navoi', name: { ru: 'Алишер Навои', en: 'Alisher Navoi', uz: 'Alisher Navoiy' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 410, y: 190, isInterchange: true, interchangeWith: 'Пахтакор / Pakhtakor', info: { ru: '🔄 ПЕРЕСАДКА на Чиланзарскую (красную) линию! Самая красивая резная станция.', en: '🔄 TRANSFER to Chilanzar (Red) Line! Highly decorated carving interior.', uz: '🔄 Chilonzor (qizil) yo‘nalishiga O‘TISH! Eng go‘zal o‘ykor bekat.' } },
  { id: 'kosmonavtlar', name: { ru: 'Космонавтов', en: 'Kosmonavtlar', uz: 'Kosmonavtlar' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 470, y: 270, isInterchange: false, info: { ru: 'Интерьер в стиле космоса, МВД, парк Голубые купола.', en: 'Space-themed interior, Ministry of Internal Affairs, Blue Domes Park.', uz: 'Kosmik uslubdagi interyer, Ichki ishlar vazirligi, Moviy gumbazlar bog‘i.' } },
  { id: 'oybek', name: { ru: 'Ойбек', en: 'Oybek', uz: 'Oybek' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 510, y: 310, isInterchange: true, interchangeWith: 'Мингурик / Mingurik', info: { ru: '🔄 ПЕРЕСАДКА на Юнусабадскую (зелёную) линию (Мингурик). ФармИнститут.', en: '🔄 TRANSFER to Yunusabad (Green) Line (Mingurik station). Pharmaceutical Institute.', uz: '🔄 Yunusobod (yashil) yo‘nalishiga O‘TISH (Ming o‘rik). Farmatsevtika instituti.' } },
  { id: 'tashkent', name: { ru: 'Ташкент (Вокзал)', en: 'Tashkent (Railway Station)', uz: 'Toshkent (Vokzal)' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 560, y: 340, isInterchange: false, info: { ru: '🚆 Главный Северный Железнодорожный Вокзал (Скоростные поезда Афрасиаб).', en: '🚆 Main Northern Railway Station (Afrasiyab High-Speed Trains to Samarkand).', uz: '🚆 Asosiy Shimoliy Temir Yo‘l Vokzali (Afrosiyob tezurar poyezdlari).' } },
  { id: 'mashinasozlar', name: { ru: 'Машиностроителей', en: 'Mashinosozlar', uz: 'Mashinasozlar' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 620, y: 340, isInterchange: false, info: { ru: 'Промышленная зона, электроаппарат.', en: 'Industrial zone and electrical equipment sector.', uz: 'Sanoat zonasi, elektr apparat zavodi.' } },
  { id: 'dustlik', name: { ru: 'Дустлик', en: 'Dustlik', uz: 'Do‘stlik' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi' }, x: 680, y: 340, isInterchange: true, interchangeWith: 'Технопарк / Technopark', info: { ru: '🔄 ПЕРЕСАДКА на Надземную Кольцевую линию (Станция Технопарк).', en: '🔄 TRANSFER to Circle Elevated Line (Technopark Station).', uz: '🔄 Yerusti Halqa yo‘nalishiga O‘TISH (Texnopark bekati).' } },

  // 🟢 Юнусабадская линия
  { id: 'turkiston', name: { ru: 'Туркистон', en: 'Turkiston', uz: 'Turkiston' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 470, y: 50, isInterchange: false, info: { ru: 'Север Юнусабада, ТРЦ Mega Planet.', en: 'North Yunusabad district, Mega Planet Mall.', uz: 'Yunusobod shimoli, Mega Planet KO‘M.' } },
  { id: 'yunusobod', name: { ru: 'Юнусабад', en: 'Yunusobod', uz: 'Yunusobod' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 470, y: 90, isInterchange: false, info: { ru: 'Юнусабадский базар и теннисный комплекс.', en: 'Yunusabad Bazaar and tennis complex.', uz: 'Yunusobod bozori va tennis majmuasi.' } },
  { id: 'shahriston', name: { ru: 'Шахристан', en: 'Shahriston', uz: 'Shahriston' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 470, y: 120, isInterchange: false, info: { ru: 'Набережная реки Бозсу, транспортная развязка.', en: 'Bozsu River embankment, transit hub.', uz: 'Bozsuv daryosi bo‘yi, yo‘l o‘tkazgich.' } },
  { id: 'bodomzor', name: { ru: 'Бодомзор', en: 'Bodomzor', uz: 'Bodomzor' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 470, y: 150, isInterchange: false, info: { ru: '📺 Ташкентская Телебашня, Узэкспоцентр, Аквапарк.', en: '📺 Tashkent TV Tower, Uzexpocentre, Aquapark.', uz: '📺 Toshkent Teleminorasi, O‘zekspomarkaz, Akvapark.' } },
  { id: 'minor', name: { ru: 'Минор', en: 'Minor', uz: 'Minor' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 470, y: 175, isInterchange: false, info: { ru: '🕌 Белоснежная мечеть Минор и набережная канала Анхор.', en: '🕌 White Minor Mosque and Anhor Canal promenade.', uz: '🕌 Oppoq Minor masjidi va Anhor kanali bo‘yi.' } },
  { id: 'yunus_rajabi', name: { ru: 'Юнус Раджаби', en: 'Yunus Rajabi', uz: 'Yunus Rajabiy' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 470, y: 195, isInterchange: true, interchangeWith: 'Амир Тимур / Amir Timur', info: { ru: '🔄 ПЕРЕСАДКА на Чиланзарскую (красную) линию! Самая глубокая станция.', en: '🔄 TRANSFER to Chilanzar (Red) Line! Deepest station in Tashkent.', uz: '🔄 Chilonzor (qizil) yo‘nalishiga O‘TISH! Eng chuqur bekat.' } },
  { id: 'mingurik', name: { ru: 'Мингурик', en: 'Mingurik', uz: 'Ming O‘rik' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi' }, x: 510, y: 330, isInterchange: true, interchangeWith: 'Ойбек / Oybek', info: { ru: '🔄 ПЕРЕСАДКА на Узбекистанскую (синюю) линию (Ойбек). Рядом Северный Вокзал.', en: '🔄 TRANSFER to Uzbekistan (Blue) Line (Oybek). Near Northern Station.', uz: '🔄 O‘zbekiston (ko‘k) yo‘nalishiga O‘TISH (Oybek). Shimoliy Vokzal yonida.' } },

  // 🩵 Все 14 станций Кольцевой
  { id: 'technopark', name: { ru: 'Технопарк (1-Бекат)', en: 'Technopark (Station 1)', uz: 'Texnopark (1-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 700, y: 340, isInterchange: true, interchangeWith: 'Дустлик / Dustlik', info: { ru: '🔄 ПЕРЕСАДКА на синюю линию (Дустлик). Начало надземного кольца.', en: '🔄 TRANSFER to Blue Line (Dustlik). Start of elevated circle.', uz: '🔄 Ko‘k yo‘nalishga O‘TISH (Do‘stlik). Yerusti halqasi boshi.' } },
  { id: 'yashnobod', name: { ru: 'Яшнабад (2-Бекат)', en: 'Yashnabad (Station 2)', uz: 'Yashnobod (2-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 700, y: 370, isInterchange: false, info: { ru: 'Эстакада над Яшнабадским районом.', en: 'Elevated viaduct over Yashnabad district.', uz: 'Yashnobod tumani yerusti ko‘prigi.' } },
  { id: 'tuzel', name: { ru: 'Тузель (3-Бекат)', en: 'Tuzel (Station 3)', uz: 'Tuzel (3-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 690, y: 400, isInterchange: false, info: { ru: 'Массив Тузель, локальный рынок.', en: 'Tuzel neighborhood, local market.', uz: 'Tuzel massivi, mahalliy bozor.' } },
  { id: 'olmos', name: { ru: 'Олмос (4-Бекат)', en: 'Olmos (Station 4)', uz: 'Olmos (4-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 660, y: 425, isInterchange: false, info: { ru: 'Жилой квартал Олмос.', en: 'Olmos residential area.', uz: 'Olmos turar-joy dahasi.' } },
  { id: 'rohat', name: { ru: 'Рохат (5-Бекат)', en: 'Rohat (Station 5)', uz: 'Rohat (5-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 620, y: 440, isInterchange: false, info: { ru: 'Круг Рохат, Ахангаранское шоссе.', en: 'Rohat roundabout, Akhangaran highway.', uz: 'Rohat aylanasi, Ohangaron yo‘li.' } },
  { id: 'yangiabad', name: { ru: 'Янгиабад (6-Бекат)', en: 'Yangiabad (Station 6)', uz: 'Yangiabod (6-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 570, y: 440, isInterchange: false, info: { ru: 'Рынок Янгиабад.', en: 'Yangiabad market area.', uz: 'Yangiabod bozori dahasi.' } },
  { id: 'quyliq', name: { ru: 'Куйлюк (7-Бекат)', en: 'Kuyluk (Station 7)', uz: 'Qo‘yliq (7-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 510, y: 440, isInterchange: false, info: { ru: '🛒 Вещевой и продуктовый рынок Куйлюк, ТРЦ Compass.', en: '🛒 Kuyluk bazaar, produce market, Compass Shopping Mall.', uz: '🛒 Qo‘yliq kiyim va oziq-ovqat bozori, Compass KO‘M.' } },
  { id: 'matonat', name: { ru: 'Матонат (8-Бекат)', en: 'Matonat (Station 8)', uz: 'Matonat (8-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 440, y: 440, isInterchange: false, info: { ru: 'Массив Сергели-2, жилая застройка.', en: 'Sergeli-2 neighborhood.', uz: 'Sergeli-2 massivi, turar-joylar.' } },
  { id: 'qiyot', name: { ru: 'Кыйот (9-Бекат)', en: 'Kiyot (Station 9)', uz: 'Qiyot (9-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 380, y: 430, isInterchange: false, info: { ru: 'Район Кыёт, Сергели.', en: 'Kiyot sector in Sergeli district.', uz: 'Sergelidagi Qiyot hududi.' } },
  { id: 'toshkent_halqa', name: { ru: 'Тошкент Халка Йули (10-Бекат)', en: 'Tashkent Ring Road (Station 10)', uz: 'Toshkent Halqa Yo‘li (10-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 320, y: 415, isInterchange: false, info: { ru: 'Ташкентская кольцевая автомобильная дорога.', en: 'Tashkent ring motorway interchange.', uz: 'Toshkent halqa avtomobil yo‘li.' } },
  { id: 'quruvchilar', name: { ru: 'Курувчилар (11-Бекат)', en: 'Kuruvchilar (Station 11)', uz: 'Quruvchilar (11-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 250, y: 395, isInterchange: false, info: { ru: 'Массив Строителей (Курувчилар).', en: 'Kuruvchilar residential sector.', uz: 'Quruvchilar massivi.' } },
  { id: 'turan', name: { ru: 'Турон (12-Бекат)', en: 'Turan (Station 12)', uz: 'Turon (12-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 210, y: 380, isInterchange: false, info: { ru: 'Район Турон.', en: 'Turan sub-district.', uz: 'Turon dahasi.' } },
  { id: 'kipchak', name: { ru: 'Кипчак (13-Бекат)', en: 'Kipchak (Station 13)', uz: 'Qipchoq (13-Bekat)' }, line: { ru: '🩵 Кольцевая Надземная', en: '🩵 Circle Elevated Line', uz: '🩵 Yerusti Halqa yo‘nalishi' }, x: 180, y: 365, isInterchange: true, interchangeWith: 'Олмазор / Olmazor', info: { ru: '🔄 ПЕРЕСАДКА на красную ветку (Олмазор). Соединение с Сергели.', en: '🔄 TRANSFER to Red Line (Olmazor). Linking Sergeli section.', uz: '🔄 Qizil yo‘nalishga O‘TISH (Olmazor). Sergeli bilan bog‘lanish.' } },
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

  // ПОГОДА В ТАШКЕНТЕ
  const [weatherData, setWeatherData] = useState(null);

  // Калькулятор Валют
  const [calcAmount, setCalcAmount] = useState(100);
  const [calcFrom, setCalcFrom] = useState('USD');
  const [calcTo, setCalcTo] = useState('UZS');

  // Выбранная станция на схеме Метро
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

  const fetchWeather = async () => {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.2995&longitude=69.2401&current_weather=true&hourly=relativehumidity_2m');
      const data = await res.json();
      if (data?.current_weather) {
        setWeatherData({
          temp: Math.round(data.current_weather.temperature),
          wind: data.current_weather.windspeed,
          humidity: data.hourly?.relativehumidity_2m?.[0] || '45'
        });
      }
    } catch (e) {
      console.warn('Weather fetch error', e);
    }
  };

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
    fetchWeather();
    const interval = setInterval(() => {
      fetchRates();
      fetchWeather();
    }, 6 * 60 * 60 * 1000);
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
            <a href="#must-eat">{t('nav.eat')}</a>
            <a href="#phrasebook">{t('nav.phrasebook')}</a>
            <a href="#souvenirs">{t('nav.souvenirs')}</a>
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
              <a href="#must-eat" className="btn btn-primary">🍲 Must Eat Plov</a>
              <a href="#phrasebook" className="btn btn-secondary">🗣️ Phrasebook</a>
              <a href="https://t.me/foreigneruz_bot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('hero.telegram')}</a>
            </div>
          </div>

          <div className="hero-panel">
            {/* WEATHER WIDGET */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#fbbf24', fontSize: '1rem' }}>{t('weather.title')}</h4>
                <span style={{ fontSize: '1.4rem' }}>🌤️</span>
              </div>
              {weatherData ? (
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <div><strong>{weatherData.temp}°C</strong></div>
                  <div>💨 {weatherData.wind} km/h</div>
                  <div>💧 {weatherData.humidity}%</div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '8px 0 0' }}>{t('weather.loading')}</p>
              )}
            </div>

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
        {/* PHRASEBOOK SECTION */}
        <section id="phrasebook" className="section container">
          <div className="section-title">
            <p className="eyebrow">🗣️ TOURIST PHRASEBOOK</p>
            <h2>{t('phrasebook.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('phrasebook.subtitle')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {PHRASEBOOK_LIST.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '18px', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>{item.uzbek}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>[{item.translit}]</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: '#e2e8f0' }}>🇷🇺 <strong>RU:</strong> {item.ru}</div>
                  <div style={{ color: '#e2e8f0' }}>🇬🇧 <strong>EN:</strong> {item.en}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SOUVENIRS SECTION */}
        <section id="souvenirs" className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">🏺 SOUVENIRS GUIDE</p>
            <h2>{t('souvenirs.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('souvenirs.subtitle')}</p>
          </div>

          <div className="card-grid">
            {SOUVENIRS_LIST.map((item, idx) => (
              <div key={idx} className="detail-panel" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '20px', borderRadius: '18px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.2rem' }}>{getTranslatedText(item.title, language)}</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 12px' }}>{getTranslatedText(item.desc, language)}</p>
                <div style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block' }}>
                  {t('souvenirs.whereLabel')} {item.where}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MUST EAT SECTION */}
        <section id="must-eat" className="section container">
          <div className="section-title">
            <p className="eyebrow">🍲 GOURMET GUIDE</p>
            <h2>{t('mustEat.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('mustEat.subtitle')}</p>
          </div>

          <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '18px 24px', borderRadius: '16px', marginBottom: '32px' }}>
            <h4 style={{ margin: 0, color: '#fbbf24', fontSize: '1.1rem' }}>{t('mustEat.tipTitle')}</h4>
            <p style={{ margin: '6px 0 0', color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.5' }}>{t('mustEat.tipDesc')}</p>
          </div>

          <div className="card-grid">
            {MUST_EAT_LIST.map((item) => (
              <div key={item.id} className="detail-panel" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '24px', borderRadius: '20px' }}>
                <span style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  {item.rank}
                </span>
                <h3 style={{ color: '#fff', margin: '12px 0 6px', fontSize: '1.3rem' }}>{getTranslatedText(item.dish, language)}</h3>
                <p style={{ color: '#fbbf24', fontWeight: 'bold', margin: '0 0 10px', fontSize: '0.95rem' }}>📍 {item.spot} · ⭐ {item.rating}</p>
                <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 16px' }}>{getTranslatedText(item.desc, language)}</p>
                
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary small"
                  style={{ textDecoration: 'none', display: 'inline-block', width: '100%', textAlign: 'center' }}
                >
                  📍 {t('places.google')}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* TOURIST FAQ SECTION */}
        <section className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">💡 Foreigner.uz Survival Kit</p>
            <h2>{t('faq.title')}</h2>
          </div>

          <div className="card-grid">
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

        {/* METRO MAP SECTION */}
        <section className="section container">
          <div className="section-title">
            <p className="eyebrow">🚇 FULL INTERACTIVE METRO</p>
            <h2>{t('metro.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '8px' }}>{t('metro.subtitle')}</p>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.15)', padding: '24px', borderRadius: '24px' }}>
            <div style={{ position: 'relative', overflowX: 'auto', background: '#070d1e', padding: '24px', borderRadius: '16px', border: '1px solid #ffffff15' }}>
              <svg viewBox="0 0 780 480" style={{ width: '100%', minWidth: '680px', height: 'auto' }}>
                <path d="M 100 390 L 180 340 L 410 210 L 640 210" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 250 110 L 410 190 L 470 270 L 560 340 L 680 340" fill="none" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 470 50 L 470 210 L 510 330" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 680 340 L 700 340 L 700 370 L 690 400 L 660 425 L 620 440 L 570 440 L 510 440 L 440 440 L 380 430 L 320 415 L 250 395 L 210 380 L 180 365" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="8,4" strokeLinecap="round" strokeLinejoin="round" />

                <line x1="410" y1="210" x2="410" y2="190" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                <line x1="470" y1="210" x2="470" y2="195" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                <line x1="510" y1="310" x2="510" y2="330" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                <line x1="180" y1="340" x2="180" y2="365" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />
                <line x1="680" y1="340" x2="700" y2="340" stroke="#fbbf24" strokeWidth="4" strokeDasharray="3,3" />

                {FULL_METRO_STATIONS.map((st) => {
                  const isSelected = selectedMetroStation?.id === st.id;
                  const stationName = getTranslatedText(st.name, language);
                  return (
                    <g key={st.id} onClick={() => setSelectedMetroStation(st)} style={{ cursor: 'pointer' }}>
                      {st.isInterchange && (
                        <circle cx={st.x} cy={st.y} r={isSelected ? 13 : 10} fill="none" stroke="#fbbf24" strokeWidth="3" />
                      )}
                      <circle cx={st.x} cy={st.y} r={isSelected ? 8 : (st.isInterchange ? 6 : 5)} fill={isSelected ? '#10b981' : '#ffffff'} stroke="#000000" strokeWidth="2" />
                      <text x={st.x} y={st.y - (st.isInterchange ? 14 : 10)} fill={isSelected ? '#10b981' : '#f8fafc'} fontSize={isSelected ? '12' : '10'} fontWeight={isSelected || st.isInterchange ? 'bold' : 'normal'} textAnchor="middle">
                        {stationName}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', fontSize: '0.85rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔴 {language === 'en' ? 'Chilanzar' : language === 'uz' ? 'Chilonzor' : 'Чиланзарская'}</span>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>🔵 {language === 'en' ? 'Uzbekistan' : language === 'uz' ? 'O‘zbekiston' : 'Узбекистанская'}</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>🟢 {language === 'en' ? 'Yunusabad' : language === 'uz' ? 'Yunusobod' : 'Юнусабадская'}</span>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>🩵 {language === 'en' ? 'Elevated Circle' : language === 'uz' ? 'Yerusti Halqa' : 'Кольцевая Надземная'}</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>🟡 {language === 'en' ? 'Double Ring = Interchange' : language === 'uz' ? 'Ikki halqa = O‘tish bekati' : 'Двойной круг = Пересадка'}</span>
              </div>
            </div>

            {selectedMetroStation && (
              <div style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(251, 191, 36, 0.6)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.3rem' }}>
                    {t('metro.stationLabel')} {getTranslatedText(selectedMetroStation.name, language)}
                  </h3>
                  <span style={{ background: '#ffffff22', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', color: '#fff' }}>
                    {getTranslatedText(selectedMetroStation.line, language)}
                  </span>
                </div>
                
                <p style={{ color: '#e2e8f0', fontSize: '1rem', marginTop: '10px', lineHeight: '1.5' }}>
                  {getTranslatedText(selectedMetroStation.info, language)}
                </p>

                {selectedMetroStation.isInterchange && (
                  <div style={{ marginTop: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b98144', padding: '10px 14px', borderRadius: '10px', color: '#34d399', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {t('metro.transferLabel')} «{selectedMetroStation.interchangeWith}»
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

        {/* RATES & CURRENCY CONVERTER */}
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
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: '#fff', fontSize: '1rem', outline: 'none' }}
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
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#222', color: '#fff', fontSize: '1rem', outline: 'none' }}
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
                        position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', zIndex: 2
                      }}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>

                    <span className="badge">{getTypeLabel(place, language)}</span>
                    <h4>{getPlaceField(place, 'name', language)}</h4>
                    <p className="muted">{(place.average_check || place.price_level) ? `${place.average_check || place.price_level} · ` : ''}⭐ {place.rating}</p>
                    <p>{getPlaceField(place, 'description', language)}</p>
                    <p className="address"><strong>{t('places.location')}:</strong> {getPlaceField(place, 'address', language)}</p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <a href={mapsUrl(place, language)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary small" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                        📍 {t('places.google')}
                      </a>
                      <a href={yandexTaxiUrl(place, language)} target="_blank" rel="noopener noreferrer" className="btn btn-primary small" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none' }}>
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
                    position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', zIndex: 2
                  }}
                >
                  {favorites.includes(place.id) ? '❤️' : '🤍'}
                </button>

                <span className="badge-secondary">{getTypeLabel(place, language)}</span>
                <h3>{getPlaceField(place, 'name', language)}</h3>
                <p>{getPlaceField(place, 'description', language)}</p>
                <p className="address"><strong>{t('places.location')}:</strong> {getPlaceField(place, 'address', language)}</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <a href={mapsUrl(place, language)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary small" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                    📍 {t('places.google')}
                  </a>
                  <a href={yandexTaxiUrl(place, language)} target="_blank" rel="noopener noreferrer" className="btn btn-primary small" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none' }}>
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
              <button key={route.id} type="button" className={`route-btn ${activeRoute === route.id ? 'active' : ''}`} onClick={() => setActiveRoute(route.id)}>
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