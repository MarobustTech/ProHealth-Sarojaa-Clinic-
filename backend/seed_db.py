import sys
import os

# Add the current directory to sys.path to allow imports from app
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Admin, Doctor, Specialization, Banner
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed_data():
    db = SessionLocal()
    
    try:
        # 1. Create Default Admin
        print("Checking for Admin user...")
        admin = db.query(Admin).filter(Admin.email == "admin@prohealth.com").first()
        if not admin:
            print("Creating default Admin user...")
            db_admin = Admin(
                name="Super Admin",
                email="admin@prohealth.com",
                password=get_password_hash("admin123")
            )
            db.add(db_admin)
            print("Admin created: admin@prohealth.com / admin123")
        else:
            print("Admin user already exists.")

        # 2. Create Specializations
        print("Checking for Specializations...")
        specializations_data = [
            {"name": "General Dentistry", "description": "Routine dental care, checkups, and cleaning", "icon": "tooth"},
            {"name": "Orthodontics", "description": "Braces and aligners for teeth straightening", "icon": "braces"},
            {"name": "Endodontics", "description": "Root canal treatments", "icon": "root"},
            {"name": "Pediatric Dentistry", "description": "Dental care for children", "icon": "child"},
            {"name": "Oral & Maxillofacial Surgery", "description": "Surgical procedures for teeth, jaws and face", "icon": "surgery"},
            {"name": "Prosthodontics", "description": "Designing and fitting artificial replacements for teeth", "icon": "implant"},
            {"name": "Periodontics", "description": "Treatment of gum diseases", "icon": "activity"},
            {"name": "Implantology", "description": "Dental implants", "icon": "screw"},
        ]

        specs_map = {} # To map name to DB object for doctors

        for spec in specializations_data:
            db_spec = db.query(Specialization).filter(Specialization.name == spec["name"]).first()
            if not db_spec:
                print(f"Creating Specialization: {spec['name']}")
                new_spec = Specialization(
                    name=spec["name"],
                    description=spec["description"],
                    icon=spec["icon"]
                )
                db.add(new_spec)
                db.flush() # Flush to get ID
                db.refresh(new_spec)
                specs_map[spec["name"]] = new_spec
            else:
                specs_map[spec["name"]] = db_spec
        
        print("Specializations seeded.")

        # 3. Create Doctors
        print("Checking for Doctors...")
        doctors_data = [
            {
                "name": "K.P. Senthamarai Kannan",
                "specialization": "Orthodontics",
                "qualification": "MDS (Orthodontist), FPFA (USA)",
                "experience": 20,
                "consultation_fee": 800.0,
                "opd_timings": "10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM"
            },
            {
                "name": "S. Vijayapriya",
                "specialization": "General Dentistry",
                "qualification": "BDS, FPFA (USA)",
                "experience": 15,
                "consultation_fee": 500.0,
                "opd_timings": "9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM"
            },
            {
                "name": "J. Arunkumar",
                "specialization": "Oral & Maxillofacial Surgery",
                "qualification": "MDS (Oral & Maxillofacial Surgeon)",
                "experience": 12,
                "consultation_fee": 1000.0,
                "opd_timings": "By Appointment"
            },
            {
                "name": "G. Rajkumar",
                "specialization": "Prosthodontics",
                "qualification": "MDS (Prosthodontist)",
                "experience": 12,
                "consultation_fee": 700.0,
                "opd_timings": "4:00 PM - 8:00 PM"
            },
            {
                "name": "M. Jaikumar",
                "specialization": "Endodontics",
                "qualification": "MDS (Endodontist)",
                "experience": 10,
                "consultation_fee": 700.0,
                "opd_timings": "4:00 PM - 8:00 PM"
            },
            {
                "name": "Basil Mathews",
                "specialization": "Pediatric Dentistry",
                "qualification": "MDS (Pedodontist)",
                "experience": 8,
                "consultation_fee": 600.0,
                "opd_timings": "By Appointment"
            },
            {
                "name": "Anuradha",
                "specialization": "Endodontics",
                "qualification": "MDS (Endodontist)",
                "experience": 8,
                "consultation_fee": 700.0,
                "opd_timings": "10:00 AM - 2:00 PM"
            },
            {
                "name": "V. T. Arun Varghese",
                "specialization": "Periodontics",
                "qualification": "MDS (Periodontist)",
                "experience": 10,
                "consultation_fee": 600.0,
                "opd_timings": "By Appointment"
            },
            {
                "name": "Shahid Basha",
                "specialization": "Implantology",
                "qualification": "BDS (Implantologist)",
                "experience": 10,
                "consultation_fee": 800.0,
                "opd_timings": "By Appointment"
            },
            {
                "name": "Dhanakoti",
                "specialization": "General Dentistry",
                "qualification": "BDS",
                "experience": 5,
                "consultation_fee": 300.0,
                "opd_timings": "9:00 AM - 5:00 PM"
            },
            {
                "name": "Manjula",
                "specialization": "General Dentistry",
                "qualification": "BDS",
                "experience": 5,
                "consultation_fee": 300.0,
                "opd_timings": "9:00 AM - 5:00 PM"
            },
            {
                "name": "Sri Hari",
                "specialization": "General Dentistry",
                "qualification": "BDS",
                "experience": 5,
                "consultation_fee": 300.0,
                "opd_timings": "9:00 AM - 5:00 PM"
            }
        ]

        for doc in doctors_data:
            db_doc = db.query(Doctor).filter(Doctor.name == doc["name"]).first()
            if not db_doc:
                print(f"Creating Doctor: Dr. {doc['name']}")
                spec_obj = specs_map.get(doc["specialization"])
                if not spec_obj and doc["specialization"] == "Implantology": 
                     # Handle case where Implantology might not match if seeded purely by name above, generally safe but adding fallback
                     spec_obj = specs_map.get("General Dentistry") 

                new_doc = Doctor(
                    name=doc["name"],
                    specialization=doc["specialization"],
                    specialization_id=spec_obj.id if spec_obj else None,
                    qualification=doc["qualification"],
                    experience=doc["experience"],
                    consultation_fee=doc["consultation_fee"],
                    opd_timings=doc["opd_timings"],
                    languages=["English", "Tamil"], # Defaulting languages
                    bio=f"Dr. {doc['name']} is a specialist in {doc['specialization']}.",
                    is_active=True
                )
                db.add(new_doc)
            else:
                print(f"Doctor {doc['name']} already exists.")

        # 4. Create Banners (Optional)
        print("Checking for Banners...")
        if db.query(Banner).count() == 0:
             print("Creating default banners...")
             b1 = Banner(title="Advanced Dental Care", description="State-of-the-art facilities for your smile", button_text="Book Now", is_active=True, order=1)
             b2 = Banner(title="Pediatric Specialist", description="Gentle care for your little ones", button_text="Learn More", is_active=True, order=2)
             db.add(b1)
             db.add(b2)
        
        db.commit()
        print("Database seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting database seed...")
    try:
        # Create tables if they don't exist (just in case)
        Base.metadata.create_all(bind=engine)
        seed_data()
    except Exception as e:
        print(f"Fatal error: {e}")
