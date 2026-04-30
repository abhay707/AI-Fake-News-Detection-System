import sys
import os
import uvicorn
import multiprocessing
import time
import requests

def run_server():
    os.system('.venv/bin/uvicorn main:app --port 8000')

if __name__ == '__main__':
    p = multiprocessing.Process(target=run_server)
    p.start()
    time.sleep(10)
    try:
        resp = requests.post('http://localhost:8000/api/v1/analyse', json={
            "text": "BREAKING: Scientists reveal 5G towers alter human DNA within 72 hours.",
            "model_id": "bert-base"
        })
        print(resp.json())
    finally:
        p.terminate()
