from tests.test_api import (
    test_root_endpoint,
    test_verb_conjugation_engine,
    test_srs_sm2_algorithm,
    test_kana_endpoint,
    test_vocabulary_endpoint,
    test_kanji_endpoint
)

if __name__ == "__main__":
    print("Running backend tests...")
    test_root_endpoint()
    print("[OK] test_root_endpoint passed")
    test_verb_conjugation_engine()
    print("[OK] test_verb_conjugation_engine passed")
    test_srs_sm2_algorithm()
    print("[OK] test_srs_sm2_algorithm passed")
    test_kana_endpoint()
    print("[OK] test_kana_endpoint passed")
    test_vocabulary_endpoint()
    print("[OK] test_vocabulary_endpoint passed")
    test_kanji_endpoint()
    print("[OK] test_kanji_endpoint passed")
    print("\nALL BACKEND TESTS PASSED SUCCESSFULLY!")
