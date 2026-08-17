import React, { useState, useMemo } from 'react';

// ==========================================
// 1. ДАННЫЕ (Языки, Категории и Локации)
// ==========================================

const languages = [
  { code: 'ru', name: 'RU' },
  { code: 'en', name: 'EN' },
  { code: 'uz', name: 'UZ' },
  { code: 'kk', name: 'KK' },
  { code: 'ky', name: 'KY' },
  { code: 'zh', name: 'ZH' },
];

const categoryFilters = [
  { key: 'all', label: { ru: 'Всё', en: 'All', uz: 'Barchasi', kk: 'Барлығы', ky: 'Бардыгы', zh: '全部' } },
  { key: 'favorites', label: { ru: '❤️ Избранное', en: '❤️ Favorites', uz: '❤️ Tanlanganlar', kk: '❤️ Тандалғандар', ky: '❤️ Тандалгандар', zh: '❤️ 收藏' } },
  { key: 'parks', label: { ru: '🌳 Парки & Зоопарк', en: '🌳 Parks & Zoo', uz: '🌳 Bog‘lar & Zopark', kk: '🌳 Саябақтар & Зоопарк', ky: '🌳 Парктер & Зоопарк', zh: '🌳 公园与动物园' } },
  { key: 'museums', label: { ru: '🏛️ Музеи & Культура', en: '🏛️ Museums & Culture', uz: '🏛️ Muzeylar', kk: '🏛️ Музейлер', ky: '🏛️ Музейлер', zh: '🏛️ 博物馆' } },
  { key: 'food', label: { ru: '🥗 Еда & Рестораны', en: '🥗 Food & Dining', uz: '🥗 Taomlar', kk: '🥗 Тағамдар', ky: '🥗 Тамак-аш', zh: '🥗 美食与餐厅' } },
];

const initialPlaces = [
  // --- ПАРКИ, ЗООПАРКИ И АКВАПАРКИ ---
  {
    id: 'tashkent-zoo',
    category: 'parks',
    title: { ru: 'Ташкентский Зоопарк', en: 'Tashkent Zoo', uz: 'Toshkent Zoparki', kk: 'Ташкент зоопаркі', ky: 'Ташкент зоопаркы', zh: '塔什干动物园' },
    description: {
      ru: 'Огромная зелёная территория с более чем 300 видами животных, водоёмами и зонами отдыха.',
      en: 'Huge green territory with over 300 species of animals, ponds, and relaxation zones.',
      uz: '300 dan ortiq hayvon turlari, suv havzalari va dam olish zonalari mavjud ulkan yashil hudud.',
      kk: '300-ден астам жануарлар түрі, су айдындары бар үлкен жасыл аймақ.',
      ky: '300дөн ашык жаныбарлардын түрлөрү бар чоң жашыл аймак.',
      zh: '拥有300多种动物、湖泊和休闲区的巨大绿化园区。'
    },
    address: 'ул. Богишамол, 232',
    query: 'Tashkent Zoo'
  },
  {
    id: 'aquapark-tashkent',
    category: 'parks',
    title: { ru: 'Аквапарк Ташкент', en: 'Tashkent Aquapark', uz: 'Toshkent Akvaparki', kk: 'Ташкент аквапаркі', ky: 'Ташкент аквапаркы', zh: '塔什干水上乐园' },
    description: {
      ru: 'Классический открытый аквапарк рядом с Телебашней: волновой бассейн, горки и детские зоны.',
      en: 'Classic outdoor water park near the TV Tower: wave pool, slides, and kids zones.',
      uz: 'Teleminora yonidagi ochiq akvapark: to‘lqinli havza, attraktsionlar va bolalar zonasi.',
      kk: 'Телеұңғы жанындағы ашық аквапарк: толқынды бассейн, сырғанақтар.',
      ky: 'Телемунара жанындагы ачык аквапарк: толкун бассейн жана слайддар.',
      zh: '电视塔旁的室外水上乐园，包含波浪池、水上滑梯和儿童区。'
    },
    address: 'просп. Амира Темура, 107',
    query: 'Tashkent Aquapark'
  },
  {
    id: 'botanical-garden',
    category: 'parks',
    title: { ru: 'Ботанический Сад', en: 'Tashkent Botanical Garden', uz: "Botanika Bog'i", kk: 'Ботаникалық бақ', ky: 'Ботаникалык бак', zh: '植物园' },
    description: {
      ru: 'Огромный природный парк для тихих прогулок, катания на велосипедах и фотосессий.',
      en: 'A vast natural park for quiet walks, cycling, and photo shoots.',
      uz: 'Tinch sayr qilish, velosiped uchish va fotosessiyalar uchun ulkan tabiat bog‘i.',
      kk: 'Тыныш серуендеу, велосипед тебу және фотосессияларға арналған үлкен бақ.',
      ky: 'Тынч сейилдөө жана велосипед тебүү үчүн чоң табигый бакча.',
      zh: '适合散步、骑行和拍照的大型自然植物园。'
    },
    address: 'ул. Богишамол, 232',
    query: 'Botanical Garden Tashkent'
  },
  {
    id: 'ecopark-tashkent',
    category: 'parks',
    title: { ru: 'Центральный Экопарк (Eco Park)', en: 'Tashkent Eco Park', uz: 'Eko Park Toshkent', kk: 'Экопарк Ташкент', ky: 'Экопарк Ташкент', zh: '生态公园 (Eco Park)' },
    description: {
      ru: 'Современный экологичный парк в центре города с беговыми дорожками, деревянными мостами и озером.',
      en: 'Modern eco-friendly park in the city center with running tracks, wooden bridges, and a lake.',
      uz: 'Yugurish yo‘lakchalari, yog‘och ko‘priklar va ko‘lga ega zamonaviy bog‘.',
      kk: 'Жүгіру жолдары, ағаш көпірлері мен көлі бар заманауи экопарк.',
      ky: 'Жөө күлүк жолдору жана көлү бар заманбап экопарк.',
      zh: '位于市中心的现代生态公园，带有跑道、木桥和人工湖。'
    },
    address: 'ул. Узбекистон Овози / Ц1',
    query: 'Ecopark Tashkent'
  },
  {
    id: 'magic-city',
    category: 'parks',
    title: { ru: 'Парк Magic City', en: 'Magic City Park', uz: "Magic City Bog'i", kk: 'Magic City саябағы', ky: 'Magic City паркы', zh: 'Magic City 魔法之城' },
    description: {
      ru: 'Крупный тематический парк с архитектурой в стиле мировых столиц, поющим фонтаном и океанариумом.',
      en: 'Large theme park featuring world-architecture styles, a musical fountain, and an aquarium.',
      uz: 'Dunyoning mashhur shaharlari uslubidagi me’morchilik, musiqa favvorasi va okeanariumga ega bog‘.',
      kk: 'Әлем астаналары стиліндегі сәулеті, ән айтатын субұрқағы бар үлкен тематикалық саябақ.',
      ky: 'Музыкалык фонтаны жана океанариуму бар чоң тематикалык парк.',
      zh: '具有世界城市建筑风格的大型主题公园，设有音乐喷泉和水族馆。'
    },
    address: 'ул. Бабура, 174',
    query: 'Magic City Tashkent'
  },
  {
    id: 'tashkent-city-park',
    category: 'parks',
    title: { ru: 'Парк Tashkent City', en: 'Tashkent City Park', uz: "Toshkent City Bog'i", kk: 'Ташкент Сити саябағы', ky: 'Ташкент Сити паркы', zh: '塔什干新城公园' },
    description: {
      ru: 'Современный парк в центре столицы с шоу музыкальных фонтанов, музеем восковых фигур и алеями.',
      en: 'Modern downtown park featuring a musical fountain show, wax museum, and scenic walk paths.',
      uz: 'Musiqiy favvoralar shousi, mum haykallar muzeyi va sayr yo‘laklariga ega zamonaviy bog‘.',
      kk: 'Музыкалық субұрқақтар шоуы, балауыз мүсіндер музейі бар заманауи саябақ.',
      ky: 'Музыкалык фонтандар шоуу жана сейилдөө аймактары бар заманбап парк.',
      zh: '市中心现代化的公园，具有音乐喷泉秀和蜡像馆。'
    },
    address: 'ул. Ислама Каримова, Tashkent City',
    query: 'Tashkent City Park'
  },

  // --- МУЗЕИ И КУЛЬТУРА ---
  {
    id: 'temurids-museum',
    category: 'museums',
    title: { ru: 'Музей истории Темуридов', en: 'Amir Timur Museum', uz: 'Temuriylar Tarixi Davlat Muzeyi', kk: 'Тимуридтер тарихы музейі', ky: 'Тимуридтер тарыхы музейи', zh: '帖木儿 Empire 历史博物馆' },
    description: {
      ru: 'Знаменитый круглый музей с голубым куполом в самом центре Ташкента, посвящённый эпохе Амира Темура.',
      en: 'Famous blue-domed museum in the heart of Tashkent, dedicated to the era of Amir Timur.',
      uz: 'Toshkent markazidagi Amir Temur davriga bag‘ishlangan mashhur ko‘k gumbazli muzey.',
      kk: 'Ташкент орталығындағы Ақсақ Темір дәуіріне арналған көк күмбезді музей.',
      ky: 'Амир Темур дооруна арналган көк кумбездуу белгилүү музей.',
      zh: '位于市中心具有标志性蓝色圆顶的博物馆，展示帖木儿时代的历史。'
    },
    address: 'просп. Амира Темура, 1',
    query: 'Amir Timur Museum Tashkent'
  },
  {
    id: 'applied-arts-museum',
    category: 'museums',
    title: { ru: 'Музей Прикладного Искусства', en: 'Museum of Applied Arts', uz: "Amaliy San'at Muzeyi", kk: 'Колданбалы өнер музейі', ky: 'Колдонмо искусство музейи', zh: '应用艺术博物馆' },
    description: {
      ru: 'Атмосферный дворец с уникальной резной росписью, где собраны лучшие ковры, сюзане и керамика Узбекистана.',
      en: 'Atmospheric palace with exquisite carved wood and plaster, exhibiting carpets, suzani, and ceramics.',
      uz: 'O‘zbekistonning eng yaxshi gilamlari, so‘zana va keramikasi jamlangan muhtasham muzey.',
      kk: 'Өзбекстанның ең үздік кілемдері мен керамикасы жиналған сарай-музей.',
      ky: 'Өзбекстандын мыкты килемдери жана керамикасы коюлган музей.',
      zh: '精致的宫殿式博物馆，展出乌兹别克斯坦顶级手毯、刺绣与陶瓷。'
    },
    address: 'ул. Ракаббаши, 15',
    query: 'Museum of Applied Arts Tashkent'
  },
  {
    id: 'polytechnic-museum',
    category: 'museums',
    title: { ru: 'Политехнический музей', en: 'Polytechnic Museum', uz: 'Politexnika Muzeyi', kk: 'Политехникалық музей', ky: 'Политехникалык музей', zh: '理工博物馆' },
    description: {
      ru: 'Интерактивный музей для всей семьи с историей автомобилей, физическими экспериментами и роботами.',
      en: 'Interactive family-friendly museum featuring auto history, physics experiments, and robotics.',
      uz: 'Avtomobillar tarixi, fizik tajribalar va robotlarga ega butun oila uchun interaktiv muzey.',
      kk: 'Автомобиль тарихы, физикалық тәжірибелері бар бүкіл отбасыға арналған интерактивті музей.',
      ky: 'Автоунаа тарыхы жана интерактивдүү физикалык эксперименттер бар музей.',
      zh: '适合全家参观的互动式博物馆，展示汽车历史、物理实验和机器人。'
    },
    address: 'ул. Амира Темура, 13',
    query: 'Polytechnic Museum Tashkent'
  },

  // --- ЕДА И РЕСТОРАНЫ ---
  {
    id: 'besh-qozon',
    category: 'food',
    title: { ru: 'Центр плова (Besh Qozon)', en: 'Plov Center (Besh Qozon)', uz: 'Osh Markazi (Besh Qozon)', kk: 'Палау орталығы (Besh Qozon)', ky: 'Плов борбору (Besh Qozon)', zh: '手抓饭中心 (Besh Qozon)' },
    description: {
      ru: 'Легендарное место, где в гигантских казанах готовят настоящий ташкентский плов.',
      en: 'Legendary spot where traditional Tashkent plov is cooked in massive cauldrons.',
      uz: 'Gigant qozonlarda haqiqiy Toshkent oshi tayyorlanadigan afsonaviy maskan.',
      kk: 'Дәстүрлі ташкент палауы үлкен қазандарда пісірілетін аңызға айналған орын.',
      ky: 'Чоң казандарда ташкент плову даярдалган атактуу жай.',
      zh: '在巨型大锅中烹制传统塔什干手抓饭的传奇餐厅。'
    },
    address: 'ул. Ифтихор, 1 (рядом с Телебашней)',
    query: 'Besh Qozon Tashkent'
  },
  {
    id: 'chorsu-bazaar-food',
    category: 'food',
    title: { ru: 'Обжорный ряд на Чорсу', en: 'Chorsu Bazaar Food Street', uz: 'Chorsu Bozor Taomlar Qatori', kk: 'Чорсу базарындағы тағамдар қатары', ky: 'Чорсу базарындагы тамак-аш катары', zh: '恰尔苏集市美食街' },
    description: {
      ru: 'Колоритный уличный фудкорт под открытым небом: шашлыки, нарын, самса, казы и хасип.',
      en: 'Vibrant outdoor street food area offering traditional kebabs, naryn, somsa, and kazhi.',
      uz: 'Ochiq osmon ostidagi gavjum taomlar qatori: kabob, naryn, somsa va hasip.',
      kk: 'Ашық аспан астындағы көше тағамдары: кәуап, нарын, самса.',
      ky: 'Ачык асман алдындагы тамак-аш катары: шашлык, нарын, самса.',
      zh: '热火朝天的露天露天小吃街：烤肉串、纳林、烤包子等。'
    },
    address: 'Базар Чорсу, Старый Город',
    query: 'Chorsu Bazaar Tashkent'
  }
];

// ==========================================
// 2. ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
// ==========================================

function Header({ lang, setLang }) {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2>📍 Ташкент — Путеводитель</h2>
      <div>
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            style={{
              margin: '0 4px',
              fontWeight: lang === l.code ? 'bold' : 'normal',
              backgroundColor: lang === l.code ? '#007bff' : '#eee',
              color: lang === l.code ? '#fff' : '#000',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {l.name}
          </button>
        ))}
      </div>
    </header>
  );
}

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Поиск мест или адресов..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
    </div>
  );
}

function CategoryFilter({ selectedCategory, setSelectedCategory, lang }) {
  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
      {categoryFilters.map((cat) => (
        <button
          key={cat.key}
          onClick={() => setSelectedCategory(cat.key)}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #007bff',
            backgroundColor: selectedCategory === cat.key ? '#007bff' : '#fff',
            color: selectedCategory === cat.key ? '#fff' : '#007bff',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
        >
          {cat.label[lang] || cat.label.ru}
        </button>
      ))}
    </div>
  );
}

function PlaceCard({ place, lang, isFav, toggleFavorite }) {
  const title = place.title[lang] || place.title.ru;
  const description = place.description[lang] || place.description.ru;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        position: 'relative',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
      }}
    >
      <button
        onClick={() => toggleFavorite(place.id)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          border: 'none',
          background: 'none',
          fontSize: '20px',
          cursor: 'pointer'
        }}
      >
        {isFav ? '❤️' : '🤍'}
      </button>
      <h3>{title}</h3>
      <p style={{ color: '#555', fontSize: '14px' }}>{description}</p>
      <p style={{ fontSize: '12px', color: '#888' }}><strong>📍 Адрес:</strong> {place.address}</p>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query)}`}
        target="_blank"
        rel="noreferrer"
        style={{ display: 'inline-block', marginTop: '10px', color: '#007bff', textDecoration: 'none' }}
      >
        Открыть на карте ↗
      </a>
    </div>
  );
}

// ==========================================
// 3. ГЛАВНЫЙ КОМПОНЕНТ APP
// ==========================================

export default function App() {
  const [lang, setLang] = useState('ru');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Переключение избранного
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Фильтрация локаций
  const filteredPlaces = useMemo(() => {
    return initialPlaces.filter((place) => {
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(place.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (place.category !== selectedCategory) return false;
      }

      const title = place.title[lang] || place.title.ru;
      return (
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [selectedCategory, searchQuery, favorites, lang]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Header lang={lang} setLang={setLang} />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} lang={lang} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              lang={lang}
              isFav={favorites.includes(place.id)}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p>Ничего не найдено.</p>
        )}
      </div>
    </div>
  );
}