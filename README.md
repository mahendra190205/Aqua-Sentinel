# Aqua-Sentinel 🌊🛰️

**Legally-Defensible Water Quality Monitoring for SDG 6.3.2**

Aqua-Sentinel is a full-stack platform designed to monitor Harmful Algal Blooms (HABs) in the Upper Ganges Basin. It combines satellite imagery analysis with a cryptographically secure "Legal Chain-of-Custody" to ensure data integrity for regulatory and legal use.

## 🚀 Key Features

### 1. 🧠 Data & Analytics Engine
- **Sentinel-2 Ingestion**: Fetches and processes multispectral imagery (Bands B3, B4, B5-B7).
- **CyFi Integration**: Uses the Cyanobacteria Finder (cyfi) logic for bio-optical modeling.
- **Tiered Alerts**:
  - 🟢 **Normal**: Safe water quality.
  - 🟠 **Tier 1 (Probable)**: F1-score ≥ 0.85.
  - 🔴 **Tier 2 (Confirmed)**: F1-score ≥ 0.93.

### 2. ⚖️ Legal Chain-of-Custody (The "Vault")
- **Immutable Logging**: Every ingestion and calibration event is cryptographically hashed (SHA-256).
- **Precise Timestamping**: All logs are tagged with a verifiable UTC timestamp.
- **Audit Trail**: A tamper-evident ledger ensuring data admissibility in court.

### 3. 🧪 Training Sandbox
- **Fine-Tuning**: authorized users can upload ground-truth CSV data to calibrate the model.
- **Auto-Optimization**: Calculates improved F1-score thresholds using `scikit-learn` logic based on local conditions.

### 4. 🗺️ Map Dashboard
- **Geospatial Visualization**: Visualizes risk zones on an interactive map of the Upper Ganges Basin.
- **Live Status**: Color-coded markers indicating real-time risk levels.

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Uvicorn, Scikit-learn, Pandas, Geopandas.
- **Frontend**: React.js (Vite), Tailwind CSS v4, React-Leaflet.
- **Security**: SHA-256 Hashing (`hashlib`).

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The API will be available at `http://localhost:8000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The App will be available at `http://localhost:5173`*

---

## 🧪 Usage Guide

1. **Map View**: Open the app to see the live status of monitored locations.
2. **Sandbox**: 
   - Navigate to the "Training Sandbox" tab.
   - Upload a CSV with columns: `latitude`, `longitude`, `observed_cyanobacteria_density`.
   - View recommended threshold adjustments.
3. **Legal Vault**: 
   - Navigate to the "Legal Vault" tab.
   - Verify the SHA-256 hashes of recent operations.

---

## 📄 License
This project is licensed under the MIT License.
