"""
Handlers Package
Contains all conversation handlers for the bot
"""
from .menu import show_main_menu, handle_clinic_info, handle_contact
from .booking import (
    start_booking,
    handle_name_input,
    handle_phone_input,
    handle_age_input,
    handle_gender_selection,
    handle_issue_selection,
    handle_doctor_selection,
    handle_date_selection,
    handle_time_selection,
    handle_booking_confirmation
)
from .manage import (
    show_appointments,
    view_appointment,
    handle_reschedule,
    handle_cancel_appointment
)

__all__ = [
    'show_main_menu',
    'handle_clinic_info',
    'handle_contact',
    'start_booking',
    'handle_name_input',
    'handle_phone_input',
    'handle_age_input',
    'handle_gender_selection',
    'handle_issue_selection',
    'handle_doctor_selection',
    'handle_date_selection',
    'handle_time_selection',
    'handle_booking_confirmation',
    'show_appointments',
    'view_appointment',
    'handle_reschedule',
    'handle_cancel_appointment',
]
