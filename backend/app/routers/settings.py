from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..models import Admin
from ..auth import get_current_admin
from passlib.context import CryptContext

router = APIRouter(prefix="/api/admin/settings", tags=["admin-settings"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class HospitalSettings(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zipCode: str

class NotificationSettings(BaseModel):
    emailNotifications: bool
    smsNotifications: bool
    appointmentReminders: bool
    systemAlerts: bool

class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str

class AdminProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

# Get admin profile
@router.get("/profile")
async def get_admin_profile(current_admin: Admin = Depends(get_current_admin)):
    return {
        "success": True,
        "admin": {
            "id": current_admin.id,
            "name": current_admin.name,
            "email": current_admin.email
        }
    }

# Update admin profile
@router.put("/profile")
async def update_admin_profile(
    profile_data: AdminProfileUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Check if email is being changed and if it's already in use
    if profile_data.email and profile_data.email != current_admin.email:
        existing_admin = db.query(Admin).filter(Admin.email == profile_data.email).first()
        if existing_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        current_admin.email = profile_data.email
    
    if profile_data.name:
        current_admin.name = profile_data.name
    
    db.commit()
    db.refresh(current_admin)
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "admin": {
            "id": current_admin.id,
            "name": current_admin.name,
            "email": current_admin.email
        }
    }

# Change password
@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Verify current password
    if not pwd_context.verify(password_data.currentPassword, current_admin.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash and update new password
    hashed_password = pwd_context.hash(password_data.newPassword)
    current_admin.password = hashed_password
    
    db.commit()
    
    return {
        "success": True,
        "message": "Password changed successfully"
    }

# Get hospital settings (placeholder - can be extended to use a settings table)
@router.get("/hospital")
async def get_hospital_settings(current_admin: Admin = Depends(get_current_admin)):
    # For now, return default settings
    # In production, you'd fetch from a settings table
    return {
        "success": True,
        "settings": {
            "name": "ProHealth Sarojaa Clinic",
            "email": current_admin.email,
            "phone": "1234567890",
            "address": "123 Health Street, Medical District",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "zipCode": "600001"
        }
    }

# Update hospital settings (placeholder)
@router.put("/hospital")
async def update_hospital_settings(
    settings: HospitalSettings,
    current_admin: Admin = Depends(get_current_admin)
):
    # In production, you'd save to a settings table
    return {
        "success": True,
        "message": "Hospital settings updated successfully",
        "settings": settings.dict()
    }

# Get notification settings (placeholder)
@router.get("/notifications")
async def get_notification_settings(current_admin: Admin = Depends(get_current_admin)):
    # In production, fetch from database
    return {
        "success": True,
        "settings": {
            "emailNotifications": True,
            "smsNotifications": True,
            "appointmentReminders": True,
            "systemAlerts": True
        }
    }

# Update notification settings (placeholder)
@router.put("/notifications")
async def update_notification_settings(
    settings: NotificationSettings,
    current_admin: Admin = Depends(get_current_admin)
):
    # In production, save to database
    return {
        "success": True,
        "message": "Notification settings updated successfully",
        "settings": settings.dict()
    }
