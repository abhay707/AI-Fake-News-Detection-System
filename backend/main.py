from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import predict, history, auth, stats

app = FastAPI(title='Fake News Detector API', version='1.0.0')

app.add_middleware(CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(predict.router)
app.include_router(history.router)
app.include_router(auth.router)
app.include_router(stats.router)

@app.get('/')
async def root():
    return {'status': 'ok', 'message': 'Fake News API is running'}

@app.get('/health')
async def health(): return { 'status': 'ok' }
