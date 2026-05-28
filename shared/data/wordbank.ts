// ============================================
// BETŰKERT SZÓBANK
// Meixner-elvek szerint válogatva:
// - csak tőszavak (nem ragozott alakok)
// - gyerekek életteréből ismert fogalmak
// - fokozatosan nehezedő
// - szint szerint rendezve
// ============================================

export const WORD_BANK: string[] = [

  // ----------------------------------------
  // FÁZIS 1–5 — a, i, ó, e  (a=1, i=1, ó=2, e=5)
  // Csak magánhangzók — rövid, egyszerű szavak
  // ----------------------------------------
  'ó', 'á', 'é', 'í',

  // ----------------------------------------
  // FÁZIS 3 — m, s, t bevezetése
  // ----------------------------------------
  'ma', 'mi', 'te', 'se',
  'mos', 'mit', 'most', 'más',
  'ám', 'tó', 'só', 'tű',
  'ima', 'esti',
  'mama', 'mami', 'tata',
  'sima',
  'atom', 'ásít',

  // ----------------------------------------
  // FÁZIS 4 — v bevezetése
  // ----------------------------------------
  'vaj', 'vár', 'vér', 'víz',
  'vas', 'van', 'vég',
  'teve', 'vese', 'vita',
  'avat', 'övez',
  'savó', 'evés',

  // ----------------------------------------
  // FÁZIS 6 — l bevezetése  ✓
  // ----------------------------------------
  'lám', 'lép', 'lót',
  'alma', 'alig', 'alap',
  'lila', 'leves', 'lámpa',
  'talál',
  'levél', 'völgy',
  'álom', 'étel',
  'villa', 'villám',

  // ----------------------------------------
  // FÁZIS 8 — p bevezetése
  // ----------------------------------------
  'pap', 'pék', 'pók',
  'kap', 'kép', 'köp',
  'pápa', 'pipa', 'púpos',
  'tapló', 'kapál',
  'papír', 'palota',
  'tepsi', 'lepke',
  'lop', 'lap',

  // ----------------------------------------
  // FÁZIS 10 — k bevezetése
  // ----------------------------------------
  'kos', 'kút', 'kéz',
  'kel', 'köt',
  'kuka', 'kefe', 'képes',
  'kakas', 'kalap', 'kacsa',
  'sikál', 'lakás',
  'mesék', 'falak',
  'kavics', 'kaktusz',

  // ----------------------------------------
  // FÁZIS 12 — f bevezetése
  // ----------------------------------------
  'fa', 'fű', 'fej',
  'fal', 'fut', 'fél',
  'fakó', 'falat', 'fecske',
  'féltve', 'fésű',
  'fülke', 'füstös',
  'kaftan', 'kupac',

  // ----------------------------------------
  // FÁZIS 13 — h bevezetése
  // ----------------------------------------
  'ház', 'hús', 'hét',
  'hal', 'haj', 'hív',
  'havas', 'halak', 'határ',
  'hullik', 'hasít',
  'pohár', 'tehén',
  'méh', 'hőség',
  'hiéna', 'hattyú',

  // ----------------------------------------
  // FÁZIS 11 — á bevezetése  ✓
  // ----------------------------------------
  'ár', 'ág', 'áll',
  'ásó', 'átok', 'áram',
  'madár', 'vásár',
  'barát', 'kakás',
  'málna', 'párna',
  'sárga', 'zárka',

  // ----------------------------------------
  // FÁZIS 14 — z bevezetése
  // ----------------------------------------
  'zár', 'zúg', 'zöld',
  'zene', 'zajog', 'zokni',
  'hazai', 'kazal',
  'varázs', 'fizet',
  'fazék', 'lazac',
  'rózsa', 'kézzel',

  // ----------------------------------------
  // FÁZIS 9 — c bevezetése
  // Korai c-szavak (phase 9-12, az első ismert betűkkel):
  'cím', 'cumi',     // phase 9: c,í,m és c,u,m,i
  'kócos',           // phase 10: k,ó,c,o,s
  'foci',            // phase 12: f,o,c,i
  // Magasabb fázisú c-szavak:
  'cél', 'cég',
  'cica', 'cipő', 'citrom',
  'cukor', 'ceruza',
  'pocak', 'kacaj',
  'lucska', 'pacal',
  'ficam', 'vacak',

  // ----------------------------------------
  // FÁZIS 16 — d bevezetése
  // ----------------------------------------
  'dob', 'dal', 'dél',
  'dió', 'duda', 'domb',
  'darab', 'doboz', 'dolog',
  'fodor', 'medál',
  'vidám', 'fedél',
  'radar',

  // ----------------------------------------
  // FÁZIS 15–16 — ő, ö bevezetése  (ő=15, ö=16 implicit)
  // ----------------------------------------
  'ős', 'öt', 'ők',
  'öböl', 'öreg', 'ördög',
  'főzés', 'dőlés',
  'tölgy',
  'körte', 'körtefa',
  'erős', 'szőlő',

  // ----------------------------------------
  // FÁZIS 19 — n bevezetése
  // ----------------------------------------
  'nap', 'nő', 'nem',
  'néni', 'anya', 'neve',
  'napos', 'nevet', 'néma',
  'fonál', 'kanál',
  'ének', 'lenéz',
  'menő', 'honos',
  'anyuka', 'nagyi',

  // ----------------------------------------
  // FÁZIS 20 — sz bevezetése
  // ----------------------------------------
  'szó', 'szín', 'szép',
  'szer', 'szív', 'szél',
  'szeret', 'szalag', 'szeder',
  'asztal', 'osztály',
  'moszkva', 'reszket',
  'észak', 'szüret',
  'szilva',

  // ----------------------------------------
  // FÁZIS 22 — r bevezetése
  // ----------------------------------------
  'rák', 'rét', 'rés',
  'rak', 'repül', 'remeg',
  'rajzol',
  'karám', 'marha',
  'derék',
  'rovar', 'horror',

  // ----------------------------------------
  // FÁZIS 17 — j bevezetése
  // ----------------------------------------
  'jó', 'jár', 'játék',
  'jég', 'jobb', 'juhar',
  'bajusz', 'pajzs',
  'sejt',
  'fijaim', 'folyam',
  'hajnal', 'majom',

  // ----------------------------------------
  // FÁZIS 24 — b bevezetése
  // ----------------------------------------
  'bab', 'bál', 'bőr',
  'baba', 'bábu', 'bárány',
  'bagoly', 'barack',
  'boldog',
  'csokor', 'labda',
  'kabát', 'szabad',
  'ebéd', 'ablak',

  // ----------------------------------------
  // FÁZIS 21 — g bevezetése  ✓
  // ----------------------------------------
  'gép', 'gőz', 'gáz',
  'gomba', 'garázs', 'gazda',
  'bogár', 'egér', 'fagylalt',
  'gólya', 'gömb',
  'rugó', 'agár',
  'fogoly', 'fogás',

  // ----------------------------------------
  // FÁZIS 18 — é bevezetése  (ú=7 és í=1 már korábban bevezetve)
  // ----------------------------------------
  'édes', 'érez', 'épít',
  'úszik', 'újság', 'útlevél',
  'íjász', 'írás', 'ítél',
  'kérdez',
  'szúnyog', 'túrós',
  'díszít', 'kísér',

  // ----------------------------------------
  // FÁZIS 23 — ü, ű bevezetése  ✓
  // ----------------------------------------
  'üveg', 'ünnepe', 'ügyes',
  'fűszer', 'tűzhely',
  'ünnep', 'ütemes',
  'körül', 'tükör',
  'füzet', 'fűnyíró',
  'szűrő', 'szükség',

  // ----------------------------------------
  // FÁZIS 25 — gy bevezetése
  // ----------------------------------------
  'gyár', 'gyep', 'gyík',
  'gyors', 'gyöngy', 'gyümölcs',
  'agyag', 'egyed',
  'Magyar',
  'hagyma', 'nagyon',
  'meggyfa', 'dinnye',

  // ----------------------------------------
  // FÁZIS 26 — cs bevezetése
  // ----------------------------------------
  'cső', 'csók', 'csúcs',
  'csiga', 'csizma', 'csillag',
  'csapat', 'csavar',
  'macska',
  'kulcs',
  'csempe', 'csöpög',

  // ----------------------------------------
  // FÁZIS 27 — ny bevezetése
  // ----------------------------------------
  'nyár', 'nyél', 'nyom',
  'nyúl', 'nyírfa', 'nyakkendő',
  'banya',
  'arány', 'kemény',
  'lányok', 'könnyed',
  'szenny',

  // ----------------------------------------
  // FÁZIS 28–30 — zs, ty, ly bevezetése  (zs=28, ty=29, ly=30)
  // ----------------------------------------
  'zsák', 'zsír', 'zsoké',
  'zsemle', 'zsivaj',
  'lyuk', 'gally',
  'tyúk', 'batyu',
  'zsebkendő', 'zsivány',
];
