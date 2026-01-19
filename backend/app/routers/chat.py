from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.database import get_db
from app.models import Appointment, Doctor, Specialization
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["Chat"])

# ================= SCHEMAS =================

class ChatMessage(BaseModel):
    message: str
    chatType: str  # "post-booking" or "general-inquiry"
    appointmentToken: Optional[str] = None

class ChatAction(BaseModel):
    action: str
    chatType: str
    appointmentToken: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class MenuOption(BaseModel):
    id: str
    label: str
    action: str
    icon: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    menu: Optional[List[MenuOption]] = None
    data: Optional[Dict[str, Any]] = None

# ================= MENU CONFIGURATIONS =================

POST_BOOKING_MENU = [
    {"id": "view_details", "label": "📋 View Details", "action": "show_appointment", "icon": "📋"},
    {"id": "download_pdf", "label": "📄 Download Receipt", "action": "download_receipt", "icon": "📄"},
    {"id": "add_calendar", "label": "📅 Add to Calendar", "action": "calendar_link", "icon": "📅"},
    {"id": "reschedule", "label": "🔁 Reschedule", "action": "reschedule", "icon": "🔁"},
    {"id": "cancel", "label": "❌ Cancel Appointment", "action": "cancel", "icon": "❌"},
]

GENERAL_INQUIRY_MENU = [
    {"id": "book", "label": "🩺 Book Appointment", "action": "book_appointment", "icon": "🩺"},
    {"id": "info", "label": "🏥 Hospital Info", "action": "show_info", "icon": "🏥"},
    {"id": "doctors", "label": "👨‍⚕️ Our Doctors", "action": "show_doctors", "icon": "👨‍⚕️"},
    {"id": "hours", "label": "🕐 Working Hours", "action": "show_hours", "icon": "🕐"},
    {"id": "location", "label": "📍 Location", "action": "show_location", "icon": "📍"},
    {"id": "contact", "label": "☎️ Contact Us", "action": "show_contact", "icon": "☎️"},
]

# ================= ENDPOINTS =================

@router.get("/menu/{chat_type}")
async def get_menu(chat_type: str):
    """Get menu options for chat type"""
    if chat_type == "post-booking":
        return {
            "success": True,
            "title": "Appointment Confirmed! 🎉",
            "menu": POST_BOOKING_MENU
        }
    elif chat_type == "general-inquiry":
        return {
            "success": True,
            "title": "How can I help you? 👋",
            "menu": GENERAL_INQUIRY_MENU
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid chat type")


@router.post("/action")
async def handle_action(action: ChatAction, db: Session = Depends(get_db)):
    """Handle chatbot actions"""
    
    # ===== POST-BOOKING ACTIONS =====
    if action.chatType == "post-booking":
        if not action.appointmentToken:
            raise HTTPException(status_code=400, detail="Appointment token required")
        
        # Get appointment
        appointment = db.query(Appointment).filter(
            Appointment.id == action.appointmentToken
        ).first()
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # View appointment details
        if action.action == "show_appointment":
            doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
            return ChatResponse(
                message=f"📋 **Appointment Details**\n\n"
                        f"🗓 Date: {appointment.appointment_date}\n"
                        f"⏰ Time: {appointment.appointment_time}\n"
                        f"👨‍⚕️ Doctor: {doctor.name if doctor else 'N/A'}\n"
                        f"🏥 Specialization: {appointment.specialization}\n"
                        f"📝 Status: {appointment.status.title()}\n"
                        f"🎫 Token: {appointment.id}",
                menu=POST_BOOKING_MENU
            )
        
        # Download receipt
        elif action.action == "download_receipt":
            # Generate download link
            download_url = f"/api/appointments/{appointment.id}/receipt"
            return ChatResponse(
                message="📄 Your receipt is ready!",
                data={"downloadUrl": download_url, "fileName": f"receipt_{appointment.id}.pdf"},
                menu=POST_BOOKING_MENU
            )
        
        # Calendar link
        elif action.action == "calendar_link":
            # Generate Google Calendar link
            date_str = appointment.appointment_date.replace("-", "")
            time_str = appointment.appointment_time.replace(":", "") + "00"
            start = f"{date_str}T{time_str}"
            end_hour = str(int(time_str[:2]) + 1).zfill(2)
            end = f"{date_str}T{end_hour}{time_str[2:]}"
            
            doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
            doctor_name = doctor.name if doctor else "Doctor"
            
            calendar_url = (
                "https://calendar.google.com/calendar/render?action=TEMPLATE"
                f"&text=Dental+Appointment+-+{doctor_name.replace(' ', '+')}"
                f"&dates={start}/{end}"
                "&details=ProHealth+Sarojaa+Clinic+Appointment"
                "&trp=false"
            )
            
            return ChatResponse(
                message="📅 Click the link below to add to your calendar!",
                data={"calendarUrl": calendar_url},
                menu=POST_BOOKING_MENU
            )
        
        # Reschedule
        elif action.action == "reschedule":
            return ChatResponse(
                message="🔁 To reschedule your appointment, please visit the booking page.",
                data={"redirectUrl": "/book"},
                menu=POST_BOOKING_MENU
            )
        
        # Cancel
        elif action.action == "cancel":
            appointment.status = "cancelled"
            db.commit()
            return ChatResponse(
                message="❌ Your appointment has been cancelled successfully.",
                menu=None
            )
    
    # ===== GENERAL INQUIRY ACTIONS =====
    elif action.chatType == "general-inquiry":
        
        # Book appointment
        if action.action == "book_appointment":
            return ChatResponse(
                message="🩺 Ready to book your appointment? Click below to get started!",
                data={"redirectUrl": "/book"},
                menu=GENERAL_INQUIRY_MENU
            )
        
        # Hospital info
        elif action.action == "show_info":
            return ChatResponse(
                message="🏥 **ProHealth Sarojaa Clinic**\n\n"
                        "We are a modern dental clinic providing world-class dental care "
                        "with state-of-the-art facilities and experienced specialists.\n\n"
                        "✨ **Our Services:**\n"
                        "• General Dentistry\n"
                        "• Cosmetic Dentistry\n"
                        "• Orthodontics\n"
                        "• Dental Implants\n"
                        "• Teeth Whitening\n"
                        "• Root Canal Treatment",
                menu=GENERAL_INQUIRY_MENU
            )
        
        # Show doctors
        elif action.action == "show_doctors":
            doctors = db.query(Doctor).filter(Doctor.is_active == True).limit(5).all()
            doctor_list = "\n\n".join([
                f"👨‍⚕️ **{doc.name}**\n"
                f"🏥 {doc.specialization}\n"
                f"🎓 {doc.qualification}\n"
                f"⏳ {doc.experience} years experience"
                for doc in doctors
            ])
            return ChatResponse(
                message=f"👨‍⚕️ **Our Expert Doctors**\n\n{doctor_list}\n\n"
                        "Visit our Doctors page to see all specialists!",
                data={"redirectUrl": "/doctors"},
                menu=GENERAL_INQUIRY_MENU
            )
        
        # Working hours
        elif action.action == "show_hours":
            return ChatResponse(
                message="🕐 **Working Hours**\n\n"
                        "Monday - Friday: 9:00 AM - 8:00 PM\n"
                        "Saturday: 9:00 AM - 6:00 PM\n"
                        "Sunday: 10:00 AM - 4:00 PM\n\n"
                        "We're here to serve you 7 days a week!",
                menu=GENERAL_INQUIRY_MENU
            )
        
        # Location
        elif action.action == "show_location":
            return ChatResponse(
                message="📍 **Our Location**\n\n"
                        "ProHealth Sarojaa Clinic\n"
                        "123 Dental Street\n"
                        "Medical District, Chennai\n"
                        "Tamil Nadu 600001\n\n"
                        "🚗 Free parking available\n"
                        "🚇 Near Metro Station",
                data={"mapUrl": "https://maps.google.com"},
                menu=GENERAL_INQUIRY_MENU
            )
        
        # Contact
        elif action.action == "show_contact":
            return ChatResponse(
                message="☎️ **Contact Us**\n\n"
                        "📞 Phone: +91 9876543210\n"
                        "📧 Email: care@prohealthclinic.com\n"
                        "🌐 Website: www.prohealthclinic.com\n\n"
                        "We're here to help! Feel free to reach out anytime.",
                menu=GENERAL_INQUIRY_MENU
            )
    
    raise HTTPException(status_code=400, detail="Invalid action")


@router.post("/message")
async def process_message(msg: ChatMessage, db: Session = Depends(get_db)):
    """Process user text messages (basic responses)"""
    
    # For now, just return the menu
    if msg.chatType == "post-booking":
        return ChatResponse(
            message="I can help you with your appointment! Choose an option below:",
            menu=POST_BOOKING_MENU
        )
    else:
        return ChatResponse(
            message="How can I assist you today? Choose an option below:",
            menu=GENERAL_INQUIRY_MENU
        )
