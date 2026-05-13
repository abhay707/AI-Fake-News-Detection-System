import sys
import logging
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    model_path:   str = './models/roberta-fake-news'
    environment:  str = 'development'

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

try:
    settings = Settings()
except Exception as e:
    logger.critical(
        "STARTUP FAILED: Missing required environment variables.\n"
        "Set SUPABASE_URL and SUPABASE_KEY in your environment or .env file.\n"
        f"Details: {e}"
    )
    sys.exit(1)
