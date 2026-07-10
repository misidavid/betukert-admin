# Szövegértés-bank javítás — fázison túli válaszok cseréje (2026-07-10)

77 elem rossz válaszai tartalmaztak a fázisnál később tanult betűket — a gyerek nem tudta
elolvasni őket. Minden csereszó szkripttel validálva: csak a fázisig tanult betűket használ.
A c25-nél a kötőjeles „pihe-puha" is javítva (a szótagoló megtörte volna).

| Id | Fázis | Mondat | Kérdés | Helyes | Csere (régi → új) |
|---|---|---|---|---|---|
| c33 | 3 | A tó sima. | Milyen a tó? | sima | „mély" → **„sós"**; „zavaros" → **„mai"** |
| c93 | 5 | Siet a mami. | Mit csinál a mami? | siet | „alszik" → **„vet"**; „ül" → **„etet"** |
| c94 | 6 | Síel a mami. | Mit csinál a mami? | síel | „úszik" → **„les"**; „fut" → **„etet"** |
| c95 | 6 | Lassít a tata. | Mit csinál a tata? | lassít | „gyorsít" → **„siet"**; „fut" → **„vet"** |
| c96 | 7 | Lassú a mami. | Milyen a mami? | lassú | „gyors" → **„sima"**; „fürge" → **„lila"** |
| c97 | 7 | Túl lassú a mami. | Milyen a mami? | túl lassú | „gyors" → **„sima"**; „fürge" → **„lila"** |
| c100 | 8 | Olvas a tata. | Mit csinál a tata? | olvas | „alszik" → **„tapsol"**; „fut" → **„mos"** |
| c101 | 8 | Illatos a leves. | Milyen a leves? | illatos | „büdös" → **„sós"**; „hideg" → **„sima"** |
| c34 | 8 | A mama mos. | Mit csinál a mama? | mos | „főz" → **„siet"**; „alszik" → **„olvas"** |
| c98 | 8 | Itt a palota. | Mi van itt? | a palota | „a kunyhó" → **„a villamos"**; „a sátor" → **„a tó"** |
| c99 | 8 | Púpos a lovas. | Milyen a lovas? | púpos | „egyenes" → **„lassú"**; „magas" → **„sima"** |
| c102 | 9 | Itt a cica. | Mi van itt? | a cica | „a kutya" → **„a sas"** |
| c103 | 9 | Pucol a mami. | Mit csinál a mami? | pucol | „alszik" → **„tapsol"** |
| c104 | 9 | Itt a piac. | Mi van itt? | a piac | „az iskola" → **„a posta"**; „a mozi" → **„a palota"** |
| c105 | 9 | Itt a pumpa. | Mi van itt? | a pumpa | „a kerék" → **„a pipa"**; „a bicikli" → **„a posta"** |
| c106 | 10 | Itt a kalap. | Mi van itt? | a kalap | „a táska" → **„a kuka"** |
| c107 | 10 | Kóstol a mami. | Mit csinál a mami? | kóstol | „főz" → **„etet"** |
| c73 | 10 | Pici a pók. | Milyen a pók? | pici | „nagy" → **„okos"**; „kövér" → **„lusta"** |
| c74 | 10 | A mókus lop. | Mit csinál a mókus? | lop | „alszik" → **„pakol"**; „ugrik" → **„mos"** |
| c109 | 11 | Kapál a tata. | Mit csinál a tata? | kapál | „fest" → **„itat"** |
| c75 | 11 | A tál teli. | Milyen a tál? | teli | „üres" → **„lapos"**; „kicsi" → **„sima"** |
| c76 | 11 | A mókus álmos. | Milyen a mókus? | álmos | „vidám" → **„lusta"**; „szomorú" → **„okos"** |
| c110 | 12 | Itt a fuvola. | Mi van itt? | a fuvola | „a dob" → **„a síp"** |
| c111 | 12 | Fest a mami. | Mit csinál a mami? | fest | „alszik" → **„vasal"** |
| c77 | 12 | Sima a fal. | Milyen a fal? | sima | „görbe" → **„festett"**; „magas" → **„lapos"** |
| c78 | 12 | Mama fut. | Mit csinál mama? | fut | „sétál" → **„olvas"**; „alszik" → **„fest"** |
| c112 | 13 | Puha a homok. | Milyen a homok? | puha | „kemény" → **„sima"**; „hideg" → **„sós"** |
| c113 | 13 | Hálás a mami. | Milyen a mami? | hálás | „mérges" → **„álmos"**; „szomorú" → **„lusta"** |
| c114 | 13 | Hullik a hó. | Mit csinál a hó? | hullik | „olvad" → **„áll"**; „ragyog" → **„lapul"** |
| c80 | 13 | Puha a hó. | Milyen a hó? | puha | „kemény" → **„sima"**; „sáros" → **„lila"** |
| c115 | 14 | Az autó lassú. | Milyen az autó? | lassú | „gyors" → **„vizes"**; „zajos" → **„lila"** |
| c116 | 14 | Fázik a mami. | Mit csinál a mami? | fázik | „melegszik" → **„vasal"**; „izzad" → **„olvas"** |
| c81 | 14 | A hal vizes. | Milyen a hal? | vizes | „száraz" → **„sós"**; „tiszta" → **„sima"** |
| c82 | 14 | Az alma sima. | Milyen az alma? | sima | „érdes" → **„zamatos"**; „repedezett" → **„lila"** |
| c118 | 15 | Itt a mező. | Mi van itt? | a mező | „az erdő" → **„a tó"**; „a kert" → **„az út"** |
| c83 | 15 | Mama főz. | Mit csinál mama? | főz | „alszik" → **„vasal"** |
| c84 | 15 | Az eső esik. | Mi esik? | az eső | „a levél" → **„az alma"** |
| c119 | 16 | Itt a híd. | Mi van itt? | a híd | „a folyó" → **„a ház"** |
| c120 | 16 | Zöld a dió. | Milyen a dió? | zöld | „barna" → **„fekete"**; „sárga" → **„lila"** |
| c85 | 16 | A dal vidám. | Milyen a dal? | vidám | „szomorú" → **„álmos"** |
| c86 | 16 | Mama dalol. | Mit csinál mama? | dalol | „alszik" → **„fest"** |
| c121 | 17 | Új az ajtó. | Milyen az ajtó? | új | „régi" → **„festett"**; „törött" → **„zöld"** |
| c122 | 17 | Itt a majom. | Mi van itt? | a majom | „a róka" → **„a teve"** |
| c87 | 17 | A leves jó. | Milyen a leves? | jó | „rossz" → **„sós"**; „savanyú" → **„illatos"** |
| c88 | 17 | A tej jó. | Milyen a tej? | jó | „rossz" → **„sós"**; „keserű" → **„vizes"** |
| c123 | 18 | Itt a fazék. | Mi van itt? | a fazék | „a lábas" → **„a kés"** |
| c124 | 18 | Sétál a pék. | Mit csinál a pék? | sétál | „ugrik" → **„dalol"** |
| c89 | 18 | A tej édes. | Milyen a tej? | édes | „keserű" → **„sós"**; „savanyú" → **„vizes"** |
| c90 | 18 | Édes a méz. | Milyen a méz? | édes | „keserű" → **„vizes"** |
| c125 | 19 | Nevet a néni. | Mit csinál a néni? | nevet | „sír" → **„int"**; „alszik" → **„dalol"** |
| c126 | 19 | Itt a póni. | Mi van itt? | a póni | „a szamár" → **„a tehén"** |
| c127 | 19 | Énekel a katona. | Mit csinál a katona? | énekel | „alszik" → **„nevet"** |
| c35 | 19 | A tál tele van. | Milyen a tál? | tele | „üres" → **„lapos"**; „kicsi" → **„festett"** |
| c129 | 20 | Hosszú az út. | Milyen az út? | hosszú | „rövid" → **„széles"**; „keskeny" → **„sima"** |
| c130 | 20 | Édes a szőlő. | Milyen a szőlő? | édes | „savanyú" → **„sós"**; „keserű" → **„zamatos"** |
| c37 | 20 | A kisfiú almát eszik. | Mit eszik a kisfiú? | almát | „kenyeret" → **„levest"**; „rétest" → **„diót"** |
| c131 | 21 | Meleg a leves. | Milyen a leves? | meleg | „forró" → **„sós"** |
| c132 | 21 | Zúg a gép. | Mit csinál a gép? | zúg | „robog" → **„dolgozik"** |
| c133 | 21 | Magas a fa. | Milyen a fa? | magas | „alacsony" → **„vastag"**; „vékony" → **„zöld"** |
| c42 | 22 | A dió a fán terem. | Hol terem a dió? | a fán | „a bokron" → **„a réten"** |
| c43 | 22 | A toll puha és fehér. | Milyen a toll? | puha és fehér | „kemény és sárga" → **„érdes és sárga"** |
| c44 | 22 | A madár énekel a fán. | Hol énekel a madár? | a fán | „a vízben" → **„a réten"**; „a bokron" → **„a tetőn"** |
| c51 | 22 | A ló fut a réten. | Hol fut a ló? | a réten | „az erdőben" → **„a parton"** |
| c53 | 22 | A szilva érik a fán. | Hol érik a szilva? | a fán | „a bokron" → **„a réten"** |
| c7 | 22 | A dió finom és kerek. | Milyen a dió? | finom és kerek | „savanyú" → **„sós"**; „nagy és piros" → **„érdes és zöld"** |
| c11 | 23 | Süt a nap az égen. | Hol süt a nap? | az égen | „a vízben" → **„a földön"**; „a fűben" → **„a réten"** |
| c134 | 23 | Szürke az egér. | Milyen az egér? | szürke | „barna" → **„fekete"** |
| c41 | 23 | A cica a padon ül. | Hol ül a cica? | a padon | „az ágyon" → **„a széken"** |
| c14 | 24 | A kisfiú labdával játszik a kertben. | Mivel játszik a kisfiú? | labdával | „csónakkal" → **„kockával"** |
| c3 | 24 | A kisfiú fut a parkban. | Ki fut a parkban? | a kisfiú | „a kutya" → **„a néni"** |
| c48 | 24 | A barack édes és lédús. | Milyen a barack? | édes és lédús | „savanyú és kemény" → **„sós és éretlen"** |
| c55 | 24 | A kakas büszke és hangos. | Milyen a kakas? | büszke és hangos | „csendes és szomorú" → **„álmos és lusta"** |
| c39 | 25 | A ház nagy és piros. | Milyen a ház? | nagy és piros | „kicsi és fehér" → **„pici és fehér"**; „sárga és alacsony" → **„sárga és szürke"** |
| c56 | 25 | A fagyi édes és hideg. | Milyen a fagyi? | édes és hideg | „meleg és savanyú" → **„meleg és sós"**; „forró és kemény" → **„forró és keserű"** |
| c70 | 25 | A régi híd nagyon hosszú. | Milyen a régi híd? | nagyon hosszú | „kicsi és alacsony" → **„nagyon rövid"** |
| c25 | 26 | A kiscsirke puha és sárga. | Milyen a kiscsirke? | puha és sárga | „kemény és fehér" → **„érdes és fehér"** *(mondat és helyes válasz is javítva: „pihe-puha" → „puha")* |
| c67 | 29 | A fehér hattyú úszik a tavon. | Hol úszik a fehér hattyú? | a tavon | „a folyón" → **„a patakban"** |
