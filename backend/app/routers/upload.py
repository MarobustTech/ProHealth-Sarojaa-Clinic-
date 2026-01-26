
from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
import os

router = APIRouter()

# Configure Cloudinary
cloudinary.config( 
  cloud_name = os.getenv("CLOUD_NAME"), 
  api_key = os.getenv("CLOUD_API_KEY"), 
  api_secret = os.getenv("CLOUD_API_SECRET") 
)

@router.post("/upload", response_model=dict)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Uploading file to Cloudinary
        result = cloudinary.uploader.upload(file.file, folder="banners")
        return {"url": result.get("secure_url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
