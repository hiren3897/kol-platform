import json
from typing import List
from pydantic import ValidationError
import logging
import os

from ..models import KOL 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class DataLoaderError(Exception):
    """Custom exception for file loading issues."""
    pass

def load_kol_data(file_path: str) -> List[KOL]:
    """
    Reads a JSON file containing KOL data and converts entries into a list of validated KOL objects.
    """
    logging.info(f"Attempting to load KOL data from: {file_path}")
    
    if not file_path or not file_path.endswith('.json'):
        raise DataLoaderError("Invalid or missing data file path. Expected a .json file.")
    
    if not os.path.exists(file_path):
        raise DataLoaderError(f"Data file not found at: {file_path}")

    try:
        # 1. Load raw JSON data
        with open(file_path, 'r') as f:
            raw_data = json.load(f)
            
    except json.JSONDecodeError as e:
        raise DataLoaderError(f"Error decoding JSON file: {e}")
    except Exception as e:
        raise DataLoaderError(f"Error reading data file: {e}")

    if not isinstance(raw_data, list):
        raise DataLoaderError("JSON data must be a list of KOL objects.")

    kols: List[KOL] = []
    error_count = 0
    
    # 2. Validate and convert each item to a KOL Pydantic model
    for index, item in enumerate(raw_data):
        try:
            # KOL.model_validate handles the validation against the model schema
            kol = KOL.model_validate(item) 
            kols.append(kol)
            
        except ValidationError as e:
            error_count += 1
            logging.warning(f"Data validation error on item {index}: {e}")
        except Exception as e:
            error_count += 1
            logging.error(f"Unexpected error processing item {index}: {e}")

    logging.info(f"Successfully loaded {len(kols)} KOL records from JSON. {error_count} items skipped.")
    return kols