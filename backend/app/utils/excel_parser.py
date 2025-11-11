import pandas as pd
from typing import List, Dict, Any
from pydantic import ValidationError
import logging

from ..models import KOL

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ExcelParserError(Exception):
    """Custom exception for file parsing issues."""
    pass

def parse_excel_file(file_path: str) -> List[KOL]:
    """
    Reads an Excel file using pandas, cleans data, and converts rows into a list of validated KOL objects.
    """
    logging.info(f"Attempting to parse Excel file from: {file_path}")
    
    if not file_path or not file_path.endswith('.xlsx'):
        raise ExcelParserError("Invalid or missing data file path.")
        
    try:
        # Read the first sheet of the Excel file
        df = pd.read_excel(file_path)
    except FileNotFoundError:
        raise ExcelParserError(f"Data file not found at: {file_path}")
    except Exception as e:
        raise ExcelParserError(f"Error reading Excel file: {e}")

    # Standardize column names to match Pydantic model aliases (or standard snake_case)
    # Based on the mock data keys: id, name, affiliation, country, city, expertiseArea, publicationsCount, hIndex, citations
    column_mapping = {
        'id': 'id',
        'name': 'name',
        'affiliation': 'affiliation',
        'country': 'country',
        'city': 'city',
        'expertiseArea': 'expertiseArea',
        'publicationsCount': 'publicationsCount',
        'hIndex': 'hIndex',
        'citations': 'citations',
    }
    
    # Clean up column names to match the expected format
    df.columns = df.columns.map(lambda x: x.split('_')[0] if x.startswith('id_') else x)
    
    # Rename columns to ensure Pydantic model mapping works
    df.rename(columns={
        'expertiseArea': 'expertiseArea',
        'publicationsCount': 'publicationsCount',
        'hIndex': 'hIndex'
    }, inplace=True)

    # Basic data cleaning: fill NaNs for 'city' (which is optional) and ensure numerics are correct
    df['city'] = df['city'].fillna('')
    numeric_cols = ['publicationsCount', 'hIndex', 'citations']
    for col in numeric_cols:
        # Replace non-numeric values (if any) with 0 or a placeholder, then convert to int
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

    kols: List[KOL] = []
    error_count = 0
    
    # Convert DataFrame rows to Pydantic models with validation
    for index, row in df.iterrows():
        try:
            # Pydantic validation handles constraints like ge=0 and type safety
            kol_data: Dict[str, Any] = row.to_dict()
            # Ensure 'id' is a string
            kol_data['id'] = str(kol_data['id']) 
            
            kol = KOL.model_validate(kol_data)
            kols.append(kol)
            
        except ValidationError as e:
            error_count += 1
            logging.warning(f"Data validation error on row {index + 1}: {e}")
        except Exception as e:
            error_count += 1
            logging.error(f"Unexpected error processing row {index + 1}: {e}")

    logging.info(f"Successfully parsed {len(kols)} KOL records. {error_count} rows skipped due to errors.")
    return kols