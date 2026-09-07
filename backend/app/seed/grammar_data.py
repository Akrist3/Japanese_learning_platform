import json

GRAMMAR_DATA = [
    {
        "point": "です / だ (Desu / Da)",
        "meaning": "To be (am / is / are)",
        "formation": "Noun / Na-adjective + です (polite) / だ (plain)",
        "explanation": "Desu is the polite copula in Japanese used to state that something is equal to something else.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "わたしは学生です。", "english": "I am a student."},
            {"japanese": "ここは静かです。", "english": "This place is quiet."}
        ]),
        "similar_grammar": "である",
        "common_mistakes": "Do not add です after い-adjectives that already end with desu or plain form verbs directly without nominalizers."
    },
    {
        "point": "は (Wa) - Topic Marker",
        "meaning": "As for... / Topic marker",
        "formation": "Noun + は",
        "explanation": "Marks the topic of the sentence. Pronounced 'wa' when used as a particle.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "田中さんは先生です。", "english": "As for Mr. Tanaka, he is a teacher."},
            {"japanese": "今日は暑いです。", "english": "Today is hot."}
        ]),
        "similar_grammar": "が (Ga)",
        "common_mistakes": "Confusing は (topic, known information) with が (subject, new information)."
    },
    {
        "point": "が (Ga) - Subject Marker",
        "meaning": "Subject marker / Emphasis",
        "formation": "Noun + が",
        "explanation": "Marks the specific subject performing an action or possessing a trait.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "だれが来ましたか。", "english": "Who came?"},
            {"japanese": "雨が降っています。", "english": "It is raining."}
        ]),
        "similar_grammar": "は (Wa)",
        "common_mistakes": "Using は when identifying an unknown subject in a question word (e.g. だれが vs だれは)."
    },
    {
        "point": "を (Wo/O) - Direct Object Marker",
        "meaning": "Direct object marker",
        "formation": "Noun + を + Transitive Verb",
        "explanation": "Marks the direct object that receives the action of a transitive verb.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "パンを食べます。", "english": "I eat bread."},
            {"japanese": "日本語を勉強します。", "english": "I study Japanese."}
        ]),
        "similar_grammar": "に (Ni)",
        "common_mistakes": "Using を with intransitive verbs like 行く or ある."
    },
    {
        "point": "に vs で (Ni vs De) - Location Particles",
        "meaning": "At / In / To (Target vs Action location)",
        "formation": "Location + に (Existence/Destination) vs Location + で (Action)",
        "explanation": "に specifies where something exists (あります/います) or moves to (行きます). で specifies where an active event or action takes place.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "図書館に本があります。", "english": "There is a book in the library."},
            {"japanese": "図書館で勉強します。", "english": "I study at the library."}
        ]),
        "similar_grammar": "へ (He)",
        "common_mistakes": "Using で with あります/います or に with active action verbs like 食べる/遊ぶ."
    },
    {
        "point": "て-form + いる (Te-form + Iru)",
        "meaning": "Continuous action / Resulting state (-ing)",
        "formation": "Verb (て-form) + いる / います",
        "explanation": "Expresses an ongoing progressive action or a state resulting from a past action.",
        "jlpt_level": "N5",
        "example_sentences_json": json.dumps([
            {"japanese": "今、本を読んでいます。", "english": "I am reading a book now."},
            {"japanese": "田中さんは結婚しています。", "english": "Mr. Tanaka is married."}
        ]),
        "similar_grammar": "て-form + ある",
        "common_mistakes": "Forgetting that verbs of movement (行く, 来る) in ている mean 'has gone and is currently there'."
    },

    # N4 Grammar
    {
        "point": "〜ことができる (Koto ga dekiru)",
        "meaning": "Can do / Able to do",
        "formation": "Verb (Dictionary form) + ことができる",
        "explanation": "Expresses potential or ability to perform an action.",
        "jlpt_level": "N4",
        "example_sentences_json": json.dumps([
            {"japanese": "日本語を話すことができます。", "english": "I can speak Japanese."}
        ]),
        "similar_grammar": "Potential Form (られる)",
        "common_mistakes": "Using past tense before ことができる."
    },

    # N3 Grammar
    {
        "point": "〜ことにする (Koto ni suru)",
        "meaning": "Decide to do...",
        "formation": "Verb (Dictionary / Nai form) + ことにする",
        "explanation": "Indicates a conscious personal decision made by the speaker.",
        "jlpt_level": "N3",
        "example_sentences_json": json.dumps([
            {"japanese": "毎日早起きすることにしました。", "english": "I decided to wake up early every day."}
        ]),
        "similar_grammar": "〜ことになる (Koto ni naru)",
        "common_mistakes": "Confusing ことにする (personal choice) with ことになる (external decision/rule)."
    },

    # N2 Grammar
    {
        "point": "〜にともなって (Ni tomonatte)",
        "meaning": "As... / Along with...",
        "formation": "Noun / Verb (Dictionary form) + にともなって",
        "explanation": "Indicates that as one change occurs, another change takes place simultaneously.",
        "jlpt_level": "N2",
        "example_sentences_json": json.dumps([
            {"japanese": "人口の減少に伴って、問題が増えている。", "english": "Along with population decline, issues are increasing."}
        ]),
        "similar_grammar": "〜につれて",
        "common_mistakes": "Using with static non-changing states."
    },

    # N1 Grammar
    {
        "point": "〜を皮切りに (Wo kawakiri ni)",
        "meaning": "Starting with / Beginning with...",
        "formation": "Noun + を皮切りにして / を皮切りに",
        "explanation": "Expresses that one major event triggered a series of consecutive events.",
        "jlpt_level": "N1",
        "example_sentences_json": json.dumps([
            {"japanese": "東京公演を皮切りに、全国ツアーが始まる。", "english": "Starting with the Tokyo concert, the nationwide tour begins."}
        ]),
        "similar_grammar": "〜を筆頭に",
        "common_mistakes": "Using for negative or isolated single occurrences."
    }
]
