"""
FSM-Based Telegram Bot for Sree Sarojaa Dental Clinic
State-driven conversational UI with inline keyboards and message editing
"""
import os
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ConversationHandler,
    filters,
    ContextTypes
)
from dotenv import load_dotenv

# Import states and handlers
from states import BotState, CallbackData
from handlers.menu import show_main_menu, handle_clinic_info, handle_contact
from handlers.booking import (
    start_booking,
    handle_name_input,
    handle_phone_input,
    handle_age_input,
    handle_gender_selection,
    handle_issue_selection,
    handle_custom_issue_input,
    handle_doctor_selection,
    handle_date_selection,
    handle_time_selection,
    handle_booking_confirmation
)
from handlers.manage import (
    show_appointments,
    view_appointment,
    handle_reschedule,
    handle_reschedule_date,
    handle_reschedule_time,
    handle_cancel_appointment
)
from keyboards import main_menu_keyboard
from utils import clear_booking_data

# Load environment variables
load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


# ==================== NAVIGATION HANDLERS ====================

async def handle_back(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle back button"""
    # Get current state from conversation
    current_state = context.user_data.get('current_state')
    
    # Define back navigation map
    back_map = {
        BotState.BOOKING_PHONE: BotState.BOOKING_NAME,
        BotState.BOOKING_AGE: BotState.BOOKING_PHONE,
        BotState.BOOKING_GENDER: BotState.BOOKING_AGE,
        BotState.BOOKING_ISSUE: BotState.BOOKING_GENDER,
        BotState.BOOKING_DOCTOR: BotState.BOOKING_ISSUE,
        BotState.BOOKING_DATE: BotState.BOOKING_DOCTOR,
        BotState.BOOKING_TIME: BotState.BOOKING_DATE,
        BotState.BOOKING_CONFIRM: BotState.BOOKING_TIME,
    }
    
    previous_state = back_map.get(current_state, BotState.MAIN_MENU)
    
    # Route to appropriate handler
    if previous_state == BotState.MAIN_MENU:
        return await show_main_menu(update, context)
    elif previous_state == BotState.BOOKING_NAME:
        return await start_booking(update, context)
    # Add more as needed
    
    return await show_main_menu(update, context)


async def handle_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle cancel button - return to main menu"""
    clear_booking_data(context)
    return await show_main_menu(update, context)


# ==================== COMMAND HANDLERS ====================

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    return await show_main_menu(update, context)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command"""
    help_text = (
        "🤖 *Bot Commands*\n\n"
        "/start - Show main menu\n"
        "/help - Show this help message\n"
        "/cancel - Cancel current operation\n\n"
        "📱 *How to use:*\n"
        "1. Click 'Book Appointment' to schedule\n"
        "2. Follow the step-by-step process\n"
        "3. Use inline buttons to select options\n"
        "4. Use 'Back' button to go to previous step\n"
        "5. Use 'Cancel' to return to main menu\n\n"
        "Need help? Contact us at 0427 2313339"
    )
    
    await update.message.reply_text(help_text, reply_markup=main_menu_keyboard(), parse_mode="Markdown")
    return BotState.MAIN_MENU


async def cancel_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /cancel command"""
    clear_booking_data(context)
    await update.message.reply_text(
        "❌ Operation cancelled.",
        reply_markup=main_menu_keyboard()
    )
    return ConversationHandler.END


# ==================== CONVERSATION HANDLER SETUP ====================

def create_conversation_handler():
    """Create the main conversation handler"""
    
    return ConversationHandler(
        entry_points=[
            CommandHandler("start", start_command),
            CommandHandler("help", help_command),
        ],
        states={
            BotState.MAIN_MENU: [
                CallbackQueryHandler(start_booking, pattern=f"^{CallbackData.BOOK_APPOINTMENT}$"),
                CallbackQueryHandler(show_appointments, pattern=f"^{CallbackData.MY_APPOINTMENTS}$"),
                CallbackQueryHandler(handle_clinic_info, pattern=f"^{CallbackData.CLINIC_INFO}$"),
                CallbackQueryHandler(handle_contact, pattern=f"^{CallbackData.CONTACT}$"),
            ],
            BotState.BOOKING_NAME: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_name_input),
                CallbackQueryHandler(handle_cancel, pattern=f"^{CallbackData.CANCEL}$"),
            ],
            BotState.BOOKING_PHONE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_phone_input),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(handle_cancel, pattern=f"^{CallbackData.CANCEL}$"),
            ],
            BotState.BOOKING_AGE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_age_input),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(handle_cancel, pattern=f"^{CallbackData.CANCEL}$"),
            ],
            BotState.BOOKING_GENDER: [
                CallbackQueryHandler(handle_gender_selection, pattern=f"^gender_"),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(handle_cancel, pattern=f"^{CallbackData.CANCEL}$"),
            ],
            BotState.BOOKING_ISSUE: [
                CallbackQueryHandler(handle_issue_selection, pattern=f"^issue_"),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_custom_issue_input),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(handle_cancel, pattern=f"^{CallbackData.CANCEL}$"),
            ],
            BotState.BOOKING_DOCTOR: [
                CallbackQueryHandler(handle_doctor_selection, pattern=f"^{CallbackData.DOCTOR_PREFIX}"),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(handle_cancel, pattern=f"^{CallbackData.CANCEL}$"),
            ],
            BotState.BOOKING_DATE: [
                CallbackQueryHandler(handle_date_selection, pattern=f"^{CallbackData.DATE_PREFIX}"),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.BOOKING_TIME: [
                CallbackQueryHandler(handle_time_selection, pattern=f"^{CallbackData.TIME_PREFIX}"),
                CallbackQueryHandler(handle_back, pattern=f"^{CallbackData.BACK}$"),
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.BOOKING_CONFIRM: [
                CallbackQueryHandler(handle_booking_confirmation, pattern=f"^confirm_"),
            ],
            BotState.BOOKING_COMPLETE: [
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.CLINIC_INFO: [
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.CONTACT_INFO: [
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.MANAGE_MENU: [
                CallbackQueryHandler(view_appointment, pattern=f"^{CallbackData.APPOINTMENT_PREFIX}"),
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.VIEW_APPOINTMENT: [
                CallbackQueryHandler(handle_reschedule, pattern=f"^{CallbackData.RESCHEDULE_PREFIX}"),
                CallbackQueryHandler(handle_cancel_appointment, pattern=f"^{CallbackData.CANCEL_PREFIX}"),
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.RESCHEDULE_DATE: [
                CallbackQueryHandler(handle_reschedule_date, pattern=f"^{CallbackData.DATE_PREFIX}"),
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
            BotState.RESCHEDULE_TIME: [
                CallbackQueryHandler(handle_reschedule_time, pattern=f"^{CallbackData.TIME_PREFIX}"),
                CallbackQueryHandler(show_main_menu, pattern=f"^{CallbackData.MAIN_MENU}$"),
            ],
        },
        fallbacks=[
            CommandHandler("cancel", cancel_command),
            CommandHandler("start", start_command),
        ],
        name="main_conversation",
        persistent=False,
    )


# ==================== MAIN ====================

def main():
    """Start the bot"""
    print("🤖 Starting Sree Sarojaa Dental Clinic Bot (FSM Version)")
    print("⏰ Connection timeout: 30s (configured for network stability)")
    
    # Create application
    app = Application.builder().token(TOKEN).connect_timeout(30).read_timeout(30).build()
    
    # Add conversation handler
    conv_handler = create_conversation_handler()
    app.add_handler(conv_handler)
    
    # Add standalone help command
    app.add_handler(CommandHandler("help", help_command))
    
    # Start bot
    print("✅ Bot is running!")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
