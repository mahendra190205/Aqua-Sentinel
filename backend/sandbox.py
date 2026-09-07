import csv
import io
import random
from typing import List, Dict, Tuple
from fastapi import UploadFile, HTTPException
import numpy as np
from sklearn.metrics import f1_score

# Mocking the CyFi model prediction for simulation purposes
def mock_cyfi_predict(lat: float, lon: float) -> float:
    """
    Returns a mock probability score (0-1) representing cyanobacteria presence.
    In a real scenario, this would fetch bands and run the model.
    """
    # Deterministic mock based on location to be consistent
    random.seed(lat + lon)
    return random.uniform(0, 1)

async def process_ground_truth(file: UploadFile) -> List[Dict]:
    """
    Parses and verifies the uploaded CSV file.
    """
    content = await file.read()
    decoded = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(decoded))
    
    required_columns = {'latitude', 'longitude', 'observed_cyanobacteria_density'}
    if not required_columns.issubset(set(csv_reader.fieldnames or [])):
        raise HTTPException(status_code=400, detail=f"CSV must contain columns: {required_columns}")
    
    data = []
    for row in csv_reader:
        try:
            data.append({
                'lat': float(row['latitude']),
                'lon': float(row['longitude']),
                'density': float(row['observed_cyanobacteria_density'])
            })
        except ValueError:
            continue # Skip bad rows
            
    return data

def optimize_thresholds(ground_truth_data: List[Dict]) -> Dict:
    """
    Calculates improved thresholds using scikit-learn logic.
    """
    y_true = []
    y_scores = []
    
    # Threshold for "Observed Bloom" based on density (e.g., > 20,000 cells/mL)
    # Assuming the content is already normalized or we pick a standard cutoff
    DENSITY_CUTOFF = 10.0 # Example arbitrary unit
    
    for row in ground_truth_data:
        # 1. Get Ground Truth Label
        is_bloom = 1 if row['density'] >= DENSITY_CUTOFF else 0
        y_true.append(is_bloom)
        
        # 2. Get Model Prediction (Mocked)
        score = mock_cyfi_predict(row['lat'], row['lon'])
        y_scores.append(score)
        
    if not y_true:
        return {"error": "No valid data points"}

    # Grid search for best F1
    best_f1 = 0
    best_threshold = 0.5
    current_f1 = 0
    
    # Calculate "Current" F1 based on default threshold (e.g. 0.85 for Tier 1)
    y_pred_current = [1 if s >= 0.85 else 0 for s in y_scores]
    current_f1 = f1_score(y_true, y_pred_current, zero_division=0)
    
    # Simple search for optimal
    thresholds = np.arange(0.1, 0.99, 0.01)
    for thresh in thresholds:
        y_pred = [1 if s >= thresh else 0 for s in y_scores]
        f1 = f1_score(y_true, y_pred, zero_division=0)
        if f1 > best_f1:
            best_f1 = f1
            best_threshold = thresh
            
    return {
        "current_f1": current_f1,
        "new_f1": best_f1,
        "recommended_tier1_threshold": float(best_threshold),
        # Heuristic: Tier 2 is often tighter, say +0.08 higher
        "recommended_tier2_threshold": min(float(best_threshold) + 0.08, 0.99)
    }
