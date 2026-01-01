from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Admin
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Security configuration
# Use environment variable or fallback to default (for development only)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production-use-environment-variable")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "43200"))  # 30 days default

# Debug: Log SECRET_KEY status (first 10 chars only for security)
import logging
logger = logging.getLogger(__name__)
logger.info(f"[AUTH] SECRET_KEY loaded: {SECRET_KEY[:10]}... (length: {len(SECRET_KEY)})")
logger.info(f"[AUTH] SECRET_KEY from env: {os.getenv('SECRET_KEY', 'NOT SET')[:10] if os.getenv('SECRET_KEY') else 'NOT SET'}...")

# Use bcrypt with proper configuration to avoid version issues
pwd_context = CryptContext(
    schemes=["bcrypt"],
    bcrypt__rounds=12,
    deprecated="auto"
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/admin/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    # Ensure password is a string and not too long for bcrypt (72 bytes max)
    if isinstance(password, bytes):
        password = password.decode('utf-8')
    # Truncate if necessary (though admin123 is only 9 chars, so this shouldn't be needed)
    password = password[:72] if len(password.encode('utf-8')) > 72 else password
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_admin(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Debug logging (remove in production)
    import logging
    logger = logging.getLogger(__name__)
    
    # Print debug info to console (for development)
    print(f"[AUTH DEBUG] Token received: {bool(token)}, Token length: {len(token) if token else 0}")
    print(f"[AUTH DEBUG] SECRET_KEY loaded: {bool(SECRET_KEY)}, Length: {len(SECRET_KEY) if SECRET_KEY else 0}")
    
    if not token:
        print("[AUTH DEBUG] No token provided in request")
        logger.warning("No token provided in request")
        raise credentials_exception
    
    try:
        print(f"[AUTH DEBUG] Attempting to decode token with SECRET_KEY...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub_claim = payload.get("sub")
        print(f"[AUTH DEBUG] Token decoded successfully. Sub claim: {sub_claim} (type: {type(sub_claim)})")
        if sub_claim is None:
            print("[AUTH DEBUG] Token missing 'sub' claim")
            logger.warning(f"Token missing 'sub' claim. Payload: {payload}")
            raise credentials_exception
        # Convert sub (string) back to int for database query
        try:
            admin_id: int = int(sub_claim)
        except (ValueError, TypeError):
            print(f"[AUTH DEBUG] Invalid 'sub' claim format: {sub_claim}")
            logger.warning(f"Invalid 'sub' claim format: {sub_claim}")
            raise credentials_exception
    except JWTError as e:
        print(f"[AUTH DEBUG] JWT decode error: {str(e)}")
        logger.warning(f"JWT decode error: {str(e)}")
        raise credentials_exception
    except Exception as e:
        print(f"[AUTH DEBUG] Unexpected error: {str(e)}")
        logger.error(f"Unexpected error validating token: {str(e)}")
        raise credentials_exception
    
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        logger.warning(f"Admin with ID {admin_id} not found in database")
        raise credentials_exception
    return admin

