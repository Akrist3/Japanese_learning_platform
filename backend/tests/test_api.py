from fastapi.testclient import TestClient
from app.main import app
from app.services.verb_engine import conjugate_verb, check_conjugation
from app.services.srs_engine import calculate_sm2


client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Japanese Learning" in response.json()["message"]

def test_verb_conjugation_engine():
    # Godan verb 飲む
    nomu_forms = conjugate_verb("飲む", "godan")
    assert nomu_forms["masu"] == "飲みます"
    assert nomu_forms["nai"] == "飲まない"
    assert nomu_forms["te"] == "飲んで"
    assert nomu_forms["ta"] == "飲んだ"

    # Ichidan verb 食べる
    taberu_forms = conjugate_verb("食べる", "ichidan")
    assert taberu_forms["masu"] == "食べます"
    assert taberu_forms["nai"] == "食べない"
    assert taberu_forms["te"] == "食べて"
    assert taberu_forms["ta"] == "食べた"

    # Irregular verb する
    suru_forms = conjugate_verb("する", "irregular")
    assert suru_forms["masu"] == "します"
    assert suru_forms["nai"] == "しない"
    assert suru_forms["te"] == "して"

def test_srs_sm2_algorithm():
    # Perfect grade 5 initial review
    res = calculate_sm2(quality=5, repetition=0, interval=1, ease_factor=2.5)
    assert res["repetition"] == 1
    assert res["interval"] == 1
    assert res["ease_factor"] >= 2.5

    # Failure grade 0 (Again)
    res_fail = calculate_sm2(quality=0, repetition=3, interval=10, ease_factor=2.5)
    assert res_fail["repetition"] == 0
    assert res_fail["interval"] == 1

def test_kana_endpoint():
    response = client.get("/api/v1/kana/list?type=hiragana")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["type"] == "hiragana"

def test_vocabulary_endpoint():
    response = client.get("/api/v1/vocabulary/list?jlpt_level=N5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_kanji_endpoint():
    response = client.get("/api/v1/kanji/list?jlpt_level=N5")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
