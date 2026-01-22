from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import admin, doctors, specializations, appointments, patients, banners, settings, export, chat, bot
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hospital Management System API", version="1.0.0")

# CORS middleware
app.add_middleware(
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(doctors.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(specializations.router, prefix="/api/specializations", tags=["Specializations"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(banners.router, prefix="/api/banners", tags=["Banners"])
app.include_router(settings.router, tags=["Settings"])
app.include_router(export.router, prefix="/api/admin/export", tags=["Export"])
app.include_router(chat.router)
app.include_router(bot.router)

@app.get("/")
async def root():
    return {"message": "Hospital Management System API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

