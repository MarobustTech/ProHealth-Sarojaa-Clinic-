"""
Menu Handlers
Main menu and information screens
"""
from telegram import Update
from telegram.ext import ContextTypes
from states import BotState, CallbackData
from keyboards import main_menu_keyboard
from utils import edit_or_send


async def show_main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show main menu"""
    welcome_text = (
        "🏥 *Welcome to Sree Sarojaa Multi Specialty Dental Clinic!*\n\n"
        "We're here to help you achieve a healthy, beautiful smile! "
        "Our experienced team of dental specialists is ready to provide you with the best care.\n\n"
        "📍 *Location:* Salem, Tamil Nadu\n"
        "⏰ *Hours:* Mon-Fri: 8 AM - 8 PM | Sat: 9 AM - 5 PM\n\n"
        "What would you like to do today?"
    )
    
    await edit_or_send(update, context, welcome_text, main_menu_keyboard())
    return BotState.MAIN_MENU


async def handle_clinic_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show clinic information"""
    clinic_text = (
        "🏥 *Sree Sarojaa Multi Specialty Dental Clinic*\n\n"
        "📍 *Address:*\n"
        "Near Vincent Bus Stop, Cherry Road\n"
        "Kumaraswamypatti, Salem - 636007\n"
        "Tamil Nadu, India\n\n"
        "⏰ *Working Hours:*\n"
        "Monday - Friday: 8:00 AM - 8:00 PM\n"
        "Saturday: 9:00 AM - 5:00 PM\n"
        "Sunday: Closed\n\n"
        "🦷 *Our Specialties:*\n"
        "• Orthodontics (Braces & Aligners)\n"
        "• Endodontics (Root Canal)\n"
        "• Prosthodontics (Dentures & Crowns)\n"
        "• Periodontics (Gum Treatment)\n"
        "• Oral Surgery\n"
        "• Cosmetic Dentistry\n"
        "• Pediatric Dentistry\n\n"
        "💎 *Advanced Technology:*\n"
        "• Intraoral Camera (Unicorn)\n"
        "• Laser Technology (Dentsply Sirona)\n"
        "• 3D Scanner (Shining 3D)\n"
        "• Invisible Aligners\n"
        "• Straumann Implants\n\n"
        "🌟 *Serving since 1998*"
    )
    
    from keyboards import navigation_keyboard
    await edit_or_send(
        update, 
        context, 
        clinic_text, 
        navigation_keyboard(back=False, cancel=False, main_menu=True)
    )
    return BotState.CLINIC_INFO


async def handle_contact(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show contact information"""
    contact_text = (
        "📞 *Contact Us*\n\n"
        "📱 *Phone:*\n"
        "• Main: 0427 2313339\n"
        "• Mobile: 8946088182\n\n"
        "📧 *Email:*\n"
        "sreesarojaa@dental.com\n\n"
        "🗺️ *Location:*\n"
        "Near Vincent Bus Stop, Cherry Road\n"
        "Kumaraswamypatti, Salem - 636007\n\n"
        "🔗 *Find Us:*\n"
        "[Google Maps](https://maps.google.com/?q=Sree+Sarojaa+Dental+Clinic+Salem)\n\n"
        "💬 *For Emergencies:*\n"
        "Call us immediately at 8946088182\n\n"
        "We're here to help! 😊"
    )
    
    from keyboards import navigation_keyboard
    await edit_or_send(
        update, 
        context, 
        contact_text, 
        navigation_keyboard(back=False, cancel=False, main_menu=True)
    )
    return BotState.CONTACT_INFO
