"""
Utility Functions for Bot
Helper functions for message management, state tracking, and formatting
"""
from telegram import Update
from telegram.ext import ContextTypes


async def edit_or_send(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str, keyboard=None, parse_mode="Markdown"):
    """
    Edit existing message or send new one
    Keeps chat clean by editing instead of sending new messages
    """
    try:
        if update.callback_query:
            # Edit the message that has the inline keyboard
            await update.callback_query.edit_message_text(
                text=text,
                reply_markup=keyboard,
                parse_mode=parse_mode
            )
            return update.callback_query.message
        elif update.message:
            # Send new message and store its ID
            msg = await update.message.reply_text(
                text=text,
                reply_markup=keyboard,
                parse_mode=parse_mode
            )
            context.user_data['last_bot_message_id'] = msg.message_id
            return msg
    except Exception as e:
        print(f"Error in edit_or_send: {e}")
        # Fallback: send new message
        if update.effective_chat:
            msg = await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=text,
                reply_markup=keyboard,
                parse_mode=parse_mode
            )
            return msg


async def delete_message(context: ContextTypes.DEFAULT_TYPE, chat_id: int, message_id: int):
    """Safely delete a message"""
    try:
        await context.bot.delete_message(chat_id=chat_id, message_id=message_id)
    except Exception as e:
        print(f"Could not delete message {message_id}: {e}")


async def cleanup_old_messages(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Delete old bot messages to keep chat clean"""
    chat_id = update.effective_chat.id
    
    # Delete user's last message if it was text input
    if update.message and 'last_user_message_id' in context.user_data:
        await delete_message(context, chat_id, context.user_data['last_user_message_id'])
    
    # Store current user message ID
    if update.message:
        context.user_data['last_user_message_id'] = update.message.message_id


def get_progress_bar(current_step: int, total_steps: int, length: int = 20) -> str:
    """Generate a progress bar"""
    filled = int((current_step / total_steps) * length)
    bar = "━" * filled + "─" * (length - filled)
    return f"{bar}"


def format_booking_header(step: int, total: int = 7) -> str:
    """Format booking flow header with progress"""
    progress = get_progress_bar(step, total)
    return f"📋 *Booking Appointment* (Step {step}/{total})\n{progress}\n"


def format_appointment_details(appt: dict) -> str:
    """Format appointment details for display"""
    return (
        f"📋 *Appointment Details*\n"
        f"{'─' * 30}\n"
        f"🆔 Token: `{appt['token']}`\n"
        f"👨‍⚕️ Doctor: Dr. {appt['doctor']}\n"
        f"🏥 Specialty: {appt['specialization']}\n"
        f"📅 Date: {appt['date']}\n"
        f"🕐 Time: {appt['time']}\n"
        f"📊 Status: {appt['status'].title()}\n"
        f"{'─' * 30}"
    )


def format_patient_summary(context: ContextTypes.DEFAULT_TYPE) -> str:
    """Format patient data summary"""
    data = context.user_data
    return (
        f"👤 *Patient Information*\n"
        f"{'─' * 30}\n"
        f"Name: {data.get('patient_name', 'N/A')}\n"
        f"Phone: {data.get('patient_phone', 'N/A')}\n"
        f"Age: {data.get('patient_age', 'N/A')}\n"
        f"Gender: {data.get('patient_gender', 'N/A')}\n"
        f"Issue: {data.get('patient_issue', 'N/A')}\n"
        f"{'─' * 30}"
    )


def clear_booking_data(context: ContextTypes.DEFAULT_TYPE):
    """Clear booking-related data from context"""
    keys_to_clear = [
        'patient_name', 'patient_phone', 'patient_age', 'patient_gender',
        'patient_issue', 'selected_doctor', 'selected_doctor_id',
        'selected_date', 'selected_time', 'booking_step'
    ]
    for key in keys_to_clear:
        context.user_data.pop(key, None)


def save_state_history(context: ContextTypes.DEFAULT_TYPE, state):
    """Save state to history for back navigation"""
    if 'state_history' not in context.user_data:
        context.user_data['state_history'] = []
    context.user_data['state_history'].append(state)


def get_previous_state(context: ContextTypes.DEFAULT_TYPE):
    """Get previous state from history"""
    history = context.user_data.get('state_history', [])
    if len(history) > 1:
        # Remove current state
        history.pop()
        # Return previous state
        return history[-1]
    return None


def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    # Remove spaces and special characters
    cleaned = ''.join(filter(str.isdigit, phone))
    # Check if it's 10 digits
    return len(cleaned) >= 10


def validate_age(age_str: str) -> tuple[bool, int]:
    """Validate age input"""
    try:
        age = int(age_str)
        if 1 <= age <= 120:
            return True, age
        return False, 0
    except ValueError:
        return False, 0


# Issue mapping (callback_data -> display text)
ISSUE_LABELS = {
    "issue_pain": "Tooth Pain",
    "issue_cavity": "Cavity",
    "issue_cleaning": "Cleaning",
    "issue_whitening": "Whitening",
    "issue_braces": "Braces/Aligners",
    "issue_root_canal": "Root Canal",
    "issue_extraction": "Extraction",
    "issue_other": "Other",
}


# Gender mapping
GENDER_LABELS = {
    "gender_male": "Male",
    "gender_female": "Female",
    "gender_other": "Other",
}


def get_issue_label(callback_data: str) -> str:
    """Get display label for issue callback data"""
    return ISSUE_LABELS.get(callback_data, callback_data)


def get_gender_label(callback_data: str) -> str:
    """Get display label for gender callback data"""
    return GENDER_LABELS.get(callback_data, callback_data)
