from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    model_path:   str = './models/roberta-fake-news'
    environment:  str = 'development'

    model_config = SettingsConfigDict(env_file='.env')

settings = Settings()
