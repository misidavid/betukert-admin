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
  // FÁZIS 1-3 — a, i, ó, e
  // Csak magánhangzók — rövid, egyszerű szavak
  // ----------------------------------------
  'ó', 'á', 'é', 'í',

  // ----------------------------------------
  // FÁZIS 4 — m, t, s bevezetése
  // ----------------------------------------
  'ma', 'mi', 'te', 'se',
  'mos', 'mit', 'most', 'más',
  'ám', 'tó', 'só', 'tű',
  'ima', 'esti',
  'mama', 'mami', 'tata',
  'sima', 'sima',
  'atom', 'ásít',

  // ----------------------------------------
  // FÁZIS 5 — v bevezetése
  // ----------------------------------------
  'vaj', 'vár', 'vér', 'víz',
  'vas', 'van', 'vég',
  'teve', 'vese', 'vita',
  'avat', 'övez',
  'savó', 'evés',

  // ----------------------------------------
  // FÁZIS 6 — l bevezetése
  // ----------------------------------------
  'lám', 'lép', 'lót',
  'alma', 'alig', 'alap',
  'lila', 'leves', 'lámpa',
  'talál', 'taval',
  'levél', 'völgy',
  'álom', 'étel',
  'villa', 'villám',

  // ----------------------------------------
  // FÁZIS 7 — p bevezetése
  // ----------------------------------------
  'pap', 'pék', 'pók',
  'kap', 'kép', 'köp',
  'pápa', 'pipa', 'púpos',
  'tapló', 'kapál',
  'papír', 'palota',
  'tepsi', 'lepke',
  'lép', 'lop', 'lap',

  // ----------------------------------------
  // FÁZIS 8 — k bevezetése
  // ----------------------------------------
  'kos', 'kút', 'kéz',
  'kap', 'kel', 'köt',
  'kuka', 'kefe', 'képes',
  'kakas', 'kalap', 'kacsa',
  'sikál', 'lakás',
  'mesék', 'falak',
  'kavics', 'kaktusz',

  // ----------------------------------------
  // FÁZIS 9 — f bevezetése
  // ----------------------------------------
  'fa', 'fű', 'fej',
  'fal', 'fut', 'fél',
  'fakó', 'falat', 'fecske',
  'féltve', 'fésű',
  'fülke', 'füstös',
  'kefe', 'kaffe',
  'kaftan', 'kupac',

  // ----------------------------------------
  // FÁZIS 10 — h bevezetése
  // ----------------------------------------
  'ház', 'hús', 'hét',
  'hal', 'haj', 'hív',
  'havas', 'halak', 'határ',
  'hullik', 'hasít',
  'pohár', 'tehén',
  'méh', 'hőség',
  'hiéna', 'hattyú',

  // ----------------------------------------
  // FÁZIS 11 — á bevezetése
  // ----------------------------------------
  'ár', 'ág', 'áll',
  'ásó', 'átok', 'áram',
  'madár', 'határ', 'vásár',
  'barát', 'kakás',
  'málna', 'párna',
  'sárga', 'zárka',

  // ----------------------------------------
  // FÁZIS 12 — z bevezetése
  // ----------------------------------------
  'zár', 'zúg', 'zöld',
  'zene', 'zajog', 'zokni',
  'hazai', 'kazal',
  'varázs', 'fizet',
  'fazék', 'lazac',
  'rózsa', 'kézzel',

  // ----------------------------------------
  // FÁZIS 13 — c bevezetése
  // ----------------------------------------
  'cél', 'cím', 'cég',
  'cica', 'cipő', 'citrom',
  'cukor', 'ceruza',
  'pocak', 'kacaj',
  'lucska', 'pacal',
  'ficam', 'vacak',

  // ----------------------------------------
  // FÁZIS 14 — d bevezetése
  // ----------------------------------------
  'dob', 'dal', 'dél',
  'dió', 'duda', 'domb',
  'darab', 'doboz', 'dolog',
  'fodor', 'medal',
  'vidám', 'fedél',
  'madár', 'radar',

  // ----------------------------------------
  // FÁZIS 15 — ö, ő bevezetése
  // ----------------------------------------
  'ős', 'öt', 'ők',
  'öböl', 'öreg', 'ördög',
  'főzés', 'dőlés',
  'tölgy', 'völgy',
  'körte', 'körtefa',
  'erős', 'szőlő',

  // ----------------------------------------
  // FÁZIS 16 — n bevezetése
  // ----------------------------------------
  'nap', 'nő', 'nem',
  'néni', 'anya', 'neve',
  'napos', 'nevet', 'néma',
  'fonál', 'kanál',
  'ének', 'lenéz',
  'menő', 'honos',
  'anyuka', 'nagyi',

  // ----------------------------------------
  // FÁZIS 17 — sz bevezetése
  // ----------------------------------------
  'szó', 'szín', 'szép',
  'szer', 'szív', 'szél',
  'szeret', 'szalag', 'szeder',
  'asztal', 'osztály',
  'moszkva', 'reszket',
  'észak', 'szüret',
  'szilva', 'szőlő',

  // ----------------------------------------
  // FÁZIS 18 — r bevezetése
  // ----------------------------------------
  'rák', 'rét', 'rés',
  'rak', 'repül', 'remeg',
  'rózsa', 'radar', 'rajzol',
  'barát', 'varázs',
  'karám', 'marha',
  'erős', 'derék',
  'rovar', 'horror',

  // ----------------------------------------
  // FÁZIS 19 — j bevezetése
  // ----------------------------------------
  'jó', 'jár', 'játék',
  'jég', 'jobb', 'juhar',
  'bajusz', 'pajzs',
  'rajzol', 'sejt',
  'fijaim', 'folyam',
  'hajnal', 'majom',

  // ----------------------------------------
  // FÁZIS 20 — b bevezetése
  // ----------------------------------------
  'bab', 'bál', 'bőr',
  'baba', 'bábu', 'bárány',
  'bagoly', 'barack',
  'barát', 'boldog',
  'csokor', 'labda',
  'kabát', 'szabad',
  'ebéd', 'ablak',

  // ----------------------------------------
  // FÁZIS 21 — g bevezetése
  // ----------------------------------------
  'gép', 'gőz', 'gáz',
  'gomba', 'garázs', 'gazda',
  'bogár', 'egér', 'fagylalt',
  'gólya', 'gömb',
  'rugó', 'agár',
  'fogoly', 'fogás',

  // ----------------------------------------
  // FÁZIS 22 — é, ú, í bevezetése
  // ----------------------------------------
  'édes', 'érez', 'épít',
  'úszik', 'újság', 'útlevél',
  'íjász', 'írás', 'ítél',
  'kérdez', 'féltve',
  'szúnyog', 'túrós',
  'díszít', 'kísér',

  // ----------------------------------------
  // FÁZIS 23 — ü, ű bevezetése
  // ----------------------------------------
  'üveg', 'ünnepe', 'ügyes',
  'fűszer', 'tűzhely',
  'ünnep', 'ütemes',
  'körül', 'tükör',
  'füzet', 'fűnyíró',
  'szűrő', 'szükség',

  // ----------------------------------------
  // FÁZIS 24 — gy bevezetése
  // ----------------------------------------
  'gyár', 'gyep', 'gyík',
  'gyors', 'gyöngy', 'gyümölcs',
  'agyag', 'egyed',
  'Magyar', 'fagylalt',
  'hagyma', 'nagyon',
  'meggyfa', 'dinnye',

  // ----------------------------------------
  // FÁZIS 25 — cs bevezetése
  // ----------------------------------------
  'cső', 'csók', 'csúcs',
  'csiga', 'csizma', 'csillag',
  'csapat', 'csavar',
  'macska', 'kacsa',
  'kulcs', 'balcs',
  'csempe', 'csöpög',

  // ----------------------------------------
  // FÁZIS 26 — ny bevezetése
  // ----------------------------------------
  'nyár', 'nyél', 'nyom',
  'nyúl', 'nyírfa', 'nyakkendő',
  'anya', 'banya',
  'arány', 'kemény',
  'lányok', 'könnyed',
  'dinnye', 'szenny',

  // ----------------------------------------
  // FÁZIS 27+ — zs, ly, ty bevezetése
  // ----------------------------------------
  'zsák', 'zsír', 'zsoké',
  'zsemle', 'zsivaj',
  'lyuk', 'gally',
  'tyúk', 'batyu',
  'zsebkendő', 'zsivány',
];
