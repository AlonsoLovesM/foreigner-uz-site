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
  { uzbek: "Assalomu alaykum!", translit: "Ассалому алайкум!", ru: "Здравствуйте!", en: "Hello / Peace be upon you!", zh: "你好！" },
  { uzbek: "Rahmat!", translit: "Рахмат!", ru: "Спасибо!", en: "Thank you!", zh: "谢谢！" },
  { uzbek: "Necha pul?", translit: "Неч пул?", ru: "Сколько стоит?", en: "How much is it?", zh: "多少钱？" },
  { uzbek: "Arzonroq qilib bering", translit: "Арзонрок килиб беринг", ru: "Сделайте скидку (подешевле)", en: "Can you give a discount?", zh: "能便宜一点吗？" },
  { uzbek: "Juda shirin!", translit: "Жуда ширин!", ru: "Очень вкусно!", en: "Very delicious!", zh: "非常美味！" },
  { uzbek: "Hisobni keltiring", translit: "Хисобни келтиринг", ru: "Принесите счёт", en: "Bring the bill, please", zh: "请结账" },
  { uzbek: "Xayr / Salomat bo'ling", translit: "Хайр / Саломат булинг", ru: "До свидания / Будьте здоровы", en: "Goodbye / Stay healthy", zh: "再见 / 保重" }
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
  { key: 'food', label: { ru: 'Еда', en: 'Food', uz: 'Taomlar', zh: '美食' } },
  { key: 'finance', label: { ru: 'Банки & обмен', en: 'Banks & exchange', uz: 'Banklar va almashtirish', zh: '银行&兑换' } },
  { key: 'health', label: { ru: 'Медицина', en: 'Health', uz: 'Tibbiyot', zh: '医疗' } },
  { key: 'shopping', label: { ru: 'Шопинг', en: 'Shopping', uz: 'Xaridlar', zh: '购物' } },
  { key: 'gas', label: { ru: 'АЗС', en: 'Gas stations', uz: 'AYQSH', zh: '加油站' } },
  { key: 'sights', label: { ru: 'Достопримечательности', en: 'Sights', uz: 'Diqqatga sazovor joylar', zh: '景点' } },
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
  hotel: { ru: 'Отель', en: 'Hotel', uz: 'Mehmonxona', zh: '酒店' },
  restaurant: { ru: 'Ресторан', en: 'Restaurant', uz: 'Restoran', zh: '餐厅' },
  cafe: { ru: 'Кафе', en: 'Cafe', uz: 'Kafe', zh: '咖啡馆' },
  exchange: { ru: 'Обмен', en: 'Exchange', uz: 'Valyuta ayirboshlash', zh: '外汇兑换' },
  bank: { ru: 'Банк / банкомат', en: 'Bank / ATM', uz: 'Bank / Bankomat', zh: '银行 / ATM' },
  clinic: { ru: 'Клиника', en: 'Clinic', uz: 'Klinika', zh: '诊所' },
  pharmacy: { ru: 'Аптека', en: 'Pharmacy', uz: 'Dorixona', zh: '药店' },
  market: { ru: 'Рынок', en: 'Market', uz: 'Bozor', zh: '集市' },
  mall: { ru: 'ТЦ / торговый центр', en: 'Mall', uz: 'Tashkiliy markaz', zh: '购物中心' },
  gas: { ru: 'АЗС', en: 'Gas Station', uz: 'AYQSH', zh: '加油站' },
  sight: { ru: 'Достопримечательность', en: 'Sight', uz: 'Diqqatga sazovor joy', zh: '景点' },
};

// ПОЛНЫЙ СПИСОК ВСЕХ СТАНЦИЙ 4 ЛИНИЙ МЕТРО ТАШКЕНТА
const FULL_METRO_STATIONS = [
  // 🔴 ЧИЛАНЗАРСКАЯ ЛИНИЯ (Chilanzar Line) - Включая Сергели
  { id: 'chinar', name: { ru: '14-Бекат (Чинар)', en: 'Station 14 (Chinar)', uz: '14-Bekat (Chinor)', zh: '14站 (Chinar)' }, line: { ru: '🔴 Чиланзарская (Сергели)', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 60, y: 440, isInterchange: false, info: { ru: 'Конечная Сергелийской надземной ветки.', en: 'Terminus of Sergeli elevated section.', uz: 'Sergeli yerusti yo‘nalishi oxirgi bekati.', zh: '塞尔格利高架段终点站。' } },
  { id: 'kipchak_ch', name: { ru: '13-Бекат (Кипчак)', en: 'Station 13 (Kipchak)', uz: '13-Bekat (Qipchoq)', zh: '13站 (Kipchak)' }, line: { ru: '🔴 Чиланзарская (Сергели)', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 90, y: 415, isInterchange: false, info: { ru: 'Наземная станция ветки Сергели.', en: 'Elevated station in Sergeli.', uz: 'Sergeli yerusti bekati.', zh: '塞尔格利高架站。' } },
  { id: 'choshtepa', name: { ru: '12-Бекат (Чоштепа)', en: 'Station 12 (Choshtepa)', uz: '12-Bekat (Choshtepa)', zh: '12站 (Choshtepa)' }, line: { ru: '🔴 Чиланзарская (Сергели)', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 120, y: 390, isInterchange: false, info: { ru: 'Переходная станция перед подземной частью.', en: 'Transition station before underground section.', uz: 'Yerosti qismiga o‘tish bekati.', zh: '进入地下段前的过渡站。' } },
  { id: 'olmazor', name: { ru: 'Олмазор', en: 'Olmazor', uz: 'Olmazor', zh: 'Olmazor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 150, y: 360, isInterchange: true, interchangeWith: 'Кипчак (Кольцевая)', info: { ru: '🔄 Пересадка на Кольцевую надземную линию.', en: '🔄 Transfer to Circle Line.', uz: '🔄 Yerusti Halqa yo‘nalishiga o‘tish bekati.', zh: '🔄 换乘高架环线。' } },
  { id: 'chilonzor', name: { ru: 'Чиланзар', en: 'Chilanzar', uz: 'Chilonzor', zh: 'Chilanzar' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 190, y: 330, isInterchange: false, info: { ru: 'Торговые ряды, жилой массив.', en: 'Shopping rows and residential area.', uz: 'Savdo qatorlari va turar-joy massivi.', zh: '商业街与住宅区。' } },
  { id: 'mirzo_ulugbek', name: { ru: 'Мирзо Улугбек', en: 'Mirzo Ulugbek', uz: 'Mirzo Ulug‘bek', zh: 'Mirzo Ulugbek' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 230, y: 300, isInterchange: false, info: { ru: 'Стадион Бунёдкор, Парк Гафура Гуляма.', en: 'Bunyodkor Stadium, Gafur Gulyam Park.', uz: 'Bunyodkor stadioni, G‘afur G‘ulom bog‘i.', zh: '本尤德科体育场、加富尔·古利亚姆公园。' } },
  { id: 'novza', name: { ru: 'Новза', en: 'Novza', uz: 'Novza', zh: 'Novza' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 270, y: 270, isInterchange: false, info: { ru: 'Мечеть Новза и торговые центры.', en: 'Novza Mosque and shopping malls.', uz: 'Novza masjidi va savdo markazlari.', zh: '诺夫扎清真寺与购物中心。' } },
  { id: 'milliy_bog', name: { ru: 'Миллий Бог', en: 'Milliy Bog', uz: 'Milliy Bog‘', zh: 'Milliy Bog' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 310, y: 240, isInterchange: false, info: { ru: 'Национальный парк Узбекистана, Magic City.', en: 'National Park of Uzbekistan, Magic City.', uz: 'O‘zbekiston Milliy bog‘i, Magic City.', zh: '乌兹别克斯坦国家公园，Magic City 魔法城。' } },
  { id: 'bunyodkor', name: { ru: 'Халклар Достлиги', en: 'Bunyodkor / People Friendship', uz: 'Xalqlar Do‘stligi', zh: '人民友谊站' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 350, y: 220, isInterchange: false, info: { ru: 'Дворец кино, Humo Arena.', en: 'Cinema Palace, Humo Arena.', uz: 'Kino saroyi, Humo Arena.', zh: '电影宫、Humo 体育馆。' } },
  { id: 'pakhtakor', name: { ru: 'Пахтакор', en: 'Pakhtakor', uz: 'Paxtakor', zh: 'Pakhtakor' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 410, y: 210, isInterchange: true, interchangeWith: 'Алишер Навои', info: { ru: '🔄 ПЕРЕСАДКА на Узбекистанскую (синюю) линию! Рядом Tashkent City Mall.', en: '🔄 TRANSFER to Uzbekistan Line! Next to Tashkent City Mall.', uz: '🔄 O‘zbekiston yo‘nalishiga O‘TISH! Tashkent City Mall yonida.', zh: '🔄 换乘乌兹别克斯坦（蓝）线！毗邻 Tashkent City Mall。' } },
  { id: 'mustaqillik', name: { ru: 'Мустакиллик Майдони', en: 'Mustaqillik Maydoni', uz: 'Mustaqillik Maydoni', zh: '独立广场站' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 440, y: 210, isInterchange: false, info: { ru: 'Площадь Независимости, правительственные здания.', en: 'Independence Square, government buildings.', uz: 'Mustaqillik maydoni, hukumat binolari.', zh: '独立广场、政府大楼。' } },
  { id: 'amir_timur', name: { ru: 'Амир Тимур Хиёбони', en: 'Amir Timur Square', uz: 'Amir Temur Xiyoboni', zh: 'Amir Timur 广场' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 480, y: 210, isInterchange: true, interchangeWith: 'Юнус Раджаби', info: { ru: '🔄 ПЕРЕСАДКА на Юнусабадскую (зелёную) линию! Сквер Амира Тимура.', en: '🔄 TRANSFER to Yunusabad Line! City center, Square.', uz: '🔄 Yunusobod yo‘nalishiga O‘TISH! Shahar markazi, Amir Temur xiyoboni.', zh: '🔄 换乘尤努萨巴德（绿）线！市中心、帖木儿广场。' } },
  { id: 'hamid_olimjon', name: { ru: 'Хамид Олимджан', en: 'Hamid Olimjon', uz: 'Hamid Olimjon', zh: 'Hamid Olimjon' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 530, y: 210, isInterchange: false, info: { ru: 'Площадь Х. Олимджана, рестораны и бизнес-центры.', en: 'H. Olimjon square, restaurants, BC.', uz: 'H. Olimjon maydoni, restoranlar.', zh: '哈米德·奥林江广场、餐厅与商务中心。' } },
  { id: 'pushkin', name: { ru: 'Пушкин', en: 'Pushkin', uz: 'Pushkin', zh: 'Pushkin' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 570, y: 210, isInterchange: false, info: { ru: 'Парк Тельмана (Central Park), памятник Пушкину.', en: 'Central Park, Pushkin monument.', uz: 'Central Park (Telman bog‘i).', zh: '中央公园、普希金纪念碑。' } },
  { id: 'buyuk_ipak_yuli', name: { ru: 'Буюк Ипак Йули', en: 'Buyuk Ipak Yuli', uz: 'Buyuk Ipak Yuli', zh: 'Buyuk Ipak Yuli' }, line: { ru: '🔴 Чиланзарская', en: '🔴 Chilanzar Line', uz: '🔴 Chilonzor yo‘nalishi', zh: '🔴 奇兰扎尔线' }, x: 620, y: 210, isInterchange: false, info: { ru: 'Конечная подземная станция (Шоссе Энтузиастов).', en: 'Terminus station of North line.', uz: 'Shimoliy yo‘nalishning oxirgi bekati.', zh: '北侧终点站。' } },

  // 🔵 УЗБЕКИСТАНСКАЯ ЛИНИЯ (Uzbekistan Line)
  { id: 'beruniy', name: { ru: 'Беруни', en: 'Beruniy', uz: 'Beruniy', zh: 'Beruniy' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 250, y: 110, isInterchange: false, info: { ru: 'Вузгородок (НУУз, ТГТУ), Студенческий городок.', en: 'University campus, Student town.', uz: 'Talabalar shaharchasi (O‘zMU, TDTU).', zh: '大学城（乌兹别克斯坦国立大学）。' } },
  { id: 'tinchlik', name: { ru: 'Тинчлик', en: 'Tinchlik', uz: 'Tinchlik', zh: 'Tinchlik' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 300, y: 135, isInterchange: false, info: { ru: 'Торговые ряды, выезд на Ташкентскую кольцевую.', en: 'Trade area, Ring road exit.', uz: 'Savdo hududi.', zh: '商业区。' } },
  { id: 'chorsu', name: { ru: 'Чорсу', en: 'Chorsu', uz: 'Chorsu', zh: 'Chorsu 楚苏' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 350, y: 160, isInterchange: false, info: { ru: '🛒 Знаменитый Базар Чорсу, старый город, сувениры.', en: '🛒 Famous Chorsu Bazaar, Old City.', uz: '🛒 Mashhur Chorsu bozori, eski shahar.', zh: '🛒 著名的楚苏大巴扎、老城、纪念品。' } },
  { id: 'ghafur_ghulom', name: { ru: 'Гафур Гулом', en: 'Gafur Gulyam', uz: 'G‘afur G‘ulom', zh: 'Gafur Gulyam' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 380, y: 180, isInterchange: false, info: { ru: 'Цирк, старый город, кафе и восточная кухня.', en: 'Circus, Old city cafes.', uz: 'Sirk, eski shahar kafelari.', zh: '马戏团、老城餐馆。' } },
  { id: 'alisher_navoi', name: { ru: 'Алишер Навои', en: 'Alisher Navoi', uz: 'Alisher Navoiy', zh: 'Alisher Navoi' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 410, y: 190, isInterchange: true, interchangeWith: 'Пахтакор', info: { ru: '🔄 ПЕРЕСАДКА на Пахтакор (красную ветку). Красивая станция.', en: '🔄 TRANSFER to Pakhtakor (Red Line). Beautiful architecture.', uz: '🔄 Paxtakor (qizil yo‘nalish)ga O‘TISH.', zh: '🔄 换乘 Pakhtakor（红线）。精致的建筑艺术。' } },
  { id: 'uzbekistan', name: { ru: 'Узбекистанская', en: 'Uzbekiston', uz: 'O‘zbekiston', zh: '乌兹别克斯坦站' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 440, y: 230, isInterchange: false, info: { ru: 'ЦУМ, Аллея голубых куполов, театр Навои.', en: 'TSUM mall, Blue Domes Alley, Navoi Theater.', uz: 'TSUM, Moviy gumbazlar xiyoboni.', zh: '中央百货商场、蓝顶巷、纳沃伊剧院。' } },
  { id: 'kosmonavtlar', name: { ru: 'Космонавтов', en: 'Kosmonavtlar', uz: 'Kosmonavtlar', zh: '航天员站' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 470, y: 270, isInterchange: false, info: { ru: 'Интерьер в стиле космоса, МВД, парк Голубые купола.', en: 'Space themed interior, Interior Ministry.', uz: 'Kosmos uslubidagi bekat, IIV.', zh: '太空主题内饰、内政部。' } },
  { id: 'oybek', name: { ru: 'Ойбек', en: 'Oybek', uz: 'Oybek', zh: 'Oybek' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 520, y: 310, isInterchange: true, interchangeWith: 'Минг Урик', info: { ru: '🔄 ПЕРЕСАДКА на Минг Урик (зелёную ветку). Рядом Фармацевтический ин-т.', en: '🔄 TRANSFER to Ming Urik (Green line).', uz: '🔄 Ming Urik (yashil yo‘nalish)ga O‘TISH.', zh: '🔄 换乘 Ming Urik（绿线）。' } },
  { id: 'toshkent', name: { ru: 'Ташкент (Северный Вокзал)', en: 'Tashkent (North Railway Station)', uz: 'Toshkent (Shimoliy Vokzal)', zh: '塔什干 (火车站)' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 560, y: 340, isInterchange: false, info: { ru: '🚆 Главный Северный Железнодорожный Вокзал Ташкента (Афрасиаб).', en: '🚆 Main Railway Station (Afrosiyob High-Speed Train).', uz: '🚆 Toshkent Shimoliy Temir Yo‘l Vokzali (Afrosiyob).', zh: '🚆 塔什干火车北站 (阿夫拉西阿卜号高铁)。' } },
  { id: 'dostlik', name: { ru: 'Dustlik', en: 'Dustlik', uz: 'Do‘stlik', zh: 'Dustlik' }, line: { ru: '🔵 Узбекистанская', en: '🔵 Uzbekistan Line', uz: '🔵 O‘zbekiston yo‘nalishi', zh: '🔵 乌兹别克斯坦线' }, x: 620, y: 340, isInterchange: true, interchangeWith: 'Технопарк (Кольцевая)', info: { ru: '🔄 ПЕРЕСАДКА на 1-Бекат Кольцевой надземной ветки (Технопарк).', en: '🔄 TRANSFER to Circle Elevated Line Station 1.', uz: '🔄 Yerusti Halqa yo‘nalishining 1-bekatiga O‘TISH.', zh: '🔄 换乘高架环线 1 站 (Технопарк)。' } },

  // 🟢 ЮНУСАБАДСКАЯ ЛИНИЯ (Yunusabad Line)
  { id: 'turkiston', name: { ru: 'Туркистон', en: 'Turkiston', uz: 'Turkiston', zh: 'Turkiston' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 50, isInterchange: false, info: { ru: 'Конечная станция на севере Юнусабада.', en: 'Northern terminus in Yunusabad.', uz: 'Yunusobod shimolidagi oxirgi bekat.', zh: '尤努萨巴德区北侧终点站。' } },
  { id: 'yunusobod', name: { ru: 'Юнусабад', en: 'Yunusobod', uz: 'Yunusobod', zh: 'Yunusobod' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 80, isInterchange: false, info: { ru: 'Рынок Юнусабад, ТРЦ Mega Planet.', en: 'Yunusabad Market, Mega Planet Mall.', uz: 'Yunusobod bozori, Mega Planet TM.', zh: '尤努萨巴德集市、Mega Planet 购物中心。' } },
  { id: 'shahriston', name: { ru: 'Шахристон', en: 'Shahriston', uz: 'Shahriston', zh: 'Shahriston' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 110, isInterchange: false, info: { ru: 'Река Бозсу, транспортный узел.', en: 'Bozsu river, transport hub.', uz: 'Bozsu daryosi, transport tuguni.', zh: '博兹苏河、交通枢纽。' } },
  { id: 'bodomzor', name: { ru: 'Бодомзор', en: 'Bodomzor', uz: 'Bodomzor', zh: 'Bodomzor' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 140, isInterchange: false, info: { ru: 'Узэкспоцентр, Аквапарк, Японский сад.', en: 'Uzexpocentre, Aquapark, Japanese Garden.', uz: 'O‘zekspomarkaz, Akvapark, Yapon bog‘i.', zh: '乌兹展览中心、水上乐园、日式花园。' } },
  { id: 'minora', name: { ru: 'Минор', en: 'Minor', uz: 'Minor', zh: 'Minor' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 170, isInterchange: false, info: { ru: 'Белокаменная мечеть Минор, Финансовый институт.', en: 'White Minor Mosque, Finance Institute.', uz: 'Oq Minor masjidi, Moliya instituti.', zh: '大理石米诺尔清真寺、金融学院。' } },
  { id: 'yunus_rajabi', name: { ru: 'Юнус Раджаби', en: 'Yunus Rajabi', uz: 'Yunus Rajabiy', zh: 'Yunus Rajabi' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 480, y: 225, isInterchange: true, interchangeWith: 'Амир Тимур Хиёбони', info: { ru: '🔄 Самая глубокая станция! Пересадка на красную линию.', en: '🔄 Deepest station! Transfer to Red line.', uz: '🔄 Eng chuqur bekat! Qizil yo‘nalishga o‘tish.', zh: '🔄 最深的车站！换乘红线。' } },
  { id: 'ming_urik', name: { ru: 'Минг Урик', en: 'Ming Urik', uz: 'Ming O‘rik', zh: 'Ming Urik' }, line: { ru: '🟢 Юнусабадская', en: '🟢 Yunusabad Line', uz: '🟢 Yunusobod yo‘nalishi', zh: '🟢 尤努萨巴德线' }, x: 500, y: 310, isInterchange: true, interchangeWith: 'Ойбек', info: { ru: '🔄 Пересадка на станцию Ойбек (синяя линия). Рядом Музей Искусств.', en: '🔄 Transfer to Oybek station (Blue Line).', uz: '🔄 Oybek bekatiga O‘TISH (ko‘k yo‘nalish).', zh: '🔄 换乘 Oybek 站（蓝线）。' } },

  // 🩵 КОЛЬЦЕВАЯ НАЗЕМНАЯ ЛИНИЯ (Circle Line / 30-Years Independence)
  { id: 'texnopark', name: { ru: '1-Бекат (Технопарк)', en: 'Station 1 (Technopark)', uz: '1-Bekat (Texnopark)', zh: '1站 (Texnopark)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line (Elevated)', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 680, y: 340, isInterchange: true, interchangeWith: 'Дустлик', info: { ru: '🔄 Старт Кольцевой надземной линии. Пересадка на синюю ветку.', en: '🔄 Transfer to Uzbekistan Line (Dustlik).', uz: '🔄 O‘zbekiston yo‘nalishiga o‘tish (Do‘stlik).', zh: '🔄 高架环线起点。换乘蓝线。' } },
  { id: 'yashnobod', name: { ru: '2-Бекат (Яшнабад)', en: 'Station 2 (Yashnabad)', uz: '2-Bekat (Yashnobod)', zh: '2站 (Yashnabad)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line (Elevated)', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 700, y: 370, isInterchange: false, info: { ru: 'Наземная эстакада Яшнабадского района.', en: 'Elevated line in Yashnabad.', uz: 'Yashnobod tumanidagi yerusti bekati.', zh: '雅什纳巴德区高架站。' } },
  { id: 'tuzel', name: { ru: '3-Бекат (Тузель)', en: 'Station 3 (Tuzel)', uz: '3-Bekat (Tuzel)', zh: '3站 (Tuzel)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line (Elevated)', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 680, y: 400, isInterchange: false, info: { ru: 'Массив Тузель и 40-летие Победы.', en: 'Tuzel district.', uz: 'Tuzel massivi.', zh: '图泽尔社区。' } },
  { id: 'qoyliq', name: { ru: '7-Бекат (Куйлюк)', en: 'Station 7 (Qoyliq)', uz: '7-Bekat (Qo‘yliq)', zh: '7站 (Qoyliq)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line (Elevated)', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 440, y: 440, isInterchange: false, info: { ru: '🛒 Крупный вещевой и продуктовый рынок Куйлюк.', en: '🛒 Huge Qoyliq Market & Food Bazaar.', uz: '🛒 Yirik Qo‘yliq bozori.', zh: '🛒 著名的奎柳克大集市。' } },
  { id: 'qipchoq_circle', name: { ru: '12-Бекат (Кипчак)', en: 'Station 12 (Kipchak)', uz: '12-Bekat (Qipchoq)', zh: '12站 (Kipchak)' }, line: { ru: '🩵 Кольцевая (Наземная)', en: '🩵 Circle Line (Elevated)', uz: '🩵 Halqa yo‘nalishi', zh: '🩵 高架环线' }, x: 180, y: 365, isInterchange: true, interchangeWith: 'Олмазор', info: { ru: '🔄 Пересадка на красную линию (Олмазор / Сергели).', en: '🔄 Transfer to Red Line (Olmazor).', uz: '🔄 Qizil yo‘nalishga O‘TISH (Olmazor).', zh: '🔄 换乘红线 (Olmazor)。' } }
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
  return place[`${field}_${language}`] || place[field] || '';
}

function getTypeLabel(place, language) {
  const typeKey = place.type || place.type_en?.toLowerCase();
  return typeLabels[typeKey]?.[language] || place[`${typeKey}_${language}`] || place.type_en || place.type || '';
}

function mapsUrl(place, language) {
  const queryValue = place.maps_query || `${getPlaceField(place, 'name', language)} ${getPlaceField(place, 'address', language)}`;
  const query = encodeURIComponent(queryValue.trim());
  return `https://www.google.com/maps/search/?api=1&query=$${query}`;
}

function yandexTaxiUrl(place, language) {
  const name = getPlaceField(place, 'name', language) || 'Ташкент';
  const address = getPlaceField(place, 'address', language) || '';
  const searchStr = encodeURIComponent(`Ташкент ${name} ${address}`);
  return `https://yandex.ru/maps/?text=${searchStr}`;
}

// УЛУЧШЕННАЯ ФУНКЦИЯ ОЗВУЧКИ ФРАЗ
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Ваш браузер не поддерживает озвучку текста.');
    return;
  }

  // Сбрасываем текущее воспроизведение
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'uz-UZ';
  
  // Умеренная скорость (0.8), чтобы произношение было чётким и естественным
  utterance.rate = 0.8;
  utterance.pitch = 1.0;

  // Пытаемся подключить нативный узбекский голос из ОС устройства
  const voices = window.speechSynthesis.getVoices();
  const uzVoice = voices.find(v => v.lang.includes('uz') || v.lang.includes('UZ'));
  if (uzVoice) {
    utterance.voice = uzVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [language, setLanguage] = useState('ru');
  const [activeCard, setActiveCard] = useState('places');
  const [activeRoute, setActiveRoute] = useState(routeCards[0].id);
  const [activeCategory, setActiveCategory] = useState('all');

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

  const [selectedMetroStation, setSelectedMetroStation] = useState(FULL_METRO_STATIONS[9]); // Pakhtakor by default

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
    else if (language === 'uz') setLanguage('zh');
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
    if (!usdRate || !eurRate || !calcAmount || Number.isNaN(Number(calcAmount))) return '—';

    const ratesInUzs = { 
      UZS: 1, 
      USD: usdRate, 
      EUR: eurRate, 
      RUB: rubRate || 140, 
      CNY: cnyRate || 1750 
    };

    const amountInUzs = calcAmount * (ratesInUzs[calcFrom] || 1);
    const result = amountInUzs / (ratesInUzs[calcTo] || 1);

    return calcTo === 'UZS' 
      ? Math.round(result).toLocaleString('ru-RU') 
      : result.toFixed(2).toLocaleString('en-US');
  }, [calcAmount, calcFrom, calcTo, usdRate, eurRate, rubRate, cnyRate]);

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
        {/* РАЗГОВОРНИК С УЛУЧШЕННОЙ ОЗВУЧКОЙ */}
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
                    style={{ background: 'rgba(251, 191, 36, 0.2)', border: '1px solid #fbbf24', color: '#fbbf24', borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
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
            <p className="eyebrow">🚇 FULL INTERACTIVE METRO (4 LINES)</p>
            <h2>{t('metro.title')}</h2>
            <p style={{ color: '#aaa', marginTop: '8px' }}>{t('metro.subtitle')}</p>
          </div>

          <div className="detail-panel" style={{ background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.15)', padding: '24px', borderRadius: '24px' }}>
            <div style={{ position: 'relative', overflowX: 'auto', background: '#070d1e', padding: '24px', borderRadius: '16px', border: '1px solid #ffffff15' }}>
              <svg viewBox="0 0 780 480" style={{ width: '100%', minWidth: '680px', height: 'auto' }}>
                {/* 🔴 Чиланзарская Ветка */}
                <path d="M 60 440 L 150 360 L 410 210 L 620 210" fill="none" stroke="#ef4444" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                {/* 🔵 Узбекистанская Ветка */}
                <path d="M 250 110 L 410 190 L 560 340 L 620 340" fill="none" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                {/* 🟢 Юнусабадская Ветка */}
                <path d="M 480 50 L 480 225 L 500 310" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                {/* 🩵 Кольцевая Наземная Ветка */}
                <path d="M 680 340 L 700 370 L 680 400 L 440 440 L 180 365" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="8,4" strokeLinecap="round" strokeLinejoin="round" />

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