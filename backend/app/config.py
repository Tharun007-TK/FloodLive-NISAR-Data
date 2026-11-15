"""
FloodMap Live — Backend System Configuration
Loads environment variables, defines filesystem storage paths, and handles authentication states.
"""

import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Resolve project base paths
BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BACKEND_DIR.parent

# Load .env file from backend directory
env_path = BACKEND_DIR / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    PROJECT_NAME: str = "FloodMap Live — Scientific NISAR Geospatial Processing Engine"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    
    # Allowed CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]
    
    # --------------------------------------------------------------------------
    # NASA Earthdata Authentication Configuration
    # --------------------------------------------------------------------------
    EARTHDATA_USERNAME: str = os.getenv("EARTHDATA_USERNAME", "")
    EARTHDATA_PASSWORD: str = os.getenv("EARTHDATA_PASSWORD", "")
    EARTHDATA_TOKEN: str = os.getenv("EARTHDATA_TOKEN", "")
    
    # Copernicus Data Space Ecosystem (CDSE)
    CDSE_CLIENT_ID: str = os.getenv("CDSE_CLIENT_ID", "")
    CDSE_CLIENT_SECRET: str = os.getenv("CDSE_CLIENT_SECRET", "")
    
    # --------------------------------------------------------------------------
    # Data Storage Paths
    # --------------------------------------------------------------------------
    DATASET_STORAGE_PATH: Path = (
        PROJECT_ROOT / "frontend" / "public" / "data"
    ).resolve()
    
    PROCESSED_OUTPUT_PATH: Path = (
        DATASET_STORAGE_PATH / "nisar"
    ).resolve()
    
    JOBS_CACHE_DIR: Path = (
        BACKEND_DIR / "cache" / "jobs"
    ).resolve()
    
    ANCILLARY_CACHE_DIR: Path = (
        BACKEND_DIR / "cache" / "ancillary"
    ).resolve()
    
    CACHE_EXPIRATION_HOURS: int = int(os.getenv("CACHE_EXPIRATION_HOURS", 72))
    
    # Default Equal Area CRS for area computations (EPSG:6933 World Cylindrical Equal Area)
    EQUAL_AREA_CRS: str = "EPSG:6933"
    
    @property
    def is_earthdata_configured(self) -> bool:
        """Checks if valid NASA Earthdata credentials are provided (not placeholders)."""
        valid_user = bool(
            self.EARTHDATA_USERNAME
            and "your_" not in self.EARTHDATA_USERNAME.lower()
            and len(self.EARTHDATA_USERNAME) > 2
        )
        valid_pass = bool(
            self.EARTHDATA_PASSWORD
            and "your_" not in self.EARTHDATA_PASSWORD.lower()
            and len(self.EARTHDATA_PASSWORD) > 2
        )
        has_token = bool(
            self.EARTHDATA_TOKEN 
            and "your_" not in self.EARTHDATA_TOKEN.lower() 
            and len(self.EARTHDATA_TOKEN) > 10
        )
        return (valid_user and valid_pass) or has_token
        
    @property
    def is_cdse_configured(self) -> bool:
        """Checks if Copernicus Data Space credentials are configured."""
        return bool(
            self.CDSE_CLIENT_ID
            and "your_" not in self.CDSE_CLIENT_ID.lower()
            and self.CDSE_CLIENT_SECRET
            and "your_" not in self.CDSE_CLIENT_SECRET.lower()
        )


settings = Settings()

# Ensure directories exist
os.makedirs(settings.DATASET_STORAGE_PATH, exist_ok=True)
os.makedirs(settings.PROCESSED_OUTPUT_PATH, exist_ok=True)
os.makedirs(settings.JOBS_CACHE_DIR, exist_ok=True)
os.makedirs(settings.ANCILLARY_CACHE_DIR, exist_ok=True)
