import os
import json
import random
from typing import List, Dict, Any
from .tools import BookingHotelTool, GoogleMapsTool, GooglePlacesTool, NominatimGeocodingTool
from .utils.itinerary import calculate_days, determine_transportation
from dotenv import load_dotenv

load_dotenv(override=True)

class Place:
    def __init__(self, name, description, lat, lng, type="activity", day=1, image=""):
        self.name = name
        self.description = description
        self.lat = lat
        self.lng = lng
        self.type = type
        self.day = day
        self.image = image

def get_openrouter_llm():
    """Mock LLM for now."""
    return None

def generate_itinerary(from_location: str, to_location: str, budget: str, members: str) -> Dict[str, Any]:
    """Generate itinerary based on structured input."""
    try:
        days = calculate_days(budget, members)
        transport = determine_transportation(budget)
        
        # Use Nominatim for free geocoding (no API key needed)
        geocoder = NominatimGeocodingTool()
        origin_coords = geocoder._run(from_location)
        dest_coords = geocoder._run(to_location)
        
        base_lat = dest_coords.get("lat", 0.0)
        base_lng = dest_coords.get("lng", 0.0)
        
        # Fetch nearby hotels using BookingHotelTool
        hotel_tool = BookingHotelTool()
        hotels = hotel_tool._run(to_location)
        
        # Specific places for destinations
        destination_places = {
            "goa": {
                "activities": [
                    {"name": "Anjuna Beach", "desc": "Famous for its hippie culture, flea market, and stunning sunsets.", "lat": 15.5833, "lng": 73.7333, "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"},
                    {"name": "Calangute Beach", "desc": "One of the most popular beaches in Goa, known for water sports.", "lat": 15.5439, "lng": 73.7553, "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"},
                    {"name": "Fort Aguada", "desc": "A 17th-century Portuguese fort with panoramic views of the Arabian Sea.", "lat": 15.4909, "lng": 73.7733, "image": "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400"},
                    {"name": "Dudhsagar Falls", "desc": "One of India's tallest waterfalls, surrounded by lush greenery.", "lat": 15.3144, "lng": 74.3144, "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"},
                    {"name": "Basilica of Bom Jesus", "desc": "A UNESCO World Heritage Site housing the remains of St. Francis Xavier.", "lat": 15.5009, "lng": 73.9117, "image": "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400"}
                ],
                "restaurants": [
                    {"name": "Martin's Corner", "desc": "Famous for Goan cuisine and live music.", "lat": 15.4992, "lng": 73.8278, "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"},
                    {"name": "Gunpowder", "desc": "Authentic Goan food with a modern twist.", "lat": 15.4992, "lng": 73.8278, "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"},
                    {"name": "Thalassa", "desc": "Seafood restaurant with ocean views.", "lat": 15.4992, "lng": 73.8278, "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"},
                    {"name": "Pousada by the Beach", "desc": "Beachside dining with fresh seafood.", "lat": 15.4992, "lng": 73.8278, "image": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"},
                    {"name": "Cafe Delmar", "desc": "Casual eatery with Goan and international dishes.", "lat": 15.4992, "lng": 73.8278, "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"}
                ]
            },
            "paris": {
                "activities": [
                    {"name": "Eiffel Tower", "desc": "Iconic iron lattice tower and symbol of Paris.", "lat": 48.8584, "lng": 2.2945, "image": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400"},
                    {"name": "Louvre Museum", "desc": "World's largest art museum, home to the Mona Lisa.", "lat": 48.8606, "lng": 2.3376, "image": "https://images.unsplash.com/photo-1566139956833-8c8a3e4c7c8e?w=400"},
                    {"name": "Notre-Dame Cathedral", "desc": "Medieval Catholic cathedral on the Île de la Cité.", "lat": 48.8529, "lng": 2.3500, "image": "https://images.unsplash.com/photo-1549144511-f099e773c147?w=400"},
                    {"name": "Champs-Élysées", "desc": "Avenue of the Champs-Élysées, famous for shopping and cafes.", "lat": 48.8698, "lng": 2.3076, "image": "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=400"},
                    {"name": "Montmartre", "desc": "Historic hill with Sacré-Cœur Basilica and artists' square.", "lat": 48.8867, "lng": 2.3431, "image": "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=400"}
                ],
                "restaurants": [
                    {"name": "Le Comptoir du Relais", "desc": "Michelin-starred restaurant with innovative French cuisine.", "lat": 48.8606, "lng": 2.3376, "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"},
                    {"name": "L'As du Fallafel", "desc": "Famous falafel spot in the Marais district.", "lat": 48.8574, "lng": 2.3615, "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"},
                    {"name": "Pierre Hermé", "desc": "World-renowned patisserie with macarons and chocolates.", "lat": 48.8656, "lng": 2.3076, "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400"},
                    {"name": "Le Grenier de Notre-Dame", "desc": "Romantic restaurant with views of Notre-Dame.", "lat": 48.8529, "lng": 2.3500, "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"},
                    {"name": "Café de Flore", "desc": "Historic café frequented by intellectuals and artists.", "lat": 48.8542, "lng": 2.3325, "image": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"}
                ]
            },
            "london": {
                "activities": [
                    {"name": "Big Ben", "desc": "Iconic clock tower at the Palace of Westminster.", "lat": 51.5007, "lng": -0.1246, "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400"},
                    {"name": "British Museum", "desc": "World-famous museum with vast collections of art and antiquities.", "lat": 51.5194, "lng": -0.1270, "image": "https://images.unsplash.com/photo-1566139956833-8c8a3e4c7c8e?w=400"},
                    {"name": "Tower of London", "desc": "Historic castle and former prison on the River Thames.", "lat": 51.5081, "lng": -0.0759, "image": "https://images.unsplash.com/photo-1520637836862-4d197d17c1a8?w=400"},
                    {"name": "Buckingham Palace", "desc": "Official residence of the British monarch.", "lat": 51.5014, "lng": -0.1419, "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"},
                    {"name": "London Eye", "desc": "Giant Ferris wheel offering panoramic views of the city.", "lat": 51.5033, "lng": -0.1195, "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400"}
                ],
                "restaurants": [
                    {"name": "The Ivy", "desc": "Celebrity haunt with modern British cuisine.", "lat": 51.5117, "lng": -0.1281, "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"},
                    {"name": "Dishoom", "desc": "Popular Bombay-style cafe with Indian cuisine.", "lat": 51.5128, "lng": -0.1281, "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"},
                    {"name": "Sketch", "desc": "Unique restaurant with art installations and afternoon tea.", "lat": 51.5128, "lng": -0.1419, "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400"},
                    {"name": "The Ledbury", "desc": "Michelin-starred restaurant with innovative tasting menus.", "lat": 51.5175, "lng": -0.1997, "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"},
                    {"name": "Borough Market", "desc": "Historic food market with diverse street food options.", "lat": 51.5055, "lng": -0.0918, "image": "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"}
                ]
            },
            "new york": {
                "activities": [
                    {"name": "Statue of Liberty", "desc": "Iconic statue symbolizing freedom and democracy.", "lat": 40.6892, "lng": -74.0445, "image": "https://images.unsplash.com/photo-1485871981521-5b1fd3805b6b?w=400"},
                    {"name": "Central Park", "desc": "Urban park with walking paths, lakes, and recreational areas.", "lat": 40.7829, "lng": -73.9654, "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"},
                    {"name": "Times Square", "desc": "Busy commercial intersection known for its bright lights.", "lat": 40.7580, "lng": -73.9855, "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400"},
                    {"name": "Empire State Building", "desc": "Art Deco skyscraper with observation decks.", "lat": 40.7484, "lng": -73.9857, "image": "https://images.unsplash.com/photo-1485871981521-5b1fd3805b6b?w=400"},
                    {"name": "Brooklyn Bridge", "desc": "Suspension bridge connecting Manhattan and Brooklyn.", "lat": 40.7061, "lng": -73.9969, "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"}
                ],
                "restaurants": [
                    {"name": "Le Bernardin", "desc": "Michelin three-star seafood restaurant.", "lat": 40.7614, "lng": -73.9821, "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"},
                    {"name": "Katz's Delicatessen", "desc": "Historic deli famous for pastrami sandwiches.", "lat": 40.7223, "lng": -73.9873, "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"},
                    {"name": "Per Se", "desc": "Fine dining restaurant with innovative American cuisine.", "lat": 40.7680, "lng": -73.9829, "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400"},
                    {"name": "Joe's Pizza", "desc": "Classic New York-style pizza joint.", "lat": 40.7308, "lng": -74.0023, "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"},
                    {"name": "Gramercy Tavern", "desc": "American brasserie with seasonal menus.", "lat": 40.7380, "lng": -73.9881, "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"}
                ]
            }
        }
        
        places = []
        dest_key = to_location.lower()
        if dest_key in destination_places:
            activities = destination_places[dest_key]["activities"]
            restaurants = destination_places[dest_key]["restaurants"]
            for i in range(1, days + 1):
                # Add activity
                act = activities[(i-1) % len(activities)]
                places.append(Place(
                    act["name"],
                    act["desc"],
                    act["lat"] + random.uniform(-0.01, 0.01),
                    act["lng"] + random.uniform(-0.01, 0.01),
                    "activity",
                    i,
                    act["image"]
                ))
                # Add restaurant
                rest = restaurants[(i-1) % len(restaurants)]
                places.append(Place(
                    rest["name"],
                    rest["desc"],
                    rest["lat"] + random.uniform(-0.01, 0.01),
                    rest["lng"] + random.uniform(-0.01, 0.01),
                    "food",
                    i,
                    rest["image"]
                ))
        else:
            # Fallback to generic
            for i in range(1, days + 1):
                places.append(Place(
                    f"Sightseeing in {to_location} Day {i}",
                    f"Exploring popular attractions around {to_location}.",
                    base_lat + random.uniform(-0.05, 0.05),
                    base_lng + random.uniform(-0.05, 0.05),
                    "activity",
                    i
                ))
                places.append(Place(
                    f"Local Restaurant",
                    f"Enjoy authentic cuisine in {to_location}.",
                    base_lat + random.uniform(-0.05, 0.05),
                    base_lng + random.uniform(-0.05, 0.05),
                    "food",
                    i
                ))
        
        # Final coordinates for response
        # origin_coords and dest_coords were already defined at the start of the function
        
        # Add hotels to places
        for hotel in hotels:
            places.append(Place(
                hotel["name"],
                hotel["description"] + f" - Price: {hotel['price']}",
                hotel["lat"],
                hotel["lng"],
                "hotel",
                1
            ))
            
        return {
            "origin": from_location,
            "destination": to_location,
            "origin_coords": origin_coords,
            "destination_coords": dest_coords,
            "days": days,
            "transportation": transport,
            "places": [vars(p) for p in places],
            "reply": f"Perfect! I've planned a {days}-day trip to {to_location} for a {members} traveling from {from_location} on a {budget} budget. The recommended transportation is {transport}. Enjoy!"
        }
    except Exception as e:
        return {
            "reply": f"Sorry, I encountered an error: {str(e)}",
            "destination": to_location,
            "days": 1,
            "transportation": "Unknown",
            "places": []
        }
