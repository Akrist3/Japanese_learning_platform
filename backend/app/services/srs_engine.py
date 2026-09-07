import math
from datetime import datetime, timedelta

def calculate_sm2(quality: int, repetition: int, interval: int, ease_factor: float):
    """
    SuperMemo SM-2 Spaced Repetition Algorithm
    quality: 0 (Again), 3 (Hard), 4 (Good), 5 (Easy)
    """
    if quality < 3:
        new_repetition = 0
        new_interval = 1
    else:
        if repetition == 0:
            new_interval = 1
        elif repetition == 1:
            new_interval = 6
        else:
            new_interval = math.ceil(interval * ease_factor)
        new_repetition = repetition + 1

    # Calculate new ease factor
    new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if new_ease_factor < 1.3:
        new_ease_factor = 1.3

    next_review = datetime.utcnow() + timedelta(days=new_interval)
    
    return {
        "repetition": new_repetition,
        "interval": new_interval,
        "ease_factor": round(new_ease_factor, 2),
        "next_review_date": next_review
    }
