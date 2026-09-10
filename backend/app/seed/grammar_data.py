import json

GRAMMAR_DATA = [
    # =========================
    # N5 Grammar
    # =========================
    {
        "point": "です / だ (Desu / Da)",
        "meaning": "To be (am / is / are)",
        "formation": "Noun / Na-adjective + です (polite) / だ (plain)",
        "explanation": "です is the polite copula used to identify or describe something. だ is the plain form.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "わたしは学生です。", "english": "I am a student."},
            {"japanese": "これは本です。", "english": "This is a book."},
            {"japanese": "ここは静かです。", "english": "This place is quiet."}
        ]),
        "similar_grammar": "である",
        "common_mistakes": "Do not use です directly after a verb in the plain form. With い-adjectives, です is added to make the sentence polite."
    },
    {
        "point": "は (Wa) - Topic Marker",
        "meaning": "As for... / Topic marker",
        "formation": "Noun + は",
        "explanation": "は marks the topic of the sentence. Although written は, it is pronounced 'wa' when used as a particle.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "田中さんは先生です。", "english": "As for Mr. Tanaka, he is a teacher."},
            {"japanese": "今日は暑いです。", "english": "Today is hot."},
            {"japanese": "私は日本人です。", "english": "I am Japanese."}
        ]),
        "similar_grammar": "が (Ga)",
        "common_mistakes": "Do not confuse は with が. は introduces the topic, while が commonly identifies or emphasizes the subject."
    },
    {
        "point": "が (Ga) - Subject Marker",
        "meaning": "Subject marker / Emphasis",
        "formation": "Noun + が",
        "explanation": "が marks the grammatical subject and is often used when identifying or emphasizing who or what performs an action or has a property.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "だれが来ましたか。", "english": "Who came?"},
            {"japanese": "雨が降っています。", "english": "It is raining."},
            {"japanese": "猫がいます。", "english": "There is a cat."}
        ]),
        "similar_grammar": "は (Wa)",
        "common_mistakes": "Use が rather than は when directly identifying an unknown subject with question words such as だれ or なに."
    },
    {
        "point": "を (Wo/O) - Direct Object Marker",
        "meaning": "Direct object marker",
        "formation": "Noun + を + Transitive Verb",
        "explanation": "を marks the direct object that receives the action of a transitive verb. It is usually pronounced 'o'.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "パンを食べます。", "english": "I eat bread."},
            {"japanese": "日本語を勉強します。", "english": "I study Japanese."},
            {"japanese": "映画を見ます。", "english": "I watch a movie."}
        ]),
        "similar_grammar": "に (Ni)",
        "common_mistakes": "Do not use を as the normal object marker with intransitive verbs such as ある or いる."
    },
    {
        "point": "に (Ni) - Time / Destination / Existence",
        "meaning": "At / On / To / In",
        "formation": "Time / Place + に",
        "explanation": "に has several basic uses, including marking a specific time, destination, or the location where something exists.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "七時に起きます。", "english": "I wake up at seven."},
            {"japanese": "学校に行きます。", "english": "I go to school."},
            {"japanese": "机の上に本があります。", "english": "There is a book on the desk."}
        ]),
        "similar_grammar": "で (De)",
        "common_mistakes": "Do not automatically translate に as 'in' or 'at'. Its meaning depends on whether it marks time, destination, or existence."
    },
    {
        "point": "で (De) - Location of Action",
        "meaning": "At / In / By means of",
        "formation": "Place + で + Action",
        "explanation": "で marks the place where an action occurs. It can also indicate a means or method.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "図書館で勉強します。", "english": "I study at the library."},
            {"japanese": "学校で日本語を話します。", "english": "I speak Japanese at school."},
            {"japanese": "バスで行きます。", "english": "I go by bus."}
        ]),
        "similar_grammar": "に (Ni)",
        "common_mistakes": "Use で for an action location, but use に for a destination or the location where something exists."
    },
    {
        "point": "へ (E) - Direction / Destination",
        "meaning": "Toward / To",
        "formation": "Place + へ + Movement Verb",
        "explanation": "へ marks the direction or destination toward which someone or something moves. It is pronounced 'e'.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "日本へ行きます。", "english": "I am going to Japan."},
            {"japanese": "学校へ行きました。", "english": "I went to school."},
            {"japanese": "家へ帰ります。", "english": "I return home."}
        ]),
        "similar_grammar": "に (Ni)",
        "common_mistakes": "へ is used with movement toward a destination. It emphasizes direction rather than the exact arrival point."
    },
    {
        "point": "も (Mo) - Also / Too",
        "meaning": "Also / Too / As well",
        "formation": "Noun + も",
        "explanation": "も replaces particles such as は or が to indicate that something is also true.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "私も学生です。", "english": "I am also a student."},
            {"japanese": "田中さんも来ます。", "english": "Mr. Tanaka will also come."},
            {"japanese": "これもおいしいです。", "english": "This is delicious too."}
        ]),
        "similar_grammar": "は (Wa)",
        "common_mistakes": "Do not use も together with は in the same basic position. も generally replaces the topic or subject particle."
    },
    {
        "point": "の (No) - Possession / Relationship",
        "meaning": "Of / Possessive / Relationship",
        "formation": "Noun + の + Noun",
        "explanation": "の connects nouns and can show possession, belonging, origin, or another relationship between nouns.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "これは私の本です。", "english": "This is my book."},
            {"japanese": "日本の車です。", "english": "It is a Japanese car."},
            {"japanese": "学校の先生です。", "english": "He/She is a school teacher."}
        ]),
        "similar_grammar": "の as nominalizer",
        "common_mistakes": "The noun after の is normally the thing being described or possessed: 私の本 means 'my book', not 'book my'."
    },
    {
        "point": "と (To) - And / With / Quotation",
        "meaning": "And / With / Quotation",
        "formation": "Noun + と + Noun / Person + と + Verb / Quote + と",
        "explanation": "と can connect nouns in a complete list, indicate doing something with someone, or mark a quotation.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "パンとご飯を食べます。", "english": "I eat bread and rice."},
            {"japanese": "友達と話します。", "english": "I talk with my friend."},
            {"japanese": "「ありがとう」と言いました。", "english": "I said, 'Thank you.'"}
        ]),
        "similar_grammar": "や (Ya)",
        "common_mistakes": "と usually gives a complete list, while や gives examples from a larger or incomplete list."
    },
    {
        "point": "から / まで (Kara / Made) - From / Until",
        "meaning": "From / Until / Up to",
        "formation": "Time / Place + から + Time / Place + まで",
        "explanation": "から marks a starting point and まで marks an endpoint.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "九時から五時まで働きます。", "english": "I work from nine to five."},
            {"japanese": "東京から大阪まで行きます。", "english": "I go from Tokyo to Osaka."},
            {"japanese": "月曜日から金曜日まで学校があります。", "english": "There is school from Monday to Friday."}
        ]),
        "similar_grammar": "より",
        "common_mistakes": "から marks the beginning point, while まで marks the ending point. They can also be used independently."
    },
    {
        "point": "あります / います (Arimasu / Imasu)",
        "meaning": "There is / There are",
        "formation": "Place に + Thing が あります / Person or Animal が います",
        "explanation": "あります is used for inanimate things, while います is used for people and animals.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "机の上に本があります。", "english": "There is a book on the desk."},
            {"japanese": "教室に先生がいます。", "english": "There is a teacher in the classroom."},
            {"japanese": "公園に犬がいます。", "english": "There is a dog in the park."}
        ]),
        "similar_grammar": "に / が",
        "common_mistakes": "Do not normally use あります for people or animals. Use います for living beings."
    },
    {
        "point": "これ / それ / あれ (Kore / Sore / Are)",
        "meaning": "This / That / That over there",
        "formation": "これ = this near speaker; それ = that near listener; あれ = that far from both",
        "explanation": "These demonstrative pronouns refer to objects without directly naming them.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "これは何ですか。", "english": "What is this?"},
            {"japanese": "それは本です。", "english": "That is a book."},
            {"japanese": "あれは山です。", "english": "That over there is a mountain."}
        ]),
        "similar_grammar": "この / その / あの",
        "common_mistakes": "これ, それ, and あれ can stand alone. Use この, その, and あの directly before a noun."
    },
    {
        "point": "この / その / あの (Kono / Sono / Ano)",
        "meaning": "This / That / That ... + noun",
        "formation": "この / その / あの + Noun",
        "explanation": "These words modify a noun and indicate the location of the noun relative to the speaker and listener.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "この本はおもしろいです。", "english": "This book is interesting."},
            {"japanese": "その車は新しいです。", "english": "That car is new."},
            {"japanese": "あの人は先生です。", "english": "That person over there is a teacher."}
        ]),
        "similar_grammar": "これ / それ / あれ",
        "common_mistakes": "Do not use この, その, or あの by themselves. They must normally be followed by a noun."
    },
    {
        "point": "から (Kara) - Reason / Because",
        "meaning": "Because / Since",
        "formation": "Clause + から",
        "explanation": "から gives a reason or explanation for the statement that follows.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "暑いから、窓を開けます。", "english": "Because it is hot, I will open the window."},
            {"japanese": "雨だから、出かけません。", "english": "Because it is raining, I will not go out."},
            {"japanese": "時間がないから、急ぎます。", "english": "Because I don't have time, I will hurry."}
        ]),
        "similar_grammar": "ので",
        "common_mistakes": "The clause before から gives the reason. Do not treat から here as the same から used for 'from'."
    },
    {
        "point": "たい (Tai) - Want to Do",
        "meaning": "Want to do",
        "formation": "Verb stem + たい",
        "explanation": "たい expresses the speaker's desire to perform an action.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "日本へ行きたいです。", "english": "I want to go to Japan."},
            {"japanese": "寿司を食べたいです。", "english": "I want to eat sushi."},
            {"japanese": "日本語を勉強したいです。", "english": "I want to study Japanese."}
        ]),
        "similar_grammar": "ほしい",
        "common_mistakes": "たい attaches to the verb stem, not the dictionary form. For example, 食べます → 食べたい."
    },
    {
        "point": "て-form + ください (Te-form + Kudasai)",
        "meaning": "Please do...",
        "formation": "Verb て-form + ください",
        "explanation": "This pattern politely asks someone to perform an action.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "ここに名前を書いてください。", "english": "Please write your name here."},
            {"japanese": "ちょっと待ってください。", "english": "Please wait a moment."},
            {"japanese": "見てください。", "english": "Please look."}
        ]),
        "similar_grammar": "て-form + いる",
        "common_mistakes": "The verb must be changed to its て-form before ください."
    },
    {
        "point": "て-form + いる (Te-form + Iru)",
        "meaning": "Continuous action / Resulting state",
        "formation": "Verb て-form + いる / います",
        "explanation": "ている can express an action in progress or a state resulting from a completed action, depending on the verb.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "今、本を読んでいます。", "english": "I am reading a book now."},
            {"japanese": "田中さんは結婚しています。", "english": "Mr. Tanaka is married."},
            {"japanese": "雨が降っています。", "english": "It is raining."}
        ]),
        "similar_grammar": "て-form + ある",
        "common_mistakes": "Do not assume ている always means '-ing'. With some verbs it describes a resulting state."
    },
    {
        "point": "ない (Nai) - Negative Form",
        "meaning": "Do not / Not",
        "formation": "Verb ない-form",
        "explanation": "The ない-form is the basic plain negative form of Japanese verbs.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "今日は学校へ行かない。", "english": "I will not go to school today."},
            {"japanese": "肉を食べない。", "english": "I do not eat meat."},
            {"japanese": "テレビを見ない。", "english": "I do not watch TV."}
        ]),
        "similar_grammar": "ません",
        "common_mistakes": "ません is polite negative, while ない is the plain negative form."
    },
    {
        "point": "た (Ta) - Past Plain Form",
        "meaning": "Did / Was / Were",
        "formation": "Verb た-form",
        "explanation": "The た-form expresses completed actions or past events in plain style.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "昨日映画を見た。", "english": "I watched a movie yesterday."},
            {"japanese": "ご飯を食べた。", "english": "I ate a meal."},
            {"japanese": "東京へ行った。", "english": "I went to Tokyo."}
        ]),
        "similar_grammar": "ました",
        "common_mistakes": "Do not confuse the plain past た-form with the polite past form ました."
    },
    {
        "point": "たり〜たりする (Tari...Tari Suru)",
        "meaning": "Do things such as...",
        "formation": "Verb た-form + り + Verb た-form + り + します",
        "explanation": "This pattern lists representative actions rather than every action performed.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "週末は映画を見たり、本を読んだりします。", "english": "On weekends, I do things like watch movies and read books."},
            {"japanese": "日曜日に掃除したり、料理したりします。", "english": "On Sunday, I do things like clean and cook."}
        ]),
        "similar_grammar": "や",
        "common_mistakes": "Use た-form before り. The final する or します completes the pattern."
    },
    {
        "point": "ことができる (Koto ga Dekiru)",
        "meaning": "Can do / Be able to do",
        "formation": "Verb dictionary form + ことができる",
        "explanation": "Expresses ability or possibility to perform an action.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "日本語を話すことができます。", "english": "I can speak Japanese."},
            {"japanese": "漢字を読むことができます。", "english": "I can read kanji."},
            {"japanese": "ここで写真を撮ることができます。", "english": "You can take pictures here."}
        ]),
        "similar_grammar": "Potential Form",
        "common_mistakes": "Use the dictionary form before ことができる, not the ます-form."
    },

    # =========================
    # N4 Grammar
    # =========================
    {
        "point": "〜ことにする (Koto ni suru)",
        "meaning": "Decide to do...",
        "formation": "Verb dictionary form / ない-form + ことにする",
        "explanation": "Indicates a personal decision or choice.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "毎日早起きすることにしました。", "english": "I decided to wake up early every day."},
            {"japanese": "今日は出かけないことにします。", "english": "I will decide not to go out today."}
        ]),
        "similar_grammar": "ことになる",
        "common_mistakes": "ことにする expresses a decision made by someone, while ことになる commonly describes an external decision or established result."
    },
    {
        "point": "〜と思う (To Omou)",
        "meaning": "I think / I believe",
        "formation": "Plain form + と思う",
        "explanation": "Used to express an opinion, thought, or belief.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "明日は雨だと思います。", "english": "I think it will rain tomorrow."},
            {"japanese": "日本語は難しいと思います。", "english": "I think Japanese is difficult."}
        ]),
        "similar_grammar": "と思っている",
        "common_mistakes": "Use the appropriate plain form before と思う, including だ for nouns and na-adjectives."
    },
    {
        "point": "〜なければならない (Nakereba Naranai)",
        "meaning": "Must / Have to",
        "formation": "Verb ない-form without い + ければならない",
        "explanation": "Expresses obligation or necessity.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "宿題をしなければなりません。", "english": "I must do my homework."},
            {"japanese": "明日早く起きなければなりません。", "english": "I have to wake up early tomorrow."}
        ]),
        "similar_grammar": "なくてもいい",
        "common_mistakes": "Do not use the full ない-form unchanged before ければ. For example, 行かない → 行かなければ."
    },
    {
        "point": "〜てもいい (Temo Ii)",
        "meaning": "May / It is okay to...",
        "formation": "Verb て-form + もいい",
        "explanation": "Used to give or ask for permission.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "ここに座ってもいいですか。", "english": "May I sit here?"},
            {"japanese": "写真を撮ってもいいです。", "english": "It is okay to take pictures."}
        ]),
        "similar_grammar": "てはいけない",
        "common_mistakes": "Use てもいい for permission, not prohibition."
    },
    {
        "point": "〜てはいけない (Te wa Ikenai)",
        "meaning": "Must not / Cannot",
        "formation": "Verb て-form + はいけない",
        "explanation": "Expresses prohibition or that an action is not allowed.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "ここで写真を撮ってはいけません。", "english": "You must not take pictures here."},
            {"japanese": "この部屋に入ってはいけません。", "english": "You must not enter this room."}
        ]),
        "similar_grammar": "てもいい",
        "common_mistakes": "Do not confuse prohibition てはいけない with permission てもいい."
    },
    {
        "point": "〜たことがある (Ta Koto ga Aru)",
        "meaning": "Have experienced doing...",
        "formation": "Verb た-form + ことがある",
        "explanation": "Describes an experience that has happened at least once in the past.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "日本へ行ったことがあります。", "english": "I have been to Japan."},
            {"japanese": "寿司を食べたことがあります。", "english": "I have eaten sushi before."}
        ]),
        "similar_grammar": "たことがない",
        "common_mistakes": "Use the た-form before ことがある when talking about past experience."
    },
    {
        "point": "〜ながら (Nagara)",
        "meaning": "While doing...",
        "formation": "Verb stem + ながら + Main action",
        "explanation": "Indicates that two actions happen at the same time, with the second action as the main one.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "音楽を聞きながら勉強します。", "english": "I study while listening to music."},
            {"japanese": "歩きながら話しました。", "english": "I talked while walking."}
        ]),
        "similar_grammar": "間に",
        "common_mistakes": "Use the verb stem before ながら, not the dictionary or ます form."
    },
    {
        "point": "〜そうです (Sou desu) - Looks Like",
        "meaning": "Looks like / Seems",
        "formation": "Verb stem / い-adjective stem / な-adjective + そうです",
        "explanation": "Expresses an appearance or impression based on what the speaker sees.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "雨が降りそうです。", "english": "It looks like it will rain."},
            {"japanese": "この料理はおいしそうです。", "english": "This food looks delicious."}
        ]),
        "similar_grammar": "そうです - hearsay",
        "common_mistakes": "Do not confuse appearance そうです with hearsay そうです, which follows a plain form."
    },
    {
        "point": "〜すぎる (Sugiru)",
        "meaning": "Too much / Too...",
        "formation": "Verb stem / い-adjective stem / な-adjective + すぎる",
        "explanation": "Indicates that something exceeds an appropriate or expected degree.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "食べすぎました。", "english": "I ate too much."},
            {"japanese": "このかばんは高すぎます。", "english": "This bag is too expensive."}
        ]),
        "similar_grammar": "あまり〜ない",
        "common_mistakes": "Remove い from an い-adjective before adding すぎる: 高い → 高すぎる."
    },
    {
        "point": "〜ほうがいい (Hou ga Ii)",
        "meaning": "It is better to...",
        "formation": "Verb た-form / ない-form + ほうがいい",
        "explanation": "Used to give advice or recommend one choice over another.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "もっと勉強したほうがいいです。", "english": "You should study more."},
            {"japanese": "無理しないほうがいいです。", "english": "You should not overdo it."}
        ]),
        "similar_grammar": "べき",
        "common_mistakes": "Use た-form for positive advice and ない-form for negative advice."
    }
]

if __name__ == "__main__":
    print(f"Grammar entries: {len(GRAMMAR_DATA)}")
    levels = {}
    for item in GRAMMAR_DATA:
        levels[item["jlpt_level"]] = levels.get(item["jlpt_level"], 0) + 1
    print("By JLPT level:", levels)
