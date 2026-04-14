import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_google_maps():
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    city = "London"
    print(f"Testing Google Maps with key: {api_key[:5]}...")
    url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={city}&inputtype=textquery&fields=geometry&key={api_key}"
    try:
        response = requests.get(url, timeout=5)
        print("Google Maps Response Status:", response.status_code)
        print("Google Maps Response JSON:", response.json())
    except Exception as e:
        print("Google Maps Request Failed:", e)

def test_booking_hotels():
    api_key = os.getenv("RAPIDAPI_KEY")
    city_name = "London"
    print(f"\nTesting Booking Hotel with key: {api_key[:5]}...")
    url = "https://booking-com.p.rapidapi.com/v1/hotels/locations"
    querystring = {"name": city_name, "locale": "en-gb"}
    headers = {
        "x-rapidapi-key": api_key,
        "x-rapidapi-host": "booking-com.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers, params=querystring, timeout=5)
        print("Booking Response Status:", response.status_code)
        print("Booking Response JSON:", response.json())
    except Exception as e:
        print("Booking Request Failed:", e)

def test_openai():
    api_key = os.getenv("OPENAI_API_KEY")
    print(f"\nTesting OpenAI with key: {api_key[:5]}...")
    url = "https://api.openai.com/v1/models"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        print("OpenAI Status:", response.status_code)
        if response.status_code != 200:
            print("OpenAI Error:", response.json())
    except Exception as e:
        print("OpenAI Request Failed:", e)

def test_openrouter():
    api_key = os.getenv("OPENROUTER_API_KEY")
    print(f"\nTesting OpenRouter with key: {api_key[:5]}...")
    url = "https://openrouter.ai/api/v1/models"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        print("OpenRouter Status:", response.status_code)
        if response.status_code != 200:
            print("OpenRouter Error:", response.json())
    except Exception as e:
        print("OpenRouter Request Failed:", e)

def test_openweather():
    api_key = os.getenv("OPENWEATHER_API_KEY")
    print(f"\nTesting OpenWeather with key: {api_key[:5]}...")
    url = f"https://api.openweathermap.org/data/2.5/weather?q=London&appid={api_key}"
    try:
        response = requests.get(url, timeout=5)
        print("OpenWeather Status:", response.status_code)
        if response.status_code != 200:
            print("OpenWeather Error:", response.json())
    except Exception as e:
        print("OpenWeather Request Failed:", e)

def test_huggingface():
    api_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    print(f"\nTesting HuggingFace with token: {api_key[:5]}...")
    url = "https://huggingface.co/api/whoami-v2"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        print("HuggingFace Status:", response.status_code)
        if response.status_code != 200:
            print("HuggingFace Error:", response.json())
    except Exception as e:
        print("HuggingFace Request Failed:", e)

if __name__ == "__main__":
    test_google_maps()
    test_booking_hotels()
    test_openai()
    test_openrouter()
    test_openweather()
    test_huggingface()
