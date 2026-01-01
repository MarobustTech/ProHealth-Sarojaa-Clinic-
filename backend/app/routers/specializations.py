from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Specialization
from app.schemas import SpecializationCreate, SpecializationUpdate, SpecializationResponse
from app.auth import get_current_admin

router = APIRouter()

def specialization_to_response(spec: Specialization) -> dict:
    return {
        "id": spec.id,
        "_id": str(spec.id),  # Support both id and _id for frontend compatibility
        "name": spec.name,
        "description": spec.description,
        "icon": spec.icon,
        "isActive": spec.is_active,
        "createdAt": spec.created_at
    }

@router.get("", response_model=List[SpecializationResponse])
@router.get("/all", response_model=List[SpecializationResponse])
async def get_specializations(
    status: Optional[str] = Query(None, description="Filter by status: active"),
    active_only: Optional[bool] = Query(None, description="Filter active only"),
    db: Session = Depends(get_db)
):
    query = db.query(Specialization)
    
    if status == "active" or active_only:
        query = query.filter(Specialization.is_active == True)
    
    specializations = query.all()
    return [specialization_to_response(spec) for spec in specializations]

@router.get("/active", response_model=List[SpecializationResponse])
async def get_active_specializations(db: Session = Depends(get_db)):
    specializations = db.query(Specialization).filter(Specialization.is_active == True).all()
    return [specialization_to_response(spec) for spec in specializations]

@router.get("/{spec_id}", response_model=SpecializationResponse)
async def get_specialization(spec_id: int, db: Session = Depends(get_db)):
    spec = db.query(Specialization).filter(Specialization.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specialization not found")
    return specialization_to_response(spec)

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_specialization(
    spec_data: SpecializationCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Check if specialization with name already exists
    existing_spec = db.query(Specialization).filter(Specialization.name == spec_data.name).first()
    if existing_spec:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Specialization with this name already exists"
        )
    
    new_spec = Specialization(
        name=spec_data.name,
        description=spec_data.description,
        icon=spec_data.icon,
        is_active=spec_data.isActive if spec_data.isActive is not None else True
    )
    db.add(new_spec)
    db.commit()
    db.refresh(new_spec)
    
    return {
        "success": True,
        "message": "Specialization created successfully",
        "specialization": specialization_to_response(new_spec)
    }

@router.put("/{spec_id}", response_model=dict)
async def update_specialization(
    spec_id: int,
    spec_data: SpecializationUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    spec = db.query(Specialization).filter(Specialization.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specialization not found")
    
    # Check name uniqueness if name is being updated
    if spec_data.name and spec_data.name != spec.name:
        existing_spec = db.query(Specialization).filter(Specialization.name == spec_data.name).first()
        if existing_spec:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Specialization with this name already exists"
            )
    
    # Update fields
    update_data = spec_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "isActive":
            setattr(spec, "is_active", value)
        else:
            setattr(spec, key, value)
    
    db.commit()
    db.refresh(spec)
    
    return {
        "success": True,
        "message": "Specialization updated successfully",
        "specialization": specialization_to_response(spec)
    }

@router.patch("/{spec_id}/toggle-active", response_model=dict)
async def toggle_specialization_active(
    spec_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    spec = db.query(Specialization).filter(Specialization.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specialization not found")
    
    spec.is_active = not spec.is_active
    db.commit()
    db.refresh(spec)
    
    return {
        "success": True,
        "message": f"Specialization {'activated' if spec.is_active else 'deactivated'} successfully",
        "specialization": specialization_to_response(spec)
    }

@router.delete("/{spec_id}", response_model=dict)
async def delete_specialization(
    spec_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    spec = db.query(Specialization).filter(Specialization.id == spec_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specialization not found")
    
    db.delete(spec)
    db.commit()
    
    return {
        "success": True,
        "message": "Specialization deleted successfully"
    }

