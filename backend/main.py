from typing import Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ingestion import fetch_sentinel2_data, analyze_water_quality
from crypto import generate_hash, timestamp_log
from sandbox import process_ground_truth, optimize_thresholds
from pydantic import BaseModel


app = FastAPI(title="Aqua-Sentinel API", version="1.0.0")

# In-memory storage for legal logs (for demonstration)
LEGAL_LOGS = []

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IngestionRequest(BaseModel):
    lat: float
    lon: float

@app.get("/")
def read_root():
    return {"message": "Aqua-Sentinel Backend is running"}

@app.post("/ingest")
def ingest_data(request: IngestionRequest):
    """
    Trigger data ingestion and analysis for a specific location.
    """
    try:
        # 1. Fetch Data
        raw_data = fetch_sentinel2_data(request.lat, request.lon)
        
        # 2. Analyze
        analysis_result = analyze_water_quality(raw_data)
        
        # 3. Create Log Entry
        log_entry = {
            "request": request.dict(),
            "raw_data_summary": "Sentinel-2 Bands", # Simplified for log
            "analysis": analysis_result
        }
        
        # 4. Timestamp & Hash (Chain-of-Custody)
        log_entry = timestamp_log(log_entry)
        log_hash = generate_hash(log_entry)
        
        # Store in volatile memory
        LEGAL_LOGS.append({
            "hash": log_hash,
            "timestamp": log_entry['timestamp'],
            "event_type": "INGESTION",
            "details": log_entry
        })
        
        return {
            "status": "success",
            "log_entry": log_entry,
            "hash": log_hash
        }

        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sandbox/train")
async def train_sandbox(file: UploadFile = File(...)):
    """
    Accepts a CSV, calculates optimized thresholds, and logs the calibration event
    in the Legal Chain-of-Custody vault.
    """
    try:
        # 1. Parse Data
        ground_truth = await process_ground_truth(file)
        
        # 2. Optimize
        results = optimize_thresholds(ground_truth)
        
        # 3. Create Evidentiary Log
        calibration_log = {
            "event_type": "CALIBRATION_ATTEMPT",
            "input_file_name": file.filename,
            "record_count": len(ground_truth),
            "optimization_results": results,
            "initiated_by": "Authorized_User_1" # In real app, from Auth token
        }
        
        # 4. Seal with Chain-of-Custody
        calibration_log = timestamp_log(calibration_log)
        log_hash = generate_hash(calibration_log)
        
        # Store in volatile memory
        LEGAL_LOGS.append({
            "hash": log_hash,
            "timestamp": calibration_log['timestamp'],
            "event_type": "CALIBRATION",
            "details": calibration_log
        })
        
        return {
            "status": "success",
            "results": results,
            "legal_log": calibration_log,
            "hash": log_hash
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/legal-logs")
def get_legal_logs():
    """
    Returns the list of immutable legal logs.
    """
    return LEGAL_LOGS


