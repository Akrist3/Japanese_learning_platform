import json

KANJI_DATA = [
    # N5 Kanji
    {
        "kanji": "日",
        "meaning": "sun / day",
        "onyomi": "ニチ, ジツ",
        "kunyomi": "ひ, -び, -か",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 4,
        "mnemonic": "A window with the sun shining through.",
        "example_words_json": json.dumps([
            {"word": "日曜日", "reading": "にちようび", "meaning": "Sunday"},
            {"word": "毎日", "reading": "まいにち", "meaning": "every day"},
            {"word": "日本", "reading": "にほん", "meaning": "Japan"}
        ])
    },
    {
        "kanji": "月",
        "meaning": "moon / month",
        "onyomi": "ゲツ, ガツ",
        "kunyomi": "つき",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 4,
        "mnemonic": "A crescent moon peaking through clouds.",
        "example_words_json": json.dumps([
            {"word": "月曜日", "reading": "げつようび", "meaning": "Monday"},
            {"word": "一月", "reading": "いちがつ", "meaning": "January"},
            {"word": "今月", "reading": "こんげつ", "meaning": "this month"}
        ])
    },
    {
        "kanji": "火",
        "meaning": "fire",
        "onyomi": "カ",
        "kunyomi": "ひ, -び, ほ-",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 4,
        "mnemonic": "Flames leaping up from a campfire.",
        "example_words_json": json.dumps([
            {"word": "火曜日", "reading": "かようび", "meaning": "Tuesday"},
            {"word": "花火", "reading": "はなび", "meaning": "fireworks"},
            {"word": "火事", "reading": "かじ", "meaning": "fire / conflagration"}
        ])
    },
    {
        "kanji": "水",
        "meaning": "water",
        "onyomi": "スイ",
        "kunyomi": "みず",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 4,
        "mnemonic": "Water splashing out from a fountain stream.",
        "example_words_json": json.dumps([
            {"word": "水曜日", "reading": "すいようび", "meaning": "Wednesday"},
            {"word": "水着", "reading": "みずぎ", "meaning": "swimsuit"},
            {"word": "飲み水", "reading": "のみみず", "meaning": "drinking water"}
        ])
    },
    {
        "kanji": "木",
        "meaning": "tree / wood",
        "onyomi": "ボク, モク",
        "kunyomi": "き, こ-",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 4,
        "mnemonic": "A tree with trunk, branches, and roots.",
        "example_words_json": json.dumps([
            {"word": "木曜日", "reading": "もくようび", "meaning": "Thursday"},
            {"word": "大木", "reading": "たいぼく", "meaning": "large tree"}
        ])
    },
    {
        "kanji": "金",
        "meaning": "gold / money",
        "onyomi": "キン, コン",
        "kunyomi": "かね, かな-",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 8,
        "mnemonic": "A roof covering gold nuggets stored underground.",
        "example_words_json": json.dumps([
            {"word": "金曜日", "reading": "きんようび", "meaning": "Friday"},
            {"word": "お金", "reading": "おかね", "meaning": "money"}
        ])
    },
    {
        "kanji": "土",
        "meaning": "soil / earth / ground",
        "onyomi": "ド, ト",
        "kunyomi": "つち",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 3,
        "mnemonic": "A plant sprout growing out of the soil ground.",
        "example_words_json": json.dumps([
            {"word": "土曜日", "reading": "どようび", "meaning": "Saturday"},
            {"word": "土地", "reading": "とち", "meaning": "land"}
        ])
    },
    {
        "kanji": "人",
        "meaning": "person / human",
        "onyomi": "ジン, ニン",
        "kunyomi": "ひと",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 2,
        "mnemonic": "A person walking on two legs.",
        "example_words_json": json.dumps([
            {"word": "日本人", "reading": "にほんじん", "meaning": "Japanese person"},
            {"word": "大人", "reading": "おとな", "meaning": "adult"},
            {"word": "一人", "reading": "ひとり", "meaning": "one person"}
        ])
    },
    {
        "kanji": "山",
        "meaning": "mountain",
        "onyomi": "サン, セン",
        "kunyomi": "やま",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 3,
        "mnemonic": "Three mountain peaks sticking up.",
        "example_words_json": json.dumps([
            {"word": "富士山", "reading": "ふじさん", "meaning": "Mt. Fuji"},
            {"word": "火山", "reading": "かざん", "meaning": "volcano"}
        ])
    },
    {
        "kanji": "川",
        "meaning": "river",
        "onyomi": "セン",
        "kunyomi": "かわ",
        "jlpt_level": "N5",
        "grade": 1,
        "stroke_count": 3,
        "mnemonic": "Three streams of flowing river water.",
        "example_words_json": json.dumps([
            {"word": "小川", "reading": "おがわ", "meaning": "stream / brook"},
            {"word": "ナイル川", "reading": "ないるがわ", "meaning": "Nile River"}
        ])
    },

    # N4 Kanji
    {
        "kanji": "旅",
        "meaning": "travel / trip",
        "onyomi": "リョ",
        "kunyomi": "たび",
        "jlpt_level": "N4",
        "grade": 3,
        "stroke_count": 10,
        "mnemonic": "Travelers carrying flags on a journey.",
        "example_words_json": json.dumps([
            {"word": "旅行", "reading": "りょこう", "meaning": "travel / trip"},
            {"word": "一人旅", "reading": "ひとりたび", "meaning": "solo trip"}
        ])
    },

    # N3 Kanji
    {
        "kanji": "選",
        "meaning": "choose / select",
        "onyomi": "セン",
        "kunyomi": "えら.ぶ",
        "jlpt_level": "N3",
        "grade": 4,
        "stroke_count": 15,
        "mnemonic": "Walking down the road to make a choice.",
        "example_words_json": json.dumps([
            {"word": "選手", "reading": "せんしゅ", "meaning": "athlete / player"},
            {"word": "選択", "reading": "せんたく", "meaning": "selection / choice"}
        ])
    },

    # N2 Kanji
    {
        "kanji": "創",
        "meaning": "create / originate",
        "onyomi": "ソウ, ショウ",
        "kunyomi": "つく.る",
        "jlpt_level": "N2",
        "grade": 6,
        "stroke_count": 12,
        "mnemonic": "Using a knife to carve out a new creation.",
        "example_words_json": json.dumps([
            {"word": "創造", "reading": "そうぞう", "meaning": "creation"},
            {"word": "創立", "reading": "そうりつ", "meaning": "establishment"}
        ])
    },

    # N1 Kanji
    {
        "kanji": "覇",
        "meaning": "hegemony / supremacy",
        "onyomi": "ハ, ハク",
        "kunyomi": "はと.ばろ",
        "jlpt_level": "N1",
        "grade": 8,
        "stroke_count": 19,
        "mnemonic": "Moon and rain over a ruler's supreme domain.",
        "example_words_json": json.dumps([
            {"word": "制覇", "reading": "せいは", "meaning": "conquest / mastery"},
            {"word": "覇者", "reading": "はしゃ", "meaning": "supreme champion"}
        ])
    }
]
