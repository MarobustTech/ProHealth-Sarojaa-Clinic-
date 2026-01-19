"""
Booking Flow Handlers
Complete appointment booking conversation flow
"""
from telegram import Update
from telegram.ext import ContextTypes
from states import BotState, CallbackData
from keyboards import (
    gender_keyboard,
    issue_keyboard,
    doctor_keyboard,
    build_calendar_keyboard,
    time_slots_keyboard,
    confirmation_keyboard,
    navigation_keyboard,
    main_menu_keyboard
)
from utils import (
    edit_or_send,
    format_booking_header,
    format_patient_summary,
    validate_phone,
    validate_age,
    get_issue_label,
    get_gender_label,
    cleanup_old_messages
)
import httpx
from datetime import date


# API helper
async def api_get(endpoint):
    """Make GET request to API"""
    base_url = "http://localhost:8000"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{base_url}{endpoint}", timeout=10.0)
            return response.json() if response.status_code == 200 else None
        except:
            return None


async def api_post(endpoint, data):
    """Make POST request to API"""
    base_url = "http://localhost:8000"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{base_url}{endpoint}", json=data, timeout=10.0)
            return response.json() if response.status_code in [200, 201] else None
        except:
            return None


async def start_booking(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Start booking flow - ask for name"""
    text = (
        f"{format_booking_header(1)}\n"
        "👤 *Please enter your full name:*\n\n"
        "_Example: John Doe_"
    )
    
    await edit_or_send(update, context, text, navigation_keyboard())
    return BotState.BOOKING_NAME


async def handle_name_input(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle name input"""
    if not update.message or not update.message.text:
        return BotState.BOOKING_NAME
    
    name = update.message.text.strip()
    
    if len(name) < 2:
        await update.message.reply_text(
            "⚠️ Please enter a valid name (at least 2 characters).",
            reply_markup=navigation_keyboard()
        )
        return BotState.BOOKING_NAME
    
    # Save name
    context.user_data['patient_name'] = name
    
    # Clean up user's message
    await cleanup_old_messages(update, context)
    
    # Ask for phone
    text = (
        f"{format_booking_header(2)}\n"
        f"✅ Name: {name}\n\n"
        "📱 *Please enter your phone number:*\n\n"
        "_Example: 9876543210_"
    )
    
    msg = await update.message.reply_text(text, reply_markup=navigation_keyboard(), parse_mode="Markdown")
    context.user_data['last_bot_message_id'] = msg.message_id
    
    return BotState.BOOKING_PHONE


async def handle_phone_input(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle phone input"""
    if not update.message or not update.message.text:
        return BotState.BOOKING_PHONE
    
    phone = update.message.text.strip()
    
    if not validate_phone(phone):
        await update.message.reply_text(
            "⚠️ Please enter a valid phone number (10 digits).",
            reply_markup=navigation_keyboard()
        )
        return BotState.BOOKING_PHONE
    
    # Save phone
    context.user_data['patient_phone'] = phone
    
    # Clean up
    await cleanup_old_messages(update, context)
    
    # Ask for age
    text = (
        f"{format_booking_header(3)}\n"
        f"✅ Name: {context.user_data['patient_name']}\n"
        f"✅ Phone: {phone}\n\n"
        "🎂 *Please enter your age:*\n\n"
        "_Example: 25_"
    )
    
    msg = await update.message.reply_text(text, reply_markup=navigation_keyboard(), parse_mode="Markdown")
    context.user_data['last_bot_message_id'] = msg.message_id
    
    return BotState.BOOKING_AGE


async def handle_age_input(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle age input"""
    if not update.message or not update.message.text:
        return BotState.BOOKING_AGE
    
    age_str = update.message.text.strip()
    valid, age = validate_age(age_str)
    
    if not valid:
        await update.message.reply_text(
            "⚠️ Please enter a valid age (1-120).",
            reply_markup=navigation_keyboard()
        )
        return BotState.BOOKING_AGE
    
    # Save age
    context.user_data['patient_age'] = age
    
    # Clean up
    await cleanup_old_messages(update, context)
    
    # Ask for gender with inline buttons
    text = (
        f"{format_booking_header(4)}\n"
        f"✅ Name: {context.user_data['patient_name']}\n"
        f"✅ Phone: {context.user_data['patient_phone']}\n"
        f"✅ Age: {age}\n\n"
        "⚧ *Select your gender:*"
    )
    
    msg = await update.message.reply_text(text, reply_markup=gender_keyboard(), parse_mode="Markdown")
    context.user_data['last_bot_message_id'] = msg.message_id
    
    return BotState.BOOKING_GENDER


async def handle_gender_selection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle gender selection"""
    query = update.callback_query
    await query.answer()
    
    gender = get_gender_label(query.data)
    context.user_data['patient_gender'] = gender
    
    # Ask for issue with inline buttons
    text = (
        f"{format_booking_header(5)}\n"
        f"✅ Name: {context.user_data['patient_name']}\n"
        f"✅ Phone: {context.user_data['patient_phone']}\n"
        f"✅ Age: {context.user_data['patient_age']}\n"
        f"✅ Gender: {gender}\n\n"
        "🦷 *What brings you to our clinic?*\n"
        "_Select your dental concern:_"
    )
    
    await query.edit_message_text(text, reply_markup=issue_keyboard(), parse_mode="Markdown")
    
    return BotState.BOOKING_ISSUE


async def handle_issue_selection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle issue selection"""
    query = update.callback_query
    await query.answer()
    
    if query.data == CallbackData.ISSUE_OTHER:
        # Ask for custom issue
        text = (
            f"{format_booking_header(5)}\n\n"
            "📝 *Please describe your dental concern:*\n\n"
            "_Type your issue and send_"
        )
        await query.edit_message_text(text, reply_markup=navigation_keyboard(), parse_mode="Markdown")
        context.user_data['waiting_for_custom_issue'] = True
        return BotState.BOOKING_ISSUE
    
    issue = get_issue_label(query.data)
    context.user_data['patient_issue'] = issue
    
    # Fetch doctors
    doctors = await api_get("/api/doctors/all")
    
    if not doctors or len(doctors) == 0:
        await query.edit_message_text(
            "❌ No doctors available at the moment. Please try again later.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    # Show doctor selection
    text = (
        f"{format_booking_header(6)}\n"
        f"✅ Issue: {issue}\n\n"
        "👨‍⚕️ *Select your preferred doctor:*"
    )
    
    await query.edit_message_text(text, reply_markup=doctor_keyboard(doctors), parse_mode="Markdown")
    
    return BotState.BOOKING_DOCTOR


async def handle_custom_issue_input(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle custom issue text input"""
    if not update.message or not update.message.text:
        return BotState.BOOKING_ISSUE
    
    issue = update.message.text.strip()
    context.user_data['patient_issue'] = issue
    context.user_data.pop('waiting_for_custom_issue', None)
    
    # Clean up
    await cleanup_old_messages(update, context)
    
    # Fetch doctors
    doctors = await api_get("/api/doctors/all")
    
    if not doctors or len(doctors) == 0:
        await update.message.reply_text(
            "❌ No doctors available at the moment. Please try again later.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    # Show doctor selection
    text = (
        f"{format_booking_header(6)}\n"
        f"✅ Issue: {issue}\n\n"
        "👨‍⚕️ *Select your preferred doctor:*"
    )
    
    msg = await update.message.reply_text(text, reply_markup=doctor_keyboard(doctors), parse_mode="Markdown")
    context.user_data['last_bot_message_id'] = msg.message_id
    
    return BotState.BOOKING_DOCTOR


async def handle_doctor_selection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle doctor selection"""
    query = update.callback_query
    await query.answer()
    
    doctor_id = query.data.replace(CallbackData.DOCTOR_PREFIX, "")
    
    # Fetch doctor details
    doctors = await api_get("/api/doctors/all")
    selected_doctor = next((d for d in doctors if str(d['id']) == doctor_id), None)
    
    if not selected_doctor:
        await query.edit_message_text(
            "❌ Doctor not found. Please try again.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    context.user_data['selected_doctor'] = selected_doctor['name']
    context.user_data['selected_doctor_id'] = doctor_id
    context.user_data['selected_specialization'] = selected_doctor['specialization']
    
    # Show calendar
    today = date.today()
    text = (
        f"{format_booking_header(7)}\n"
        f"✅ Doctor: Dr. {selected_doctor['name']}\n\n"
        "📅 *Select appointment date:*"
    )
    
    calendar = build_calendar_keyboard(today.year, today.month, doctor_id)
    await query.edit_message_text(text, reply_markup=calendar, parse_mode="Markdown")
    
    return BotState.BOOKING_DATE


async def handle_date_selection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle date selection"""
    query = update.callback_query
    await query.answer()
    
    # Parse date from callback
    parts = query.data.replace(CallbackData.DATE_PREFIX, "").split("_")
    doctor_id = parts[0]
    date_str = parts[1]
    
    context.user_data['selected_date'] = date_str
    
    # Generate time slots (simplified - you can fetch from API)
    time_slots = [
        {"time": "9:00 AM", "available": True},
        {"time": "10:00 AM", "available": True},
        {"time": "11:00 AM", "available": True},
        {"time": "2:00 PM", "available": True},
        {"time": "3:00 PM", "available": True},
        {"time": "4:00 PM", "available": True},
        {"time": "5:00 PM", "available": True},
    ]
    
    text = (
        f"{format_booking_header(7)}\n"
        f"✅ Date: {date_str}\n\n"
        "🕐 *Select appointment time:*"
    )
    
    await query.edit_message_text(
        text,
        reply_markup=time_slots_keyboard(time_slots, doctor_id, date_str),
        parse_mode="Markdown"
    )
    
    return BotState.BOOKING_TIME


async def handle_time_selection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle time selection"""
    query = update.callback_query
    await query.answer()
    
    # Parse time from callback
    parts = query.data.replace(CallbackData.TIME_PREFIX, "").split("_")
    time_str = parts[2]
    
    context.user_data['selected_time'] = time_str
    
    # Show confirmation
    text = (
        "📋 *Confirm Your Appointment*\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "👤 *Patient Information:*\n"
        f"Name: {context.user_data['patient_name']}\n"
        f"Phone: {context.user_data['patient_phone']}\n"
        f"Age: {context.user_data['patient_age']}\n"
        f"Gender: {context.user_data['patient_gender']}\n"
        f"Issue: {context.user_data['patient_issue']}\n\n"
        "🏥 *Appointment Details:*\n"
        f"Doctor: Dr. {context.user_data['selected_doctor']}\n"
        f"Specialty: {context.user_data['selected_specialization']}\n"
        f"Date: {context.user_data['selected_date']}\n"
        f"Time: {time_str}\n\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "Is this information correct?"
    )
    
    await query.edit_message_text(
        text,
        reply_markup=confirmation_keyboard("✅ Confirm Booking", "❌ Cancel"),
        parse_mode="Markdown"
    )
    
    return BotState.BOOKING_CONFIRM


async def handle_booking_confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle booking confirmation"""
    query = update.callback_query
    await query.answer()
    
    if query.data == CallbackData.CONFIRM_NO:
        await query.edit_message_text(
            "❌ Booking cancelled.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    # Create appointment
    appointment_data = {
        "patientName": context.user_data['patient_name'],
        "patientPhone": context.user_data['patient_phone'],
        "patientEmail": f"{update.effective_user.username}@telegram.user" if update.effective_user.username else None,
        "patientAge": context.user_data['patient_age'],
        "patientGender": context.user_data['patient_gender'],
        "doctorId": int(context.user_data['selected_doctor_id']),
        "specialization": context.user_data['selected_specialization'],
        "appointmentDate": context.user_data['selected_date'],
        "appointmentTime": context.user_data['selected_time'],
        "notes": context.user_data['patient_issue']
    }
    
    result = await api_post("/api/appointments", appointment_data)
    
    if not result or not result.get('success'):
        await query.edit_message_text(
            "❌ Failed to create appointment. Please try again later.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    # Success!
    token = result.get('token', 'N/A')
    
    success_text = (
        "✅ *Appointment Confirmed!*\n\n"
        "🎉 Great! Your appointment has been successfully booked.\n\n"
        "📋 *Appointment Details:*\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"🆔 Token: `{token}`\n"
        f"👨‍⚕️ Doctor: Dr. {context.user_data['selected_doctor']}\n"
        f"🏥 Specialty: {context.user_data['selected_specialization']}\n"
        f"📅 Date: {context.user_data['selected_date']}\n"
        f"🕐 Time: {context.user_data['selected_time']}\n"
        "━━━━━━━━━━━━━━━━━━━━\n\n"
        "📍 *Clinic Address:*\n"
        "Sree Sarojaa Multi Specialty Dental Clinic\n"
        "Near Vincent Bus Stop, Cherry Road\n"
        "Salem - 636007\n\n"
        "💡 *Please arrive 10 minutes early*\n"
        "📞 For any queries: 0427 2313339"
    )
    
    await query.edit_message_text(
        success_text,
        reply_markup=main_menu_keyboard(),
        parse_mode="Markdown"
    )
    
    return BotState.BOOKING_COMPLETE
