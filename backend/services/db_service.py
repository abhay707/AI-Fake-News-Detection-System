from supabase import create_client
from config import settings

_client = None

def get_client():
    global _client
    if _client is None:
        url = settings.supabase_url.strip()
        key = settings.supabase_key.strip()
        if not url or not key:
            raise ValueError("Supabase URL or Key is missing.")
        if not url.startswith('http'):
            url = f"https://{url}"
        _client = create_client(url, key)
    return _client

def save_prediction(text: str, result: dict) -> None:
    try:
        get_client().table('predictions').insert({
            'input_text':  text,
            'prediction':  result['prediction'],
            'confidence':  result['confidence'],
            'model_used':  result['model_used'],
        }).execute()
    except Exception as e:
        print(f"Warning: Failed to save prediction to DB: {e}")

def get_history(limit: int = 50) -> list:
    try:
        res = (get_client().table('predictions')
                .select('*')
                .order('created_at', desc=True)
                .limit(limit)
                .execute())
        return res.data
    except Exception as e:
        print(f"Warning: Failed to fetch history from DB: {e}")
        return []
