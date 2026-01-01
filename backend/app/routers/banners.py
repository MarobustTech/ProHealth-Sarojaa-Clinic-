from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Banner
from app.schemas import BannerCreate, BannerUpdate, BannerResponse
from app.auth import get_current_admin

router = APIRouter()

def banner_to_response(banner: Banner) -> dict:
    return {
        "id": banner.id,
        "_id": str(banner.id),  # Support both id and _id for frontend compatibility
        "title": banner.title,
        "description": banner.description,
        "image": banner.image,
        "link": banner.link,
        "buttonText": banner.button_text or (banner.link and "Learn More" or None),  # Frontend compatibility
        "buttonLink": banner.link,  # Frontend compatibility
        "isActive": banner.is_active,
        "order": banner.order,
        "createdAt": banner.created_at
    }

@router.get("", response_model=List[BannerResponse])
async def get_banners(
    status: Optional[str] = Query(None, description="Filter by status: active"),
    db: Session = Depends(get_db)
):
    query = db.query(Banner)
    
    if status == "active":
        query = query.filter(Banner.is_active == True)
    
    banners = query.order_by(Banner.order.asc()).all()
    return [banner_to_response(banner) for banner in banners]

@router.get("/{banner_id}", response_model=BannerResponse)
async def get_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return banner_to_response(banner)

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_banner(
    banner_data: BannerCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Handle both 'link' and 'buttonLink' fields
    link = banner_data.link or banner_data.buttonLink
    
    new_banner = Banner(
        title=banner_data.title,
        description=banner_data.description,
        image=banner_data.image,
        link=link,
        button_text=banner_data.buttonText,
        is_active=banner_data.isActive if banner_data.isActive is not None else True,
        order=banner_data.order if banner_data.order is not None else 0
    )
    db.add(new_banner)
    db.commit()
    db.refresh(new_banner)
    
    return {
        "success": True,
        "message": "Banner created successfully",
        "banner": banner_to_response(new_banner)
    }

@router.put("/{banner_id}", response_model=dict)
async def update_banner(
    banner_id: int,
    banner_data: BannerUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    # Handle buttonLink -> link mapping
    link = banner_data.link or banner_data.buttonLink
    if link is not None:
        banner.link = link
    
    # Handle buttonText
    if banner_data.buttonText is not None:
        banner.button_text = banner_data.buttonText
    
    # Update other fields
    update_data = banner_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "isActive":
            setattr(banner, "is_active", value)
        elif key not in ["buttonLink", "buttonText", "link"]:  # Skip already handled fields
            setattr(banner, key, value)
    
    db.commit()
    db.refresh(banner)
    
    return {
        "success": True,
        "message": "Banner updated successfully",
        "banner": banner_to_response(banner)
    }

@router.patch("/{banner_id}/toggle-active", response_model=dict)
async def toggle_banner_active(
    banner_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    banner.is_active = not banner.is_active
    db.commit()
    db.refresh(banner)
    
    return {
        "success": True,
        "message": f"Banner {'activated' if banner.is_active else 'deactivated'} successfully",
        "banner": banner_to_response(banner)
    }

@router.delete("/{banner_id}", response_model=dict)
async def delete_banner(
    banner_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    db.delete(banner)
    db.commit()
    
    return {
        "success": True,
        "message": "Banner deleted successfully"
    }

