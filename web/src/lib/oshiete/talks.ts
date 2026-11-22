// おしえて英語の中身(質問・解説・判定の要点)。
// もとは C:\まなビレッジ\ウェブ部\おしえて英語課\企画チーム\app\oshiete.html(おしえて英語課\企画チーム\docs\基本英文法_設計.md と同じ)から、そのまま移したもの。
// key:解決の要点(AIの判定に使う)。kw:AIが使えないときの簡易判定。f:追い質問。mistake:わざと間違い

export type Who = "haru" | "riko" | "takumi";
export type Phase = { num: number; name: string; map: string; mapTitle: string };
export type Mistake = { t: string; fix: string; kw: string[] };
export type Talk = { ph: number; who: Who; topic: string; video: string; q: string[]; key: string[]; kw: string[]; f: [string, string]; hint: string; mistake?: Mistake };

export const PEOPLE: Record<Who, { name: string; profile: string; av: string; color: string; honorific: string }> = {
  "haru": {
    "name": "ハル",
    "profile": "中学2年",
    "av": "boy",
    "color": "#FFD3B0",
    "honorific": "くん"
  },
  "riko": {
    "name": "リコ",
    "profile": "高校1年",
    "av": "girl",
    "color": "#CFE3FF",
    "honorific": "さん"
  },
  "takumi": {
    "name": "タクミ",
    "profile": "社会人・学び直し",
    "av": "man",
    "color": "#D3EEDA",
    "honorific": "さん"
  }
};

export const PHASES: Phase[] = [
  {
    "num": 1,
    "name": "フェーズ1 文の形",
    "map": "S＝「〜が・〜は」（主語）　V＝動詞\nO＝主語とは別のもの（「〜を」「〜に」になることが多い）\nC＝主語や O とイコールになる言葉（様子・名前・職業など）\n場所・時・様子を足す言葉（to school, fast など）は、文の形には数えない（付け足し）\n\n1. S V：He runs.（彼は走る）\n2. S V O：I like music.（私は音楽が好き）\n3. S V C：He is happy.（彼＝幸せ）\n4. S V O O：He gave me a book.（彼は私に本をくれた）\n5. S V O C：The news made me happy.（私＝幸せ）",
    "mapTitle": "5文型の地図"
  },
  {
    "num": 2,
    "name": "フェーズ2 自動詞と他動詞",
    "map": "・他動詞＝後ろに名詞を直接置ける\n　discuss the plan／marry her／enter the room／reach Tokyo\n・自動詞＝後ろに名詞を直接置けない。前置詞でつなぐ\n　listen to music／wait for you／arrive at the station／talk to her\n・両方に使える動詞もある：open, close, start\n　The door opened.／I opened the door.\n・日本語の「〜に」「〜と」「〜について」につられない。前置詞が要るかどうかは、英語の動詞で決まる",
    "mapTitle": "自動詞と他動詞の地図"
  },
  {
    "num": 3,
    "name": "フェーズ3 群動詞",
    "map": "・動詞＋小さな言葉（up, off, for, into など）で、別の1語になる＝群動詞。部品の意味から組み立てない\n　look for（探す）／run into（偶然会う）／give up（あきらめる）／put off（延期する）\n・1語では後ろに名詞を置けない動詞も、合体すると置けるようになる\n　× look my key → look for my key\n・群動詞にも、後ろに名詞を置けるものと置けないものがある\n　置ける：look for my key／run into my friend／put off the meeting\n　置けない：grow up（育つ）／get up（起きる）／show up（現れる）→ grew up in Tokyo\n・listen to music は「listen＋付け足しの to music」と見ても、「listen to＋music」と見てもよい（好み）\n・it・them などの位置\n　up・off・on（副詞）は間にはさむ：pick it up／put it off\n　for・at・to・into（前置詞）は名詞のすぐ前：look for it／listen to it\n・種類がとても多いので、使いたいときに辞書で調べて、例文ごと、そのつど自分のものにする",
    "mapTitle": "群動詞の地図"
  },
  {
    "num": 4,
    "name": "フェーズ4 助動詞",
    "map": "・助動詞＝動詞の前に置く言葉\n　do（does）／can（できる）／will（〜するつもり・〜してくれる？）／shall（Shall we…?＝〜しようか？）／should（〜したほうがいい）／may（〜してもいい・〜かもしれない）／must（〜しなければならない・〜に違いない）\n・作り方は、みんな同じ\n　疑問文は、助動詞を前に出す：Can you swim?／Do you swim?\n　否定文は、助動詞に not を付ける：I can't swim.／I don't swim.\n　後ろの動詞は元の形：He can swim.／Does he swim?\n　助動詞は、動詞の前に1つだけ：× I don't can swim. → I can't swim.\n・do は、ふつうの文では隠れている：I (do) like music.\n　否定文・疑問文で顔を出す：I don't like music.／Do you like music?\n・主語が he・she・it のときは does。likes の s は、隠れている does の印\n　does が顔を出すと、s は does へ移り、動詞は元の形\n　He likes music. → Does he like music?／He doesn't like music.\n・強めたいときも、do が姿を見せる：I do like music.（本当に好き）",
    "mapTitle": "助動詞の地図"
  }
];

export const TALKS: Talk[] = [
  {
    "ph": 1,
    "who": "haru",
    "topic": "I music like.",
    "video": "SVO",
    "q": [
      "先生、質問いいですか？",
      "「私は音楽が好き」を英語にしたくて、I music like. って書いたら×でした。日本語と同じ順番じゃダメなんですか？"
    ],
    "key": [
      "英語は「主語→動詞→何を」の順",
      "動詞は2番目（日本語のように最後ではない）"
    ],
    "kw": [
      "主語→動詞",
      "動詞が2番目",
      "動詞は2番目",
      "動詞を2番目",
      "二番目",
      "動詞の後",
      "動詞のあと",
      "i like music",
      "動詞が先",
      "動詞を先",
      "前に来る",
      "前にくる",
      "like が先",
      "likeが先",
      "like を先",
      "likeを先",
      "like を前",
      "likeを前"
    ],
    "f": [
      "じゃあ「私はテニスをする」は、どの順番ですか？",
      "「音楽が好き」なのに、music が動詞の後ろでいいんですか？"
    ],
    "hint": "英語は「だれが → どうする → 何を」の順番です。日本語は動詞が最後ですが、英語は動詞が2番目に来ます。\nI like music.（S V O）\n\n日本語では「音楽が好き」と言いますが、英語では like のすぐ後ろが「何を（O）」の場所です。"
  },
  {
    "ph": 1,
    "who": "riko",
    "topic": "She stayed calm.",
    "video": "SVC",
    "q": [
      "She stayed calm. って、「彼女は落ち着いて泊まった」ってことですか？ stay って「泊まる」ですよね？"
    ],
    "key": [
      "stay＋様子は「〜のままでいる」（be動詞と同じイコールの仲間）",
      "「彼女＝落ち着いている」状態が続いた、という意味"
    ],
    "kw": [
      "のまま",
      "ままだった",
      "ままでいる",
      "イコール",
      "状態が続",
      "落ち着いている",
      "冷静"
    ],
    "f": [
      "じゃあ I stayed at a hotel. の stay は、どういう意味ですか？",
      "The door remained open. は、どういう意味ですか？"
    ],
    "hint": "stay と remain は、be動詞と同じ「＝」の仲間です。後ろに様子（C）が来ると、「〜のままでいる」という意味になります。\nShe stayed calm.＝彼女は落ち着いたままだった（彼女＝落ち着いている）\nThe door remained open.＝ドアは開いたままだった（ドア＝開いている）\n\nbe動詞はその時の状態、stay・remain は「その状態が続く」という意味です。どれも S V C の形です。\n\n後ろに様子ではなく場所が来ると、stay は「泊まる」です。\nI stayed at a hotel.（ホテルに泊まった）"
  },
  {
    "ph": 1,
    "who": "takumi",
    "topic": "I go to school.",
    "video": "SV",
    "q": [
      "I go to school. の to って何ですか？ I go school. じゃダメなんですか？"
    ],
    "key": [
      "go は後ろに名詞を直接置けない",
      "だから to でつなぐ（to school は「学校へ」という付け足し）"
    ],
    "kw": [
      "直接",
      "つなぐ",
      "つなげ",
      "つない",
      "前置詞",
      "自動詞",
      "付け足し",
      "置けない",
      "学校へ"
    ],
    "f": [
      "じゃあ listen music もダメなんですか？",
      "じゃあ I like school. は、to が要らないんですか？"
    ],
    "hint": "go は、後ろに「〜を」の名詞を直接置けない動詞です。\n「どこへ」を足したいときは to でつなぎます。to school は「学校へ」という付け足しなので、文の形には数えません。\nI go (to school).＝S V\n\nlive（住む）や listen（聞く）も同じで、live in Tokyo、listen to music と言います。動詞によって、後ろに名詞を直接置けるかどうかが決まっています。",
    "mistake": {
      "t": "わかった！じゃあ「私は東京に住んでいる」は I live Tokyo. ですね！",
      "fix": "I live in Tokyo.（live も後ろに名詞を直接置けないので in でつなぐ）",
      "kw": [
        "live in",
        "in tokyo",
        "in が要る",
        "inが要る",
        "in がいる",
        "inがいる",
        "in が必要",
        "inが必要",
        "in を付け",
        "inを付け",
        "in をつけ",
        "inをつけ",
        "in でつな",
        "inでつな",
        "前置詞"
      ]
    }
  },
  {
    "ph": 1,
    "who": "haru",
    "topic": "He bought me a present.",
    "video": "SVOO",
    "q": [
      "He bought me a present. って、彼が私を買ったんですか！？"
    ],
    "key": [
      "名詞が2つ並ぶと「人に・物を」",
      "「彼が私にプレゼントを買ってくれた」という意味"
    ],
    "kw": [
      "人に",
      "私に",
      "2つ",
      "二つ",
      "物を",
      "くれた"
    ],
    "f": [
      "じゃあ She gave me a pen. は、どういう意味ですか？",
      "どっちが「〜に」で、どっちが「〜を」か、どう見分けるんですか？"
    ],
    "hint": "give・buy・send・show・teach などは、後ろに名詞を2つ並べられます。順番は「人に → 物を」の順です。\nHe bought me a present.＝彼は私にプレゼントを買ってくれた（S V O O）",
    "mistake": {
      "t": "わかった！じゃあ「先生は私たちに英語を教える」は The teacher teaches English us. ですね！",
      "fix": "The teacher teaches us English.（人→物の順）",
      "kw": [
        "teaches us english",
        "us english"
      ]
    }
  },
  {
    "ph": 1,
    "who": "riko",
    "topic": "The news made me happy.",
    "video": "SVOC",
    "q": [
      "The news made me happy. って、ニュースが私を作ったんですか？"
    ],
    "key": [
      "「ニュースが私を幸せにした」という意味",
      "me と happy がイコール（私＝幸せ）"
    ],
    "kw": [
      "幸せに",
      "イコール",
      "＝",
      "="
    ],
    "f": [
      "「作った」じゃないなら、make はいつ「作る」なんですか？",
      "me と happy は、どういう関係なんですか？"
    ],
    "hint": "make・call・name・keep などは、「O を C にする（と呼ぶ）」という形になります。後ろの2つはイコールの関係です。\nThe news made me happy.＝ニュースが私を幸せにした（私＝幸せ）。S V O C の形です。\n\n後ろに名詞が1つだけなら、make は「作る」です（make a cake）。",
    "mistake": {
      "t": "わかった！じゃあ「その歌は私を悲しくさせた」は The song made sad me. ですね！",
      "fix": "The song made me sad.（O→C の順。me＝sad）",
      "kw": [
        "made me sad",
        "me sad"
      ]
    }
  },
  {
    "ph": 1,
    "who": "takumi",
    "topic": "She is in the room.",
    "video": "SVC",
    "q": [
      "be動詞は「＝」って習ったんですけど、She is in the room. って、彼女＝部屋ってことですか？"
    ],
    "key": [
      "後ろが場所なら、be動詞は「いる・ある」",
      "in the room は付け足しで、彼女＝部屋ではない"
    ],
    "kw": [
      "にいる",
      "にある",
      "場所",
      "付け足し",
      "存在"
    ],
    "f": [
      "じゃあ My bag is on the desk. は、どういう意味ですか？",
      "She is a teacher. のときは、イコールなんですか？"
    ],
    "hint": "be動詞は、後ろに来るもので意味が変わります。\n・be＋様子や職業（happy, a teacher）＝「〜だ」\n　She is happy.（彼女＝幸せ、S V C）\n・be＋場所（in the room）＝「〜にいる・ある」\n　She is in the room.（彼女は部屋にいる、S V）\n　in the room は付け足しなので、彼女＝部屋ではありません。\n\nこのときも be動詞は省けません。be動詞そのものが「いる・ある」の意味を持っています。\nI am in Tokyo.（私は東京にいる）",
    "mistake": {
      "t": "わかった！じゃあ「私は東京にいます」は I in Tokyo. ですね！ イコールじゃないなら、be動詞は要らないんですよね？",
      "fix": "I am in Tokyo.（be動詞は省けない。be動詞そのものが「いる・ある」の意味を持っている）",
      "kw": [
        "i am in tokyo",
        "i'm in tokyo",
        "省けない",
        "省略できない",
        "am が要る",
        "amが要る",
        "am が必要",
        "amが必要",
        "be動詞が要る",
        "be動詞は要る",
        "be動詞が必要",
        "be動詞は必要",
        "be動詞がいる",
        "be動詞はいる"
      ]
    }
  },
  {
    "ph": 1,
    "who": "haru",
    "topic": "I gave a book him.",
    "video": "SVOO",
    "q": [
      "「彼に本をあげた」を I gave a book him. って書いたら×でした。なんでですか？"
    ],
    "key": [
      "並べる順番は「人→物」",
      "物を先にするなら、人の前に to を付ける"
    ],
    "kw": [
      "人→物",
      "人→もの",
      "人が先",
      "人を先",
      "人が前",
      "人を前",
      "人に・物を",
      "人に物を",
      "gave him a book",
      "to him",
      "him を先",
      "himを先",
      "him が先",
      "himが先"
    ],
    "f": [
      "じゃあ I gave him a book. ならOKですか？",
      "物を先に言いたいときは、どうすればいいんですか？"
    ],
    "hint": "give の後ろに2つ並べるときは、「人に → 物を」の順です。\nI gave him a book.\n\n物を先に言いたいときは、人の前に to を付けます。\nI gave a book to him.（このとき to him は付け足し）",
    "mistake": {
      "t": "わかった！じゃあ「友達に手紙を送った」は I sent a letter my friend. ですね！",
      "fix": "I sent my friend a letter. または I sent a letter to my friend.",
      "kw": [
        "sent my friend a letter",
        "to my friend"
      ]
    }
  },
  {
    "ph": 1,
    "who": "riko",
    "topic": "He runs fast.",
    "video": "SV",
    "q": [
      "He runs fast. の fast って、「〜を」なんですか？ 動詞の後ろにあるから…"
    ],
    "key": [
      "fast は「〜を」ではなく、動きの様子を足す言葉",
      "文の形は「彼は走る」（S V）"
    ],
    "kw": [
      "様子",
      "速く",
      "付け足し",
      "副詞",
      "どのように"
    ],
    "f": [
      "じゃあ She sings well. の well も同じですか？",
      "「〜を」かどうかは、どうやって見分けるんですか？"
    ],
    "hint": "動詞の後ろに来る言葉が、全部「〜を（O）」とは限りません。\nfast は「速く」という、動きの様子を足す言葉（付け足し）です。He runs fast. は、S V（彼は走る）に「速く」を足しただけです。\n\n見分け方は、「〜を」と訳せるかどうか。「速くを走る」は変なので、O ではありません。"
  },
  {
    "ph": 1,
    "who": "takumi",
    "topic": "We call him Ken.",
    "video": "SVOC",
    "q": [
      "We call him Ken. って、「彼をケンに呼ぶ」？ 日本語にするとよくわからないです…"
    ],
    "key": [
      "「私たちは彼をケンと呼ぶ」という意味",
      "him と Ken はイコール"
    ],
    "kw": [
      "と呼ぶ",
      "イコール",
      "彼＝ケン",
      "彼=ケン",
      "him＝ken",
      "him=ken",
      "呼び名"
    ],
    "f": [
      "じゃあ They named the dog Pochi. は、どういう意味ですか？",
      "him と Ken の順番を逆にしたらダメですか？"
    ],
    "hint": "call A B は「A を B と呼ぶ」という意味です。him と Ken はイコールです（彼＝ケン）。S V O C の形です。\nname A B（A を B と名づける）も同じ形です。順番は「呼ばれる人 → 呼び名」です。",
    "mistake": {
      "t": "わかった！じゃあ「みんなは私をハルと呼ぶ」は Everyone calls Haru me. ですね！",
      "fix": "Everyone calls me Haru.（呼ばれる人→呼び名の順）",
      "kw": [
        "calls me haru",
        "me haru"
      ]
    }
  },
  {
    "ph": 1,
    "who": "haru",
    "topic": "made me a cake / made me happy",
    "video": "SVOC",
    "q": [
      "She made me a cake. と She made me happy. って、同じ made me なのに、意味がぜんぜん違うんですか？"
    ],
    "key": [
      "後ろの2つがイコールかどうかで見分ける",
      "made me a cake は「私にケーキを作ってくれた」という意味で、made me happy は「私を幸せにした」"
    ],
    "kw": [
      "イコール",
      "≠",
      "私＝幸せ",
      "私=幸せ",
      "me＝happy",
      "me=happy",
      "幸せにした",
      "ケーキを作ってくれた",
      "私にケーキ"
    ],
    "f": [
      "じゃあ He made me angry. は、どっちですか？",
      "She made me a dress. は、どっちですか？"
    ],
    "hint": "後ろの2つがイコールかどうかで見分けます。\n・me ≠ a cake（私はケーキではない）\n　→「人に・物を」（S V O O）：私にケーキを作ってくれた\n・me ＝ happy（私＝幸せ）\n　→「O を C にする」（S V O C）：私を幸せにした",
    "mistake": {
      "t": "わかった！じゃあ She made me a teacher. も、ケーキと同じで「私に先生を作ってくれた」ですね！",
      "fix": "私＝先生なので「私を先生にした」（S V O C）。イコールかどうかで見分ける",
      "kw": [
        "先生にした",
        "私を先生",
        "私＝先生",
        "私=先生",
        "me＝a teacher",
        "me=a teacher",
        "svoc",
        "s v o c"
      ]
    }
  },
  {
    "ph": 2,
    "who": "haru",
    "topic": "Wait me.",
    "video": "JITA",
    "q": [
      "「ちょっと待って」を Wait me. って言ったら、変な顔をされました。なんでですか？"
    ],
    "key": [
      "wait は後ろに名詞を直接置けない",
      "for でつなぐ（Wait for me.）"
    ],
    "kw": [
      "for",
      "wait for",
      "直接",
      "自動詞",
      "前置詞",
      "置けない"
    ],
    "f": [
      "じゃあ「バスを待ってる」は、どう言うんですか？",
      "「〜を待つ」なのに、なんで「〜を」が使えないんですか？"
    ],
    "hint": "wait は、後ろに名詞を直接置けない動詞（自動詞）です。「〜を待つ」と言うときは、for でつなぎます。\nWait for me.（私を待って）\n\n日本語では「私を待つ」ですが、英語の wait は「〜を」を直接とれません。"
  },
  {
    "ph": 2,
    "who": "riko",
    "topic": "He married with her.",
    "video": "JITA",
    "q": [
      "「彼は彼女と結婚した」を He married with her. って書いたら×でした。「彼女と」なのに、なんで with がダメなんですか？"
    ],
    "key": [
      "marry は後ろに名詞を直接置ける",
      "だから with は要らない（日本語の「と」につられない）"
    ],
    "kw": [
      "直接",
      "要らない",
      "いらない",
      "married her",
      "他動詞",
      "不要",
      "必要ない"
    ],
    "f": [
      "じゃあ「私と結婚して」は、どう言うんですか？",
      "なんで日本語と英語で違うんですか？"
    ],
    "hint": "marry は、後ろに名詞を直接置ける動詞（他動詞）です。\nHe married her.（彼は彼女と結婚した）\n\n日本語の「〜と」につられて with を付けたくなりますが、要りません。\n反対に、talk（話す）は直接置けない動詞なので、talk to her / talk with her と言います。",
    "mistake": {
      "t": "わかった！じゃあ「彼女と話した」も I talked her. ですね！ with は要らないんですよね？",
      "fix": "I talked to her. / I talked with her.（talk は直接置けない動詞）",
      "kw": [
        "talked to",
        "talked with",
        "talk to",
        "talk with",
        "前置詞が要る",
        "前置詞がいる",
        "前置詞が必要",
        "to が要る",
        "toが要る",
        "to が必要",
        "toが必要",
        "自動詞"
      ]
    }
  },
  {
    "ph": 2,
    "who": "takumi",
    "topic": "arrived / reached",
    "video": "JITA",
    "q": [
      "「東京に着いた」を I arrived Tokyo. って書いたら×でした。でも I reached Tokyo. は○。同じ「着いた」なのに、なんでですか？"
    ],
    "key": [
      "reach は直接置ける、arrive は置けない",
      "arrive は in や at でつなぐ"
    ],
    "kw": [
      "直接",
      "arrive in",
      "arrive at",
      "arrived in",
      "arrived at",
      "他動詞",
      "自動詞",
      "前置詞"
    ],
    "f": [
      "じゃあ「駅に着いた」は、どう言うんですか？",
      "意味が同じなら、どっちを使ってもいいんですか？"
    ],
    "hint": "意味が同じでも、動詞によって型が違います。\n・reach は直接置ける動詞（他動詞）：reach Tokyo\n・arrive は直接置けない動詞（自動詞）なので、前置詞でつなぐ\n　arrive in Tokyo（広い場所）／arrive at the station（地点）",
    "mistake": {
      "t": "わかった！じゃあ「駅に着いた」は I reached at the station. ですね！",
      "fix": "I reached the station.（reach は直接置ける。arrive なら arrive at the station）",
      "kw": [
        "reached the station",
        "reach the station",
        "at は要らない",
        "atは要らない",
        "at はいらない",
        "atはいらない",
        "at は不要",
        "atは不要",
        "不要",
        "他動詞",
        "直接"
      ]
    }
  },
  {
    "ph": 2,
    "who": "haru",
    "topic": "The door opened.",
    "video": "JITA",
    "q": [
      "The door opened. って、ドアが開けたんですか？ ドアに手はないのに…"
    ],
    "key": [
      "後ろに名詞がないと「開く」で、あると「開ける」",
      "The door opened. は「ドアが開いた」"
    ],
    "kw": [
      "開いた",
      "開く",
      "両方",
      "名詞がない",
      "名詞が無い",
      "自動詞",
      "あいた",
      "ひらいた"
    ],
    "f": [
      "じゃあ The meeting started. は、どういう意味ですか？",
      "「開く」と「開ける」は、どうやって見分けるんですか？"
    ],
    "hint": "open は、両方の使い方ができる動詞です。\n・後ろに名詞を置かないと「開く」（自動詞）\n　The door opened.（ドアが開いた）\n・後ろに名詞を置くと「〜を開ける」（他動詞）\n　I opened the door.（私はドアを開けた）\n\nclose（閉まる／閉める）、start（始まる／始める）も同じです。"
  },
  {
    "ph": 2,
    "who": "riko",
    "topic": "entered into the room",
    "video": "JITA",
    "q": [
      "「部屋に入った」を I entered into the room. って書いたら×でした。「部屋の中に」なのに、なんで into がダメなんですか？"
    ],
    "key": [
      "enter は後ろに名詞を直接置ける",
      "だから into は要らない"
    ],
    "kw": [
      "直接",
      "要らない",
      "いらない",
      "entered the room",
      "他動詞",
      "不要",
      "必要ない"
    ],
    "f": [
      "じゃあ「学校に入った」は、どう言うんですか？",
      "「に」が付くのに、なんで前置詞が要らないんですか？"
    ],
    "hint": "enter は、後ろに名詞を直接置ける動詞（他動詞）です。\nI entered the room.\n\n「〜に入る」の「に」につられて into を付けたくなりますが、要りません。\napproach（〜に近づく）も同じで、approach the station と言います（× approach to）。",
    "mistake": {
      "t": "わかった！じゃあ「台風が日本に近づいている」は The typhoon is approaching to Japan. ですね！",
      "fix": "The typhoon is approaching Japan.（approach も直接置ける）",
      "kw": [
        "approaching japan",
        "approach japan",
        "to は要らない",
        "toは要らない",
        "to はいらない",
        "toはいらない",
        "to は不要",
        "toは不要",
        "不要",
        "他動詞",
        "直接"
      ]
    }
  },
  {
    "ph": 2,
    "who": "takumi",
    "topic": "rise と raise",
    "video": "JITA",
    "q": [
      "rise と raise って、どっちも「上がる」ですよね？ 何が違うんですか？"
    ],
    "key": [
      "rise は「上がる」で、後ろに名詞を置かない",
      "raise は「〜を上げる」で、後ろに名詞を置く"
    ],
    "kw": [
      "上げる",
      "あげる",
      "自動詞",
      "他動詞",
      "名詞を置く",
      "名詞を置かない",
      "目的語"
    ],
    "f": [
      "じゃあ「質問がある人は手を上げて」の「上げて」は、どっちですか？",
      "rise の過去形は何ですか？"
    ],
    "hint": "形が似ていますが、型が違うペアです。\n・rise＝「上がる」（自動詞、後ろに名詞を置かない）\n　The sun rises.（太陽が昇る）\n・raise＝「〜を上げる」（他動詞、後ろに名詞を置く）\n　Raise your hand.（手を上げて）\n\n過去形は rise → rose、raise → raised。",
    "mistake": {
      "t": "わかった！じゃあ「物価が上がった」は Prices raised. ですね！",
      "fix": "Prices rose.（「上がる」は rise。過去形は rose）",
      "kw": [
        "rose",
        "自動詞",
        "名詞を置かない",
        "raise は上げる",
        "raiseは上げる",
        "raise は〜を上げる",
        "raiseは〜を上げる"
      ]
    }
  },
  {
    "ph": 2,
    "who": "haru",
    "topic": "I go to home.",
    "video": "JITA",
    "q": [
      "I go to home. って書いたら×でした。go は to が要るって習ったのに！"
    ],
    "key": [
      "home は「家へ」という意味で、「へ」がもう入っている",
      "だから to は要らない（go home）"
    ],
    "kw": [
      "家へ",
      "「へ」",
      "へが入",
      "へも入",
      "へという意味",
      "への意味",
      "副詞",
      "go home"
    ],
    "f": [
      "じゃあ「そこへ行く」は、どう言うんですか？",
      "school と home は、何が違うんですか？"
    ],
    "hint": "go が to でつなぐ動詞なのは、その通りです（go to school）。\nでも home は、ここでは「家へ」という意味の付け足しの言葉で、「へ」の意味がもう入っています。だから to は要りません。\nI go home.\n\nthere（そこへ）、abroad（外国へ）も同じです：go there／go abroad。",
    "mistake": {
      "t": "わかった！じゃあ「学校へ行く」も I go school. でいいんですね！",
      "fix": "I go to school.（school は名詞なので to が要る）",
      "kw": [
        "go to school",
        "to が要る",
        "toが要る",
        "to がいる",
        "toがいる",
        "to が必要",
        "toが必要",
        "school は名詞",
        "schoolは名詞"
      ]
    }
  },
  {
    "ph": 2,
    "who": "riko",
    "topic": "discussed about",
    "video": "JITA",
    "q": [
      "「その問題について話し合った」を We discussed about the problem. って書いたら×でした。「について」なのに、なんで about がダメなんですか？"
    ],
    "key": [
      "discuss は「〜について話し合う」で、直接置ける",
      "だから about は要らない"
    ],
    "kw": [
      "直接",
      "要らない",
      "いらない",
      "discussed the problem",
      "他動詞",
      "不要",
      "必要ない",
      "入って"
    ],
    "f": [
      "じゃあ「将来について話し合おう」は、どう言うんですか？",
      "talk about は○なのに、discuss about はダメなんですか？"
    ],
    "hint": "discuss は、「〜について話し合う」という意味まで1語に入っている動詞（他動詞）です。だから about は要りません。\nWe discussed the problem.\n\n反対に、listen（聞く）は直接置けない動詞なので、listen to the story と言います。",
    "mistake": {
      "t": "わかった！じゃあ「その話を聞いた」は I listened the story. ですね！ 前置詞は要らないんですよね？",
      "fix": "I listened to the story.（listen は直接置けない）",
      "kw": [
        "listened to",
        "listen to",
        "to が要る",
        "toが要る",
        "to が必要",
        "toが必要",
        "自動詞",
        "前置詞が要る",
        "前置詞が必要"
      ]
    }
  },
  {
    "ph": 2,
    "who": "takumi",
    "topic": "explain me",
    "video": "JITA",
    "q": [
      "Please explain me this word. って書いたら×でした。teach me English は○なのに、なんでですか？"
    ],
    "key": [
      "explain は「人に・物を」の2つを並べられない",
      "人は to でつなぐ（explain this word to me）"
    ],
    "kw": [
      "2つ",
      "二つ",
      "to me",
      "並べられない",
      "並べない",
      "svoo",
      "s v o o",
      "とれない",
      "取れない"
    ],
    "f": [
      "じゃあ「その理由を私に説明して」は、どう言うんですか？",
      "tell は2つ並べていいんですか？"
    ],
    "hint": "teach・give・tell は、後ろに「人に・物を」の2つを並べられる動詞です（フェーズ1の S V O O）。\nでも explain は2つ並べられません。「人に」は to でつなぎます。\nPlease explain this word to me.\n\nsay も同じで、say it to me と言います（× say me）。",
    "mistake": {
      "t": "わかった！じゃあ「その理由を私に言って」は Say me the reason. ですね！",
      "fix": "Tell me the reason. または Say the reason to me.（say は2つ並べられない、tell は並べられる）",
      "kw": [
        "tell me",
        "to me"
      ]
    }
  },
  {
    "ph": 2,
    "who": "haru",
    "topic": "結局どう見分けるの？",
    "video": "JITA",
    "q": [
      "先生、wait は for が要って、marry は with が要らなくて…。",
      "結局、どうやって見分けて覚えればいいんですか？"
    ],
    "key": [
      "「後ろに名詞を直接置けるか」で見分ける（日本語の助詞では判断できない）",
      "動詞を、後ろの言葉とセットで覚える"
    ],
    "kw": [
      "直接",
      "セット",
      "辞書",
      "自動詞",
      "他動詞",
      "後ろの言葉と"
    ],
    "f": [
      "日本語の「〜を」が付いていれば、直接置ける動詞なんですか？",
      "じゃあ、新しい動詞はどうやって覚えればいいんですか？"
    ],
    "hint": "見分けるポイントは1つ、「後ろに名詞を直接置けるか」です。\n日本語の「〜を」「〜に」「〜と」「〜について」では判断できません（marry は「〜と」なのに直接、wait は「〜を」なのに for）。\n\n覚え方は、動詞1語ではなく、後ろの言葉とセットで覚えること。\nwait for／listen to／arrive at／discuss 〜／marry 〜\n\n迷ったら、辞書の「自」「他」のマークで確かめられます。"
  },
  {
    "ph": 3,
    "who": "haru",
    "topic": "I'm looking for my key.",
    "video": "GUN",
    "q": [
      "友達が I'm looking for my key. って言いながら、カバンの中をガサガサしてました。",
      "look は「見る」で、for は「〜のほう」だから…「鍵のほうを見てる」？"
    ],
    "key": [
      "look for は「〜を探す」という意味",
      "部品の意味をつなげず、別の1語として覚える"
    ],
    "kw": [
      "探",
      "1語",
      "一語",
      "別の単語",
      "別の言葉",
      "まとまり",
      "1つの動詞",
      "ひとつの動詞",
      "群動詞"
    ],
    "f": [
      "じゃあ look at と look for は、何が違うんですか？",
      "for の意味から考えちゃダメなんですか？"
    ],
    "hint": "look for は、「〜を探す」という意味の、別の1語です。look と for の意味をつなげて考えても、「探す」にはたどり着きません。\n\n日本語でも「見る」と「つける」で「見つける」になりますが、「つける」の意味から「見つける」は考えませんよね。それと同じです。\nこのように、動詞＋小さな言葉で別の1語になるまとまりを、群動詞と言います。\n\nまた、look は1語では後ろに名詞を直接置けない動詞なので、I'm looking my key. とは言えません。でも for と合体した look for は、後ろに my key を置けるようになります。"
  },
  {
    "ph": 3,
    "who": "riko",
    "topic": "I ran into my friend.",
    "video": "GUN",
    "q": [
      "「駅で I ran into my friend.」って英文がありました。",
      "run は「走る」で into は「〜の中へ」だから…。友達に走って突っ込んだんですか！？"
    ],
    "key": [
      "run into は「偶然会う」という意味",
      "部品の意味から組み立てない"
    ],
    "kw": [
      "偶然",
      "たまたま",
      "ばったり"
    ],
    "f": [
      "じゃあ「スーパーで先生に偶然会った」は、どう言うんですか？",
      "なんで「走る」が「会う」になるんですか？"
    ],
    "hint": "run into は、「〜に偶然会う」という意味の、別の1語です。\nrun と into の意味から組み立てると、「走って突っ込む」になってしまいますね。群動詞は、部品に分けずに、まとまりのまま覚えます。\nI ran into my friend at the station.＝駅で友達に偶然会った",
    "mistake": {
      "t": "わかった！じゃあ「昨日、偶然ケンに会った」は、走って会いに行くわけじゃないから I met into Ken yesterday. ですね！",
      "fix": "I ran into Ken yesterday.（run into で1語。met にはしない）",
      "kw": [
        "ran into",
        "run into"
      ]
    }
  },
  {
    "ph": 3,
    "who": "takumi",
    "topic": "Pick up it.",
    "video": "GUN",
    "q": [
      "落ちたペンを指して「それ、拾って」を Pick up it. って書いたら×でした。Pick up the pen. は○なのに、なんでですか？"
    ],
    "key": [
      "it は pick と up の間にはさむ（Pick it up.）",
      "名詞なら、どちらの順番でもよい"
    ],
    "kw": [
      "間に",
      "あいだに",
      "はさ",
      "挟",
      "pick it up"
    ],
    "f": [
      "じゃあ Pick the pen up. は、合っていますか？",
      "them のときは、どうなりますか？"
    ],
    "hint": "pick up（拾う）のような、up・off・on で終わる群動詞は、名詞なら2通りの順番で言えます。\npick up the pen／pick the pen up\n\nでも it・them・me のような短い言葉は、必ず間にはさみます。\nPick it up.（× Pick up it.）\n\nturn off（消す）も同じで、Turn it off.（それを消して）と言います。",
    "mistake": {
      "t": "わかった！じゃあ「それを消して」は Turn off it. ですね！",
      "fix": "Turn it off.（it は turn と off の間にはさむ）",
      "kw": [
        "turn it off"
      ]
    }
  },
  {
    "ph": 3,
    "who": "haru",
    "topic": "I gave up.",
    "video": "GUN",
    "q": [
      "テストの問題が難しくて、友達が I gave up. って言いました。",
      "give は「あげる」で up は「上」だから…。上にあげたんですか？"
    ],
    "key": [
      "give up は「あきらめる」という意味",
      "部品の意味から組み立てない"
    ],
    "kw": [
      "あきらめ",
      "諦め"
    ],
    "f": [
      "じゃあ「夢をあきらめないで」は、どう言うんですか？",
      "up が「上」じゃないなら、何なんですか？"
    ],
    "hint": "give up は、「あきらめる」という意味の、別の1語です。give と up をつなげて「上にあげる」と考えても、意味は出てきません。\nI gave up.＝もうあきらめた\n\n後ろに名詞を置くと「〜をあきらめる」です。\nI gave up the plan.（その計画をあきらめた）"
  },
  {
    "ph": 3,
    "who": "riko",
    "topic": "I grew up Tokyo.",
    "video": "GUN",
    "q": [
      "「私は東京で育った」を I grew up Tokyo. って書いたら×でした。群動詞って、後ろに名詞を置けるんじゃないんですか？"
    ],
    "key": [
      "grow up は後ろに名詞を置けない",
      "場所は in でつなぐ（grew up in Tokyo）"
    ],
    "kw": [
      "in tokyo",
      "置けない",
      "おけない",
      "in でつな",
      "inでつな"
    ],
    "f": [
      "じゃあ「大阪で育った」は、どう言うんですか？",
      "群動詞なら全部、名詞を置けるんじゃないんですか？"
    ],
    "hint": "群動詞にも、後ろに名詞を置けるものと置けないものがあります。\nlook for は置けますが（look for my key）、grow up（育つ）は置けません。だから、場所は in でつなぎます。\nI grew up in Tokyo.\n\nget up（起きる）、show up（現れる）も置けない仲間です。\nI get up at six.／He showed up at the party.\n\n自動詞と他動詞と同じで、群動詞ごとに決まっています。",
    "mistake": {
      "t": "わかった！じゃあ「彼はパーティーに現れなかった」は He didn't show up the party. ですね！",
      "fix": "He didn't show up at the party.（show up も後ろに名詞を置けないので at でつなぐ）",
      "kw": [
        "up at",
        "at the party"
      ]
    }
  },
  {
    "ph": 3,
    "who": "takumi",
    "topic": "Look it for.",
    "video": "GUN",
    "q": [
      "pick it up は it を間にはさむって習ったので、「それを探して」を Look it for. って書いたら×でした。なんでですか？"
    ],
    "key": [
      "for は後ろに名詞が必要な言葉（前置詞）なので、名詞のすぐ前に置く（Look for it.）",
      "間にはさめるのは、最後に1人で立てる up・off・on などのときだけ"
    ],
    "kw": [
      "look for it",
      "すぐ前",
      "前置詞",
      "離れ"
    ],
    "f": [
      "じゃあ「それを見て」は、どう言うんですか？",
      "どの言葉なら、間にはさめるんですか？"
    ],
    "hint": "小さな言葉には2種類あります。\n\nfor・at・to・into は前置詞といい、字のとおり「名詞の前に置く言葉」です。後ろに名詞がいて、はじめて意味が決まるので、名詞と離れません。\nLook for it.（それを探して）／Listen to it.（それを聞いて）／I ran into him.（彼に偶然会った）\nLook for. で止めると「何を？」となりますね。\n\nいっぽう up・off・on は、文の最後に1人で立てる言葉で、副詞と呼びます。\nPick it up.／Stand up.／I gave up.\n1人で立てるので、it を間にはさめます。\n\n見分け方は、最後に1人で立てるか、後ろに名詞が必要か、です。",
    "mistake": {
      "t": "わかった！じゃあ「それを聞いて」は Listen it to. ですね！",
      "fix": "Listen to it.（to は前置詞なので、名詞のすぐ前に置く）",
      "kw": [
        "listen to it"
      ]
    }
  },
  {
    "ph": 3,
    "who": "haru",
    "topic": "listen to music の to",
    "video": "GUN",
    "q": [
      "listen to music の to music は「付け足し」って習ったのに、listen to で1つの動詞だって言う人もいます。",
      "どっちが正しいんですか？"
    ],
    "key": [
      "どちらの見方でもよい",
      "どちらでも、listen には to が要る"
    ],
    "kw": [
      "どちらでも",
      "どっちでも",
      "両方",
      "好きなほう",
      "好きな方",
      "好み",
      "どちらの見方"
    ],
    "f": [
      "じゃあ、私はどっちで覚えればいいですか？",
      "listen music じゃダメなのは、変わらないんですか？"
    ],
    "hint": "どちらの見方でも大丈夫です。\n①listen は後ろに名詞を置けない動詞で、to music は付け足し\n②listen to で、後ろに名詞を置ける1つの群動詞で、music が「何を」にあたる\n\ngo to school も同じで、go＋付け足しと見ても、go to を1つの動詞と見てもかまいません。好きなほうで考えましょう。\n\n大事なのは、listen music とは言わず、to が要ることです。"
  },
  {
    "ph": 3,
    "who": "riko",
    "topic": "put on と wear",
    "video": "GUN",
    "q": [
      "put on も wear も「着る」ですよね？",
      "「彼はいつもメガネをかけている」って、どっちを使えばいいんですか？"
    ],
    "key": [
      "put on は「身につける動作」で、wear は「身につけている状態」",
      "いつもかけているなら wear（He always wears glasses.）"
    ],
    "kw": [
      "状態",
      "wears",
      "いつもかけている",
      "身につけている"
    ],
    "f": [
      "じゃあ「急いでコートを着た」は、どっちですか？",
      "2つは何が違うんですか？"
    ],
    "hint": "put on は「身につける動作」で、wear は「身につけている状態」です。\nI put on my coat.＝（今）コートを着た（着る動き）\nHe always wears glasses.＝彼はいつもメガネをかけている（かけている状態）\n\n「いつも」のように、状態を言うときは wear です。",
    "mistake": {
      "t": "わかった！じゃあ「彼女はいつも赤い靴をはいている」は She always puts on red shoes. ですね！",
      "fix": "She always wears red shoes.（はいている状態なので wear）",
      "kw": [
        "wears",
        "wear"
      ]
    }
  },
  {
    "ph": 3,
    "who": "takumi",
    "topic": "We put off the meeting.",
    "video": "GUN",
    "q": [
      "会社のメールに We put off the meeting. ってありました。",
      "put は「置く」で off は「離れて」だから…。会議を置いて、どこかへ行ったんですか？"
    ],
    "key": [
      "put off は「延期する」という意味",
      "部品の意味から組み立てない"
    ],
    "kw": [
      "延期",
      "先延ばし",
      "のばし"
    ],
    "f": [
      "じゃあ「旅行を延期した」は、どう言うんですか？",
      "「それを延期しよう」は、どう言うんですか？"
    ],
    "hint": "put off は、「〜を延期する」という意味の、別の1語です。\nWe put off the meeting.＝会議を延期した\n\noff で終わる群動詞なので、it のときは間にはさみます。\nLet's put it off.（それを延期しよう）",
    "mistake": {
      "t": "わかった！じゃあ「それを来週に延期しよう」は Let's put off it until next week. ですね！",
      "fix": "Let's put it off until next week.（it は put と off の間にはさむ）",
      "kw": [
        "put it off"
      ]
    }
  },
  {
    "ph": 3,
    "who": "haru",
    "topic": "全部覚えないとダメ？",
    "video": "GUN",
    "q": [
      "先生、look for に run into に give up…。",
      "こういうの、全部先に覚えないとダメなんですか？"
    ],
    "key": [
      "全部を先に覚えなくてよい。使いたいときに調べて、そのつど自分のものにする",
      "別の1語として、例文ごと覚える"
    ],
    "kw": [
      "調べ",
      "例文",
      "使いたい",
      "そのつど",
      "都度"
    ],
    "f": [
      "じゃあ、知らない群動詞に出会ったら、どうすればいいですか？",
      "例文で覚えると、何がいいんですか？"
    ],
    "hint": "群動詞は、とても種類が多いので、全部を先に覚えようとしなくて大丈夫です。\n使いたいとき、出会ったときに辞書で調べて、そのつど自分のものにしていきましょう。\n\n覚えるときは、部品の意味から組み立てず、別の1語として、例文ごと覚えます。\n例文で覚えると、後ろに名詞を置けるか（grow up in Tokyo）や、it の位置（pick it up）も一緒に覚えられます。"
  },
  {
    "ph": 4,
    "who": "haru",
    "topic": "I don't can swim.",
    "video": "JODO",
    "q": [
      "「私は泳げない」を I don't can swim. って書いたら×でした。",
      "否定は don't って習ったのに、なんでですか？"
    ],
    "key": [
      "can と do は同じ仲間（助動詞）なので、2つ並べない",
      "can に not を付ける（I can't swim.）"
    ],
    "kw": [
      "can't swim",
      "cannot swim",
      "can not swim",
      "同じ仲間",
      "並べない",
      "並べられない",
      "1つだけ",
      "一つだけ",
      "ひとつだけ",
      "助動詞は1つ",
      "助動詞が2つ",
      "can に not",
      "canにnot",
      "can に直接"
    ],
    "f": [
      "じゃあ「私は英語を話せない」は、どう言うんですか？",
      "なんで don't を使っちゃダメなんですか？"
    ],
    "hint": "can と do は、どちらも助動詞という同じ仲間です。助動詞は、動詞の前に置く言葉で、置けるのは1つだけです。\ncan がもう入っているので、do を並べることはできません。否定文は、can に直接 not を付けます。\nI can't swim.（I cannot swim.）\n\nI don't swim.（ふだん泳がない）も、I can't swim.（泳げない）も、助動詞に not を付けるという、同じ作り方です。",
    "mistake": {
      "t": "わかった！じゃあ「彼は泳げない」は He doesn't can swim. ですね！",
      "fix": "He can't swim.（can があれば doesn't は要らない。can に not を付ける）",
      "kw": [
        "can't swim",
        "cannot swim",
        "can not swim",
        "doesn't は要らない",
        "doesn'tは要らない",
        "doesn't はいらない",
        "doesn'tはいらない",
        "doesn't は不要",
        "doesn'tは不要",
        "can に not",
        "canにnot",
        "並べない",
        "並べられない",
        "同じ仲間"
      ]
    }
  },
  {
    "ph": 4,
    "who": "riko",
    "topic": "Can you swim?",
    "video": "JODO",
    "q": [
      "「泳ぎますか？」は Do you swim? なのに、「泳げますか？」は Can you swim? ですよね。",
      "なんで can のときは Do を使わないんですか？"
    ],
    "key": [
      "疑問文は、助動詞を前に出す（Can you swim?）",
      "can と do は同じ作り方の仲間なので、can の文に do は要らない"
    ],
    "kw": [
      "前に出す",
      "前に出し",
      "前に出る",
      "前に出て",
      "先頭に",
      "同じ仲間",
      "同じ作り方",
      "1つだけ",
      "一つだけ",
      "ひとつだけ",
      "並べない",
      "並べられない",
      "do は要らない",
      "doは要らない",
      "do はいらない",
      "doはいらない",
      "do は不要",
      "doは不要"
    ],
    "f": [
      "じゃあ「ピアノを弾けますか？」は、どう言うんですか？",
      "Do you can swim? じゃダメなんですか？"
    ],
    "hint": "疑問文は、助動詞を前に出すだけで作れます。can も do も同じ助動詞の仲間なので、作り方は同じです。\nYou can swim. → Can you swim?\n\nDo you swim? も、do を前に出した形です。\ncan がもう前に出ているので、do を足す必要はありません。助動詞は1つの文に1つだけなので、Do you can swim? とは言いません。"
  },
  {
    "ph": 4,
    "who": "takumi",
    "topic": "I like music. の否定",
    "video": "JODO",
    "q": [
      "I like music. を否定にしたら I don't like music. でした。",
      "元の文に do なんてなかったのに、急に出てきた don't は、どこから来たんですか？"
    ],
    "key": [
      "I like music. には do が隠れている",
      "否定文では、隠れていた do が顔を出して not が付く（I don't like music.）"
    ],
    "kw": [
      "隠れて",
      "隠れた",
      "かくれて",
      "かくれた",
      "顔を出",
      "表に出",
      "見えない",
      "省略され",
      "i do like",
      "(do)",
      "（do）"
    ],
    "f": [
      "じゃあ「私はコーヒーを飲まない」は、どう言うんですか？",
      "do は、もともとどこにあったんですか？"
    ],
    "hint": "実は I like music. にも、do が隠れています。\nI (do) like music.\n\nふつうの文では、do は表に出てきません。でも、否定文や疑問文では、隠れていた do が顔を出します。\nI don't like music.／Do you like music?\n\nI can't swim. と同じで、助動詞に not が付いているだけです。",
    "mistake": {
      "t": "わかった！じゃあ「私は犬が好きじゃない」は I not like dogs. ですね！",
      "fix": "I don't like dogs.（隠れていた do を出して、not を付ける）",
      "kw": [
        "don't like dogs",
        "do not like",
        "don't が要る",
        "don'tが要る",
        "don't が必要",
        "don'tが必要",
        "do が要る",
        "doが要る",
        "do が必要",
        "doが必要",
        "do を出",
        "doを出",
        "隠れていた",
        "顔を出"
      ]
    }
  },
  {
    "ph": 4,
    "who": "haru",
    "topic": "He can swims.",
    "video": "JODO",
    "q": [
      "「彼は泳げる」を He can swims. って書いたら×でした。",
      "主語が he のときは動詞に s を付けるって聞いたのに、なんでですか？"
    ],
    "key": [
      "助動詞のあとの動詞は、元の形（He can swim.）",
      "主語が he でも、s は付けない"
    ],
    "kw": [
      "元の形",
      "もとの形",
      "原形",
      "s は付けない",
      "sは付けない",
      "s はつけない",
      "sはつけない",
      "s を付けない",
      "sを付けない",
      "s は要らない",
      "sは要らない",
      "s はいらない",
      "sはいらない",
      "s は不要",
      "sは不要",
      "swim のまま",
      "swimのまま"
    ],
    "f": [
      "じゃあ「彼女は上手に歌える」は、どう言うんですか？",
      "Does he swim? の swim に s がないのも、同じですか？"
    ],
    "hint": "助動詞のあとの動詞は、いつも元の形です。\nHe can swim.\n主語が he でも she でも、can のあとの動詞に s は付きません。\n\nDoes he swim? の swim に s がないのも、同じ理由です。does という助動詞のあとなので、元の形になります。",
    "mistake": {
      "t": "わかった！じゃあ「彼は明日来るよ」は He will comes tomorrow. ですね！",
      "fix": "He will come tomorrow.（will も助動詞なので、後ろの動詞は元の形）",
      "kw": [
        "will come tomorrow",
        "come tomorrow",
        "元の形",
        "もとの形",
        "原形",
        "s は付けない",
        "sは付けない",
        "s はつけない",
        "sはつけない",
        "s は要らない",
        "sは要らない",
        "s はいらない",
        "sはいらない",
        "s は不要",
        "sは不要"
      ]
    }
  },
  {
    "ph": 4,
    "who": "riko",
    "topic": "Does he like music?",
    "video": "JODO",
    "q": [
      "He likes music. を疑問文にしたら Does he like music? で、likes の s が消えていました。",
      "s はどこへ行っちゃったんですか？"
    ],
    "key": [
      "likes の s は、隠れている does の印",
      "does が顔を出すと、s は does へ移り、動詞は元の形に戻る（Does he like music?）"
    ],
    "kw": [
      "does の印",
      "doesの印",
      "does へ移",
      "doesへ移",
      "does に移",
      "doesに移",
      "does のほう",
      "doesのほう",
      "does の方",
      "doesの方",
      "does に付",
      "doesに付",
      "隠れて",
      "隠れた",
      "かくれて",
      "顔を出",
      "元の形",
      "もとの形",
      "原形"
    ],
    "f": [
      "じゃあ「彼女はテニスをしますか？」は、どう言うんですか？",
      "Does he likes music? にならないのは、なぜですか？"
    ],
    "hint": "主語が he・she・it のとき、隠れている do は does になります。\nHe (does) like music.\n\nふつうの文では does が隠れているので、その印として、動詞に s が付きます。\nHe likes music.\n\n疑問文や否定文で does が顔を出すと、s は does のほうへ移るので、動詞は元の形に戻ります。\nDoes he like music?／He doesn't like music.",
    "mistake": {
      "t": "わかった！じゃあ「彼女は犬が好きじゃない」は She doesn't likes dogs. ですね！",
      "fix": "She doesn't like dogs.（s は doesn't に移っているので、動詞は元の形）",
      "kw": [
        "doesn't like dogs",
        "does not like",
        "doesn't に移",
        "doesn'tに移",
        "does に移",
        "doesに移",
        "元の形",
        "もとの形",
        "原形",
        "s は要らない",
        "sは要らない",
        "s はいらない",
        "sはいらない",
        "s は不要",
        "sは不要",
        "s は付けない",
        "sは付けない",
        "s を取",
        "sを取"
      ]
    }
  },
  {
    "ph": 4,
    "who": "takumi",
    "topic": "Do you like music? の Do",
    "video": "JODO",
    "q": [
      "Do you like music? の Do って、「する」ですよね？",
      "でも、音楽が好きかを聞いているだけで、何もしていないのに…"
    ],
    "key": [
      "疑問文の Do は「する」ではなく、隠れていた助動詞の do が前に出ただけ",
      "Can you swim? と同じ作り方"
    ],
    "kw": [
      "隠れて",
      "隠れた",
      "かくれて",
      "かくれた",
      "前に出",
      "意味はない",
      "意味がない",
      "意味を足さない",
      "意味はありません",
      "意味がありません",
      "「する」ではな",
      "「する」じゃな",
      "助動詞の do",
      "助動詞のdo",
      "can you swim",
      "同じ作り方"
    ],
    "f": [
      "じゃあ Do you play tennis? の Do も同じですか？",
      "なんで can のときは Do を付けないんですか？"
    ],
    "hint": "この Do は「する」という意味ではありません。I like music. に隠れていた助動詞の do が、疑問文にするために前に出ただけです。だから、Do 自体は意味を足しません。\n\nCan you swim? の can が前に出るのと、同じ作り方です。\n\n「する」の do は、I do my homework.（宿題をする）のように、動詞の場所にいるときです。",
    "mistake": {
      "t": "わかった！じゃあ「あなたは泳げますか？」は、疑問文だから Do を付けて Do you can swim? ですね！",
      "fix": "Can you swim?（can も do と同じ助動詞なので、2つ並べない。can を前に出す）",
      "kw": [
        "can you swim",
        "並べない",
        "並べられない",
        "1つだけ",
        "一つだけ",
        "ひとつだけ",
        "can を前",
        "canを前",
        "can が前",
        "canが前",
        "do は要らない",
        "doは要らない",
        "do はいらない",
        "doはいらない",
        "do は不要",
        "doは不要",
        "同じ仲間"
      ]
    }
  },
  {
    "ph": 4,
    "who": "haru",
    "topic": "You should study more.",
    "video": "JODO",
    "q": [
      "先生に You should study more. って言われました。",
      "これって「もっと勉強しろ！」って命令ですか？ ちょっとこわいです…"
    ],
    "key": [
      "should は「〜したほうがいい」というすすめ",
      "命令ではない（命令は Study more. のように動詞から始める）"
    ],
    "kw": [
      "ほうがいい",
      "方がいい",
      "ほうが良い",
      "方が良い",
      "すすめ",
      "勧め",
      "薦め",
      "アドバイス",
      "命令ではな",
      "命令じゃな",
      "動詞から始"
    ],
    "f": [
      "じゃあ「早く寝たほうがいいよ」は、どう言うんですか？",
      "命令とは、どう違うんですか？"
    ],
    "hint": "should は「〜したほうがいい」くらいの、すすめる言葉です。命令ではありません。\nYou should study more.＝もっと勉強したほうがいいよ\n\n命令なら、Study more.（もっと勉強しなさい）のように、動詞から始めます。\n\nshould も助動詞なので、後ろの動詞は元の形です。"
  },
  {
    "ph": 4,
    "who": "riko",
    "topic": "Will you…? と Shall we…?",
    "video": "JODO",
    "q": [
      "Will you help me? と Shall we dance? って、どっちも「〜しませんか？」みたいな感じですよね？",
      "違いがわかりません。"
    ],
    "key": [
      "Will you 〜? は「〜してくれる？」（お願い）",
      "Shall we 〜? は「〜しようか？」（さそう）"
    ],
    "kw": [
      "してくれる",
      "お願い",
      "頼みごと",
      "依頼",
      "しようか",
      "しましょう",
      "さそう",
      "さそい",
      "誘う言い方",
      "誘いの",
      "一緒に",
      "いっしょに"
    ],
    "f": [
      "じゃあ「窓を開けてくれる？」は、どう言うんですか？",
      "作り方は、Can you swim? と同じですか？"
    ],
    "hint": "Will you 〜? は「〜してくれる？」と、相手にお願いする言い方です。\nWill you help me?＝手伝ってくれる？\n\nShall we 〜? は「（一緒に）〜しようか？」と、さそう言い方です。\nShall we dance?＝踊りましょうか？\n\n主語を見ると分かります。you はあなたがすること、we は私たちですることです。\nどちらも、助動詞（will・shall）を前に出すだけの、同じ作り方です。"
  },
  {
    "ph": 4,
    "who": "takumi",
    "topic": "It may rain.／He must be tired.",
    "video": "JODO",
    "q": [
      "天気予報で It may rain. って言っていて、友達は He must be tired. って言っていました。",
      "may は「〜してもいい」で、must は「〜しなければならない」ですよね？ 雨が降ってもいい？ 彼は疲れなければならない？"
    ],
    "key": [
      "may には「〜かもしれない」の意味がある（It may rain.）",
      "must には「〜に違いない」の意味がある（He must be tired.）"
    ],
    "kw": [
      "かもしれな",
      "違いな",
      "ちがいな",
      "に決まって",
      "もう1つの意味",
      "もう一つの意味",
      "別の意味",
      "推量",
      "確かさ",
      "確信"
    ],
    "f": [
      "じゃあ「彼は家にいるかもしれない」は、どう言うんですか？",
      "どっちの意味か、どうやって見分けるんですか？"
    ],
    "hint": "may と must には、もう1つの意味があります。\nmay は「〜かもしれない」で、must は「〜に違いない」という意味です。\nIt may rain.＝雨が降るかもしれない\nHe must be tired.＝彼は疲れているに違いない\n\nどちらも、話す人が「どのくらい確かだと思っているか」という気持ちを足しています。\n「してもいい」「しなければならない」で意味が合わないときは、こちらの意味で考えましょう。"
  },
  {
    "ph": 4,
    "who": "haru",
    "topic": "結局、助動詞って何？",
    "video": "JODO",
    "q": [
      "先生、can、will、should、must…。",
      "結局、助動詞って何なんですか？ do も入るんですか？"
    ],
    "key": [
      "助動詞は動詞の前に置く言葉で、do も同じ仲間",
      "作り方はみんな同じ（前に出す・not を付ける・後ろは元の形）"
    ],
    "kw": [
      "動詞の前",
      "同じ仲間",
      "仲間です",
      "入ります",
      "前に出す",
      "not を付け",
      "notを付け",
      "not をつけ",
      "notをつけ",
      "元の形",
      "もとの形",
      "原形",
      "作り方は同じ",
      "作り方が同じ",
      "同じ作り方",
      "作り方はみんな"
    ],
    "f": [
      "じゃあ I do like music. の do は、何ですか？",
      "can と do は、どこが同じなんですか？"
    ],
    "hint": "助動詞は、動詞の前に置く言葉です。can（できる）や should（したほうがいい）のように気持ちを足したり、疑問文・否定文を作ったりします。\n\ndo も同じ仲間で、作り方はみんな同じです。\n・疑問文は前に出す：Can you swim?／Do you swim?\n・否定文は not を付ける：I can't swim.／I don't swim.\n・後ろの動詞は元の形\n\nちがうのは、do がふつうの文では隠れていることだけです。\n隠れていた do は、強めたいときにも姿を見せます。\nI do like music.＝本当に音楽が好きなんです"
  }
] as Talk[];

export const THANKS = "わかりました、ありがとうございます！";
export const RETRY = "えっ、どこがちがうんですか？ もう少しくわしく教えてください！";
export const NUDGE = "先生、ヒントの解説を見てから、もう一度教えてもらえますか？";
