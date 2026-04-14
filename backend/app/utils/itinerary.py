def calculate_days(budget: str, members: str) -> int:
    """
    Calculate recommended number of days based on budget and members heuristically.
    """
    base_days = 3
    if budget.lower() == "moderate":
        base_days += 2
    elif budget.lower() == "high":
        base_days += 4
        
    if members.lower() in ["family", "friends"]:
        base_days += 1
        
    return base_days

def determine_transportation(budget: str, distance_km: float = 0) -> str:
    """
    Determine best mode of transportation based on budget.
    """
    if budget.lower() == "high":
        return "Flight / Private Car"
    elif budget.lower() == "moderate":
        return "Train / Rental Car"
    else:
        return "Bus / Public Transport"
