import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'app'))
from app.tools import NominatimGeocodingTool

tool = NominatimGeocodingTool()
print("Berlin:", tool._run("Berlin"))
print("Tokyo:", tool._run("Tokyo"))
