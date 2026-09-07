def get_audio_info(japanese_text: str) -> dict:
    """
    Returns audio service metadata for browser Web Speech Synthesis / HTML5 Audio fallback.
    """
    return {
        "text": japanese_text,
        "lang": "ja-JP",
        "fallback_type": "speech_synthesis",
        "rate": 0.9
    }
