"""
Grammar Engine
==============
A real, rule-based Japanese grammar analysis engine.

Unlike a naive keyword/substring matcher (e.g. `if "は" in text`), this module
actually tokenizes the input with a morphological analyzer (Janome) to get
part-of-speech tags, base (dictionary) forms, and conjugation info for every
token in the sentence, then runs a set of grammar rules against that
structured data.

This is still a *rule-based* engine (not a full statistical/LLM grammar
checker), but the rules operate on real linguistic structure instead of
raw substrings, so they generalize to sentences the original author never
anticipated.

Public API:
    analyze_sentence(text: str) -> dict
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Optional
from janome.tokenizer import Tokenizer

_tokenizer = Tokenizer()

# ---------------------------------------------------------------------------
# Reference data
# ---------------------------------------------------------------------------

# Verbs that are (almost) always intransitive and therefore should not be
# marked with を (the direct-object particle). This is one of the most
# common JLPT N5 mistakes and is explicitly called out in this project's own
# grammar seed data.
INTRANSITIVE_ONLY_VERBS = {
    "行く", "来る", "帰る", "ある", "いる", "なる", "着く", "咲く",
}

# Common transitive verbs, used only to give a more specific correction
# hint when we detect a を + intransitive-verb mistake.
TRANSITIVE_HINTS = {
    "行く": None,
    "来る": None,
    "帰る": None,
    "ある": "持つ (to have/hold)",
    "いる": None,
    "なる": None,
}

# Interrogative (question) words that overwhelmingly pair with が rather
# than は when they are the grammatical subject of the sentence.
QUESTION_WORDS = {"だれ", "誰", "どなた", "どこ", "いつ", "なに", "何", "どちら", "どの", "いくつ", "いくら"}

# English glosses for POS categories, used to build a readable breakdown.
POS_GLOSS = {
    "名詞": "noun",
    "動詞": "verb",
    "形容詞": "i-adjective",
    "形容動詞": "na-adjective",
    "助詞": "particle",
    "助動詞": "auxiliary",
    "副詞": "adverb",
    "連体詞": "adnominal",
    "接続詞": "conjunction",
    "感動詞": "interjection",
    "記号": "symbol",
    "接頭詞": "prefix",
    "フィラー": "filler",
}

CASE_PARTICLES = {"を", "が", "に", "で", "へ", "と", "から", "まで", "の"}

# を and が are "pure" case particles that (unlike に/で/と/から/まで) do not
# stack with topic/focus particles such as は or も. Adjacent pairs below are
# essentially always a mistake rather than a valid double-particle construction
# like には or からは.
INVALID_PARTICLE_PAIRS = {
    ("を", "は"), ("は", "を"),
    ("を", "が"), ("が", "を"),
    ("が", "は"), ("は", "が"),
    ("を", "も"), ("も", "を"),
    ("が", "も"), ("も", "が"),
    ("を", "を"), ("が", "が"),
}


@dataclass
class Token:
    surface: str
    pos: str
    pos_detail_1: str
    pos_detail_2: str
    conj_type: str
    conj_form: str
    base_form: str
    reading: str

    @property
    def gloss(self) -> str:
        return POS_GLOSS.get(self.pos, self.pos)


@dataclass
class Issue:
    severity: str  # "error" | "warning" | "info"
    message: str
    suggestion: Optional[str] = None


def _tokenize(text: str) -> List[Token]:
    tokens = []
    for t in _tokenizer.tokenize(text):
        # Janome's part_of_speech is a comma-joined string:
        # "名詞,代名詞,一般,*,*,*,私,ワタシ,ワタシ" style fields come from
        # .part_of_speech / .infl_type / .infl_form / .base_form / .reading
        pos_parts = t.part_of_speech.split(",")
        tokens.append(Token(
            surface=t.surface,
            pos=pos_parts[0],
            pos_detail_1=pos_parts[1] if len(pos_parts) > 1 else "*",
            pos_detail_2=pos_parts[2] if len(pos_parts) > 2 else "*",
            conj_type=t.infl_type or "*",
            conj_form=t.infl_form or "*",
            base_form=t.base_form or t.surface,
            reading=t.reading or t.surface,
        ))
    return tokens


def _contains_japanese(text: str) -> bool:
    for ch in text:
        code = ord(ch)
        if (0x3040 <= code <= 0x30FF) or (0x4E00 <= code <= 0x9FFF) or (0xFF66 <= code <= 0xFF9D):
            return True
    return False


# ---------------------------------------------------------------------------
# Individual grammar rules
# Each rule receives the full token list and appends Issue objects.
# ---------------------------------------------------------------------------

def _rule_wo_with_intransitive(tokens: List[Token], issues: List[Issue]) -> None:
    for i, tok in enumerate(tokens):
        if tok.pos == "助詞" and tok.surface == "を":
            # Look ahead for the next verb, skipping adverbs/nouns in between.
            for j in range(i + 1, len(tokens)):
                nxt = tokens[j]
                if nxt.pos == "動詞":
                    if nxt.base_form in INTRANSITIVE_ONLY_VERBS:
                        hint = TRANSITIVE_HINTS.get(nxt.base_form)
                        suggestion = f"Consider に or へ instead of を before {nxt.base_form}."
                        if hint:
                            suggestion += f" If you meant possession, the transitive verb is {hint}."
                        issues.append(Issue(
                            severity="error",
                            message=(
                                f"「を」is a direct-object marker for transitive verbs, but "
                                f"「{nxt.base_form}」is intransitive and doesn't take a direct object."
                            ),
                            suggestion=suggestion,
                        ))
                    break
                if nxt.pos in ("助詞", "記号"):
                    break


def _rule_question_word_wa(tokens: List[Token], issues: List[Issue]) -> None:
    for i, tok in enumerate(tokens):
        if tok.surface in QUESTION_WORDS and i + 1 < len(tokens):
            nxt = tokens[i + 1]
            if nxt.pos == "助詞" and nxt.surface == "は":
                issues.append(Issue(
                    severity="warning",
                    message=(
                        f"「{tok.surface}」is a question word asking for new/unknown information. "
                        f"These almost always pair with が rather than は, since は marks known/topic information."
                    ),
                    suggestion=f"Try 「{tok.surface}が...」instead of 「{tok.surface}は...」.",
                ))


def _rule_i_adjective_plus_da(tokens: List[Token], issues: List[Issue]) -> None:
    for i, tok in enumerate(tokens):
        if tok.pos == "形容詞" and i + 1 < len(tokens):
            nxt = tokens[i + 1]
            if nxt.base_form == "だ" and nxt.pos in ("助動詞",):
                issues.append(Issue(
                    severity="error",
                    message=(
                        f"い-adjectives like 「{tok.base_form}」already function as a predicate on their own "
                        f"and cannot be followed by だ."
                    ),
                    suggestion=f"Drop だ: 「{tok.surface}」(plain) or 「{tok.surface}です」(polite).",
                ))


def _rule_double_case_particle(tokens: List[Token], issues: List[Issue]) -> None:
    for i in range(len(tokens) - 1):
        a, b = tokens[i], tokens[i + 1]
        if a.pos == "助詞" and b.pos == "助詞" and (a.surface, b.surface) in INVALID_PARTICLE_PAIRS:
            issues.append(Issue(
                severity="error",
                message=f"「{a.surface}{b.surface}」— を and が don't combine with は/も/themselves like this.",
                suggestion=f"Use just one particle, e.g. drop 「{a.surface}」or drop 「{b.surface}」depending on what you mean to mark.",
            ))


def _rule_missing_particle(tokens: List[Token], issues: List[Issue]) -> None:
    for i in range(len(tokens) - 1):
        a, b = tokens[i], tokens[i + 1]
        if a.pos != "名詞" or b.pos != "動詞":
            continue
        # Skip valid noun+する compound verbs (サ変接続 nouns), e.g. 勉強する.
        if a.pos_detail_1 == "サ変接続" and b.base_form == "する":
            continue
        issues.append(Issue(
            severity="info",
            message=f"「{a.surface}」is directly followed by the verb 「{b.surface}」with no particle in between.",
            suggestion="Double-check whether a particle (を/が/に/で/と) is missing, e.g. 「{}を{}」.".format(a.surface, b.surface),
        ))


def _rule_dangling_particle_ending(tokens: List[Token], issues: List[Issue]) -> None:
    meaningful = [t for t in tokens if t.pos != "記号"]
    if not meaningful:
        return
    last = meaningful[-1]
    # Sentence-final particles (か, ね, よ, な, わ, さ, ぞ...) are a normal,
    # complete way to end a Japanese sentence — only flag other particles.
    if last.pos == "助詞" and "終助詞" not in last.pos_detail_1:
        issues.append(Issue(
            severity="warning",
            message=f"The sentence ends on the particle 「{last.surface}」, which usually means it's incomplete.",
            suggestion="Add a predicate (verb/adjective/だ・です) to finish the thought.",
        ))


def _rule_motion_verb_teiru_note(tokens: List[Token], issues: List[Issue]) -> None:
    for i, tok in enumerate(tokens):
        if tok.pos == "動詞" and tok.base_form in ("行く", "来る", "帰る") and i + 2 < len(tokens):
            if tokens[i + 1].surface == "て" and tokens[i + 2].base_form in ("いる", "います"):
                issues.append(Issue(
                    severity="info",
                    message=(
                        f"「{tok.base_form}て+いる」with a motion verb usually describes a resulting state "
                        f"(\"has gone/come and is currently there\"), not an action in progress."
                    ),
                ))


_RULES = [
    _rule_wo_with_intransitive,
    _rule_question_word_wa,
    _rule_i_adjective_plus_da,
    _rule_double_case_particle,
    _rule_missing_particle,
    _rule_dangling_particle_ending,
    _rule_motion_verb_teiru_note,
]


def analyze_sentence(text: str) -> dict:
    """
    Analyze a Japanese sentence and return a structured result:
    {
        "input": str,
        "is_japanese": bool,
        "tokens": [ {surface, reading, pos, gloss, base_form, conj_form}, ... ],
        "issues": [ {severity, message, suggestion}, ... ],
        "summary": str,   # human-readable explanation, ready to display
    }
    """
    text = text.strip()

    if not text:
        return {
            "input": text,
            "is_japanese": False,
            "tokens": [],
            "issues": [],
            "summary": "Please enter a sentence to check.",
        }

    if not _contains_japanese(text):
        return {
            "input": text,
            "is_japanese": False,
            "tokens": [],
            "issues": [],
            "summary": (
                "This doesn't look like Japanese text — try writing your sentence "
                "using hiragana, katakana, or kanji so I can analyze the particles and verb forms."
            ),
        }

    tokens = _tokenize(text)
    issues: List[Issue] = []
    for rule in _RULES:
        rule(tokens, issues)

    token_dicts = [
        {
            "surface": t.surface,
            "reading": t.reading,
            "pos": t.pos,
            "gloss": t.gloss,
            "base_form": t.base_form,
            "conj_form": t.conj_form if t.conj_form != "*" else None,
        }
        for t in tokens
    ]

    issue_dicts = [
        {"severity": i.severity, "message": i.message, "suggestion": i.suggestion}
        for i in issues
    ]

    summary = _build_summary(text, token_dicts, issue_dicts)

    return {
        "input": text,
        "is_japanese": True,
        "tokens": token_dicts,
        "issues": issue_dicts,
        "summary": summary,
    }


def _build_summary(text: str, token_dicts: list, issue_dicts: list) -> str:
    lines = [f"### Sentence Analysis: {text}", ""]

    errors = [i for i in issue_dicts if i["severity"] == "error"]
    warnings = [i for i in issue_dicts if i["severity"] == "warning"]
    infos = [i for i in issue_dicts if i["severity"] == "info"]

    if errors:
        lines.append("**Grammar issues found:**")
        for iss in errors:
            lines.append(f"- ❌ {iss['message']}")
            if iss["suggestion"]:
                lines.append(f"  → {iss['suggestion']}")
    elif warnings:
        lines.append("**Looks mostly correct, but worth double-checking:**")
        for iss in warnings:
            lines.append(f"- ⚠️ {iss['message']}")
            if iss["suggestion"]:
                lines.append(f"  → {iss['suggestion']}")
    else:
        lines.append("✅ No grammar errors detected in particle usage, verb transitivity, or adjective conjugation.")

    if infos:
        lines.append("")
        lines.append("**Notes:**")
        for iss in infos:
            lines.append(f"- ℹ️ {iss['message']}")
            if iss["suggestion"]:
                lines.append(f"  → {iss['suggestion']}")

    lines.append("")
    lines.append("**Word-by-word breakdown:**")
    for t in token_dicts:
        conj = f" ({t['conj_form']})" if t["conj_form"] else ""
        lines.append(f"- {t['surface']} 「{t['reading']}」 — {t['gloss']}{conj}, base form: {t['base_form']}")

    return "\n".join(lines)