"""
Bot State Definitions
Defines all possible states in the conversation flow
"""
from enum import Enum, auto


class BotState(Enum):
    """Conversation states for the bot"""
    # Main states
    IDLE = auto()
    MAIN_MENU = auto()
    
    # Booking flow states
    BOOKING_NAME = auto()
    BOOKING_PHONE = auto()
    BOOKING_AGE = auto()
    BOOKING_GENDER = auto()
    BOOKING_ISSUE = auto()
    BOOKING_DOCTOR = auto()
    BOOKING_DATE = auto()
    BOOKING_TIME = auto()
    BOOKING_CONFIRM = auto()
    BOOKING_COMPLETE = auto()
    
    # Management states
    MANAGE_MENU = auto()
    VIEW_APPOINTMENT = auto()
    RESCHEDULE_DATE = auto()
    RESCHEDULE_TIME = auto()
    
    # Info states
    CLINIC_INFO = auto()
    CONTACT_INFO = auto()


# State transition map (for validation)
VALID_TRANSITIONS = {
    BotState.IDLE: [BotState.MAIN_MENU],
    BotState.MAIN_MENU: [BotState.BOOKING_NAME, BotState.MANAGE_MENU, BotState.CLINIC_INFO, BotState.CONTACT_INFO],
    BotState.BOOKING_NAME: [BotState.BOOKING_PHONE, BotState.MAIN_MENU],
    BotState.BOOKING_PHONE: [BotState.BOOKING_AGE, BotState.BOOKING_NAME, BotState.MAIN_MENU],
    BotState.BOOKING_AGE: [BotState.BOOKING_GENDER, BotState.BOOKING_PHONE, BotState.MAIN_MENU],
    BotState.BOOKING_GENDER: [BotState.BOOKING_ISSUE, BotState.BOOKING_AGE, BotState.MAIN_MENU],
    BotState.BOOKING_ISSUE: [BotState.BOOKING_DOCTOR, BotState.BOOKING_GENDER, BotState.MAIN_MENU],
    BotState.BOOKING_DOCTOR: [BotState.BOOKING_DATE, BotState.BOOKING_ISSUE, BotState.MAIN_MENU],
    BotState.BOOKING_DATE: [BotState.BOOKING_TIME, BotState.BOOKING_DOCTOR, BotState.MAIN_MENU],
    BotState.BOOKING_TIME: [BotState.BOOKING_CONFIRM, BotState.BOOKING_DATE, BotState.MAIN_MENU],
    BotState.BOOKING_CONFIRM: [BotState.BOOKING_COMPLETE, BotState.BOOKING_TIME, BotState.MAIN_MENU],
    BotState.BOOKING_COMPLETE: [BotState.MAIN_MENU],
    BotState.MANAGE_MENU: [BotState.VIEW_APPOINTMENT, BotState.MAIN_MENU],
    BotState.VIEW_APPOINTMENT: [BotState.RESCHEDULE_DATE, BotState.MANAGE_MENU, BotState.MAIN_MENU],
    BotState.RESCHEDULE_DATE: [BotState.RESCHEDULE_TIME, BotState.VIEW_APPOINTMENT, BotState.MAIN_MENU],
    BotState.RESCHEDULE_TIME: [BotState.VIEW_APPOINTMENT, BotState.RESCHEDULE_DATE, BotState.MAIN_MENU],
    BotState.CLINIC_INFO: [BotState.MAIN_MENU],
    BotState.CONTACT_INFO: [BotState.MAIN_MENU],
}


# Callback data patterns
class CallbackData:
    """Callback data patterns for inline keyboards"""
    # Navigation
    BACK = "nav_back"
    CANCEL = "nav_cancel"
    MAIN_MENU = "nav_main"
    
    # Main menu
    BOOK_APPOINTMENT = "menu_book"
    MY_APPOINTMENTS = "menu_appointments"
    CLINIC_INFO = "menu_clinic"
    CONTACT = "menu_contact"
    
    # Gender
    GENDER_MALE = "gender_male"
    GENDER_FEMALE = "gender_female"
    GENDER_OTHER = "gender_other"
    
    # Common issues
    ISSUE_PAIN = "issue_pain"
    ISSUE_CAVITY = "issue_cavity"
    ISSUE_CLEANING = "issue_cleaning"
    ISSUE_WHITENING = "issue_whitening"
    ISSUE_BRACES = "issue_braces"
    ISSUE_ROOT_CANAL = "issue_root_canal"
    ISSUE_EXTRACTION = "issue_extraction"
    ISSUE_OTHER = "issue_other"
    
    # Confirmation
    CONFIRM_YES = "confirm_yes"
    CONFIRM_NO = "confirm_no"
    
    # Patterns (with parameters)
    DOCTOR_PREFIX = "doctor_"
    DATE_PREFIX = "date_"
    TIME_PREFIX = "time_"
    APPOINTMENT_PREFIX = "appt_"
    RESCHEDULE_PREFIX = "resch_"
    CANCEL_PREFIX = "cancel_"
