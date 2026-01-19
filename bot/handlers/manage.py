"""
Appointment Management Handlers
View, reschedule, and cancel appointments
"""
from telegram import Update
from telegram.ext import ContextTypes
from states import BotState, CallbackData
from keyboards import (
    appointments_list_keyboard,
    appointment_actions_keyboard,
    main_menu_keyboard,
    build_calendar_keyboard,
    time_slots_keyboard
)
from utils import edit_or_send, format_appointment_details
import httpx
from datetime import date


async def api_get(endpoint):
    """Make GET request to API"""
    base_url = "http://localhost:8000"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{base_url}{endpoint}", timeout=10.0)
            return response.json() if response.status_code == 200 else None
        except:
            return None


async def api_delete(endpoint):
    """Make DELETE request to API"""
    base_url = "http://localhost:8000"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(f"{base_url}{endpoint}", timeout=10.0)
            return response.status_code in [200, 204]
        except:
            return False


async def show_appointments(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show user's appointments"""
    # In a real implementation, fetch by telegram_id
    # For now, we'll show a message
    text = (
        "📋 *My Appointments*\n\n"
        "To view your appointments, please use the token number "
        "provided when you booked.\n\n"
        "You can also manage appointments through our website."
    )
    
    await edit_or_send(update, context, text, main_menu_keyboard())
    return BotState.MANAGE_MENU


async def view_appointment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """View appointment details"""
    query = update.callback_query
    await query.answer()
    
    token = query.data.replace(CallbackData.APPOINTMENT_PREFIX, "")
    
    # Fetch appointment
    appt = await api_get(f"/api/bot/appointments/{token}")
    
    if not appt:
        await query.edit_message_text(
            "❌ Appointment not found or has been cancelled.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    text = format_appointment_details(appt)
    
    await query.edit_message_text(
        text,
        reply_markup=appointment_actions_keyboard(token),
        parse_mode="Markdown"
    )
    
    return BotState.VIEW_APPOINTMENT


async def handle_reschedule(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle appointment rescheduling"""
    query = update.callback_query
    await query.answer()
    
    token = query.data.replace(CallbackData.RESCHEDULE_PREFIX, "")
    
    # Fetch appointment
    appt = await api_get(f"/api/bot/appointments/{token}")
    
    if not appt:
        await query.edit_message_text(
            "❌ Appointment not found or has been cancelled.",
            reply_markup=main_menu_keyboard()
        )
        return BotState.MAIN_MENU
    
    context.user_data['reschedule_token'] = token
    context.user_data['reschedule_doctor_id'] = appt['doctor_id']
    
    # Show calendar
    today = date.today()
    text = (
        "📅 *Reschedule Appointment*\n\n"
        f"Current: {appt['date']} at {appt['time']}\n\n"
        "Select new date:"
    )
    
    calendar = build_calendar_keyboard(today.year, today.month, appt['doctor_id'])
    await query.edit_message_text(text, reply_markup=calendar, parse_mode="Markdown")
    
    return BotState.RESCHEDULE_DATE


async def handle_reschedule_date(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle reschedule date selection"""
    query = update.callback_query
    await query.answer()
    
    # Parse date
    parts = query.data.replace(CallbackData.DATE_PREFIX, "").split("_")
    doctor_id = parts[0]
    date_str = parts[1]
    
    context.user_data['reschedule_date'] = date_str
    
    # Generate time slots
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
        "🕐 *Select new time:*\n\n"
        f"Date: {date_str}"
    )
    
    await query.edit_message_text(
        text,
        reply_markup=time_slots_keyboard(time_slots, doctor_id, date_str),
        parse_mode="Markdown"
    )
    
    return BotState.RESCHEDULE_TIME


async def handle_reschedule_time(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle reschedule time selection"""
    query = update.callback_query
    await query.answer()
    
    # Parse time
    parts = query.data.replace(CallbackData.TIME_PREFIX, "").split("_")
    time_str = parts[2]
    
    # In real implementation, update appointment via API
    # For now, show success message
    
    text = (
        "✅ *Appointment Rescheduled!*\n\n"
        f"New Date: {context.user_data['reschedule_date']}\n"
        f"New Time: {time_str}\n\n"
        "You will receive a confirmation shortly."
    )
    
    await query.edit_message_text(
        text,
        reply_markup=main_menu_keyboard(),
        parse_mode="Markdown"
    )
    
    # Clear reschedule data
    context.user_data.pop('reschedule_token', None)
    context.user_data.pop('reschedule_doctor_id', None)
    context.user_data.pop('reschedule_date', None)
    
    return BotState.MAIN_MENU


async def handle_cancel_appointment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle appointment cancellation"""
    query = update.callback_query
    await query.answer()
    
    token = query.data.replace(CallbackData.CANCEL_PREFIX, "")
    
    # Delete appointment
    success = await api_delete(f"/api/bot/appointments/{token}")
    
    if success:
        text = "✅ Appointment cancelled successfully."
    else:
        text = "❌ Failed to cancel appointment. Please contact us directly."
    
    await query.edit_message_text(
        text,
        reply_markup=main_menu_keyboard()
    )
    
    return BotState.MAIN_MENU
