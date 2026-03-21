from supabase import create_client
from config import settings

_client = None

def get_client():
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url,
                                settings.supabase_key)
    return _client

def save_prediction(text: str, result: dict) -> None:
    get_client().table('predictions').insert({
        'input_text':  text,
        'prediction':  result['prediction'],
        'confidence':  result['confidence'],
        'model_used':  result['model_used'],
    }).execute()

def get_history(limit: int = 50) -> list:
    res = (get_client().table('predictions')
            .select('*')
            .order('created_at', desc=True)
            .limit(limit)
            .execute())
    return res.data
