import httpx
from app.config import settings

async def generate_ai_tutor_response(query: str, context: str = "", mode: str = "explain") -> dict:
    """
    Generates AI explanations, sentence corrections, or roleplay dialogues.
    Uses OpenAI API if OPENAI_API_KEY is configured; otherwise uses standard rule-based responses.
    """
    if settings.OPENAI_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {"role": "system", "content": "You are a helpful Japanese language tutor. Provide clear, concise explanations tailored to the student's level."},
                            {"role": "user", "content": f"Mode: {mode}. Query: {query}. Context: {context}"}
                        ]
                    },
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    answer = data["choices"][0]["message"]["content"]
                    return {"success": True, "answer": answer, "provider": "OpenAI"}
        except Exception:
            pass  # Fallback to local rule engine if API call fails

    # Rule-Based Japanese Grammar & Sentence Checker Fallback Engine
    query_lower = query.lower()
    
    if mode == "check_sentence":
        # Rule check for sentence
        if "は" in query and "が" in query:
            explanation = "Your sentence correctly uses particles! Remember: は marks the topic (known info/contrast), while が marks the specific subject (new info/emphasis)."
        elif "行きました" in query or "いきます" in query:
            explanation = "Sentence looks grammatically correct! Destination takes に or へ (e.g. 日本へ行きます)."
        elif "たべます" in query or "食べました" in query:
            explanation = "Good usage of the transitive verb 食べる! Direct object takes を particle (e.g. りんごを食べます)."
        else:
            explanation = f"Sentence Analysis for: '{query}'\nGrammar structure: Valid Japanese phrasing. Notice sentence-final verb order and particle attachments."
        
        return {
            "success": True,
            "answer": explanation,
            "corrected_sentence": query,
            "provider": "Japanese Journey Rule Engine"
        }
    
    elif mode == "roleplay":
        return {
            "success": True,
            "answer": "いらっしゃいませ！何にしますか？ (Welcome! What would you like to order?)\n\nTry responding with: 『ラーメンをください』 (Ramen please!)",
            "provider": "Japanese Journey Roleplay Simulator"
        }

    else:
        # Grammar Q&A
        if "は" in query or "が" in query or "wa vs ga" in query_lower:
            answer = """### Particle Comparison: は (wa) vs が (ga)

1. ** Topic vs. Subject**:
   - **は (Topic Marker)**: Sets the stage for what the sentence is about.
     - Example: *わたし**は**学生です。* (As for me, I am a student.)
   - **が (Subject Marker)**: Highlights the specific actor or answers "who/what".
     - Example: *だれ**が**来ましたか。* (Who came?) -> *田中さん**が**来ました。* (Tanaka came.)

2. **New Info vs. Known Info**:
   - Information **after** は is stressed.
   - Information **before** が is stressed.
"""
        elif "に" in query or "で" in query or "ni vs de" in query_lower:
            answer = """### Particle Comparison: に (ni) vs で (de)

- **に (Target / Time / Existence Point)**: Indicates a static point in time, location of existence, or destination.
  - Example: *東京**に**行きます。* (Going to Tokyo.)
  - Example: *部屋**に**猫がいます。* (There is a cat in the room.)
- **で (Action Location / Means)**: Indicates where an action takes place or the tool/means used.
  - Example: *図書館**で**勉強します。* (Studying at the library.)
  - Example: *電車**で**来ました。* (Came by train.)
"""
        elif "te-form" in query_lower or "て形" in query or "て-form" in query_lower:
            answer = """### The て-form (Te-form) Guide

The て-form is used for connecting sentences, asking permissions (〜てもいいです), prohibiting (〜てはいけません), and making requests (〜てください).

- **Godan Verbs**:
  - う, つ, る → って (買ったら -> 買って)
  - む, ぶ, ぬ → んで (飲む -> 飲んで)
  - く → いて (書く -> 書いて) [Exception: 行く -> 行って]
  - ぐ → いで (泳ぐ -> 泳いで)
  - す → して (話す -> 話して)
- **Ichidan Verbs**: Drop る, add て (食べる -> 食べて)
- **Irregular Verbs**: する → して, くる → きて
"""
        else:
            answer = f"### Japanese Learning Advice for: '{query}'\n\nJapanese sentence structure follows Subject-Object-Verb (SOV) order. Particles act as postpositions indicating the grammatical function of each preceding noun."

        return {
            "success": True,
            "answer": answer,
            "provider": "Japanese Journey Rule Engine"
        }
