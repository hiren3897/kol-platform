# 💾 KOL Data Analytics Platform - Backend (FastAPI)

This directory contains the RESTful API service built using **FastAPI** to manage and analyze Key Opinion Leader (KOL) data. The API is designed for performance and provides structured endpoints for retrieving raw data and pre-calculated statistics.

## 🚀 Setup and Run

### Prerequisites
* Python 3.9+
* `pip` (Python package installer)

### Installation
1.  **Navigate to the backend directory:**
    ```bash
    cd kol-platform/backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    ```

3.  **Activate the environment:**
    * **macOS/Linux:** `source venv/bin/activate`
    * **Windows (CMD):** `venv\Scripts\activate`

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Data Source
The application currently loads data from a local JSON file: `backend/data/mockKolData.json`.

### Run the Server
Start the API server using Uvicorn with hot-reloading enabled for development:
```bash
uvicorn app.main:app --reload