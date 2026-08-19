import { useEffect, useMemo, useState } from 'react';
import placesData from '../data/places.json';

const translations = {
  ru: {
    nav: { about: 'О продукте', places: 'Места', eat: 'Must Eat', souvenirs: 'Сувениры', phrasebook: 'Разговорник', rates: 'Курс', language: 'RU' },
    hero: {
      headline: 'Полезный путеводитель по Ташкенту: где жить, что посмотреть и где вкусно поесть.',
      description: 'Foreigner.uz собирает лучшие отели, рестораны, рынки, клиники, АЗС, сувениры и узбекский разговорник с озвучкой в одном месте.',
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
    places: { title: 'Полезные места', subtitle: 'Отели, обмен, клиники, рынки и заведения для отдыха.', google: 'Google Maps', taxi: 'Яндекс Go', location: 'Адрес' },
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
    metro: {
      title: '🚇 Интерактивная Карта Метро Ташкента',
      subtitle: 'Нажмите на любую станцию на схеме!',
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
      description: 'Foreigner.uz collects top hotels, restaurants, markets, clinics, souvenirs and an Uzbek phrasebook with audio in one place.',
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
    places: { title: 'Useful places', subtitle: 'Hotels, exchange, clinics, markets and places to relax.', google: 'Google Maps', taxi: 'Yandex Go', location: 'Address' },
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
    metro: {
      title: '🚇 Tashkent Interactive Metro Map',
      subtitle: 'Click any station on the map below!',
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
      subtitle: 'Phrases to impress locals and help at markets. Click 🔊 to pronounce!',
      listenBtn: '🔊 Play Sound',
    },
    souvenirs: {
      title: '🏺 What to bring from Uzbekistan (Souvenirs)',
      subtitle: 'Best authentic gifts and best places to buy them.',
      whereLabel: '📍 Where to buy:',
    }
  },
  hi: {
    nav: { about: 'के बारे में', places: 'स्थान', eat: 'ज़रूर आज़माएँ', souvenirs: 'स्मृति-चिन्ह', phrasebook: 'वाक्यांश', rates: 'दर', language: 'HI' },
    hero: {
      headline: 'ताशकंद के लिए उपयोगी यात्रा मार्गदर्शिका: कहाँ रहना है, क्या देखना है और क्या खाना है।',
      description: 'Foreigner.uz एक ही जगह पर सबसे अच्छे होटल, रेस्तरां, बाजार, क्लिनिक, स्मृति-चिन्ह और उज़्बेक वाक्यांशों को एक साथ प्रस्तुत करता है।',
      action: 'स्थान देखें',
      contact: 'ईमेल लिखें',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'नई चीज़ें',
      subtitle: 'ताशकंद में हर यात्रा करने वाले के लिए एक पूरी जानकारी।',
    },
    cards: {
      places: { title: 'ताशकंद के सबसे अच्छे स्थान', description: 'अपने आसपास के होटल, बाजार, रेस्तरां, विनिमय केंद्र और उपयोगी सेवाएँ खोजें।', accent: 'स्थान' },
      currency: { title: 'मुद्रा दर', description: 'USD, EUR, RUB और CNY की दरें स्वचालित रूप से अपडेट होती हैं।', accent: 'दर' },
      bot: { title: 'Telegram सहायक', description: 'बॉट आपके सवालों का जवाब देगा और ताशकंद के लिए वास्तविक समय में सलाह देगा।', accent: 'सहायक' },
    },
    rate: {
      title: 'CBU मुद्रा दर और कैलकुलेटर',
      subtitle: 'UZS, USD, EUR, RUB, CNY और INR की तात्कालिक दरें।',
      loaded: 'अपडेट किया गया',
      tip: 'अच्छी दर पाने के लिए भरोसेमंद बैंकों या ATM से मुद्रा बदलें।',
      refresh: 'दर रिफ्रेश करें',
      error: 'दर लोड नहीं हो सकी। कृपया बाद में कोशिश करें।',
      calcTitle: '🧮 मुद्रा कैलकुलेटर',
      amountLabel: 'राशि:',
      fromLabel: 'से:',
      toLabel: 'तक:',
      resultLabel: 'परिणाम:',
    },
    places: { title: 'उपयोगी स्थान', subtitle: 'होटल, विनिमय, क्लिनिक, बाजार और आराम करने की जगहें।', google: 'Google Maps', taxi: 'Yandex Go', location: 'पता' },
    favorites: { title: 'सहेजे गए स्थान और यात्रा योजना', subtitle: 'अपने पसंदीदा स्थान बचाएँ और एक छोटी दिन-योजना बनाएं।', empty: 'अभी तक कोई पसंदीदा स्थान नहीं', emptyHint: 'किसी भी स्थान पर ❤️ दबाकर अपना маршрут बनाएँ।', ready: 'सहेजा गया', show: 'पसंदीदा दिखाएँ', clear: 'साफ करें', planTitle: 'छोटा маршрут', stepLabel: 'कदम' },
    mustVisit: { title: 'ज़रूर देखें', subtitle: 'खरीदारी, sightseeing और अनुभवों के लिए ताशकंद के शीर्ष स्थान।' },
    routes: { title: 'मार्ग', subtitle: 'दिन और शाम के लिए तैयार विकल्प।' },
    download: { pre: 'जल्द ही आपके फोन पर', title: 'ऐप खोलें और एक ऐसा मार्ग पाएं जो आपकी यात्रा को आसान और रंगीन बना दे।', text: 'हम ऐसे उत्पाद बना रहे हैं जिससे आप समय बर्बाद किए बिना अधिक देखें।' },
    planner: {
      title: 'ताशकंद के लिए तैयार маршрут',
      subtitle: 'अपने रफ्तार के अनुसार प्रारूप चुनें: जल्दी दिन, पूरा दिन या सप्ताहांत।',
      vibeLabel: 'प्रारूप चुनें:',
      modes: { quick: 'तुरंत दिन', full: 'पूरा दिन', weekend: 'सप्ताहांत' },
      resultTitle: 'संतुलित दिन-योजना',
      resultDesc: 'यह एक दिन या कई दिनों के लिए भी काम करता है — आसानी से छोटा या बड़ा किया जा सकता है।',
      stepLabel: 'कदम',
      maps: 'नक्शा',
      taxi: 'टैक्सी',
      call: 'कॉल',
    },
    faq: {
      title: 'यात्री मार्गदर्शिका',
      subtitle: 'शहर में सहज रहने के लिए जरूरी जानकारी।',
      metroTitle: '🚇 मेट्रो भुगतान',
      metroDesc: 'टर्नस्टाइल पर सीधे बैंक कार्ड (Visa, Mastercard, Humo, Uzcard) या NFC फोन से भुगतान किया जा सकता है। नकद से टिकट काउंटर पर QR-पर्ची खरीदी जा सकती है (1700 UZS)।',
      restTitle: '🍽️ टिपिंग और सेवा शुल्क',
      restDesc: 'अधिकतर रेस्तरां में बिल में 10–15% सेवा शुल्क पहले से जुड़ा होता है। अतिरिक्त टिप देना वैकल्पिक है।',
    },
    metro: {
      title: '🚇 ताशकंद इंटरैक्टिव मेट्रो मानचित्र',
      subtitle: 'नीचे दिए गए किसी भी स्टेशन पर क्लिक करें!',
      legendTitle: '📌 ट्रांसफ़र हब:',
      linesTitle: '🔴 मेट्रो लाइनें:',
      stationLabel: '🚇 स्टेशन:',
      transferLabel: '🔄 स्टेशन पर बदलें',
    },
    weather: {
      title: '☀️ ताशकंद में मौसम',
      loading: 'मौसम लोड हो रहा है...',
      temp: 'तापमान:',
      wind: 'हवा:',
      humidity: 'नमी:',
    },
    mustEat: {
      title: '🍲 ताशकंद में ज़रूर आज़माएँ',
      subtitle: 'उज़्बेक व्यंजनों और उनके प्रसिद्ध स्थान जहाँ उन्हें कोशिश करना चाहिए।',
      tipTitle: '💡 प्लोव टिप:',
      tipDesc: 'ताशकंद में प्लोव सुबह बनाया जाता है और दोपहर में परोसा जाता है! इसे खाने का सबसे अच्छा समय 11:30 से 13:30 तक है। 14:00 के बाद सबसे अच्छा प्लोव खत्म हो सकता है।',
    },
    phrasebook: {
      title: '🗣️ उज़्बेक पर्यटक वाक्यांश',
      subtitle: 'स्थानीय लोगों के साथ अच्छा संबंध बनाने के लिए उपयोगी वाक्य। 🔊 पर क्लिक करें!',
      listenBtn: '🔊 आवाज़ सुनें',
    },
    souvenirs: {
      title: '🏺 उज़्बेकिस्तान से क्या लाएँ (स्मृति-चिन्ह)',
      subtitle: 'सबसे अच्छे उपहार और उन्हें खरीदने के सबसे अच्छे स्थान।',
      whereLabel: '📍 कहाँ खरीदें:',
    }
  },
  uz: {
    nav: { about: 'Haqida', places: 'Joylar', eat: 'Taomlar', souvenirs: 'Esodaliklar', phrasebook: 'So‘zlashgich', rates: 'Kurs', language: 'UZ' },
    hero: {
      headline: 'Toshkent bo‘ylab qulay qo‘llanma: qayerda yashash, nimani ko‘rish va maza qilib ovqatlanish.',
      description: 'Foreigner.uz eng yaxshi mehmonxonalar, restoranlar, bozorlar, klinikalar, esdalik sovg‘alari va ovozli so‘zlashgichni bitta joyda jamlaydi.',
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
      currency: { title: 'Valyuta kursi', description: 'USD, EUR, RUB va CNY valyuta kurslari avtomatik yangilanadi.', accent: 'Kurs' },
      bot: { title: 'Telegram yordamchi', description: 'Bot savollarga javob beradi va real vaqt rejimida Toshkent bo‘yicha maslahat beradi.', accent: 'Bot' },
    },
    rate: {
      title: 'MB Valyuta kurslari & Kalkulyator',
      subtitle: 'Jonli kurslar va UZS, USD, EUR, RUB hamda CNY tezkor kalkulyatori.',
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
    favorites: { title: 'Tanlanganlar va sayohat rejasi', subtitle: 'Yoqtirgan joylaringizni saqlang va qisqa kunlik marshrut yarating.', empty: 'Hozircha saqlangan joylar yo‘q', emptyHint: 'Har qanday joyda ❤️ bosib marshrutni yarating.', ready: 'Saqlangan', show: 'Tanlanganlarni ko‘rsatish', clear: 'Tozalash', planTitle: 'Qisqa marshrut', stepLabel: 'Qadam' },
    mustVisit: { title: 'Tashrif buyurish shart', subtitle: 'Toshkentdagi sayr, xarid va taassurotlar uchun eng yaxshi maskanlar.' },
    routes: { title: 'Yo‘nalishlar', subtitle: 'Kunduzgi va kechki tayyor yo‘nalishlar.' },
    download: { pre: 'Tez orada telefoningizda', title: 'Ilovani oching va safaringizni yorqinroq qiladigan marshrutni oling.', text: 'Biz vaqtingizni bekorga sarflamasdan ko‘proq narsani ko‘rishingiz uchun mahsulot yaratmoqdamiz.' },
    planner: {
      title: 'Toshkent uchun tayyor marshrut',
      subtitle: 'Sizning tezligingizga mos formatni tanlang: tez kun, to‘liq kun yoki dam olish kunlari.',
      vibeLabel: 'Formatni tanlang:',
      modes: { quick: 'Tez kun', full: 'To‘liq kun', weekend: 'Dam olish' },
      resultTitle: 'O‘rtacha kunlik marshrut',
      resultDesc: 'Bu bir kunlik ham, shaharda bir necha kun qolish uchun ham mos — osonlik bilan qisqartirish yoki cho‘zish mumkin.',
      stepLabel: 'Qadam',
      maps: 'Xarita',
      taxi: 'Taksi',
      call: 'Qo‘ng‘iroq',
    },
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
      subtitle: 'Tafsilotlar uchun istalgan bekatni bosing!',
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
      subtitle: 'Bozorda yoki taksida asqotadigan eng kerakli iboralar. Ovozni eshitish uchun 🔊 bosing!',
      listenBtn: '🔊 Ovoz berish',
    },
    souvenirs: {
      title: '🏺 O‘zbekistondan nima olib ketish kerak',
      subtitle: 'Eng yaxshi esdalik sovg‘alari va ularni qulay narxda sotib olish joylari.',
      whereLabel: '📍 Qayerdan sotib olish kerak:',
    }
  },
  kk: {
    nav: { about: 'Туралы', places: 'Орындар', eat: 'Must Eat', souvenirs: 'Сувенирлер', phrasebook: 'Сөйлеу сөздігі', rates: 'Баға', language: 'KK' },
    hero: {
      headline: 'Ташкенттегі пайдалы саяхат нұсқаулығы: қайда тұру, не көретініміз және қайда жақсы жеу.',
      description: 'Foreigner.uz бір жерде ең жақсы қонақ үйлер, мейрамханалар, базарлар, клиникалар, сувенирлер және дыбыстық өзбекше сөйлеу сөздігін жинайды.',
      action: 'Орындарды қарау',
      contact: 'Поштаға жазу',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'Не жаңалық',
      subtitle: 'Ташкенттегі әрбір турист үшін толық анықтама жинағы.',
    },
    cards: {
      places: { title: 'Ташкенттегі үздік орындар', description: 'Жақын жерде қонақ үйлер, базарлар, мейрамханалар, валюта айырбастау пункттері мен пайдалы қызметтерді табыңыз.', accent: 'Орындар' },
      currency: { title: 'Валюта бағамы', description: 'USD, EUR, RUB және CNY бағамдары автоматты түрде жаңартылады.', accent: 'Баға' },
      bot: { title: 'Telegram көмекшісі', description: 'Бот сұрақтарға жауап беріп, Ташкент туралы нақты уақытта кеңес береді.', accent: 'Бот' },
    },
    rate: {
      title: 'CBU валюта бағамы & калькулятор',
      subtitle: 'USD, EUR, RUB, CNY және UZS үшін нақты баға және жылдам конвертер.',
      loaded: 'Жаңартылды',
      tip: 'Жақсы баға алу үшін валюта айырбастау үшін сенімді банктер мен банкоматтарды таңдаңыз.',
      refresh: 'Бағаны жаңарту',
      error: 'Бағаларды жүктеу мүмкін болмады. Кейінірек қайталап көріңіз.',
      calcTitle: '🧮 Валюта калькуляторы',
      amountLabel: 'Сома:',
      fromLabel: 'Кімнен:',
      toLabel: 'Кімге:',
      resultLabel: 'Нәтиже:',
    },
    places: { title: 'Пайдалы орындар', subtitle: 'Қонақ үйлер, валюта айырбастау, клиникалар, базарлар және демалу орындары.', google: 'Google Maps', taxi: 'Yandex Go', location: 'Мекенжай' },
    favorites: { title: 'Сақталған орындар мен сапар жоспары', subtitle: 'Ұнайтын орындарды сақтап, қысқа күндік маршрут құрыңыз.', empty: 'Әзірге сақталған орындар жоқ', emptyHint: 'Кез келген орынға ❤️ басып маршрут құра бастау.', ready: 'Сақталды', show: 'Сақталғандарды көрсету', clear: 'Тазалау', planTitle: 'Қысқа маршрут', stepLabel: 'Қадам' },
    mustVisit: { title: 'Көріп шығу керек', subtitle: 'Ташкенттегі ең қызықты орындар, сатып алу және әсерлер үшін.' },
    routes: { title: 'Маршруттар', subtitle: 'Күндізгі және кешкі дайын нұсқалар.' },
    download: { pre: 'Жақында телефоныңызда', title: 'Қолданбаны ашып, сапарыңызды жеңілдететін маршрут алыңыз.', text: 'Біз уақытты босқа жоғалтпай көбірек нәрсені көру үшін өнім құрып жатырмыз.' },
    planner: {
      title: 'Бүгінгі дайын маршрут',
      subtitle: 'Сіздің қарқыныңызға сай формат таңдаңыз: тез күн, толық күн немесе демалыс.',
      vibeLabel: 'Формат таңдаңыз:',
      modes: { quick: 'Тез күн', full: 'Толық күн', weekend: 'Демалыс' },
      resultTitle: 'Орташа күндік маршрут',
      resultDesc: 'Бұл бір күн үшін де, қалада бірнеше күн қалу үшін де жарайды — оңай қысқарту немесе созу мүмкін.',
      stepLabel: 'Қадам',
      maps: 'Карта',
      taxi: 'Такси',
      call: 'Қоңырау',
    },
    faq: {
      title: 'Туристерге арналған нұсқаулық',
      subtitle: 'Қаланың ішінде жайлы болу үшін маңызды ақпарат.',
      metroTitle: '🚇 Метро төлеу',
      metroDesc: 'Түрлі банктік карталармен (Visa, Mastercard, Humo, Uzcard) немесе NFC телефонымен турникеттен тікелей төлеуге болады. Нақты ақша арқылы кассада QR-билет сатып алуға болады (1700 UZS).',
      restTitle: '🍽️ Сервиc және чәй',
      restDesc: 'Көптеген мейрамханалар чектерге 10–15% қызмет ақысы автоматты түрде қосады. Қосымша чәй қалдыру міндетті емес.',
    },
    metro: {
      title: '🚇 Ташкент метросының интерактивті картасы',
      subtitle: 'Картадағы кез келген аялдаманы басыңыз!',
      legendTitle: '📌 Ауыстыру түйіндері:',
      linesTitle: '🔴 Метро желілері:',
      stationLabel: '🚇 Станция:',
      transferLabel: '🔄 Ауыстыру станциясы',
    },
    weather: {
      title: '☀️ Ташкенттегі ауа райы',
      loading: 'Ауа райы жүктелуде...',
      temp: 'Температура:',
      wind: 'Жел:',
      humidity: 'Ылғалдылық:',
    },
    mustEat: {
      title: '🍲 Ташкентте Must Eat',
      subtitle: 'Өзбек тағамдары мен оларды дәмдеу үшін әйгілі орындар.',
      tipTitle: '💡 Плов туралы кеңес:',
      tipDesc: 'Ташкентте плов таңертең пісіріліп, түскі уақытта беріледі! Оны жеу үшін ең жақсы уақыт — 11:30-ден 13:30-ға дейін. 14:00ден кейін ең тәттісі таусылып қалуы мүмкін.',
    },
    phrasebook: {
      title: '🗣️ Туристер үшін өзбек сөйлеу сөздігі',
      subtitle: 'Жергілікті тұрғындармен жақсы қарым-қатынаста болу үшін пайдалы фразалар. Дыбысты тыңдау үшін 🔊 басыңыз!',
      listenBtn: '🔊 Дыбысты тыңдау',
    },
    souvenirs: {
      title: '🏺 Өзбекстаннан не алып кетуге болады',
      subtitle: 'Ең жақсы сувенирлер және оларды сатып алудың тиімді орындары.',
      whereLabel: '📍 Қайдан сатып алу керек:',
    }
  },
  ky: {
    nav: { about: 'Жөнүндө', places: 'Жайгашуулар', eat: 'Must Eat', souvenirs: 'Сувенирлер', phrasebook: 'Сөздүк', rates: 'Баасы', language: 'KY' },
    hero: {
      headline: 'Ташкенттеги пайдалуу саякат колдонмосу: кайда жашоо, эмне көрүү жана кайда жеп коюу.',
      description: 'Foreigner.uz бир жерде мыкты мейманканалар, ресторандар, базарлар, клиникалар, сувенирлер жана үн менен угулатылган өзбекче сөздүктү чогултту.',
      action: 'Жайгашууларды караңыз',
      contact: 'Почтага жазуу',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: 'Эмне жаңы',
      subtitle: 'Ташкенттеги ар бир турист үчүн толук маалымат.',
    },
    cards: {
      places: { title: 'Ташкенттин мыкты жайгашуусу', description: 'Жакын жердеги мейманканаларды, базарларды, ресторандарды, валюта алмаштырууну жана пайдалуу кызматтарды табыңыз.', accent: 'Жайгашуулар' },
      currency: { title: 'Валюта курсу', description: 'USD, EUR, RUB жана CNY курстары автоматтык түрдө жаңылат.', accent: 'Курс' },
      bot: { title: 'Telegram жардамчы', description: 'Бот суроолорго жооп берет жана Ташкент жөнүндө реалдуу убакта кеңеш берет.', accent: 'Бот' },
    },
    rate: {
      title: 'CBU валюта курсу & калькулятор',
      subtitle: 'USD, EUR, RUB, CNY жана UZS үчүн реалдуу курс жана тез конвертер.',
      loaded: 'Жаңыланды',
      tip: 'Жакшы курс алуу үчүн ишенимдүү банктер менен банкоматтарды колдонуңуз.',
      refresh: 'Курсту жаңылоо',
      error: 'Курс жүктөлбөдү. Кейинчерээк кайра аракет кылыңыз.',
      calcTitle: '🧮 Валюта калькулятору',
      amountLabel: 'Сумма:',
      fromLabel: 'Кимден:',
      toLabel: 'Кимге:',
      resultLabel: 'Натыйжа:',
    },
    places: { title: 'Пайдалуу жайгашуулар', subtitle: 'Мейманканалар, валюта алмаштыруу, клиникалар, базарлар жана эс алуу жерлери.', google: 'Google Maps', taxi: 'Yandex Go', location: 'Дарек' },
    favorites: { title: 'Сакталган жерлер жана сапар планы', subtitle: 'Ұнай турган жерлерди сактап, кыска күндүк маршрут түзүңүз.', empty: 'Азырынча сакталган жерлер жок', emptyHint: 'Кез келген жерге ❤️ басып маршрут түзө баштаңыз.', ready: 'Сакталды', show: 'Сакталгандарды көрсөтүү', clear: 'Тазалоо', planTitle: 'Кыска маршрут', stepLabel: 'Кадам' },
    mustVisit: { title: 'Көрүү керек', subtitle: 'Ташкенттин эң сонун жерлери, сатып алуу жана тажрыйба үчүн.' },
    routes: { title: 'Маршруттар', subtitle: 'Күндүзгү жана кечки даяр варианттар.' },
    download: { pre: 'Жакында телефонуңузда', title: 'Колдонмону ачып, сапарыңызды жеңилдеткен маршрут алыңыз.', text: 'Биз убактыңызды боско жоготпостон көбүрөөк нерсени көрүү үчүн продукт түзүп жатабыз.' },
    planner: {
      title: 'Ташкент үчүн даяр маршрут',
      subtitle: 'Сиздин ылдамдыгыңызга жараша формат тандаңыз: тез күн, толук күн же дем алуу.',
      vibeLabel: 'Формат тандаңыз:',
      modes: { quick: 'Тез күн', full: 'Толук күн', weekend: 'Дем алуу' },
      resultTitle: 'Орточо күндүк маршрут',
      resultDesc: 'Бул бир күн үчүн да, шаарда бир нече күн калуу үчүн да ылайыктуу — оңой кыскартууга же узартууга болот.',
      stepLabel: 'Кадам',
      maps: 'Карта',
      taxi: 'Такси',
      call: 'Чалуу',
    },
    faq: {
      title: 'Туристтерге арналған эскертүү',
      subtitle: 'Шаарда ыңгайлуу болуу үчүн маанилүү маалымат.',
      metroTitle: '🚇 Метро төлөө',
      metroDesc: 'Банк карталары (Visa, Mastercard, Humo, Uzcard) же NFC телефон аркылуу турникеттен түздөн-түз төлөөгө болот. Накас акча менен кассада QR-билет сатып алууга болот (1700 UZS).',
      restTitle: '🍽️ Сервис жана чаевые',
      restDesc: 'Көпчүлүк ресторандарда чектерге 10–15% кызмат акысы автоматтык түрдө кошулат. Кошумча чаевые калтыруу милдеттүү эмес.',
    },
    metro: {
      title: '🚇 Ташкент метросунун интерактивтик картасы',
      subtitle: 'Картанын каалаган станциясын басыңыз!',
      legendTitle: '📌 Алмашуу түйүндөрү:',
      linesTitle: '🔴 Метро линиялары:',
      stationLabel: '🚇 Станция:',
      transferLabel: '🔄 Алмашуу станциясы',
    },
    weather: {
      title: '☀️ Ташкенттеги аба ырайы',
      loading: 'Аба ырайы жүктөлүүдө...',
      temp: 'Температура:',
      wind: 'Жел:',
      humidity: 'Ылгалдуулук:',
    },
    mustEat: {
      title: '🍲 Ташкентте Must Eat',
      subtitle: 'Өзбек тамактары жана аларды татуу үчүн белгилүү жерлер.',
      tipTitle: '💡 Плов боюнча кеңеш:',
      tipDesc: 'Ташкентте плов эртең менен пиши жана түштөн кийин жейт. Эң жакшы убакыт — 11:30дөн 13:30га чейин. 14:00дөн кийин эң таттуусы барат.',
    },
    phrasebook: {
      title: '🗣️ Туристтер үчүн өзбекче сөздүк',
      subtitle: 'Жергиликтүү адамдар менен жакшы карым-катнаш үчүн пайдалуу сөздөр. Угуу үчүн 🔊 басыңыз!',
      listenBtn: '🔊 Угуу',
    },
    souvenirs: {
      title: '🏺 Өзбекстандан эмне алып кетүү керек',
      subtitle: 'Эң жакшы сувенирлер жана аларды сатып алуу үчүн жагымдуу жерлер.',
      whereLabel: '📍 Кайдан сатып алуу керек:',
    }
  },
  zh: {
    nav: { about: '关于', places: '地点', eat: '必吃', souvenirs: '纪念品', phrasebook: '常用语', rates: '汇率', language: 'ZH' },
    hero: {
      headline: '塔什干实用旅行指南：住宿、景点和特色美食一网打尽。',
      description: 'Foreigner.uz 汇集了塔什干优质酒店、餐厅、集市、诊所、加油站、纪念品以及带语音朗读的乌兹别克语常用语。',
      action: '浏览地点',
      contact: '发送邮件',
      telegram: 'Telegram @foreigneruz_bot',
    },
    about: {
      title: '最新动态',
      subtitle: '为每一位前往塔什干的游客提供完整的参考指南。',
    },
    cards: {
      places: { title: '塔什干热门地点', description: '查找您身边的酒店、市场、餐厅、外汇兑换处和实用服务。', accent: '地点' },
      currency: { title: '实时汇率', description: 'USD、EUR、RUB 和 CNY 汇率每天自动更新。', accent: '汇率' },
      bot: { title: 'Telegram 助手', description: 'Bot 机器人将实时解答疑问并提供塔什干出行建议。', accent: '助手' },
    },
    rate: {
      title: '乌兹别克斯坦央行汇率 & 换算器',
      subtitle: '实时汇率以及 UZS、USD、EUR、RUB 和 CNY 即时计算器。',
      loaded: '更新时间',
      tip: '建议在正规银行或 ATM 兑换外汇，以获得最优惠的汇率。',
      refresh: '刷新汇率',
      error: '加载汇率失败，请稍后重试。',
      calcTitle: '🧮 汇率换算器',
      amountLabel: '金额：',
      fromLabel: '从：',
      toLabel: '到：',
      resultLabel: '总计：',
    },
    places: { title: '实用地点', subtitle: '酒店、外汇、诊所、集市与休闲场所。', google: 'Google 地图', taxi: 'Yandex 叫车', location: '地址' },
    mustVisit: { title: '必游景点', subtitle: '塔什干最佳散步、购物和体验打卡点。', google: 'Google 地图', taxi: 'Yandex 叫车' },
    routes: { title: '精选路线', subtitle: '为您准备好的日间和夜间游览方案。' },
    download: { pre: '即将登陆手机端', title: '打开应用，开启轻松精彩的旅行路线。', text: '我们致力于打造一款让您无需盲目搜索即可探索更多的产品。' },
    planner: {
      title: '塔什干城市路线',
      subtitle: '根据你的节奏选择形式：轻松半日、完整一天或周末放松。',
      vibeLabel: '选择形式：',
      modes: { quick: '轻松半日', full: '完整一天', weekend: '周末' },
      resultTitle: '适合一天的平衡路线',
      resultDesc: '适合一天，也适合在城里停留多日，可以随时缩短或延长。',
      stepLabel: '步骤',
      maps: '地图',
      taxi: '打车',
      call: '拨打',
    },
    faq: {
      title: '游客生存指南',
      subtitle: '城市出行必备重要信息。',
      metroTitle: '🚇 地铁支付',
      metroDesc: '可以直接在闸机处使用银行卡（Visa, Mastercard, Humo, Uzcard）或手机 NFC 刷卡进站。现金可在售票处购买纸质二维码车票（1700 UZS）。',
      restTitle: '🍽️ 小费与服务费',
      restDesc: '大多数餐厅账单中会自动包含 10–15% 的服务费（Service Charge）。额外给小费是自愿的。',
    },
    metro: {
      title: '🚇 塔什干互动地铁线路图',
      subtitle: '点击线路图上的任意车站查看详情！',
      legendTitle: '📌 换乘枢纽：',
      linesTitle: '🔴 地铁线路：',
      stationLabel: '🚇 车站：',
      transferLabel: '🔄 换乘车站',
    },
    weather: {
      title: '☀️ 塔什干实时天气',
      loading: '天气加载中...',
      temp: '温度：',
      wind: '风速：',
      humidity: '湿度：',
    },
    mustEat: {
      title: '🍲 塔什干必吃美食',
      subtitle: '乌兹别克特色菜肴以及不容错过的地道名店。',
      tipTitle: '💡 抓饭打卡技巧：',
      tipDesc: '塔什干抓饭每天清晨焖煮，午餐享用！抓饭中心最佳前往时间为 11:30 至 13:30。下午 2:00 之后最香的抓饭可能就卖光了。',
    },
    phrasebook: {
      title: '🗣️ 游客乌兹别克语常用语',
      subtitle: '在巴扎集市或打车时超实用的语句。点击 🔊 播放发音！',
      listenBtn: '🔊 朗读发音',
    },
    souvenirs: {
      title: '🏺 乌兹别克斯坦必买纪念品',
      subtitle: '最地道的伴手礼及划算的购买地点。',
      whereLabel: '📍 推荐购买地：',
    }
  },
};

const PHRASEBOOK_LIST = [
  { uzbek: 'Salom! Assalomu alaykum!', translit: 'Salom! Assalomu alaykum!', ru: 'Здравствуйте!', en: 'Hello!', zh: '你好！' },
  { uzbek: 'Rahmat!', translit: 'Rahmat!', ru: 'Спасибо!', en: 'Thank you!', zh: '谢谢！' },
  { uzbek: 'Bu nima turadi?', translit: 'Bu nima turadi?', ru: 'Что это?', en: 'What is this?', zh: '这是什么？' },
  { uzbek: 'Bu qancha turadi?', translit: 'Bu qancha turadi?', ru: 'Сколько это стоит?', en: 'How much is this?', zh: '这个多少钱？' },
  { uzbek: 'Bir oz arzonroq bo\'lmasa?', translit: 'Bir oz arzonroq bo\'lmasa?', ru: 'Можно немного дешевле?', en: 'Could you make it a bit cheaper?', zh: '能便宜一点吗？' },
  { uzbek: 'Bu juda mazali!', translit: 'Bu juda mazali!', ru: 'Очень вкусно!', en: 'It is very tasty!', zh: '非常好吃！' },
  { uzbek: 'Hisobni olib bering, iltimos.', translit: 'Hisobni olib bering, iltimos.', ru: 'Принесите счёт, пожалуйста.', en: 'Please bring the bill.', zh: '请给我结账。' },
  { uzbek: 'Xayr, salomat bo\'ling!', translit: 'Xayr, salomat bo\'ling!', ru: 'До свидания, будьте здоровы!', en: 'Goodbye, take care!', zh: '再见，保重！' }
];

const SOUVENIRS_LIST = [
  {
    icon: "🏺",
    title: { ru: "Риштанская Керамика", en: "Rishtan Ceramics", uz: "Rishton Keramikasi", zh: "里什坦手工陶瓷" },
    desc: {
      ru: "Знаменитая сине-голубая ляган-посуда и пиалы ручной работы с узорами.",
      en: "Famous blue-and-turquoise handmade ceramic plates (lyagan) & tea cups.",
      uz: "O‘zbekistonning mashhur qo‘lda ishlangan ko‘k-havorang lagan va piyolalari.",
      zh: "著名的蓝绿花纹手工盘（Lyagan）和茶碗。"
    },
    where: "Chorsu Bazaar / Abulkasym Medrese"
  },
  {
    icon: "🧣",
    title: { ru: "Икат, Адрас и Сюзане", en: "Ikat & Suzani", uz: "Ikat, Adras va So‘zana", zh: "艾德莱斯丝绸与苏扎尼刺绣" },
    desc: {
      ru: "Шёлковые ткани (адрас), шарфы и настенные вышитые полотна сюзане.",
      en: "Handwoven silk fabrics (Ikat/Adras), scarves, and embroidered Suzani wall hangings.",
      uz: "Ipak va paxta matolari (adras), ro‘mollar va qo‘lda tikilgan so‘zanalar.",
      zh: "手工编织丝织品、围巾和手工刺绣挂毯（Suzani）。"
    },
    where: "Chorsu Bazaar Art Alley"
  },
  {
    icon: "🌰",
    title: { ru: "Сухофрукты и Орехи", en: "Dry Fruits & Nuts", uz: "Quritilgan mevalar va yong‘oqlar", zh: "干果与坚果" },
    desc: {
      ru: "Самаркандский изюм, курага, солёные косточки урюка (шондона) и миндаль.",
      en: "Samarkand raisins, dried apricots, salted apricot seeds (shondona) and almonds.",
      uz: "Samarqand mayizi, turshak, sho‘r dasta va bodomlar.",
      zh: "撒马尔罕葡萄干、杏干、咸杏仁核及巴旦木。"
    },
    where: "Chorsu Bazaar (Row 3-4)"
  }
];

const routeCards = [
  {
    id: 'day',
    title: { ru: 'Дневной маршрут', en: 'Day route', uz: 'Kunduzgi yo‘nalish', zh: '日间游览路线' },
    subtitle: { ru: 'Прогулка, рынок и вкусный обед.', en: 'Walk, market and a tasty lunch.', uz: 'Sayr, bozor va mazali tushlik.', zh: '散步、集市与美味午餐。' },
    items: [
      { ru: 'Утро: Чорсу и местные завтраки', en: 'Morning: Chorsu and local breakfast', uz: 'Ertalab: Chorsu va mahalliy nonushta', zh: '早晨：楚苏集市与特色早餐' },
      { ru: 'Обед: Настоящий Ташкентский плов в Besh Qozon', en: 'Lunch: Authentic Tashkent Plov at Besh Qozon', uz: 'Tushlik: Besh Qozonda haqiqiy Toshkent palovi', zh: '午餐：Besh Qozon 地道塔什干抓饭' },
      { ru: 'День: Tashkent City Mall и шопинг', en: 'Day: Tashkent City Mall and shopping', uz: 'Kunduzi: Tashkent City Mall va xaridlar', zh: '下午：Tashkent City Mall 购物' },
      { ru: 'Вечер: ужин в ресторане с видом', en: 'Evening: dinner with a view', uz: 'Kechqurun: chiroyli manzarali restoranda kechki ovqat', zh: '傍晚：观景餐厅晚餐' },
    ],
  },
  {
    id: 'evening',
    title: { ru: 'Вечерний маршрут', en: 'Evening route', uz: 'Kechki yo‘nalish', zh: '夜间游览路线' },
    subtitle: { ru: 'Атмосфера, подсветка и лёгкие развлечения.', en: 'Atmosphere, lights and easy entertainment.', uz: 'Muhit, chiroqlar va yengil hordiq.', zh: '夜景灯光与休闲娱乐。' },
    items: [
      { ru: 'Ночной Magic City в огнях', en: 'Magic City at night with lights', uz: 'Tungi chiroqlar ichidagi Magic City', zh: '夜间灯火辉煌的 Magic City 魔法城' },
      { ru: 'Коктейли и сочный шашлык', en: 'Cocktails and juicy shashlik', uz: 'Kokteyllar va sersharbat shashlik', zh: '鸡尾酒与多汁烤肉串' },
      { ru: 'Панорамный вид с телебашни', en: 'Panoramic view from the TV tower', uz: 'Teleminoradan panoramali manzara', zh: '电视塔全景鸟瞰' },
    ],
  },
];

const MUST_EAT_LIST = [
  {
    id: 'plov-beshqozon',
    rank: '🏆 №1 PLOV CENTER',
    dish: { ru: 'Ташкентский Плов (Besh Qozon)', en: 'Tashkent Plov (Besh Qozon)', uz: 'Toshkent Palovi (Besh Qozon)', zh: '塔什干抓饭 (Besh Qozon)' },
    spot: 'Центр Плова (Besh Qozon)',
    address: { ru: 'ул. Ифтихор, 1 (около Телебашни)', en: 'Iftikhor str. 1 (near TV Tower)', uz: 'Iftxor ko‘ch. 1 (Teleminora yonida)', zh: 'Iftikhor 街 1 号 (电视塔旁)' },
    desc: {
      ru: 'Легендарный центр плова №1 в Узбекистане. Огромные казаны, свежее мясо, перепелиные яйца и казы.',
      en: 'The #1 legendary Plov Center in Uzbekistan. Huge cauldrons, fresh meat, quail eggs, and kazy.',
      uz: 'O‘zbekistondagi №1 afsonaviy osh markazi. Ulkan qozonlar, yangi go‘sht, bedana tuxumi va qazi.',
      zh: '乌兹别克斯坦排名第一的抓饭中心。巨型大锅、鲜嫩羊肉、鹌鹑蛋与马肉香肠。'
    },
    rating: '4.9',
    query: 'Besh Qozon Tashkent'
  },
  {
    id: 'plov-kamolon',
    rank: '🥈 №2 PLOV CENTER',
    dish: { ru: 'Камолон Ош (Kamolon Osh)', en: 'Kamolon Plov (Kamolon Osh)', uz: 'Kamolon Osh', zh: '卡莫隆抓饭 (Kamolon Osh)' },
    spot: 'Kamolon Osh',
    address: { ru: 'ул. Самарканд Дарвоза', en: 'Samarqand Darvoza str.', uz: 'Samarqand Darvoza ko‘ch.', zh: 'Samarqand Darvoza 街' },
    desc: {
      ru: 'Традиционный ташкентский плов для ценителей. Нежнейшее мясо и насыщенный вкус.',
      en: 'Traditional Tashkent Plov for true foodies. Tender meat and rich flavor.',
      uz: 'Chaqqon va shirin an’anaviy Toshkent oshining haqiqiy shinavandalari uchun.',
      zh: '抓饭老饕喜爱的传统塔什干味道，肉质鲜嫩，香味浓郁。'
    },
    rating: '4.8',
    query: 'Kamolon Osh Tashkent'
  },
  {
    id: 'somsa',
    rank: '🥐 MUST TRY',
    dish: { ru: 'Тандырная Самса (Зафар / Сомсахона)', en: 'Tandoor Somsa', uz: 'Tandir Somsa', zh: '馕坑烤烤包子 (Somsa)' },
    spot: 'Центральные Самсахоны',
    address: { ru: 'Рынок Чорсу / ул. Чиланзар', en: 'Chorsu Bazaar / Chilanzar str.', uz: 'Chorsu bozori / Chilonzor', zh: '楚苏集市 / 奇兰扎尔街' },
    desc: {
      ru: 'Хрустящее слоёное тесто прямо из тандыра с сочным рубленым мясом и луком.',
      en: 'Crispy tandoor somsa with juicy chopped meat and onions.',
      uz: 'Tandirdan uzilgan qat-qat va sersharbat to‘g‘ralgan go‘shtli somsa.',
      zh: '刚出馕坑的酥脆千层皮烤包子，内馅为多汁碎肉与洋葱。'
    },
    rating: '4.8',
    query: 'Chorsu Somsa Tashkent'
  },
  {
    id: 'shashlik',
    rank: '🥩 MUST TRY',
    dish: { ru: 'Узбекский Шашлык (Молотый & Кусковой)', en: 'Uzbek Shashlik (Kebab)', uz: 'O‘zbek Shashligi', zh: '乌兹别克烤肉串 (Shashlik)' },
    spot: 'Chustiy / Кафе на Чиланзаре',
    address: { ru: 'Ташкент, ул. Гагарина', en: 'Gagarin str., Tashkent', uz: 'Gagarin ko‘ch., Toshkent', zh: '塔什干加加林街' },
    desc: {
      ru: 'Ароматный шашлык на углях с маринованным луком и горячей лепёшкой.',
      en: 'Flavorful charcoal-grilled meat served with pickled onions and fresh flatbread.',
      uz: 'Ko‘mda pishirilgan xushbo‘y shashlik, pijoz va issiq non bilan.',
      zh: '木炭现烤香气四溢的肉串，配以腌洋葱与热馕。'
    },
    rating: '4.7',
    query: 'Shashlik Tashkent'
  }
];

const categoryFilters = [
  { key: 'all', label: { ru: 'Всё', en: 'All', uz: 'Barchasi', zh: '全部' } },
  { key: 'favorites', label: { ru: '❤️ Избранное', en: '❤️ Favorites', uz: '❤️ Tanlanganlar', zh: '❤️ 收藏' } },
  { key: 'hotels', label: { ru: 'Отели', en: 'Hotels', uz: 'Mehmonxonalar', zh: '酒店' } },
  { key: 'coffee', label: { ru: 'Кофейни', en: 'Coffee shops', uz: 'Kofejarlar', zh: '咖啡馆' } },
  { key: 'food', label: { ru: 'Еда', en: 'Food', uz: 'Taomlar', zh: '美食' } },
  { key: 'cyber', label: { ru: 'Компьютерные клубы', en: 'Gaming clubs', uz: 'Kompyuter klublari', zh: '电脑俱乐部' } },
  { key: 'finance', label: { ru: 'Банки & обмен', en: 'Banks & exchange', uz: 'Banklar va almashtirish', zh: '银行&兑换' } },
  { key: 'health', label: { ru: 'Медицина', en: 'Health', uz: 'Tibbiyot', zh: '医疗' } },
  { key: 'shopping', label: { ru: 'Шопинг', en: 'Shopping', uz: 'Xaridlar', zh: '购物' } },
  { key: 'park', label: { ru: 'Парки', en: 'Parks', uz: 'Bog\'lar', zh: '公园' } },
  { key: 'aquapark', label: { ru: 'Аквапарки', en: 'Aquaparks', uz: 'Akvaparklar', zh: '水上乐园' } },
  { key: 'zoo', label: { ru: 'Зоопарки', en: 'Zoos', uz: 'Hayvonot bog\'lari', zh: '动物园' } },
  { key: 'gas', label: { ru: 'АЗС', en: 'Gas stations', uz: 'AYQSH', zh: '加油站' } },
  { key: 'sights', label: { ru: 'Достопримечательности', en: 'Sights', uz: 'Diqqatga sazovor joylar', zh: '景点' } },
];

const categoryGroups = {
  all: ['hotel', 'coffee', 'restaurant', 'cafe', 'foodmall', 'cyber', 'bank', 'exchange', 'clinic', 'pharmacy', 'market', 'mall', 'park', 'aquapark', 'zoo', 'gas', 'sight'],
  hotels: ['hotel'],
  coffee: ['coffee'],
  food: ['restaurant', 'cafe', 'foodmall'],
  cyber: ['cyber'],
  finance: ['bank', 'exchange'],
  health: ['clinic', 'pharmacy'],
  shopping: ['market', 'mall'],
  park: ['park'],
  aquapark: ['aquapark'],
  zoo: ['zoo'],
  gas: ['gas'],
  sights: ['sight'],
};

const typeLabels = {
  hotel: { ru: 'Отель', en: 'Hotel', uz: 'Mehmonxona', zh: '酒店' },
  coffee: { ru: 'Кофейня', en: 'Coffee shop', uz: 'Kofe', zh: '咖啡店' },
  foodmall: { ru: 'Фудмолл', en: 'Food mall', uz: 'Food mall', zh: '美食广场' },
  restaurant: { ru: 'Ресторан', en: 'Restaurant', uz: 'Restoran', zh: '餐厅' },
  cafe: { ru: 'Кафе', en: 'Cafe', uz: 'Kafe', zh: '咖啡馆' },
  cyber: { ru: 'Компьютерный клуб', en: 'Gaming club', uz: 'Kompyuter klubi', zh: '电脑俱乐部' },
  exchange: { ru: 'Обмен', en: 'Exchange', uz: 'Valyuta ayirboshlash', zh: '外汇兑换' },
  bank: { ru: 'Банк / банкомат', en: 'Bank / ATM', uz: 'Bank / Bankomat', zh: '银行 / ATM' },
  clinic: { ru: 'Клиника', en: 'Clinic', uz: 'Klinika', zh: '诊所' },
  pharmacy: { ru: 'Аптека', en: 'Pharmacy', uz: 'Dorixona', zh: '药店' },
  market: { ru: 'Рынок', en: 'Market', uz: 'Bozor', zh: '集市' },
  mall: { ru: 'ТЦ / торговый центр', en: 'Mall', uz: 'Tashkiliy markaz', zh: '购物中心' },
  park: { ru: 'Парк', en: 'Park', uz: 'Bog\'', zh: '公园' },
  aquapark: { ru: 'Аквапарк', en: 'Aquapark', uz: 'Akvapark', zh: '水上乐园' },
  zoo: { ru: 'Зоопарк', en: 'Zoo', uz: 'Hayvonot bog\'i', zh: '动物园' },
  gas: { ru: 'АЗС', en: 'Gas Station', uz: 'AYQSH', zh: '加油站' },
  sight: { ru: 'Достопримечательность', en: 'Sight', uz: 'Diqqatga sazovor joy', zh: '景点' },
};

// ПОЛНЫЙ СПИСОК ВСЕХ СТАНЦИЙ (ВКЛЮЧАЯ ПОЛНУЮ КОЛЬЦЕВУЮ ЛИНИЮ 1-14)
const FULL_METRO_STATIONS = [
  // 🔴 ЧИЛАНЗАРСКАЯ ЛИНИЯ
  { id: 'olmazor', name: { ru: 'Олмазор', en: 'Olmazor', uz: 'Olmazor', zh: 'Olmazor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 150, y: 360, isInterchange: true, info: { ru: '🔄 Пересадка на Кольцевую надземную линию (Кипчак / 12-Бекат).', en: '🔄 Transfer to Circle Line.', uz: '🔄 Yerusti Halqa yo‘nalishiga o‘tish.', zh: '🔄 换乘高架环线。' } },
  { id: 'chilonzor', name: { ru: 'Чиланзар', en: 'Chilanzar', uz: 'Chilonzor', zh: 'Chilanzar' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 190, y: 330, isInterchange: false, info: { ru: 'Торговые ряды, жилой массив.', en: 'Shopping rows and residential area.', uz: 'Savdo qatorlari va turar-joy massivi.', zh: '商业街与住宅区。' } },
  { id: 'mirzo_ulugbek', name: { ru: 'Мирзо Улугбек', en: 'Mirzo Ulugbek', uz: 'Mirzo Ulug‘bek', zh: 'Mirzo Ulugbek' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 230, y: 300, isInterchange: false, info: { ru: 'Стадион Бунёдкор, Парк Гафура Гуляма.', en: 'Bunyodkor Stadium, Gafur Gulyam Park.', uz: 'Bunyodkor stadioni, G‘afur G‘ulom bog‘i.', zh: '本尤德科体育场。' } },
  { id: 'novza', name: { ru: 'Новза', en: 'Novza', uz: 'Novza', zh: 'Novza' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 270, y: 270, isInterchange: false, info: { ru: 'Мечеть Новза и торговые центры.', en: 'Novza Mosque and shopping malls.', uz: 'Novza masjidi.', zh: '诺夫扎清真寺。' } },
  { id: 'milliy_bog', name: { ru: 'Миллий Бог', en: 'Milliy Bog', uz: 'Milliy Bog‘', zh: 'Milliy Bog' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 310, y: 240, isInterchange: false, info: { ru: 'Национальный парк Узбекистана, Magic City.', en: 'National Park of Uzbekistan, Magic City.', uz: 'O‘zbekiston Milliy bog‘i, Magic City.', zh: '国家公园，Magic City 魔法城。' } },
  { id: 'bunyodkor', name: { ru: 'Халклар Достлиги', en: 'Bunyodkor', uz: 'Xalqlar Do‘stligi', zh: '人民友谊站' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 350, y: 220, isInterchange: false, info: { ru: 'Дворец кино, Humo Arena.', en: 'Cinema Palace, Humo Arena.', uz: 'Kino saroyi, Humo Arena.', zh: '电影宫、Humo 体育馆。' } },
  { id: 'pakhtakor', name: { ru: 'Пахтакор', en: 'Pakhtakor', uz: 'Paxtakor', zh: 'Pakhtakor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 410, y: 210, isInterchange: true, info: { ru: '🔄 Пересадка на Узбекистанскую (синюю) линию! Рядом Tashkent City Mall.', en: '🔄 Transfer to Uzbekistan Line!', uz: '🔄 O‘zbekiston yo‘nalishiga O‘TISH.', zh: '🔄 换乘乌兹别克斯坦（蓝）线！' } },
  { id: 'mustaqillik', name: { ru: 'Мустакиллик Майдони', en: 'Mustaqillik Maydoni', uz: 'Mustaqillik Maydoni', zh: '独立广场站' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 440, y: 210, isInterchange: false, info: { ru: 'Площадь Независимости.', en: 'Independence Square.', uz: 'Mustaqillik maydoni.', zh: '独立广场。' } },
  { id: 'amir_timur', name: { ru: 'Амир Тимур Хиёбони', en: 'Amir Timur Square', uz: 'Amir Temur Xiyoboni', zh: 'Amir Timur 广场' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 480, y: 210, isInterchange: true, info: { ru: '🔄 Пересадка на Юнусабадскую (зелёную) линию! Сквер Амира Тимура.', en: '🔄 Transfer to Yunusabad Line!', uz: '🔄 Yunusobod yo‘nalishiga O‘TISH.', zh: '🔄 换乘尤努萨巴德（绿）线！' } },
  { id: 'hamid_olimjon', name: { ru: 'Хамид Олимджан', en: 'Hamid Olimjon', uz: 'Hamid Olimjon', zh: 'Hamid Olimjon' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 530, y: 210, isInterchange: false, info: { ru: 'Площадь Х. Олимджана.', en: 'H. Olimjon square.', uz: 'H. Olimjon maydoni.', zh: '哈米德·奥林江广场。' } },
  { id: 'pushkin', name: { ru: 'Пушкин', en: 'Pushkin', uz: 'Pushkin', zh: 'Pushkin' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 570, y: 210, isInterchange: false, info: { ru: 'Парк Тельмана (Central Park).', en: 'Central Park.', uz: 'Central Park.', zh: '中央公园。' } },
  { id: 'buyuk_ipak_yuli', name: { ru: 'Буюк Ипак Йули', en: 'Buyuk Ipak Yuli', uz: 'Buyuk Ipak Yuli', zh: 'Buyuk Ipak Yuli' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰зар线' }, x: 620, y: 210, isInterchange: false, info: { ru: 'Конечная подземная станция.', en: 'Terminus station.', uz: 'Oxirgi bekat.', zh: '终点站。' } },

  // 🔵 УЗБЕКИСТАНСКАЯ ЛИНИЯ
  { id: 'beruniy', name: { ru: 'Беруни', en: 'Beruniy', uz: 'Beruniy', zh: 'Beruniy' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 250, y: 110, isInterchange: false, info: { ru: 'Вузгородок.', en: 'University campus.', uz: 'Talabalar shaharchasi.', zh: '大学城。' } },
  { id: 'tinchlik', name: { ru: 'Тинчлик', en: 'Tinchlik', uz: 'Tinchlik', zh: 'Tinchlik' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 300, y: 135, isInterchange: false, info: { ru: 'Торговые ряды.', en: 'Trade area.', uz: 'Savdo hududi.', zh: '商业区。' } },
  { id: 'chorsu', name: { ru: 'Чорсу', en: 'Chorsu', uz: 'Chorsu', zh: 'Chorsu 楚苏' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 350, y: 160, isInterchange: false, info: { ru: '🛒 Знаменитый Базар Чорсу, старый город.', en: '🛒 Famous Chorsu Bazaar.', uz: '🛒 Mashhur Chorsu bozori.', zh: '🛒 楚苏大巴扎。' } },
  { id: 'ghafur_ghulom', name: { ru: 'Гафур Гулом', en: 'Gafur Gulyam', uz: 'G‘afur G‘ulom', zh: 'Gafur Gulyam' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 380, y: 180, isInterchange: false, info: { ru: 'Цирк, кафе.', en: 'Circus.', uz: 'Sirk.', zh: '马戏团。' } },
  { id: 'alisher_navoi', name: { ru: 'Алишер Навои', en: 'Alisher Navoi', uz: 'Alisher Navoiy', zh: 'Alisher Navoi' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 410, y: 190, isInterchange: true, info: { ru: '🔄 Пересадка на Пахтакор (красную ветку).', en: '🔄 Transfer to Pakhtakor.', uz: '🔄 Paxtakorga O‘TISH.', zh: '🔄 换乘 Pakhtakor。' } },
  { id: 'uzbekistan', name: { ru: 'Узбекистанская', en: 'Uzbekiston', uz: 'O‘zbekiston', zh: '乌兹别克斯坦站' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 440, y: 230, isInterchange: false, info: { ru: 'ЦУМ, Аллея голубых куполов.', en: 'TSUM mall.', uz: 'TSUM.', zh: '中央百货。' } },
  { id: 'kosmonavtlar', name: { ru: 'Космонавтов', en: 'Kosmonavtlar', uz: 'Kosmonavtlar', zh: '航天员站' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 470, y: 270, isInterchange: false, info: { ru: 'Интерьер в стиле космоса.', en: 'Space themed interior.', uz: 'Kosmos uslubidagi bekat.', zh: '太空主题站。' } },
  { id: 'oybek', name: { ru: 'Ойбек', en: 'Oybek', uz: 'Oybek', zh: 'Oybek' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 520, y: 310, isInterchange: true, info: { ru: '🔄 Пересадка на Минг Урик (зелёную ветку).', en: '🔄 Transfer to Ming Urik.', uz: '🔄 Ming Urikga O‘TISH.', zh: '🔄 换乘 Ming Urik。' } },
  { id: 'toshkent', name: { ru: 'Ташкент (Вокзал)', en: 'Tashkent (Station)', uz: 'Toshkent (Vokzal)', zh: '塔什干 (火车站)' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 560, y: 340, isInterchange: false, info: { ru: '🚆 Главный Северный Вокзал (Афрасиаб).', en: '🚆 Main Railway Station.', uz: '🚆 Toshkent Vokzali.', zh: '🚆 塔什干火车站。' } },
  { id: 'dostlik', name: { ru: 'Дустлик', en: 'Dustlik', uz: 'Do‘stlik', zh: 'Dustlik' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 620, y: 340, isInterchange: true, info: { ru: '🔄 Пересадка на 1-Бекат (Технопарк) Кольцевой линии.', en: '🔄 Transfer to Circle Line Station 1.', uz: '🔄 Halqa yo‘nalishiga O‘TISH.', zh: '🔄 换乘高架环线 1 站。' } },

  // 🟢 ЮНУСАБАДСКАЯ ЛИНИЯ
  { id: 'turkiston', name: { ru: 'Туркистон', en: 'Turkiston', uz: 'Turkiston', zh: 'Turkiston' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 50, isInterchange: false, info: { ru: 'Север Юнусабада.', en: 'North Yunusabad.', uz: 'Yunusobod shimoli.', zh: '尤努萨巴德北。' } },
  { id: 'yunusobod', name: { ru: 'Юнусабад', en: 'Yunusobod', uz: 'Yunusobod', zh: 'Yunusobod' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 80, isInterchange: false, info: { ru: 'Рынок Юнусабад, ТРЦ Mega Planet.', en: 'Yunusabad Market, Mega Planet.', uz: 'Yunusobod bozori.', zh: '尤努萨巴德集市。' } },
  { id: 'shahriston', name: { ru: 'Шахристон', en: 'Shahriston', uz: 'Shahriston', zh: 'Shahriston' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 110, isInterchange: false, info: { ru: 'Река Бозсу.', en: 'Bozsu river.', uz: 'Bozsu daryosi.', zh: '博兹苏河。' } },
  { id: 'bodomzor', name: { ru: 'Бодомзор', en: 'Bodomzor', uz: 'Bodomzor', zh: 'Bodomzor' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 140, isInterchange: false, info: { ru: 'Узэкспоцентр, Аквапарк, Японский сад.', en: 'Uzexpocentre, Aquapark.', uz: 'O‘zekspomarkaz, Akvapark.', zh: '乌兹展览中心。' } },
  { id: 'minora', name: { ru: 'Минор', en: 'Minor', uz: 'Minor', zh: 'Minor' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 170, isInterchange: false, info: { ru: 'Мечеть Минор, Финансовый институт.', en: 'White Minor Mosque.', uz: 'Minor masjidi.', zh: '米诺尔清真寺。' } },
  { id: 'yunus_rajabi', name: { ru: 'Юнус Раджаби', en: 'Yunus Rajabi', uz: 'Yunus Rajabiy', zh: 'Yunus Rajabi' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 225, isInterchange: true, info: { ru: '🔄 Пересадка на Амир Тимур (красную линию).', en: '🔄 Transfer to Red line.', uz: '🔄 Qizil yo‘nalishga o‘tish.', zh: '🔄 换乘红线。' } },
  { id: 'ming_urik', name: { ru: 'Минг Урик', en: 'Ming Urik', uz: 'Ming O‘rik', zh: 'Ming Urik' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 500, y: 310, isInterchange: true, info: { ru: '🔄 Пересадка на Ойбек (синюю линию).', en: '🔄 Transfer to Oybek station.', uz: '🔄 Oybek bekatiga O‘TISH.', zh: '🔄 换乘 Oybek 站。' } },

  // 🩵 КОЛЬЦЕВАЯ НАЗЕМНАЯ ЛИНИЯ (ВСЕ 14 БЕКАТОВ!)
  { id: 'b1', name: { ru: '1-Бекат (Технопарк)', en: 'Station 1 (Technopark)', uz: '1-Bekat (Texnopark)', zh: '1站 (Texnopark)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 680, y: 340, isInterchange: true, info: { ru: '🔄 Пересадка на станцию Дустлик (синяя линия).', en: '🔄 Transfer to Dustlik.', uz: '🔄 Do‘stlik bekatiga o‘tish.', zh: '🔄 换乘 Dustlik。' } },
  { id: 'b2', name: { ru: '2-Бекат (Яшнабад)', en: 'Station 2 (Yashnabad)', uz: '2-Bekat (Yashnobod)', zh: '2站 (Yashnabad)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 710, y: 360, isInterchange: false, info: { ru: 'Наземная станция.', en: 'Elevated station.', uz: 'Yerusti bekati.', zh: '高架站。' } },
  { id: 'b3', name: { ru: '3-Бекат (Тузель)', en: 'Station 3 (Tuzel)', uz: '3-Bekat (Tuzel)', zh: '3站 (Tuzel)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 710, y: 390, isInterchange: false, info: { ru: 'Массив Тузель.', en: 'Tuzel district.', uz: 'Tuzel massivi.', zh: '图泽尔区。' } },
  { id: 'b4', name: { ru: '4-Бекат (Олмос)', en: 'Station 4 (Olmos)', uz: '4-Bekat (Olmos)', zh: '4站 (Olmos)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 690, y: 420, isInterchange: false, info: { ru: 'Массив Олмос.', en: 'Olmos district.', uz: 'Olmos massivi.', zh: '奥尔摩斯区。' } },
  { id: 'b5', name: { ru: '5-Бекат (Рохат)', en: 'Station 5 (Rohat)', uz: '5-Bekat (Rohat)', zh: '5站 (Rohat)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 650, y: 440, isInterchange: false, info: { ru: 'Круг Рохат.', en: 'Rohat circle.', uz: 'Rohat aylanasi.', zh: '罗哈特盘道。' } },
  { id: 'b6', name: { ru: '6-Бекат (Унгкурган)', en: 'Station 6 (Yangiobod)', uz: '6-Bekat (Yangiobod)', zh: '6站 (Yangiobod)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 590, y: 450, isInterchange: false, info: { ru: 'Рынок Янгиабад.', en: 'Yangiobod Market.', uz: 'Yangiobod bozori.', zh: '杨吉阿巴德集市。' } },
  { id: 'b7', name: { ru: '7-Бекат (Куйлюк)', en: 'Station 7 (Qoyliq)', uz: '7-Bekat (Qo‘yliq)', zh: '7站 (Qoyliq)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 520, y: 450, isInterchange: false, info: { ru: '🛒 Крупный рынок Куйлюк, Compass Mall.', en: '🛒 Qoyliq Market, Compass Mall.', uz: '🛒 Qo‘yliq bozori.', zh: '🛒 奎柳克集市。' } },
  { id: 'b8', name: { ru: '8-Бекат (Матонати)', en: 'Station 8 (Matonati)', uz: '8-Bekat (Matonati)', zh: '8站 (Matonati)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 450, y: 450, isInterchange: false, info: { ru: 'Жилой массив Куйлюк.', en: 'Qoyliq residential area.', uz: 'Qo‘yliq massivi.', zh: '奎柳克住宅区。' } },
  { id: 'b9', name: { ru: '9-Бекат (Кипчак)', en: 'Station 9 (Qipchoq)', uz: '9-Bekat (Qipchoq)', zh: '9站 (Qipchoq)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 380, y: 450, isInterchange: false, info: { ru: 'Массив Сергели.', en: 'Sergeli area.', uz: 'Sergeli massivi.', zh: '塞尔格利区。' } },
  { id: 'b10', name: { ru: '10-Бекат (Чоштепа)', en: 'Station 10 (Choshtepa)', uz: '10-Bekat (Choshtepa)', zh: '10站 (Choshtepa)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 310, y: 440, isInterchange: false, info: { ru: 'Чоштепа.', en: 'Choshtepa.', uz: 'Choshtepa.', zh: '乔什特帕。' } },
  { id: 'b11', name: { ru: '11-Бекат (Сергели)', en: 'Station 11 (Sergeli)', uz: '11-Bekat (Sergeli)', zh: '11站 (Sergeli)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 240, y: 420, isInterchange: false, info: { ru: 'Центр Сергели.', en: 'Sergeli center.', uz: 'Sergeli markazi.', zh: '塞尔格利中心。' } },
  { id: 'b12', name: { ru: '12-Бекат (Кипчак)', en: 'Station 12 (Kipchak)', uz: '12-Bekat (Qipchoq)', zh: '12站 (Kipchak)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 180, y: 390, isInterchange: true, info: { ru: '🔄 Пересадка на красную линию (станция Олмазор).', en: '🔄 Transfer to Red Line (Olmazor).', uz: '🔄 Qizil yo‘nalishga O‘TISH (Olmazor).', zh: '🔄 换乘红线 (Olmazor)。' } },
  { id: 'b13', name: { ru: '13-Бекат (Курувчилар)', en: 'Station 13 (Kuruvchilar)', uz: '13-Bekat (Quruvchilar)', zh: '13站 (Kuruvchilar)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 120, y: 360, isInterchange: false, info: { ru: 'Массив Курувчилар.', en: 'Kuruvchilar district.', uz: 'Quruvchilar massivi.', zh: '建筑者社区。' } },
  { id: 'b14', name: { ru: '14-Бекат (Кипчак)', en: 'Station 14 (Chinor)', uz: '14-Bekat (Chinor)', zh: '14站 (Chinor)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 70, y: 330, isInterchange: false, info: { ru: 'Конечная станция Кольцевой линии.', en: 'Terminus of Circle Line.', uz: 'Halqa yo‘nalishining oxirgi bekati.', zh: '高架环线终点站。' } }
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
    return text[language] || text.ru || text.en || '';
  }
  return text;
}

function getPlaceField(place, field, language) {
  const preferredLanguage = language || 'en';
  const candidates = [];

  if (preferredLanguage === 'ru') {
    candidates.push(`${field}_ru`, field, `${field}_en`);
  } else {
    candidates.push(`${field}_${preferredLanguage}`, `${field}_en`, field);
  }

  for (const key of candidates) {
    const value = place[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return '';
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

// НАДЕЖНАЯ ОЗВУЧКА ЧЕРЕЗ GOOGLE TTS (Без искажения букв)
function speakText(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=uz&client=tw-ob`;
    const audio = new Audio(audioUrl);
    
    audio.play().catch(() => {
      // Запасной фоллбэк
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
  const [activeCard, setActiveCard] = useState('places');
  const [activeRoute, setActiveRoute] = useState(routeCards[0].id);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [plannerMode, setPlannerMode] = useState('full');

  const [usdRate, setUsdRate] = useState(null);
  const [eurRate, setEurRate] = useState(null);
  const [rubRate, setRubRate] = useState(null);
  const [cnyRate, setCnyRate] = useState(null);
  const [rateUpdated, setRateUpdated] = useState('');
  const [rateError, setRateError] = useState(false);

  const [weatherData, setWeatherData] = useState(null);

  const [calcAmount, setCalcAmount] = useState(100);
  const [calcFrom, setCalcFrom] = useState('USD');
  const [calcTo, setCalcTo] = useState('UZS');

  const [selectedMetroStation, setSelectedMetroStation] = useState(FULL_METRO_STATIONS[6]); // Pakhtakor by default

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

  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem('foreigner_favorites');
    } catch (e) {
      console.error('Failed to clear favorites', e);
    }
  };

  const sharePlace = async (place) => {
    const mapUrl = mapsUrl(place, language);
    const shareData = {
      title: getPlaceField(place, 'name', language),
      text: getPlaceField(place, 'description', language),
      url: mapUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(`${shareData.title} — ${shareData.url}`);
      alert('Ссылка на карту скопирована в буфер обмена');
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  const t = (path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], translations[language]) || path;
  };

  const toggleLanguage = () => {
    if (language === 'ru') setLanguage('en');
    else if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('uz');
    else if (language === 'uz') setLanguage('zh');
    else if (language === 'zh') setLanguage('kk');
    else if (language === 'kk') setLanguage('ky');
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
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matchesQuery = (place) => {
      if (!normalizedQuery) return true;
      const text = [
        place.name,
        place.name_en,
        place.description,
        place.description_en,
        place.address,
        place.address_en,
        place.category,
        place.category_en,
        place.type,
        place.type_en,
      ].join(' ').toLowerCase();

      return text.includes(normalizedQuery);
    };

    if (activeCategory === 'favorites') {
      return placesData.filter((place) => favorites.includes(place.id) && matchesQuery(place));
    }

    const types = categoryGroups[activeCategory] || categoryGroups.all;
    return placesData.filter((place) => types.includes(place.type) && matchesQuery(place));
  }, [activeCategory, favorites, searchQuery]);

  const favoritePlaces = useMemo(() => {
    return placesData.filter((place) => favorites.includes(place.id));
  }, [favorites]);

  const timeLabels = useMemo(() => ({
    morning: language === 'ru' ? 'Утро' : language === 'uz' ? 'Ertalab' : language === 'kk' ? 'Таң' : language === 'ky' ? 'Эртө' : language === 'hi' ? 'सुबह' : 'Morning',
    day: language === 'ru' ? 'День' : language === 'uz' ? 'Kunduz' : language === 'kk' ? 'Күндіз' : language === 'ky' ? 'Күндүз' : language === 'hi' ? 'दिन' : 'Day',
    evening: language === 'ru' ? 'Вечер' : language === 'uz' ? 'Kechqurun' : language === 'kk' ? 'Кеш' : language === 'ky' ? 'Кеш' : language === 'hi' ? 'शाम' : 'Evening',
  }), [language]);

  const planByTime = useMemo(() => {
    const groups = { morning: [], day: [], evening: [] };
    const morningTypes = ['sight', 'market', 'hotel', 'cafe', 'coffee'];
    const dayTypes = ['restaurant', 'exchange', 'bank', 'clinic', 'pharmacy', 'mall', 'gas', 'market', 'coffee', 'foodmall', 'cyber'];
    const eveningTypes = ['restaurant', 'cafe', 'sight', 'mall', 'hotel', 'coffee', 'foodmall'];

    favoritePlaces.forEach((place, index) => {
      const type = place.type;
      let target = 'day';

      if (morningTypes.includes(type)) target = 'morning';
      else if (eveningTypes.includes(type)) target = 'evening';
      else if (dayTypes.includes(type)) target = 'day';

      if (index % 3 === 0) target = 'morning';
      else if (index % 3 === 1) target = 'day';
      else target = 'evening';

      groups[target].push(place);
    });

    return Object.entries(groups).map(([key, places]) => ({
      key,
      label: timeLabels[key],
      places: places.slice(0, 2).map((place, stepIndex) => ({
        ...place,
        step: stepIndex + 1,
      })),
    }));
  }, [favoritePlaces, timeLabels]);

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
      const rub = data.find((item) => item.Ccy === 'RUB');
      const cny = data.find((item) => item.Ccy === 'CNY');

      if (usd && eur) {
        setUsdRate(parseFloat(usd.Rate));
        setEurRate(parseFloat(eur.Rate));
        if (rub) setRubRate(parseFloat(rub.Rate));
        if (cny) setCnyRate(parseFloat(cny.Rate));
        setRateUpdated(usd.Date || new Date().toLocaleDateString());
        return;
      }
    } catch (e) {
      console.warn('Не удалось загрузить с ЦБ РУз', e);
      setRateError(true);
    }
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
    if (!calcAmount || Number.isNaN(Number(calcAmount))) return '—';

    const ratesInUzs = {
      UZS: 1,
      USD: usdRate ?? 12650,
      EUR: eurRate ?? 13800,
      RUB: rubRate ?? 140,
      CNY: cnyRate ?? 1750,
      INR: 150,
      KZT: 28,
      KGS: 145,
    };

    const amountInUzs = Number(calcAmount) * (ratesInUzs[calcFrom] || 1);
    const result = amountInUzs / (ratesInUzs[calcTo] || 1);

    return calcTo === 'UZS'
      ? Math.round(result).toLocaleString('ru-RU')
      : result.toFixed(2).toLocaleString('en-US');
  }, [calcAmount, calcFrom, calcTo, usdRate, eurRate, rubRate, cnyRate]);

  const plannerItems = useMemo(() => {
    const modeMap = {
      quick: [
        placesData.find((place) => place.id === 'tower-1'),
        placesData.find((place) => place.id === 'rest-1'),
        placesData.find((place) => place.id === 'market-1'),
      ].filter(Boolean),
      full: [
        placesData.find((place) => place.id === 'tower-1'),
        placesData.find((place) => place.id === 'sight-2'),
        placesData.find((place) => place.id === 'mall-1'),
        placesData.find((place) => place.id === 'rest-1'),
        placesData.find((place) => place.id === 'market-1'),
      ].filter(Boolean),
      weekend: [
        placesData.find((place) => place.id === 'tower-1'),
        placesData.find((place) => place.id === 'magic-1'),
        placesData.find((place) => place.id === 'mall-1'),
        placesData.find((place) => place.id === 'rest-1'),
        placesData.find((place) => place.id === 'shop-1'),
      ].filter(Boolean),
    };

    return (modeMap[plannerMode] || modeMap.full).map((place, index) => ({
      ...place,
      step: index + 1,
    }));
  }, [plannerMode]);

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
              🌐 {t('nav.language')}
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
              <div>{language === 'zh' ? '为游客提供的实用指南与建议' : language === 'uz' ? 'Sayyohlar uchun xizmatlar va maslahatlar' : language === 'ru' ? 'Сервисы и советы для туристов' : 'Services and tips for tourists'}</div>
              <div>{language === 'zh' ? 'USD, EUR, RUB, CNY 实时汇率' : language === 'uz' ? 'USD, EUR, RUB, CNY jonli kursi' : language === 'ru' ? 'Актуальный курс USD, EUR, RUB и CNY' : 'Live USD, EUR, RUB & CNY rates'}</div>
              <div>{language === 'zh' ? '日间与夜间精选路线' : language === 'uz' ? 'Kun va kech uchun marshrut rejasi' : language === 'ru' ? 'План маршрута на день и вечер' : 'Day and evening routes'}</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section container">
          <div className="section-title">
            <p className="eyebrow">📱 SMART TRAVEL MODE</p>
            <h2>{t('planner.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('planner.subtitle')}</p>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.14)', padding: '20px', borderRadius: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>{t('planner.vibeLabel')}</div>
              <div className="category-buttons" style={{ justifyContent: 'flex-start' }}>
                {Object.entries(t('planner.modes')).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`category-btn ${plannerMode === key ? 'active' : ''}`}
                    onClick={() => setPlannerMode(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px', background: 'rgba(251, 191, 36, 0.12)', padding: '12px 14px', borderRadius: '12px', color: '#fbbf24', fontSize: '0.95rem' }}>
              <strong>{t('planner.resultTitle')}</strong> — {t('planner.resultDesc')}
            </div>

            <div className="card-grid">
              {plannerItems.map((place) => (
                <div key={place.id} className="detail-panel" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', padding: '16px', borderRadius: '16px' }}>
                  <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>{t('planner.stepLabel')} {place.step}</div>
                  <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.1rem' }}>{getPlaceField(place, 'name', language)}</h3>
                  <p style={{ color: '#cbd5e1', margin: '0 0 10px', fontSize: '0.95rem' }}>{getPlaceField(place, 'description', language)}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a href={mapsUrl(place, language)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary small" style={{ textDecoration: 'none', textAlign: 'center' }}>
                      📍 {t('planner.maps')}
                    </a>
                    <a href={yandexTaxiUrl(place, language)} target="_blank" rel="noopener noreferrer" className="btn btn-primary small" style={{ textDecoration: 'none', textAlign: 'center', background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none' }}>
                      🚖 {t('planner.taxi')}
                    </a>
                    <a href={`tel:${place.phone || '1173'}`} className="btn btn-secondary small" style={{ textDecoration: 'none', textAlign: 'center' }}>
                      📞 {t('planner.call')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* РАЗГОВОРНИК С НАЧИСТО ИСПРАВЛЕННОЙ ОЗВУЧКОЙ */}
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
                    style={{ background: 'rgba(251, 191, 36, 0.2)', border: '1px solid #fbbf24', color: '#fbbf24', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    🔊
                  </button>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ color: '#e2e8f0' }}>🇷🇺 <strong>RU:</strong> {item.ru}</div>
                  <div style={{ color: '#e2e8f0' }}>🇬🇧 <strong>EN:</strong> {item.en}</div>
                  <div style={{ color: '#e2e8f0' }}>🇨🇳 <strong>ZH:</strong> {item.zh}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* СУВЕНИРЫ */}
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

        {/* MUST EAT */}
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
                  href={`https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(item.query)}`}
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

        {/* ИНТЕРАКТИВНОЕ МЕТРО */}
        <section className="section container">
          <div className="section-title">
            <p className="eyebrow">🚇 FULL METRO MAP (4 LINES & ALL 14 CIRCLE STATIONS)</p>
            <h2>{t('metro.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '8px' }}>{t('metro.subtitle')}</p>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.15)', padding: '24px', borderRadius: '24px' }}>
            <div style={{ position: 'relative', overflowX: 'auto', background: '#070d1e', padding: '24px', borderRadius: '16px', border: '1px solid #ffffff15' }}>
              <svg viewBox="0 0 780 480" style={{ width: '100%', minWidth: '680px', height: 'auto' }}>
                {/* 🔴 Чиланзарская Ветка */}
                <path d="M 150 360 L 410 210 L 620 210" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                {/* 🔵 Узбекистанская Ветка */}
                <path d="M 250 110 L 410 190 L 560 340 L 620 340" fill="none" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                {/* 🟢 Юнусабадская Ветка */}
                <path d="M 480 50 L 480 225 L 500 310" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                {/* 🩵 ПОЛНАЯ Кольцевая Наземная Ветка (1-14 станций) */}
                <path d="M 680 340 L 710 360 L 710 390 L 690 420 L 650 440 L 590 450 L 520 450 L 450 450 L 380 450 L 310 440 L 240 420 L 180 390 L 120 360 L 70 330" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="8,4" strokeLinecap="round" strokeLinejoin="round" />

                {FULL_METRO_STATIONS.map((st) => {
                  const isSelected = selectedMetroStation?.id === st.id;
                  const stationName = getTranslatedText(st.name, language);
                  return (
                    <g key={st.id} onClick={() => setSelectedMetroStation(st)} style={{ cursor: 'pointer' }}>
                      {st.isInterchange && (
                        <circle cx={st.x} cy={st.y} r={isSelected ? 13 : 10} fill="none" stroke="#fbbf24" strokeWidth="3" />
                      )}
                      <circle cx={st.x} cy={st.y} r={isSelected ? 8 : (st.isInterchange ? 6 : 5)} fill={isSelected ? '#10b981' : '#ffffff'} stroke="#000000" strokeWidth="2" />
                      <text x={st.x} y={st.y - (st.isInterchange ? 14 : 10)} fill={isSelected ? '#10b981' : '#f8fafc'} fontSize={isSelected ? '12' : '9'} fontWeight={isSelected || st.isInterchange ? 'bold' : 'normal'} textAnchor="middle">
                        {stationName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {selectedMetroStation && (
              <div style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(251, 191, 36, 0.6)', padding: '20px', borderRadius: '16px' }}>
                <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.3rem' }}>
                  {t('metro.stationLabel')} {getTranslatedText(selectedMetroStation.name, language)}
                </h3>
                <p style={{ color: '#94a3b8', margin: '4px 0 10px', fontSize: '0.9rem' }}>
                  {getTranslatedText(selectedMetroStation.line, language)}
                </p>
                <p style={{ color: '#e2e8f0', fontSize: '1rem', margin: 0 }}>
                  {getTranslatedText(selectedMetroStation.info, language)}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* КУРСЫ ВАЛЮТ */}
        <section id="rates" className="section section-alt container">
          <div className="section-title">
            <p className="eyebrow">💰 CURRENCY & CONVERTER</p>
            <h2>{t('rate.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '4px' }}>{t('rate.subtitle')}</p>
          </div>
          
          <div className="rate-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="rate-card">
              <span className="eyebrow">CBU exchange rates</span>
              <h3 className="rate-value" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.2rem', margin: '16px 0' }}>
                <div>💵 <b>USD:</b> {usdRate ? `${formatRate(usdRate, language)} sum` : '...'}</div>
                <div>💶 <b>EUR:</b> {eurRate ? `${formatRate(eurRate, language)} sum` : '...'}</div>
                <div>🇷🇺 <b>RUB:</b> {rubRate ? `${formatRate(rubRate, language)} sum` : '...'}</div>
                <div>🇨🇳 <b>CNY:</b> {cnyRate ? `${formatRate(cnyRate, language)} sum` : '...'}</div>
                <div>🇮🇳 <b>INR:</b> {formatRate(150, language)} sum</div>
                <div>💰 <b>KZT:</b> {formatRate(28, language)} sum</div>
                <div>🪙 <b>KGS:</b> {formatRate(145, language)} sum</div>
              </h3>
              <p>{rateError ? t('rate.error') : `${t('rate.loaded')}: ${rateUpdated}`}</p>
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
                      <option value="RUB">🇷🇺 RUB</option>
                      <option value="CNY">🇨🇳 CNY</option>
                      <option value="INR">🇮🇳 INR</option>
                      <option value="KZT">💰 KZT</option>
                      <option value="KGS">🪙 KGS</option>
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
                      <option value="RUB">🇷🇺 RUB</option>
                      <option value="CNY">🇨🇳 CNY</option>
                      <option value="INR">🇮🇳 INR</option>
                      <option value="KZT">💰 KZT</option>
                      <option value="KGS">🪙 KGS</option>
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

        {/* МЕСТА */}
        <section id="places" className="section container">
          <div className="section-title">
            <p className="eyebrow">{t('places.title')}</p>
            <h2>{t('places.subtitle')}</h2>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(15, 23, 42, 0.82)', border: '1px solid rgba(255,255,255,0.14)', padding: '18px', borderRadius: '18px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#5bd1ff', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: '700' }}>{t('favorites.title')}</div>
                <h3 style={{ margin: '4px 0 6px', color: '#fff', fontSize: '1.1rem' }}>{t('favorites.subtitle')}</h3>
                <p style={{ margin: 0, color: '#abc0d7', fontSize: '0.95rem' }}>
                  {favorites.length > 0 ? `${t('favorites.ready')}: ${favorites.length}` : t('favorites.empty')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary small" onClick={() => setActiveCategory('favorites')} style={{ textDecoration: 'none' }}>
                  {t('favorites.show')}
                </button>
                {favorites.length > 0 && (
                  <button type="button" className="btn btn-secondary small" onClick={clearFavorites} style={{ textDecoration: 'none' }}>
                    {t('favorites.clear')}
                  </button>
                )}
              </div>
            </div>

            {favorites.length > 0 ? (
              <div className="trip-plan-grid" style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {planByTime.map((slot) => (
                  <div key={slot.key} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ color: '#5bd1ff', fontWeight: '700', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{slot.label}</div>
                    {slot.places.length > 0 ? slot.places.map((place) => (
                      <div key={place.id} style={{ paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '6px' }}>
                        <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.8rem', marginBottom: '4px' }}>{t('favorites.stepLabel')} {place.step}</div>
                        <div style={{ color: '#fff', fontWeight: '700', marginBottom: '4px' }}>{getPlaceField(place, 'name', language)}</div>
                        <div style={{ color: '#abc0d7', fontSize: '0.9rem' }}>{getPlaceField(place, 'description', language)}</div>
                      </div>
                    )) : (
                      <div style={{ color: '#abc0d7', fontSize: '0.9rem' }}>—</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: '14px', color: '#abc0d7', background: 'rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '12px' }}>
                {t('favorites.emptyHint')}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={language === 'ru' ? 'Поиск по названию, адресу или категории' : language === 'en' ? 'Search by name, address or category' : 'Nom, manzil yoki kategoriya bo\'yicha qidirish'}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.04)',
                color: '#fff',
                fontSize: '0.96rem',
                outline: 'none',
              }}
            />
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
          </div>

          <div className="places-grid">
            {filteredPlaces.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888' }}>
                {activeCategory === 'favorites' ? 'Сохранённых мест нет' : '—'}
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
                    <button
                      type="button"
                      className="btn btn-secondary small"
                      onClick={() => sharePlace(place)}
                      style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}
                    >
                      🔗 Share
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* МАРШРУТЫ */}
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
              {routeItems.map((item, idx) => (
                <li key={idx}>{getTranslatedText(item, language)}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* СКАЧАТЬ / СВЯЗЬ */}
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