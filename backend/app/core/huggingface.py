
import requests
from app.core.config import HUGGINGFACE_API_KEY

API_URL_SIMPLIFICATION = "https://api-inference.huggingface.co/models/eilamc14/t5-base-text-simplification"
API_URL_TTS = "https://api-inference.huggingface.co/models/microsoft/speecht5_tts"
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

def query_huggingface_json(payload, api_url):
    response = requests.post(api_url, headers=HEADERS, json=payload)
    return response.json()

def query_huggingface_binary(payload, api_url):
    response = requests.post(api_url, headers=HEADERS, json=payload)
    return response.content

def simplify_text(text: str):
    payload = {"inputs": text}
    return query_huggingface_json(payload, API_URL_SIMPLIFICATION)

def text_to_speech(text: str):
    payload = {"inputs": text}
    return query_huggingface_binary(payload, API_URL_TTS)

