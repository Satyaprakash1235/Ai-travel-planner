import os
import requests
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type, List, Dict, Any

class HotelSearchInput(BaseModel):
    city_name: str = Field(..., description="The name of the city to search for hotels in.")

class BookingHotelTool(BaseTool):
    name: str = "BookingHotelTool"
    description: str = "Search for hotels in a specific city using the Booking.com API."
    args_schema: Type[BaseModel] = HotelSearchInput

    def _run(self, city_name: str) -> List[Dict[str, Any]]:
        api_key = os.getenv("RAPIDAPI_KEY")
        if not api_key:
            return []

        url = "https://booking-com.p.rapidapi.com/v1/hotels/locations"
        querystring = {"name": city_name, "locale": "en-gb"}
        headers = {
            "x-rapidapi-key": api_key,
            "x-rapidapi-host": "booking-com.p.rapidapi.com"
        }

        try:
            # Step 1: Get Dest ID for city
            response = requests.get(url, headers=headers, params=querystring, timeout=5)
            data = response.json()
            if not data:
                return []
            dest_id = data[0].get('dest_id')
            dest_type = data[0].get('dest_type')

            # Step 2: Search hotels
            search_url = "https://booking-com.p.rapidapi.com/v1/hotels/search"
            search_query = {
                "dest_id": dest_id,
                "order_by": "popularity",
                "checkout_date": "2026-04-10",
                "adults_number": "2",
                "checkin_date": "2026-04-09",
                "room_number": "1",
                "dest_type": dest_type,
                "locale": "en-gb",
                "units": "metric",
                "include_adjacency": "true"
            }
            
            search_response = requests.get(search_url, headers=headers, params=search_query, timeout=5)
            search_data = search_response.json()
            
            hotels = []
            for result in search_data.get('result', [])[:5]:
                hotels.append({
                    "name": result.get('hotel_name'),
                    "description": f"Rating: {result.get('review_score')} - {result.get('accommodation_type_name')}",
                    "lat": result.get('latitude'),
                    "lng": result.get('longitude'),
                    "price": f"{result.get('min_total_price')} {result.get('currency_code')}",
                    "type": "hotel"
                })
            return hotels
        except Exception as e:
            print(f"Error fetching hotels: {e}")
            return []

class GoogleMapsInput(BaseModel):
    city: str = Field(..., description="The name of the city to get coordinates for.")

class GoogleMapsTool(BaseTool):
    name: str = "GoogleMapsTool"
    description: str = "Get the latitude and longitude coordinates for a given city."
    args_schema: Type[BaseModel] = GoogleMapsInput

    def _run(self, city: str) -> Dict[str, float]:
        api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        if api_key and api_key.strip():
            try:
                url = f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={city}&inputtype=textquery&fields=geometry&key={api_key}"
                response = requests.get(url, timeout=5)
                data = response.json()
                if data.get("candidates"):
                    loc = data["candidates"][0]["geometry"]["location"]
                    return {"lat": loc["lat"], "lng": loc["lng"]}
            except Exception as e:
                print(f"Google Places API failed: {e}")

        # Fallback coordinates for major cities
        cities = {
            "goa": {"lat": 15.2993, "lng": 74.1240},
            "mumbai": {"lat": 19.0760, "lng": 72.8777},
            "delhi": {"lat": 28.6139, "lng": 77.2090},
            "paris": {"lat": 48.8566, "lng": 2.3522},
            "london": {"lat": 51.5074, "lng": -0.1278},
            "new york": {"lat": 40.7128, "lng": -74.0060},
            "dubai": {"lat": 25.2048, "lng": 55.2708},
            "tokyo": {"lat": 35.6762, "lng": 139.6503},
        }
        return cities.get(city.lower(), {"lat": 20.0, "lng": 0.0})

class NominatimGeocodingTool(BaseTool):
    name: str = "NominatimGeocodingTool"
    description: str = "A free alternative for geocoding using OpenStreetMap (Nominatim). No API key required."
    args_schema: Type[BaseModel] = GoogleMapsInput

    def _run(self, city: str) -> Dict[str, float]:
        """Convert city name to coordinates using Nominatim."""
        try:
            url = f"https://nominatim.openstreetmap.org/search?q={city}&format=json&limit=1"
            headers = {"User-Agent": "AntigravityTravelPlanner/1.0"}
            response = requests.get(url, headers=headers, timeout=5)
            data = response.json()
            if data:
                return {
                    "lat": float(data[0]["lat"]),
                    "lng": float(data[0]["lon"])
                }
        except Exception as e:
            print(f"Nominatim Geocoding failed: {e}")
        
        # Fallback to hardcoded coordinates if Nominatim fails
        cities = {
            "goa": {"lat": 15.2993, "lng": 74.1240},
            "mumbai": {"lat": 19.0760, "lng": 72.8777},
            "delhi": {"lat": 28.6139, "lng": 77.2090},
            "paris": {"lat": 48.8566, "lng": 2.3522},
            "london": {"lat": 51.5074, "lng": -0.1278},
            "new york": {"lat": 40.7128, "lng": -74.0060},
            "dubai": {"lat": 25.2048, "lng": 55.2708},
            "tokyo": {"lat": 35.6762, "lng": 139.6503},
        }
        return cities.get(city.lower(), {"lat": 20.0, "lng": 0.0})

class GooglePlacesTool(BaseTool):
    name: str = "GooglePlacesTool"
    description: str = "Search for nearby places (attractions or restaurants) around a given latitude and longitude."
    args_schema: Type[BaseModel] = GoogleMapsInput  # Reuse the input schema

    def _run(self, city: str) -> List[Dict[str, Any]]:
        api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        if not api_key or not api_key.strip():
            return []

        # First get coordinates
        coords = GoogleMapsTool()._run(city)
        lat, lng = coords["lat"], coords["lng"]

        places = []
        types = ["tourist_attraction", "restaurant"]
        
        for place_type in types:
            try:
                url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=50000&type={place_type}&key={api_key}"
                response = requests.get(url, timeout=5)
                data = response.json()
                
                for result in data.get("results", [])[:3]:  # Limit to 3 per type
                    photo_ref = ""
                    if result.get("photos"):
                        photo_ref = result["photos"][0]["photo_reference"]
                        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={api_key}"
                    else:
                        photo_url = "https://via.placeholder.com/400x300?text=No+Image"
                    
                    places.append({
                        "name": result.get("name", ""),
                        "description": result.get("vicinity", ""),
                        "lat": result["geometry"]["location"]["lat"],
                        "lng": result["geometry"]["location"]["lng"],
                        "type": place_type,
                        "image": photo_url,
                        "rating": result.get("rating", 0)
                    })
            except Exception as e:
                print(f"Error fetching {place_type}: {e}")
        
        return places
