from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch
import datetime

client = TestClient(app)

def test_health():
    r = client.get('/health')
    assert r.status_code == 200

@patch('services.model_service.predict')
@patch('services.db_service.save_prediction')
def test_predict_returns_expected_shape(mock_save, mock_predict):
    mock_predict.return_value = {
        'prediction': 'FAKE',
        'confidence': 0.95,
        'model_used': 'roberta-base',
        'analysed_at': datetime.datetime.now(datetime.timezone.utc)
    }
    r = client.post('/api/predict',
        json={ 'text': 'A' * 25, 'model': 'roberta-base' })
    assert r.status_code == 200
    body = r.json()
    assert 'prediction' in body
    assert body['prediction'] in ['REAL', 'FAKE']
    assert 0 <= body['confidence'] <= 1

def test_predict_rejects_short_text():
    r = client.post('/api/predict',
        json={ 'text': 'too short' })
    assert r.status_code == 422  # Pydantic validation error
