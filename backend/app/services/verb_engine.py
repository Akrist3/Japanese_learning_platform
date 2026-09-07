from typing import Dict

def conjugate_verb(verb_dict: str, verb_group: str) -> Dict[str, str]:
    """
    Conjugates a Japanese verb into 15+ standard forms.
    verb_group: 'godan', 'ichidan', 'irregular'
    """
    results = {}
    
    # Handle Irregular Verbs (する, くる)
    if verb_group == "irregular":
        if "する" in verb_dict:
            base = verb_dict[:-2]
            results = {
                "dictionary": verb_dict,
                "masu": base + "します",
                "masu_negative": base + "しません",
                "nai": base + "しない",
                "te": base + "して",
                "ta": base + "した",
                "past_negative": base + "しなかった",
                "potential": base + "できる",
                "passive": base + "される",
                "causative": base + "させる",
                "causative_passive": base + "させられる",
                "volitional": base + "しよう",
                "conditional_ba": base + "すれば",
                "imperative": base + "しろ",
                "prohibitive": verb_dict + "な"
            }
        elif "来る" in verb_dict or "くる" in verb_dict:
            kanji_mode = "来る" in verb_dict
            k_kuru = "来" if kanji_mode else "く"
            k_ki = "来" if kanji_mode else "き"
            k_ko = "来" if kanji_mode else "こ"
            
            results = {
                "dictionary": verb_dict,
                "masu": k_ki + "ます",
                "masu_negative": k_ki + "ません",
                "nai": k_ko + "ない",
                "te": k_ki + "て",
                "ta": k_ki + "た",
                "past_negative": k_ko + "なかった",
                "potential": k_ko + "られる",
                "passive": k_ko + "られる",
                "causative": k_ko + "させる",
                "causative_passive": k_ko + "させられる",
                "volitional": k_ko + "よう",
                "conditional_ba": k_kuru + "れば",
                "imperative": k_ko + "い",
                "prohibitive": verb_dict + "な"
            }
        return results

    # Ichidan Verbs (ends with る, stem ends in e/i)
    if verb_group == "ichidan":
        stem = verb_dict[:-1]
        results = {
            "dictionary": verb_dict,
            "masu": stem + "ます",
            "masu_negative": stem + "ません",
            "nai": stem + "ない",
            "te": stem + "て",
            "ta": stem + "た",
            "past_negative": stem + "なかった",
            "potential": stem + "られる",
            "passive": stem + "られる",
            "causative": stem + "させる",
            "causative_passive": stem + "させられる",
            "volitional": stem + "よう",
            "conditional_ba": stem + "れば",
            "imperative": stem + "ろ",
            "prohibitive": verb_dict + "な"
        }
        return results

    # Godan Verbs
    last_char = verb_dict[-1]
    stem = verb_dict[:-1]

    # Vowel mappings for Godan ending characters
    # u -> i (masu), a (nai), e (potential/imperative), o (volitional)
    godan_table = {
        "う": {"i": "い", "a": "わ", "e": "え", "o": "おう", "te": "った", "t_e": "って"},
        "つ": {"i": "ち", "a": "た", "e": "て", "o": "とう", "te": "った", "t_e": "って"},
        "る": {"i": "り", "a": "ら", "e": "れ", "o": "ろう", "te": "った", "t_e": "って"},
        "む": {"i": "み", "a": "ま", "e": "め", "o": "もう", "te": "んだ", "t_e": "んで"},
        "ぶ": {"i": "び", "a": "ば", "e": "べ", "o": "ぼう", "te": "んだ", "t_e": "んで"},
        "ぬ": {"i": "に", "a": "な", "e": "ね", "o": "のう", "te": "んだ", "t_e": "んで"},
        "く": {"i": "き", "a": "か", "e": "け", "o": "こう", "te": "いた", "t_e": "いて"},
        "ぐ": {"i": "ぎ", "a": "が", "e": "げ", "o": "ごう", "te": "いだ", "t_e": "いで"},
        "す": {"i": "し", "a": "さ", "e": "せ", "o": "そう", "te": "した", "t_e": "して"}
    }

    # Exception for 行く / いく
    if verb_dict in ["行く", "いく"]:
        te_form = stem + "いて" if "いく" in verb_dict else "行っと"
        ta_form = stem + "いた" if "いく" in verb_dict else "行った"
        te_form = "行って" if verb_dict == "行く" else "いって"
        ta_form = "行った" if verb_dict == "行く" else "いった"
        
        m = godan_table[last_char]
        results = {
            "dictionary": verb_dict,
            "masu": stem + m["i"] + "ます",
            "masu_negative": stem + m["i"] + "ません",
            "nai": stem + m["a"] + "ない",
            "te": te_form,
            "ta": ta_form,
            "past_negative": stem + m["a"] + "なかった",
            "potential": stem + m["e"] + "る",
            "passive": stem + m["a"] + "れる",
            "causative": stem + m["a"] + "せる",
            "causative_passive": stem + m["a"] + "せられる",
            "volitional": stem + m["o"],
            "conditional_ba": stem + m["e"] + "ば",
            "imperative": stem + m["e"],
            "prohibitive": verb_dict + "な"
        }
        return results

    if last_char in godan_table:
        m = godan_table[last_char]
        results = {
            "dictionary": verb_dict,
            "masu": stem + m["i"] + "ます",
            "masu_negative": stem + m["i"] + "ません",
            "nai": stem + m["a"] + "ない",
            "te": stem + m["t_e"],
            "ta": stem + m["te"],
            "past_negative": stem + m["a"] + "なかった",
            "potential": stem + m["e"] + "る",
            "passive": stem + m["a"] + "れる",
            "causative": stem + m["a"] + "せる",
            "causative_passive": stem + m["a"] + "せられる",
            "volitional": stem + m["o"],
            "conditional_ba": stem + m["e"] + "ば",
            "imperative": stem + m["e"],
            "prohibitive": verb_dict + "na" if verb_dict.isalpha() else verb_dict + "な"
        }

    return results

def check_conjugation(verb_dict: str, verb_group: str, target_form: str, user_answer: str) -> dict:
    conjugated_dict = conjugate_verb(verb_dict, verb_group)
    expected = conjugated_dict.get(target_form, "").strip()
    is_correct = user_answer.strip() == expected
    
    return {
        "correct": is_correct,
        "expected": expected,
        "user_answer": user_answer,
        "target_form": target_form,
        "all_forms": conjugated_dict
    }
