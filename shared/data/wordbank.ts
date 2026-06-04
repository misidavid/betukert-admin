// ============================================
// BETŰKERT SZÓBANK
// Meixner-elvek szerint válogatva:
// - csak tőszavak (nem ragozott alakok)
// - gyerekek életteréből ismert fogalmak
// - fokozatosan nehezedő
// - szint szerint rendezve
//
// A szekciók a szó TÉNYLEGES fázisát jelzik
// (a benne lévő legkésőbbi graféma alapján).
// * = implicit graféma (megfigyelés útján tanult)
// ============================================

export const WORD_BANK: string[] = [

  // ----------------------------------------
  // Fázis 3 — m, s, t
  // ----------------------------------------
  'ma', 'mi', 'mit',
  'tó', 'só',
  'sas',
  'ima',
  'mama', 'mami', 'tata', 'sima',

  // ----------------------------------------
  // Fázis 4 — v
  // ----------------------------------------
  'vas', 'vita', 'avat', 'savó',

  // ----------------------------------------
  // Fázis 5 — e
  // ----------------------------------------
  'te', 'se',
  'mese', 'este', 'test', 'evet',
  'esti', 'teve', 'vese',

  // ----------------------------------------
  // Fázis 6 — l
  // ----------------------------------------
  'ló', 'les',
  'tele', 'illat',
  'alma', 'lila', 'leves', 'villa',
  'villamos', 'emelet',

  // ----------------------------------------
  // Fázis 7 — ú
  // ----------------------------------------
  'út', 'lassú',

  // ----------------------------------------
  // Fázis 8 — p, o*
  // ----------------------------------------
  'lep', 'lop', 'lap',
  'toll', 'olló', 'olvas', 'posta',
  'mos', 'most', 'atom',
  'pap', 'pipa', 'tapló',
  'alap', 'palota', 'tepsi', 'púpos',

  // ----------------------------------------
  // Fázis 9 — c, u*
  // ----------------------------------------
  'cím', 'cumi', 'cica',
  'malac', 'pacal',
  'autó', 'piac', 'utca',

  // ----------------------------------------
  // Fázis 10 — k
  // ----------------------------------------
  'kis', 'okos',
  'kap', 'kel', 'kos', 'kút',
  'kapa', 'kupa', 'kuka', 'makk', 'móka',
  'kapu', 'sapka', 'lakó', 'komp',
  'kocka', 'mókus',
  'kakas', 'kalap', 'kupac',
  'pakol', 'iskola',
  'kupola', 'lakoma',
  'kakaó',
  'kócos', 'pocak', 'vacak',
  'lepke', 'pók',

  // ----------------------------------------
  // Fázis 11 — á
  // ----------------------------------------
  'ám', 'más',
  'tál', 'sál', 'láp', 'mák',
  'váll', 'lapát',
  'áll', 'ásó', 'átok', 'ásít',
  'saláta', 'táska', 'állomás',
  'lám', 'lámpa', 'álom', 'villám',
  'pápa', 'kapál', 'sikál', 'lakás', 'talál',

  // ----------------------------------------
  // Fázis 12 — f
  // ----------------------------------------
  'fa', 'fal', 'fut',
  'fest', 'fóka', 'fekete',
  'fakó', 'falat', 'kefe',
  'foci', 'ficam',

  // ----------------------------------------
  // Fázis 13 — h
  // ----------------------------------------
  'hó', 'hal', 'hús', 'hív', 'hát', 'has',
  'hull', 'homok', 'puha',
  'havas', 'hullik', 'hasít',
  'hatalmas', 'homokos',

  // ----------------------------------------
  // Fázis 14 — z
  // ----------------------------------------
  'víz', 'hoz', 'húz', 'íz',
  'ház', 'mozi',
  'hazai', 'kazal', 'fizet', 'lazac',
  'víziló',

  // ----------------------------------------
  // Fázis 15 — ő
  // ----------------------------------------
  'ős', 'ők', 'őz',
  'kő', 'eső', 'főz', 'tető', 'mező',
  'cipő',

  // ----------------------------------------
  // Fázis 16 — d, ö*
  // ----------------------------------------
  'öt', 'öl', 'öv', 'ad',
  'vad', 'lúd', 'híd', 'köd', 'kedd',
  'dió', 'duda', 'dal',
  'hold', 'padló', 'kötő',
  'kesudió',
  'zöld', 'köp', 'köt', 'övez',
  'medál', 'vidám',
  'valódi', 'lakodalom',

  // ----------------------------------------
  // Fázis 17 — j
  // ----------------------------------------
  'jó', 'új', 'tej',
  'haj', 'fej', 'vaj', 'ujj',
  'sajt', 'tojás',
  'hajó', 'ajtó',
  'sejt', 'majom', 'kacaj',

  // ----------------------------------------
  // Fázis 18 — é
  // ----------------------------------------
  'év', 'él', 'kék', 'kés', 'méz', 'tél',
  'vés', 'véd',
  'hét', 'méh', 'fél',
  'lép', 'pék', 'kép', 'kéz',
  'cél', 'dél',
  'sétál', 'hétfő', 'délelőtt',
  'képes', 'féltve',
  'édes', 'épít', 'ítél',
  'fazék', 'fedél',
  'levél', 'étel',
  'játék', 'útlevél',
  'főzés', 'dőlés', 'evés',
  'télitök', 'édesapa',

  // ----------------------------------------
  // Fázis 19 — n
  // ----------------------------------------
  'nő', 'nap', 'nem',
  'kint', 'van',
  'néz', 'énekel',
  'póni', 'vonat', 'hinta', 'katona',
  'kendő', 'pince', 'mandula', 'vonalzó',
  'délután', 'péntek',
  'néni', 'neve', 'néma',
  'napos', 'nevet',
  'zene', 'zokni', 'kaftan',
  'tehén', 'hiéna', 'málna',
  'fonál', 'kanál', 'ének',
  'lenéz', 'menő', 'honos', 'hajnal',
  'elefánt', 'kalandos', 'vonatos',
  'kalandozás', 'mandulafa',

  // ----------------------------------------
  // Fázis 20 — sz
  // ----------------------------------------
  'száj', 'szén', 'szem',
  'puszi', 'ősz', 'száll', 'szék', 'kasza',
  'szó', 'szín', 'szív', 'szép', 'szél',
  'uszoda', 'hosszú', 'széles',
  'eszik', 'iszik',
  'disznó', 'káposzta',
  'iszap', 'szikla', 'tavasz',
  'szappan', 'szandál',
  'asztal', 'szilva',
  'kaktusz', 'szőlő', 'észak',
  'úszik', 'íjász', 'díszít',
  'szamóca', 'szilvafa', 'szalonna',

  // ----------------------------------------
  // Fázis 21 — g
  // ----------------------------------------
  'fog', 'ing',
  'súg', 'húg', 'vág', 'tág', 'hág',
  'szög', 'szeg',
  'meleg', 'hideg', 'magas', 'vastag',
  'hang', 'liget', 'fogkefe',
  'dugó', 'vége', 'gida', 'hugi',
  'gép', 'gőz', 'gáz',
  'ág', 'zúg', 'jég',
  'vég', 'alig', 'hőség',
  'cég', 'dolog', 'szalag',
  'gazda', 'fogás', 'újság',
  'zajog',
  'flamingó',

  // ----------------------------------------
  // Fázis 22 — r
  // ----------------------------------------
  'ír', 'kor', 'kör', 'kér', 'kár', 'kar',
  'rég', 'rág', 'sár',
  'piros', 'fehér', 'régi', 'rövid', 'szomorú',
  'orr', 'térd',
  'virág', 'erdő',
  'tör', 'varr', 'farag', 'söpör', 'töröl',
  'ugrik', 'gurul', 'ugrat',
  'rigó', 'rágó', 'karó', 'kérő', 'róka',
  'orvos', 'tanár', 'mérnök', 'sofőr',
  'daru', 'varjú', 'szarvas', 'szamár', 'denevér',
  'eper', 'lekvár', 'retek', 'sárgarépa', 'krumpli',
  'harmat', 'ikra', 'hurka',
  'vödör', 'seprő', 'takaró', 'törölköző',
  'radír', 'ragasztó', 'nadrág', 'kréta', 'kerékpár', 'roller',
  'reggel', 'szerda', 'vasárnap',
  'strand', 'kórház', 'játszótér',
  'rák', 'rét', 'rés', 'rak',
  'kert', 'park', 'kard', 'rönk',
  'kerék', 'korom', 'köröm', 'karom',
  'káros', 'koros', 'kapar', 'rakás',
  'korona', 'karika', 'koszorú',
  'vár', 'vér', 'papír', 'határ', 'pohár',
  'ár', 'áram', 'madár', 'vásár',
  'párna', 'sárga', 'zárka', 'zár',
  'citrom', 'cukor', 'ceruza',
  'fodor', 'radar',
  'öreg', 'ördög', 'körte', 'körtefa', 'erős',
  'szer', 'szeret', 'szeder', 'reszket',
  'remeg', 'rajzol', 'karám', 'marha', 'derék',
  'rovar', 'horror',
  'jár', 'juhar', 'egér', 'rugó', 'agár',
  'érez', 'írás', 'kérdez', 'túrós', 'kísér',
  'kenguru', 'krokodil', 'oroszlán', 'gorilla', 'állatkert',
  'rajzolás', 'kukorica', 'kirándulás',

  // ----------------------------------------
  // Fázis 23 — ü, ű
  // ----------------------------------------
  'fül', 'sül', 'süt', 'tűr', 'tűz',
  'hűs', 'hűtő', 'sütő', 'kürt',
  'szürke',
  'üres', 'üreg', 'üzen',
  'sün', 'ürge',
  'tű', 'fű', 'fésű', 'fülke', 'füstös',
  'fűszer', 'szüret', 'repül',
  'üveg', 'ünnepe', 'ünnep', 'ütemes',
  'körül', 'tükör', 'füzet', 'szűrő', 'szükség',
  'repülő', 'tűzijáték', 'repülőgép',

  // ----------------------------------------
  // Fázis 24 — b
  // ----------------------------------------
  'bár', 'bor', 'bál', 'bőr', 'baj',
  'bél', 'bér', 'bír', 'bán', 'bűn',
  'bari', 'boci', 'béna', 'betű',
  'boka', 'bokor', 'birka',
  'béka', 'bika',
  'galamb', 'veréb',
  'tábla', 'szoba', 'gomb', 'bolt',
  'szabó', 'bíró', 'szombat',
  'kolbász', 'borsó', 'uborka',
  'dob', 'domb', 'darab', 'doboz',
  'öböl', 'jobb', 'bajusz',
  'bab', 'baba', 'bábu', 'barack', 'boldog',
  'labda', 'kabát', 'szabad', 'ebéd', 'ablak',
  'gomba', 'bogár', 'gömb', 'barát',
  'bicikli', 'autóbusz',

  // ----------------------------------------
  // Fázis 25 — gy
  // ----------------------------------------
  'nagy', 'ágy', 'hegy', 'légy', 'fagy',
  'megy', 'gyenge',
  'meggy', 'gyere',
  'kígyó', 'gyűrű', 'gyalu', 'gyúró',
  'mogyoró',
  'völgy', 'tölgy', 'fagylalt',
  'ügyes', 'nagyi',
  'gyár', 'gyep', 'gyík', 'gyors', 'gyöngy',
  'agyag', 'egyed', 'hagyma', 'nagyon', 'meggyfa',

  // ----------------------------------------
  // Fázis 26 — cs
  // ----------------------------------------
  'csap', 'csal', 'csáp', 'csel',
  'csomó', 'tócsa', 'csaló',
  'olcsó', 'karcsú',
  'vércse', 'harcsa',
  'csengő', 'csorba', 'csárda', 'csorda',
  'csapda', 'csemete', 'vacsora',
  'csuka', 'csákó', 'csikó',
  'csecsemő', 'lépcső',
  'hörcsög', 'csirke', 'pogácsa',
  'paradicsom', 'narancs',
  'mocsár', 'cserje',
  'csésze', 'papucs', 'csúszda', 'csípő',
  'szakács', 'csütörtök',
  'kacsa', 'kavics', 'fecske', 'lucska',
  'csokor', 'gyümölcs',
  'cső', 'csók', 'csúcs',
  'csiga', 'csizma', 'csillag', 'csapat', 'csavar',
  'macska', 'kulcs', 'csempe', 'csöpög',
  'palacsinta', 'csokoládé', 'narancsital',

  // ----------------------------------------
  // Fázis 27 — ny
  // ----------------------------------------
  'nyak', 'nyíl',
  'tény', 'lény', 'lényeg',
  'konyha', 'szoknya', 'hernyó', 'nyalka', 'pernye',
  'kenyér', 'tenyér', 'tányér', 'nyereg',
  'patkány', 'cseresznye',
  'kémény', 'kötény', 'torony',
  'könyv', 'könyök', 'könyvtár',
  'csúnya', 'könnyű', 'savanyú', 'alacsony', 'keskeny', 'vékony',
  'nyit',
  'anya', 'anyuka', 'bárány',
  'szúnyog', 'fűnyíró', 'dinnye',
  'nyár', 'nyél', 'nyom', 'nyúl', 'nyírfa', 'nyakkendő',
  'banya', 'arány', 'kemény', 'könnyed', 'szenny',
  'nyalóka',

  // ----------------------------------------
  // Fázis 28 — zs
  // ----------------------------------------
  'zselé', 'rezsó', 'rozsda', 'vizsla',
  'varázs', 'rózsa', 'pajzs', 'garázs',
  'zsák', 'zsír', 'zsoké', 'zsemle', 'zsivaj', 'zsebkendő', 'zsivány',

  // ----------------------------------------
  // Fázis 29 — ty
  // ----------------------------------------
  'kutya', 'kesztyű', 'potya',
  'hattyú', 'tyúk', 'batyu',

  // ----------------------------------------
  // Fázis 30 — ly
  // ----------------------------------------
  'hely', 'súly', 'mély', 'folyó',
  'sirály', 'kastély', 'selyem',
  'boglya', 'fáklya', 'kályha',
  'bagoly', 'gólya', 'fogoly', 'tűzhely',
  'osztály', 'folyam', 'lyuk', 'gally',
  'folyópart',


  // ----------------------------------------
  // Fázis 36 — A, I, Í, O, Ó, M, S, T nagybetű
  // ----------------------------------------
  'Alma', 'Anna', 'Anikó', 'Attila',
  'Imi', 'Irma',
  'Ottó',
  'Misi', 'Soma',
  'Sára', 'Timi', 'Tamás',

  // ----------------------------------------
  // Fázis 37 — Z, P, H nagybetű
  // ----------------------------------------
  'Zita', 'Zoli',
  'Pali', 'Peti', 'Péter',
  'Hanna', 'Hédi',

  // ----------------------------------------
  // Fázis 38 — U, Ú, E, Á, K, L, N nagybetű
  // ----------------------------------------
  'Emma', 'Eszter',
  'Ákos', 'Árpád',
  'Kata', 'Lili', 'Nóra', 'László',

  // ----------------------------------------
  // Fázis 39 — Ö, Ő, É, V, B, C nagybetű
  // ----------------------------------------
  'Éva',
  'Vali', 'Viktor',
  'Béla', 'Bori', 'Balázs', 'Cili',

  // ----------------------------------------
  // Fázis 40 — Ü, Ű, F, G, J nagybetű
  // ----------------------------------------
  'Fanni', 'Ferenc',
  'Géza', 'Gábor',
  'Jani', 'Jenő', 'Judit',

  // ----------------------------------------
  // Fázis 41 — D, R, Sz, Ty, Cs nagybetű
  // ----------------------------------------
  'Dóra', 'Dani',
  'Réka', 'Rita',
  'Szabi', 'Szilvi',
  'Csabi', 'Csilla',

  // ----------------------------------------
  // Fázis 42 — Gy, Zs, Ny, Ly nagybetű
  // ----------------------------------------
  'Gyuri', 'Gyula',
  'Zsófi', 'Zsolt',

];
