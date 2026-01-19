"""
Inline Keyboard Builders
Centralized keyboard generation for consistent UI
"""
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from states import CallbackData


def main_menu_keyboard():
    """Main menu keyboard"""
    keyboard = [
        [InlineKeyboardButton("📅 Book Appointment", callback_data=CallbackData.BOOK_APPOINTMENT)],
        [InlineKeyboardButton("📋 My Appointments", callback_data=CallbackData.MY_APPOINTMENTS)],
        [InlineKeyboardButton("ℹ️ Clinic Info", callback_data=CallbackData.CLINIC_INFO)],
        [InlineKeyboardButton("📞 Contact Us", callback_data=CallbackData.CONTACT)],
    ]
    return InlineKeyboardMarkup(keyboard)


def gender_keyboard(include_nav=True):
    """Gender selection keyboard"""
    keyboard = [
        [InlineKeyboardButton("👨 Male", callback_data=CallbackData.GENDER_MALE)],
        [InlineKeyboardButton("👩 Female", callback_data=CallbackData.GENDER_FEMALE)],
        [InlineKeyboardButton("⚧ Other", callback_data=CallbackData.GENDER_OTHER)],
    ]
    
    if include_nav:
        keyboard.append([
            InlineKeyboardButton("🔙 Back", callback_data=CallbackData.BACK),
            InlineKeyboardButton("❌ Cancel", callback_data=CallbackData.CANCEL)
        ])
    
    return InlineKeyboardMarkup(keyboard)


def issue_keyboard(include_nav=True):
    """Common dental issues keyboard"""
    keyboard = [
        [InlineKeyboardButton("🦷 Tooth Pain", callback_data=CallbackData.ISSUE_PAIN)],
        [InlineKeyboardButton("🕳️ Cavity", callback_data=CallbackData.ISSUE_CAVITY)],
        [InlineKeyboardButton("✨ Cleaning", callback_data=CallbackData.ISSUE_CLEANING)],
        [InlineKeyboardButton("💎 Whitening", callback_data=CallbackData.ISSUE_WHITENING)],
        [InlineKeyboardButton("🦷 Braces/Aligners", callback_data=CallbackData.ISSUE_BRACES)],
        [InlineKeyboardButton("🔧 Root Canal", callback_data=CallbackData.ISSUE_ROOT_CANAL)],
        [InlineKeyboardButton("🦷 Extraction", callback_data=CallbackData.ISSUE_EXTRACTION)],
        [InlineKeyboardButton("📝 Other", callback_data=CallbackData.ISSUE_OTHER)],
    ]
    
    if include_nav:
        keyboard.append([
            InlineKeyboardButton("🔙 Back", callback_data=CallbackData.BACK),
            InlineKeyboardButton("❌ Cancel", callback_data=CallbackData.CANCEL)
        ])
    
    return InlineKeyboardMarkup(keyboard)


def doctor_keyboard(doctors, include_nav=True):
    """Doctor selection keyboard"""
    keyboard = []
    
    for doctor in doctors:
        keyboard.append([
            InlineKeyboardButton(
                f"👨‍⚕️ Dr. {doctor['name']} - {doctor['specialization']}",
                callback_data=f"{CallbackData.DOCTOR_PREFIX}{doctor['id']}"
            )
        ])
    
    if include_nav:
        keyboard.append([
            InlineKeyboardButton("🔙 Back", callback_data=CallbackData.BACK),
            InlineKeyboardButton("❌ Cancel", callback_data=CallbackData.CANCEL)
        ])
    
    return InlineKeyboardMarkup(keyboard)


def navigation_keyboard(back=True, cancel=True, main_menu=False):
    """Generic navigation keyboard"""
    keyboard = []
    row = []
    
    if back:
        row.append(InlineKeyboardButton("🔙 Back", callback_data=CallbackData.BACK))
    if cancel:
        row.append(InlineKeyboardButton("❌ Cancel", callback_data=CallbackData.CANCEL))
    if main_menu:
        row.append(InlineKeyboardButton("🏠 Main Menu", callback_data=CallbackData.MAIN_MENU))
    
    if row:
        keyboard.append(row)
    
    return InlineKeyboardMarkup(keyboard) if keyboard else None


def confirmation_keyboard(yes_text="✅ Confirm", no_text="❌ Cancel"):
    """Confirmation keyboard"""
    keyboard = [
        [
            InlineKeyboardButton(yes_text, callback_data=CallbackData.CONFIRM_YES),
            InlineKeyboardButton(no_text, callback_data=CallbackData.CONFIRM_NO)
        ]
    ]
    return InlineKeyboardMarkup(keyboard)


def appointment_actions_keyboard(token):
    """Appointment management actions"""
    keyboard = [
        [InlineKeyboardButton("📄 Download Receipt", callback_data=f"pdf_{token}")],
        [InlineKeyboardButton("🔁 Reschedule", callback_data=f"{CallbackData.RESCHEDULE_PREFIX}{token}")],
        [InlineKeyboardButton("❌ Cancel Appointment", callback_data=f"{CallbackData.CANCEL_PREFIX}{token}")],
        [InlineKeyboardButton("🏠 Main Menu", callback_data=CallbackData.MAIN_MENU)],
    ]
    return InlineKeyboardMarkup(keyboard)


def appointments_list_keyboard(appointments):
    """List of user's appointments"""
    keyboard = []
    
    for appt in appointments:
        keyboard.append([
            InlineKeyboardButton(
                f"📅 {appt['date']} - Dr. {appt['doctor']}",
                callback_data=f"{CallbackData.APPOINTMENT_PREFIX}{appt['token']}"
            )
        ])
    
    keyboard.append([InlineKeyboardButton("🏠 Main Menu", callback_data=CallbackData.MAIN_MENU)])
    
    return InlineKeyboardMarkup(keyboard)


def build_calendar_keyboard(year, month, doctor_id, available_dates=None):
    """Calendar keyboard for date selection"""
    import calendar
    from datetime import date, timedelta
    
    keyboard = []
    
    # Month/Year header
    month_name = calendar.month_name[month]
    keyboard.append([InlineKeyboardButton(f"📅 {month_name} {year}", callback_data="ignore")])
    
    # Day headers
    keyboard.append([InlineKeyboardButton(day, callback_data="ignore") for day in ["M", "T", "W", "T", "F", "S", "S"]])
    
    # Get calendar
    cal = calendar.monthcalendar(year, month)
    today = date.today()
    
    for week in cal:
        row = []
        for day in week:
            if day == 0:
                row.append(InlineKeyboardButton(" ", callback_data="ignore"))
            else:
                current_date = date(year, month, day)
                if current_date < today:
                    # Past date
                    row.append(InlineKeyboardButton("✖️", callback_data="ignore"))
                else:
                    # Future date
                    date_str = current_date.strftime("%Y-%m-%d")
                    row.append(InlineKeyboardButton(
                        str(day),
                        callback_data=f"{CallbackData.DATE_PREFIX}{doctor_id}_{date_str}"
                    ))
        keyboard.append(row)
    
    # Navigation
    nav_row = []
    if month > 1 or year > today.year:
        prev_month = month - 1 if month > 1 else 12
        prev_year = year if month > 1 else year - 1
        nav_row.append(InlineKeyboardButton("◀️", callback_data=f"cal_{prev_year}_{prev_month}_{doctor_id}"))
    
    nav_row.append(InlineKeyboardButton("🏠 Main Menu", callback_data=CallbackData.MAIN_MENU))
    
    next_month = month + 1 if month < 12 else 1
    next_year = year if month < 12 else year + 1
    nav_row.append(InlineKeyboardButton("▶️", callback_data=f"cal_{next_year}_{next_month}_{doctor_id}"))
    
    keyboard.append(nav_row)
    
    return InlineKeyboardMarkup(keyboard)


def time_slots_keyboard(slots, doctor_id, date_str, include_nav=True):
    """Time slots keyboard"""
    keyboard = []
    
    # Group slots in rows of 2
    for i in range(0, len(slots), 2):
        row = []
        for slot in slots[i:i+2]:
            if slot['available']:
                row.append(InlineKeyboardButton(
                    slot['time'],
                    callback_data=f"{CallbackData.TIME_PREFIX}{doctor_id}_{date_str}_{slot['time']}"
                ))
            else:
                row.append(InlineKeyboardButton(f"✖️ {slot['time']}", callback_data="ignore"))
        keyboard.append(row)
    
    if include_nav:
        keyboard.append([
            InlineKeyboardButton("🔙 Back", callback_data=CallbackData.BACK),
            InlineKeyboardButton("🏠 Main Menu", callback_data=CallbackData.MAIN_MENU)
        ])
    
    return InlineKeyboardMarkup(keyboard)
