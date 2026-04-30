from fastapi.testclient import TestClient
from main import app
import datetime

client = TestClient(app)

# Test 1 — health check
def test_health():
    r = client.get('/health')
    assert r.status_code == 200

# Test 2 — bert-base returns correct shape
def test_predict_bert_returns_correct_shape():
    r = client.post('/api/predict',
        json={'text': 'A' * 25, 'model': 'bert-base'})
    assert r.status_code == 200
    body = r.json()
    assert body['model_used'] == 'bert-base'
    assert body['prediction'] in ['REAL', 'FAKE']
    assert 0.0 <= body['confidence'] <= 1.0
    assert 'analysed_at' in body

# Test 3 — short text rejected
def test_predict_rejects_short_text():
    r = client.post('/api/predict',
        json={'text': 'too short'})
    assert r.status_code == 422

# Test 4 — invalid model rejected at schema level
def test_predict_rejects_invalid_model():
    r = client.post('/api/predict',
        json={'text': 'A' * 25, 'model': 'gpt-4'})
    assert r.status_code == 422

# Test 5 — roberta-base rejected at schema level now that it is locked out
def test_predict_rejects_roberta_model():
    r = client.post('/api/predict',
        json={'text': 'A' * 25, 'model': 'roberta-base'})
    assert r.status_code == 422
