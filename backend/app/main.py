from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .agents import generate_itinerary
from .database import save_trip

app = FastAPI(title="AI Travel Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlanRequest(BaseModel):
    from_location: str
    to_location: str
    budget: str
    members: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Travel Planner API"}

@app.post("/plan")
async def plan_endpoint(request: PlanRequest):
    try:
        response = generate_itinerary(
            request.from_location,
            request.to_location,
            request.budget,
            request.members
        )
        
        # Save plan to DB
        try:
            await save_trip({"type": "plan", "request": request.model_dump(), "response": response})
        except Exception:
            pass # Ignore DB errors

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
