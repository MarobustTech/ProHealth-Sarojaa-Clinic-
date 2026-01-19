import os
import calendar
import httpx
import asyncio
from datetime import date, timedelta, datetime
from dotenv import load_dotenv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, CommandHandler, CallbackQueryHandler,
    MessageHandler, ContextTypes, filters
)

# ================= CONFIG =================

load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
API_BASE = "http://127.0.0.1:8000"

PDF_DIR = "receipts"
os.makedirs(PDF_DIR, exist_ok=True)

# ================= API HELPERS =================

async def api_get(path, params=None):
    async with httpx.AsyncClient(timeout=15) as c:
        try:
            r = await c.get(API_BASE + path, params=params)
            r.raise_for_status()
            return r.json()
        except:
            return None

async def api_post(path, data):
    async with httpx.AsyncClient(timeout=15) as c:
        try:
            r = await c.post(API_BASE + path, json=data)
            r.raise_for_status()
            return r.json()
        except:
            return None

async def api_patch(path, data):
    async with httpx.AsyncClient(timeout=15) as c:
        try:
            r = await c.patch(API_BASE + path, json=data)
            r.raise_for_status()
            return r.json()
        except:
            return None

async def api_delete(path):
    async with httpx.AsyncClient(timeout=15) as c:
        try:
            return (await c.delete(API_BASE + path)).status_code == 200
        except:
            return False

# ================= PDF (LOCAL) =================

def generate_pdf(appt):
    file = f"{PDF_DIR}/{appt['token']}.pdf"
    c = canvas.Canvas(file, pagesize=A4)
    width, height = A4
    
    # Header with clinic name
    c.setFillColorRGB(0.2, 0.4, 0.6)  # Blue color
    c.rect(0, height - 100, width, 100, fill=True, stroke=False)
    
    # Add logo if it exists
    logo_path = "logo.png"
    if os.path.exists(logo_path):
        try:
            # Draw logo on the left side of header
            c.drawImage(logo_path, 40, height - 90, width=60, height=60, preserveAspectRatio=True, mask='auto')
        except:
            pass  # If logo fails to load, continue without it
    
    c.setFillColorRGB(1, 1, 1)  # White text
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width/2, height - 45, "Sree Sarojaa")
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, height - 70, "Multi Specialty Dental Clinic")
    
    # Appointment Receipt Title
    c.setFillColorRGB(0, 0, 0)  # Black text
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width/2, height - 130, "APPOINTMENT RECEIPT")
    
    # Horizontal line
    c.setStrokeColorRGB(0.2, 0.4, 0.6)
    c.setLineWidth(2)
    c.line(50, height - 150, width - 50, height - 150)
    
    # Appointment Details Section
    y_position = height - 190
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y_position, "Appointment Details:")
    
    y_position -= 30
    c.setFont("Helvetica", 12)
    c.drawString(70, y_position, f"Token Number:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(250, y_position, f"{appt['token']}")
    
    y_position -= 25
    c.setFont("Helvetica", 12)
    c.drawString(70, y_position, f"Date:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(250, y_position, f"{appt['date']}")
    
    y_position -= 25
    c.setFont("Helvetica", 12)
    c.drawString(70, y_position, f"Time:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(250, y_position, f"{appt['time']}")
    
    y_position -= 25
    c.setFont("Helvetica", 12)
    c.drawString(70, y_position, f"Doctor:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(250, y_position, f"Dr. {appt['doctor']}")
    
    y_position -= 25
    c.setFont("Helvetica", 12)
    c.drawString(70, y_position, f"Specialization:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(250, y_position, f"{appt.get('specialization', 'General Dentistry')}")
    
    # Patient Details Section (if available)
    if 'patient_name' in appt or 'telegram_id' in appt:
        y_position -= 40
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "Patient Details:")
        
        if 'patient_name' in appt:
            y_position -= 25
            c.setFont("Helvetica", 12)
            c.drawString(70, y_position, f"Name:")
            c.setFont("Helvetica-Bold", 12)
            c.drawString(250, y_position, f"{appt['patient_name']}")
    
    # Important Instructions Box
    y_position -= 50
    # Light blue background
    c.setFillColorRGB(0.95, 0.97, 1.0)  # Very light blue
    c.setStrokeColorRGB(0.2, 0.4, 0.6)  # Blue border
    c.setLineWidth(1)
    c.rect(50, y_position - 60, width - 100, 70, fill=True, stroke=True)
    
    c.setFillColorRGB(0.2, 0.4, 0.6)  # Blue text for title
    c.setFont("Helvetica-Bold", 12)
    c.drawString(60, y_position - 20, "Important Instructions:")
    
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica", 10)
    c.drawString(60, y_position - 38, "• Please arrive 10 minutes before your appointment time")
    c.drawString(60, y_position - 52, "• Bring this receipt and a valid ID")
    c.drawString(60, y_position - 66, "• For cancellation, contact us at least 24 hours in advance")
    
    # Clinic Contact Information
    y_position -= 120
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y_position, "Clinic Address:")
    
    c.setFont("Helvetica", 10)
    y_position -= 18
    c.drawString(50, y_position, "Near Vincent Bus Stop, Cherry Road")
    y_position -= 15
    c.drawString(50, y_position, "Kumaraswamypatti, Salem - 636007")
    
    y_position -= 25
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y_position, "Contact Us:")
    
    c.setFont("Helvetica", 10)
    y_position -= 18
    c.drawString(50, y_position, "Phone: 0427 2313339")
    y_position -= 15
    c.drawString(50, y_position, "Mobile: 8946088182")
    
    # Footer
    c.setStrokeColorRGB(0.2, 0.4, 0.6)
    c.setLineWidth(1)
    c.line(50, 80, width - 50, 80)
    
    c.setFont("Helvetica-Oblique", 9)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawCentredString(width/2, 60, "Thank you for choosing Sree Sarojaa Multi Specialty Dental Clinic")
    c.drawCentredString(width/2, 45, "Your smile is our priority! 🦷")

    c.save()
    return file

# ================= REMINDER =================

async def reminder_task(bot, chat_id, delay, text):
    await asyncio.sleep(delay)
    await bot.send_message(chat_id=chat_id, text=text)

# ================= UI =================

def main_menu():
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("🦷 Book Dental Appointment", callback_data="menu_book")],
        [InlineKeyboardButton("📂 My Appointments", callback_data="menu_my")],
        [InlineKeyboardButton("🏥 Clinic Information", callback_data="menu_hospital")],
        [InlineKeyboardButton("👨‍⚕️ Our Doctors", callback_data="menu_doctors")],
        [InlineKeyboardButton("🕐 Working Hours", callback_data="menu_hours")],
        [InlineKeyboardButton("📍 Location & Directions", callback_data="menu_location")],
        [InlineKeyboardButton("☎️ Contact Us", callback_data="menu_contact")]
    ])

def build_calendar(year, month, doctor_id):
    cal = calendar.Calendar()
    today = date.today()
    last = today + timedelta(days=365)

    kb = [
        [
            InlineKeyboardButton("⬅", callback_data=f"nav|{year}|{month-1}|{doctor_id}"),
            InlineKeyboardButton(f"{calendar.month_name[month]} {year}", callback_data="ignore"),
            InlineKeyboardButton("➡", callback_data=f"nav|{year}|{month+1}|{doctor_id}")
        ],
        [InlineKeyboardButton(d, callback_data="ignore")
         for d in ["Mo","Tu","We","Th","Fr","Sa","Su"]]
    ]

    week = []
    for d in cal.itermonthdates(year, month):
        if d.month != month or d < today or d > last:
            week.append(InlineKeyboardButton("❌", callback_data="ignore"))
        else:
            week.append(InlineKeyboardButton(
                str(d.day),
                callback_data=f"date|{doctor_id}|{d.isoformat()}"
            ))
        if len(week) == 7:
            kb.append(week)
            week = []

    return InlineKeyboardMarkup(kb)

# ================= START / DEEP LINK =================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()

    if context.args and context.args[0].startswith("apt_"):
        token = context.args[0].replace("apt_", "")
        appt = await api_get(f"/api/bot/appointments/{token}")
        
        if not appt:
            await update.message.reply_text(
                "❌ Appointment not found or has been cancelled.",
                reply_markup=main_menu()
            )
            return

        pdf = generate_pdf(appt)
        gcal = generate_google_calendar_link(appt)

        await update.message.reply_text(
            f"📅 {appt['date']} {appt['time']}\n👨‍⚕️ {appt['doctor']}",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("📄 Download PDF", callback_data=f"pdf|{token}")],
                [InlineKeyboardButton("📅 Add to Google Calendar", url=gcal)],
                [InlineKeyboardButton("🔁 Reschedule", callback_data=f"resch|{token}")],
                [InlineKeyboardButton("❌ Cancel Appointment", callback_data=f"cancel|{token}")],
                [InlineKeyboardButton("🏠 Main Menu", callback_data="menu_home")]
            ])
        )
        context.user_data["pdf"] = pdf
        return

    user_name = update.effective_user.first_name or "there"
    await update.message.reply_text(
        f"👋 Hello *{user_name}*!\n\n"
        f"Welcome to *Sree Sarojaa Multi Specialty Dental Clinic* 🦷✨\n\n"
        f"We're here to help you achieve a healthy, beautiful smile! Our experienced team of dental specialists is ready to provide you with the best care.\n\n"
        f"📍 *Location:* Salem, Tamil Nadu\n"
        f"⏰ *Hours:* Mon-Fri: 8 AM - 8 PM | Sat: 9 AM - 5 PM\n\n"
        f"What would you like to do today?",
        reply_markup=main_menu(),
        parse_mode="Markdown"
    )

# ================= TEXT HANDLER =================

async def text_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    mode = context.user_data.get("mode")
    
    if mode == "patient_name":
        context.user_data["patient_name"] = update.message.text
        context.user_data["mode"] = "patient_phone"
        await update.message.reply_text("📱 Please enter your phone number:")
    
    elif mode == "patient_phone":
        context.user_data["patient_phone"] = update.message.text
        context.user_data["mode"] = "patient_age"
        await update.message.reply_text("🎂 Please enter your age:")
    
    elif mode == "patient_age":
        try:
            age = int(update.message.text)
            if age < 1 or age > 120:
                await update.message.reply_text("⚠️ Please enter a valid age (1-120):")
                return
            context.user_data["patient_age"] = age
            context.user_data["mode"] = "patient_gender"
            
            # Show gender selection buttons
            keyboard = [
                [InlineKeyboardButton("👨 Male", callback_data="gender|male")],
                [InlineKeyboardButton("👩 Female", callback_data="gender|female")],
                [InlineKeyboardButton("⚧ Other", callback_data="gender|other")]
            ]
            await update.message.reply_text(
                "⚧ Please select your gender:",
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
        except ValueError:
            await update.message.reply_text("⚠️ Please enter a valid number for age:")
    
    elif mode == "issue":
        await handle_issue(update, context)
    
    else:
        # Default - show main menu
        await update.message.reply_text(
            "Choose an option 👇",
            reply_markup=main_menu()
        )

# ================= MENU =================

async def menu_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()

    if q.data == "menu_book":
        context.user_data["mode"] = "patient_name"
        await q.edit_message_text("👤 Please enter your full name:")

    elif q.data == "menu_my":
        # Show loading message
        loading_msg = await q.edit_message_text("🔄 Loading your appointments...")
        
        telegram_id = str(update.effective_user.id)
        appts = await api_get(f"/api/bot/appointments/{telegram_id}")
        
        if not appts:
            await loading_msg.edit_text(
                "📂 *No Appointments Yet*\n\n"
                "👉 You haven't booked any appointments yet.\n\n"
                "💡 Tap 'Book Dental Appointment' to schedule your first visit!",
                reply_markup=main_menu(),
                parse_mode="Markdown"
            )
            return
        
        # Create appointment list with status badges
        appointment_text = f"📅 *Your Appointments ({len(appts)})*\n\n"
        
        kb = []
        for a in appts:
            status_emoji = {
                "confirmed": "✅",
                "pending": "⏳",
                "completed": "✔️",
                "cancelled": "❌"
            }.get(a.get('status', 'pending'), "📅")
            
            kb.append([InlineKeyboardButton(
                f"{status_emoji} {a['date']} {a['time']} - Dr. {a['doctor']}",
                callback_data=f"view|{a['token']}"
            )])
        
        kb.append([InlineKeyboardButton("🏠 Main Menu", callback_data="menu_home")])
        
        await loading_msg.edit_text(
            appointment_text + "👇 Tap on any appointment to view details:",
            reply_markup=InlineKeyboardMarkup(kb),
            parse_mode="Markdown"
        )






    elif q.data == "menu_hours":
        info = await api_get("/api/bot/clinic-info")
        await q.edit_message_text(
            f"🕐 **Working Hours**\n\n"
            f"{info['hours']['weekdays']}\n"
            f"{info['hours']['saturday']}\n"
            f"{info['hours']['sunday']}",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    elif q.data == "menu_location":
        info = await api_get("/api/bot/clinic-info")
        await q.edit_message_text(
            f"📍 **Location**\n\n"
            f"{info['address']}\n\n"
            f"🗺️ [Open in Google Maps]({info['maps_link']})",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )


    elif q.data == "menu_hospital":
        info = await api_get("/api/bot/clinic-info")
        await q.edit_message_text(
            f"🏥 **{info['name']}**\n\n"
            f"{info['about']}\n\n"
            f"📍 {info['address']}\n\n"
            f"📞 {info['phone']}\n"
            f"📱 {info['mobile']}",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    elif q.data == "menu_doctors":
        loading_msg = await q.edit_message_text("🔄 Loading our specialist team...")
        doctors = await api_get("/api/bot/doctors")
        
        print(f"[DEBUG] Fetched {len(doctors) if doctors else 0} doctors from API")
        
        if not doctors:
            await loading_msg.edit_text(
                "⚠️ *No Doctors Available*\n\n"
                "We're currently updating our doctor roster. Please try again later or contact us directly.",
                reply_markup=main_menu(),
                parse_mode="Markdown"
            )
            return
        
        # Show header
        await loading_msg.edit_text(
            f"👨‍⚕️ *Our Dental Specialists*\n\n"
            f"We have {len(doctors)} experienced doctors ready to serve you:",
            parse_mode="Markdown"
        )
        
        # Show each doctor as a detailed card
        count = 0
        for d in doctors:
            count += 1
            print(f"[DEBUG] Displaying doctor {count}: {d['name']}")
            card = (
                f"👨‍⚕️ *Dr. {d['name']}*\n"
                f"{'─' * 35}\n"
                f"🎓 *Qualification:* {d['qualification']}\n"
                f"🏥 *Specialty:* {d['specialization']}\n"
                f"⏳ *Experience:* {d['experience']}\n"

                f"{'─' * 35}\n"
                f"📝 _{d.get('about', 'Experienced dental specialist')}_"
            )
            await q.message.reply_text(
                card,
                parse_mode="Markdown",
                reply_markup=InlineKeyboardMarkup([
                    [InlineKeyboardButton(f"📅 Book with Dr. {d['name']}", callback_data=f"doctor|{d['id']}")]
                ])
            )
        
        print(f"[DEBUG] Displayed {count} doctor cards total")
        
        # Show back button
        await q.message.reply_text(
            "⬆️ Tap 'Book' on your preferred doctor",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🏠 Back to Main Menu", callback_data="menu_home")]
            ])
        )

    elif q.data == "menu_hours":
        info = await api_get("/api/bot/clinic-info")
        await q.edit_message_text(
            f"🕐 **Working Hours**\n\n"
            f"{info['hours']['weekdays']}\n"
            f"{info['hours']['saturday']}\n"
            f"{info['hours']['sunday']}",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    elif q.data == "menu_location":
        info = await api_get("/api/bot/clinic-info")
        await q.edit_message_text(
            f"📍 **Location**\n\n"
            f"{info['address']}\n\n"
            f"🗺️ [Open in Google Maps]({info['maps_link']})",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    elif q.data == "menu_contact":
        await q.edit_message_text(
            "📞 *Contact Us*\n\n"
            "📞 Phone: 0427 2313339\n"
            "📱 Mobile: 8946088182\n\n"
            "📍 Location:\n"
            "Near Vincent Bus Stop\n"
            "Cherry Road, Kumaraswamypatti\n"
            "Salem - 636007\n\n"
            "🕐 Hours:\n"
            "Mon-Fri: 8:00 AM - 8:00 PM\n"
            "Sat: 9:00 AM - 5:00 PM\n"
            "Sun: Closed",
            reply_markup=main_menu(),
            parse_mode="Markdown"
        )

    elif q.data == "menu_home":
        await q.edit_message_text("🏠 Main Menu", reply_markup=main_menu())

# ================= ISSUE → DOCTOR =================

async def handle_issue(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle dental concern and show doctors"""
    issue = update.message.text
    context.user_data["issue"] = issue
    
    # Detect specialization using AI endpoint
    try:
        result = await api_post("/api/bot/ai/specialization", {"text": issue})
        specialization = result.get("specialization", "General Dentistry")
    except:
        specialization = "General Dentistry"
    
    context.user_data["specialization"] = specialization
    
    # Get doctors for this specialization
    doctors = await api_get(f"/api/bot/doctors/by-specialization?specialization={specialization}")
    
    if not doctors:
        # No specialists found - offer to show all doctors
        await update.message.reply_text(
            f"🔍 *No {specialization} Specialists Found*\n\n"
            f"We don't have a specialist specifically for {specialization} right now.\n\n"
            f"Would you like to see all our available doctors?",
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("👨‍⚕️ Show All Doctors", callback_data="menu_doctors")],
                [InlineKeyboardButton("🏠 Back to Main Menu", callback_data="menu_home")]
            ])
        )
        return
    
    
    # Auto-select first doctor and show calendar directly
    if doctors:
        d = doctors[0]
        today = date.today()
        
        await update.message.reply_text(
            f"✅ Assigned to *Dr. {d['name']}* ({d['qualification']})\n"
            f"📅 *Select Appointment Date:*",
            parse_mode="Markdown",
            reply_markup=build_calendar(today.year, today.month, d['id'])
        )


# ================= DOCTOR / CALENDAR / SLOT =================

async def doctor_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    
    # Clean up other doctor cards so only the selected one (eventually edited) remains
    if "doctor_msg_ids" in context.user_data:
        current_id = q.message.message_id
        for mid in context.user_data["doctor_msg_ids"]:
            try:
                if mid != current_id:
                    await context.bot.delete_message(chat_id=q.message.chat_id, message_id=mid)
            except Exception:
                pass
        context.user_data.pop("doctor_msg_ids", None)
    
    # Handle both formats: "doctor|id" and "doctor|id|name"
    parts = q.data.split("|")
    did = parts[1]
    
    # Get doctor name from API if not in callback
    if len(parts) == 3:
        name = parts[2]
    else:
        # Fetch doctor details
        doctors = await api_get("/api/bot/doctors")
        doctor = next((d for d in doctors if str(d['id']) == did), None)
        name = doctor['name'] if doctor else "Doctor"
    
    context.user_data.update({"doctor_id": did, "doctor_name": name})

    today = date.today()
    await q.edit_message_text(
        f"📅 Select date for Dr. {name}",
        reply_markup=build_calendar(today.year, today.month, did)
    )

async def calendar_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    parts = q.data.split("|")

    if parts[0] == "nav":
        y, m, d = int(parts[1]), int(parts[2]), parts[3]
        if m < 1:
            m, y = 12, y - 1
        if m > 12:
            m, y = 1, y + 1
        await q.edit_message_reply_markup(build_calendar(y, m, d))
        return

    if parts[0] == "date":
        context.user_data["date"] = parts[2]
        context.user_data["doctor_id"] = parts[1] # Fix: Store doctor_id for later use
        doctor_id = parts[1]
        date_str = parts[2]
        
        slots = await api_get("/api/bot/availability", {
            "doctor_id": doctor_id,
            "date": date_str
        })

        # Calculate back button data (Current Year/Month)
        y_str, m_str, _ = date_str.split("-")
        
        # Handle empty slots (e.g. Sunday or fully booked)
        if not slots:
             await q.edit_message_text(
                 "🚫 *Clinic Closed / No Slots Available*\n\n"
                 "We are open:\nMon-Fri: 8 AM - 8 PM\nSat: 9 AM - 5 PM\nSun: Closed\n\n"
                 "Please select another date.",
                 parse_mode="Markdown",
                 reply_markup=InlineKeyboardMarkup([
                      [InlineKeyboardButton("🔙 Back to Calendar", callback_data=f"nav|{y_str}|{m_str}|{doctor_id}")]
                 ])
             )
             return

        kb = []
        # Group slots in rows of 3
        row = []
        for s in slots:
            if s["available"]:
                row.append(InlineKeyboardButton(
                    s["time"],
                    callback_data=f"slot|{s['time']}"
                ))
                if len(row) == 3:
                    kb.append(row)
                    row = []
        if row:
            kb.append(row)
            
        # Add Back button
        kb.append([InlineKeyboardButton("🔙 Back to Calendar", callback_data=f"nav|{y_str}|{m_str}|{doctor_id}")])

        await q.edit_message_text("⏰ *Select appointment time:*", reply_markup=InlineKeyboardMarkup(kb), parse_mode="Markdown")

    elif parts[0] == "slot":
        # Check context validity (handle restart/session loss)
        if "date" not in context.user_data or "doctor_id" not in context.user_data:
             await q.answer("⚠️ Session expired. Please start over.", show_alert=True)
             await q.edit_message_text(
                 "⚠️ *Session Expired*\nPlease start booking again from the menu.", 
                 reply_markup=main_menu(), 
                 parse_mode="Markdown"
             )
             return

        if "reschedule_token" in context.user_data:
            token = context.user_data.pop("reschedule_token")
            await api_patch(f"/appointments/{token}/reschedule", {
                "date": context.user_data["date"],
                "time": parts[1],
                "doctor_id": context.user_data["doctor_id"]
            })
            await q.edit_message_text("✅ Appointment rescheduled.", reply_markup=main_menu())
            return

        # Create appointment with patient data
        patient_data = {
            "telegram_id": str(update.effective_user.id),
            "name": context.user_data.get("patient_name", update.effective_user.first_name or "Telegram User"),
            "phone": context.user_data.get("patient_phone", "N/A"),
            "email": f"{update.effective_user.username}@telegram.user" if update.effective_user.username else None,
            "age": context.user_data.get("patient_age"),
            "gender": context.user_data.get("patient_gender")
        }
        
        res = await api_post("/api/bot/appointments", {
            "patient_data": patient_data,
            "date": context.user_data["date"],
            "time": parts[1],
            "doctor_id": context.user_data["doctor_id"]
        })

        pdf = generate_pdf(res)
        context.user_data["pdf"] = pdf
        gcal = generate_google_calendar_link(res)

        await q.edit_message_text(
            f"✅ *Appointment Confirmed!*\n\n"
            f"🎉 Great! Your appointment has been successfully booked.\n\n"
            f"📋 *Appointment Details:*\n"
            f"{'─' * 30}\n"
            f"🆔 Token: `{res['token']}`\n"
            f"👨‍⚕️ Doctor: Dr. {res['doctor']}\n"
            f"🏥 Specialty: {res['specialization']}\n"
            f"📅 Date: {res['date']}\n"
            f"🕐 Time: {res['time']}\n"
            f"{'─' * 30}\n\n"
            f"📍 *Clinic Address:*\n"
            f"Sree Sarojaa Multi Specialty Dental Clinic\n"
            f"Near Vincent Bus Stop, Cherry Road\n"
            f"Salem - 636007\n\n"
            f"💡 *Please arrive 10 minutes early*\n"
            f"📞 For any queries: 0427 2313339",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("📄 Download Receipt", callback_data=f"pdf|{res['token']}")],
                [InlineKeyboardButton("📅 Add to Calendar", url=gcal)],
                [InlineKeyboardButton("🔔 Set Reminder", callback_data="remind|3600")],
                [InlineKeyboardButton("🏠 Main Menu", callback_data="menu_home")]
            ]),
            parse_mode="Markdown"
        )

# ================= MANAGE =================

async def manage_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    action, token = q.data.split("|")

    if action == "view":
        appt = await api_get(f"/appointments/{token}")
        if not appt:
            await q.edit_message_text(
                "❌ Appointment not found or has been cancelled.",
                reply_markup=main_menu()
            )
            return
        
        await q.edit_message_text(
            f"📅 {appt['date']} {appt['time']}\n👨‍⚕️ {appt['doctor']}",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🔁 Reschedule", callback_data=f"resch|{token}")],
                [InlineKeyboardButton("❌ Cancel Appointment", callback_data=f"cancel|{token}")],
                [InlineKeyboardButton("🏠 Home", callback_data="menu_home")]
            ])
        )

    elif action == "resch":
        appt = await api_get(f"/appointments/{token}")
        if not appt:
            await q.edit_message_text(
                "❌ Appointment not found or has been cancelled.",
                reply_markup=main_menu()
            )
            return
        
        context.user_data["reschedule_token"] = token
        context.user_data["doctor_id"] = appt["doctor_id"]

        today = date.today()
        await q.edit_message_text(
            "📅 Select new date:",
            reply_markup=build_calendar(today.year, today.month, appt["doctor_id"])
        )

    elif action == "cancel":
        await api_delete(f"/appointments/{token}")
        await q.edit_message_text("❌ Appointment cancelled.", reply_markup=main_menu())

    elif action == "pdf":
        await context.bot.send_document(
            update.effective_chat.id,
            open(context.user_data["pdf"], "rb"),
            filename="Appointment_Receipt.pdf"
        )

    elif action == "remind":
        delay = int(token)
        asyncio.create_task(
            reminder_task(
                context.bot,
                update.effective_chat.id,
                delay,
                "⏰ Reminder: You have an appointment soon!"
            )
        )
        await q.edit_message_text("🔔 Reminder set successfully.", reply_markup=main_menu())

# ================= GENDER HANDLER =================

async def gender_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    
    _, gender = q.data.split("|")
    context.user_data["patient_gender"] = gender.capitalize()
    context.user_data["mode"] = "issue"
    
    await q.edit_message_text(
        f"✅ Gender: {gender.capitalize()}\n\n"
        "🦷 Now, please describe your dental concern:\n\n"
        "(e.g., tooth pain, cavity, cleaning, whitening, braces)"
    )

# ================= GOOGLE =================

def generate_google_calendar_link(appt):
    date_str = appt["date"].replace("-", "")
    time_str = appt["time"].replace(":", "") + "00"

    start = f"{date_str}T{time_str}"
    end_hour = str(int(time_str[:2]) + 1).zfill(2)
    end = f"{date_str}T{end_hour}{time_str[2:]}"

    return (
        "https://calendar.google.com/calendar/render?action=TEMPLATE"
        f"&text=Doctor+Appointment+-+Dr+{appt['doctor'].replace(' ', '+')}"
        f"&dates={start}/{end}"
        "&details=Hospital+Appointment"
        "&trp=false"
    )

# ================= MAIN =================

def main():
    # Configure with longer timeout for network issues
    app = (
        ApplicationBuilder()
        .token(BOT_TOKEN)
        .connect_timeout(30.0)
        .read_timeout(30.0)
        .write_timeout(30.0)
        .pool_timeout(30.0)
        .build()
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_handler))
    app.add_handler(CallbackQueryHandler(menu_handler, pattern="^menu_"))
    app.add_handler(CallbackQueryHandler(gender_handler, pattern=r"^gender\|"))
    app.add_handler(CallbackQueryHandler(doctor_handler, pattern=r"^doctor\|"))
    app.add_handler(CallbackQueryHandler(calendar_handler, pattern=r"^(nav\||date\||slot\|)"))
    app.add_handler(CallbackQueryHandler(manage_handler, pattern=r"^(view|cancel|pdf|remind|resch)"))

    print("🤖 Hosbot running")
    print("⏰ Connection timeout: 30s (configured for network stability)")
    
    try:
        app.run_polling(drop_pending_updates=True)
    except Exception as e:
        print(f"❌ Bot stopped: {e}")
        print("💡 Tip: Check your internet connection and try again")

if __name__ == "__main__":
    main()
