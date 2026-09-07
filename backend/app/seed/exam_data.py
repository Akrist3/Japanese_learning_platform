import json

EXAM_DATA = [
    {
        "title": "JLPT N5 Full Practice Exam 1",
        "jlpt_level": "N5",
        "duration_minutes": 60,
        "total_questions": 10,
        "questions_json": json.dumps([
            {
                "id": 1,
                "section": "Vocabulary",
                "question": "「あした」の漢字はどれですか。",
                "options": ["明日", "昨日", "今日", "来日"],
                "correct_option": 0,
                "explanation": "明日 is read as あした (tomorrow). 昨日 is 昨日 (yesterday) and 今日 is きょう (today)."
            },
            {
                "id": 2,
                "section": "Vocabulary",
                "question": "毎朝、コーヒーを（　）ます。",
                "options": ["のん", "のんびり", "のみ", "のま"],
                "correct_option": 2,
                "explanation": "The polite ます-form stem of 飲む (to drink) is のみ."
            },
            {
                "id": 3,
                "section": "Grammar",
                "question": "わたしは図書館（ controversy ）勉強します。",
                "options": ["に", "で", "を", "へ"],
                "correct_option": 1,
                "explanation": "で is used for the location where an action (勉強する) takes place."
            },
            {
                "id": 4,
                "section": "Grammar",
                "question": "りんご（　）みかんを買いました。",
                "options": ["と", "が", "は", "に"],
                "correct_option": 0,
                "explanation": "と is used to connect nouns ('and'): apples and oranges."
            },
            {
                "id": 5,
                "section": "Grammar",
                "question": "正しい文を選んでください：",
                "options": [
                    "毎日日本語を勉強します。",
                    "毎日日本語が勉強します。",
                    "毎日日本語に勉強します。",
                    "毎日日本語で勉強します。"
                ],
                "correct_option": 0,
                "explanation": "勉強する takes direct object を particle."
            },
            {
                "id": 6,
                "section": "Reading",
                "question": "文章を読んで答えてください：\n「田中さんは毎朝７時に起きます。朝ご飯を食べてから、電車で会社へ行きます。」\n\n質問：田中さんはどうやって会社へ行きますか。",
                "options": ["歩いて", "バスで", "電車で", "自転車で"],
                "correct_option": 2,
                "explanation": "The text states 電車で会社へ行きます (goes to company by train)."
            },
            {
                "id": 7,
                "section": "Reading",
                "question": "質問：田中さんは何時に起きますか。",
                "options": ["６時", "７時", "８時", "９時"],
                "correct_option": 1,
                "explanation": "The text explicitly says 毎朝７時に起きます."
            },
            {
                "id": 8,
                "section": "Listening",
                "question": "音声の質問：男の人と女の人が話しています。女の人は何を購入しますか。\n\n「男：いらっしゃいませ。りんごはおいしいですよ。\n女：じゃあ、りんごを２つください。」",
                "options": ["みかん１つ", "りんご２つ", "バナナ３つ", "パン１つ"],
                "correct_option": 1,
                "explanation": "The woman says りんごを２つください (2 apples please)."
            },
            {
                "id": 9,
                "section": "Particles",
                "question": "「机の（　）に本があります。」",
                "options": ["上", "中", "下", "横"],
                "correct_option": 0,
                "explanation": "机の上に本があります means 'There is a book on top of the desk'."
            },
            {
                "id": 10,
                "section": "Verbs",
                "question": "「食べる」の過去形（Plain Past）はどれですか。",
                "options": ["食べた", "食べて", "食べない", "食べます"],
                "correct_option": 0,
                "explanation": "The plain past form of 食べる is 食べた."
            }
        ])
    },
    {
        "title": "JLPT N4 Practice Exam 1",
        "jlpt_level": "N4",
        "duration_minutes": 75,
        "total_questions": 5,
        "questions_json": json.dumps([
            {
                "id": 1,
                "section": "Grammar",
                "question": "雨が（　）そうだから、傘を持って行きましょう。",
                "options": ["降り", "降る", "降って", "降った"],
                "correct_option": 0,
                "explanation": "Verb stem + そう (looks like it will rain)."
            },
            {
                "id": 2,
                "section": "Reading",
                "question": "「来週のテストのために、毎日３時間復習することにした。」\n\n質問：この人は何を決めましたか。",
                "options": ["テストを休むこと", "毎日復習すること", "旅行に行くこと", "友達と遊ぶこと"],
                "correct_option": 1,
                "explanation": "〜ことにした means decided to review daily."
            }
        ])
    }
]
