import pandas as pd
from typing import List, Dict, Any
from pydantic import ValidationError
import logging

from ..models import KOL # Relative import

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ExcelParserError(Exception):
    """Custom exception for file parsing issues."""
    pass

def parse_excel_file(file_path: str) -> List[KOL]:
    """
    Reads the 'Authors' sheet of an Excel file, cleans data, and converts rows into a list of validated KOL objects.
    """
    logging.info(f"Attempting to parse Excel file from: {file_path}")
    
    if not file_path or not file_path.endswith('.xlsx'):
        raise ExcelParserError("Invalid or missing data file path.")
        
    try:
        # 1. READ ONLY THE 'Authors' SHEET
        # We assume the main KOL data is in a sheet named 'Authors'
        # The header should be the first row (header=0).
        df = pd.read_excel(file_path, sheet_name='Authors', header=0) 
        logging.info(f"Successfully read 'Authors' sheet with {len(df)} rows.")
    except FileNotFoundError:
        raise ExcelParserError(f"Data file not found at: {file_path}")
    except ValueError:
        # This catches if the sheet name 'Authors' is not found
        raise ExcelParserError(f"Sheet 'Authors' not found in the Excel file.")
    except Exception as e:
        raise ExcelParserError(f"Error reading Excel file: {e}")

    # Standardize/rename columns to match Pydantic model
    df.rename(columns={
        'Author ID': 'id', # Maps to model.id
        'Name': 'name', # Maps to model.name
        'Affiliations/Sites': 'affiliation', # Maps to model.affiliation
        'Countries': 'country', # Maps to model.country
        # The 'city' column is MISSING in this sheet, it is Optional in the Pydantic model.
        # The column 'expertiseArea' is also MISSING in this sheet. We'll use Keywords and set expertiseArea as Optional for now.
        # Publications, H-Index, and Citations are also missing in the Authors sheet.
        
        # Based on the original KOL model:
        # expertise_area, publications_count, h_index, citations
        # We MUST remove all processing of columns that are NOT in the 'Authors' sheet:

        # 2. RENAME ONLY EXISTING COLUMNS (id, name, affiliation, country)
    }, inplace=True)


    # 3. Handle MISSING COLUMNS
    # Since the 'Authors' sheet only contains basic info, we must make these fields
    # optional or assign placeholders if they are mandatory in KOL model.
    df['publicationsCount'] = 0
    df['hIndex'] = 0
    df['citations'] = 0
    df['expertiseArea'] = 'Unknown' # Placeholder
    df['city'] = '' # Add the missing column with empty strings
    
    # Standardize 'id' type
    df['id'] = df['id'].astype(str)
    
    # Fill NaN for 'affiliation' and 'country' to ensure they are strings
    df['affiliation'] = df['affiliation'].fillna('')
    df['country'] = df['country'].fillna('Unknown')


    kols: List[KOL] = []
    error_count = 0
    
    # Convert DataFrame rows to Pydantic models with validation
    for index, row in df.iterrows():
        try:
            kol_data: Dict[str, Any] = row.to_dict()
            
            # Pydantic validation handles constraints like ge=0 and type safety
            # We map the keys used in the model to the data dictionary
            kol = KOL(
                id=kol_data.get('id', str(index)), # Use 'id' column name if renamed
                name=kol_data['name'], 
                affiliation=kol_data.get('Affiliations/Sites', kol_data.get('affiliation', '')), # Use the column name directly if rename failed
                country=kol_data['Countries'], # Use the column name directly if rename failed
                city=kol_data.get('city', ''), # Now included
                expertiseArea=kol_data.get('expertiseArea', 'Unknown'),
                publicationsCount=kol_data.get('publicationsCount', 0),
                hIndex=kol_data.get('hIndex', 0),
                citations=kol_data.get('citations', 0)
            )
            kols.append(kol)
            
        except ValidationError as e:
            error_count += 1
            logging.warning(f"Data validation error on row {index + 1}: {e}")
        except KeyError as e:
            error_count += 1
            logging.error(f"Missing required column in Authors sheet: {e}")
        except Exception as e:
            error_count += 1
            logging.error(f"Unexpected error processing row {index + 1}: {e}")

    logging.info(f"Successfully parsed {len(kols)} KOL records. {error_count} rows skipped due to errors or missing columns.")
    return kols