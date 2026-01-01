"""
Script to populate database with sample data for demonstration
Run this after setting up the database
"""
from app.database import SessionLocal
from app.models import Doctor, Specialization, Patient, Appointment, Banner
from datetime import datetime, timedelta
import random

def populate_data():
    db = SessionLocal()
    
    try:
        print("Populating database with sample data...")
        print("-" * 60)
        
        # 1. Create Specializations
        print("\n1. Creating Specializations...")
        specializations_data = [
            {
                "name": "Cardiology",
                "description": "Heart and cardiovascular system care. Treatment of heart diseases, hypertension, and cardiac emergencies.",
                "icon": "❤️",
                "is_active": True
            },
            {
                "name": "Neurology",
                "description": "Brain and nervous system disorders. Treatment of strokes, epilepsy, migraines, and neurological conditions.",
                "icon": "🧠",
                "is_active": True
            },
            {
                "name": "Pediatrics",
                "description": "Comprehensive healthcare for infants, children, and adolescents. Child development and pediatric diseases.",
                "icon": "👶",
                "is_active": True
            },
            {
                "name": "Orthopedics",
                "description": "Bone, joint, and muscle disorders. Treatment of fractures, arthritis, and sports injuries.",
                "icon": "🦴",
                "is_active": True
            },
            {
                "name": "Dermatology",
                "description": "Skin, hair, and nail conditions. Treatment of acne, eczema, psoriasis, and skin cancer.",
                "icon": "✨",
                "is_active": True
            },
            {
                "name": "Ophthalmology",
                "description": "Eye care and vision services. Treatment of eye diseases, cataracts, and vision correction.",
                "icon": "👁️",
                "is_active": True
            },
            {
                "name": "Internal Medicine",
                "description": "Adult medicine and disease prevention. Comprehensive care for chronic and acute conditions.",
                "icon": "🩺",
                "is_active": True
            },
            {
                "name": "Psychiatry",
                "description": "Mental health and psychological disorders. Treatment of depression, anxiety, and behavioral issues.",
                "icon": "🧘",
                "is_active": True
            }
        ]
        
        spec_map = {}
        for spec_data in specializations_data:
            existing = db.query(Specialization).filter(Specialization.name == spec_data["name"]).first()
            if not existing:
                spec = Specialization(**spec_data)
                db.add(spec)
                db.flush()
                spec_map[spec_data["name"]] = spec
                print(f"  [OK] Created: {spec_data['name']}")
            else:
                spec_map[spec_data["name"]] = existing
                print(f"  [EXISTS] {spec_data['name']}")
        
        db.commit()
        
        # 2. Create Doctors
        print("\n2. Creating Doctors...")
        doctors_data = [
            {
                "name": "Dr. Sarah Johnson",
                "specialization": "Cardiology",
                "email": "sarah.johnson@hospital.com",
                "phone": "+1 234 567 8901",
                "experience": 15,
                "qualification": "MD, FACC, Cardiologist",
                "consultation_fee": 500.00,
                "opd_timings": "Mon-Fri: 9:00 AM - 5:00 PM",
                "languages": ["English", "Spanish"],
                "bio": "Board-certified cardiologist with 15 years of experience. Specializes in interventional cardiology, heart failure management, and preventive cardiology. Published over 50 research papers.",
                "image": "/experienced-male-cardiologist-doctor-professional-.jpg",
                "is_active": True
            },
            {
                "name": "Dr. Emily Chen",
                "specialization": "Neurology",
                "email": "emily.chen@hospital.com",
                "phone": "+1 234 567 8902",
                "experience": 12,
                "qualification": "MD, PhD, Neurologist",
                "consultation_fee": 600.00,
                "opd_timings": "Mon-Wed: 10:00 AM - 4:00 PM",
                "languages": ["English", "Mandarin"],
                "bio": "Neurologist specializing in movement disorders and neurodegenerative diseases. Expert in Parkinson's disease and Alzheimer's treatment.",
                "image": "/asian-female-neurologist-doctor-professional-intel.jpg",
                "is_active": True
            },
            {
                "name": "Dr. Michael Roberts",
                "specialization": "Pediatrics",
                "email": "michael.roberts@hospital.com",
                "phone": "+1 234 567 8903",
                "experience": 10,
                "qualification": "MD, FAAP, Pediatrician",
                "consultation_fee": 400.00,
                "opd_timings": "Mon-Sat: 8:00 AM - 6:00 PM",
                "languages": ["English", "French"],
                "bio": "Pediatrician dedicated to providing comprehensive care for children of all ages. Specializes in developmental pediatrics and childhood immunizations.",
                "image": "/asian-male-pediatrician-doctor-gentle-professional.jpg",
                "is_active": True
            },
            {
                "name": "Dr. James Wilson",
                "specialization": "Orthopedics",
                "email": "james.wilson@hospital.com",
                "phone": "+1 234 567 8904",
                "experience": 18,
                "qualification": "MD, FACS, Orthopedic Surgeon",
                "consultation_fee": 550.00,
                "opd_timings": "Tue-Thu: 9:00 AM - 3:00 PM",
                "languages": ["English"],
                "bio": "Orthopedic surgeon with expertise in joint replacement, sports medicine, and trauma surgery. Performed over 2000 successful surgeries.",
                "image": "/experienced-male-orthopedic-surgeon-professional-p.jpg",
                "is_active": True
            },
            {
                "name": "Dr. Priya Sharma",
                "specialization": "Dermatology",
                "email": "priya.sharma@hospital.com",
                "phone": "+1 234 567 8905",
                "experience": 8,
                "qualification": "MD, Dermatologist",
                "consultation_fee": 450.00,
                "opd_timings": "Mon-Fri: 10:00 AM - 6:00 PM",
                "languages": ["English", "Hindi"],
                "bio": "Dermatologist specializing in cosmetic dermatology, acne treatment, and skin cancer detection. Expert in laser treatments.",
                "image": "/professional-female-dermatologist-doctor-elegant-p.jpg",
                "is_active": True
            },
            {
                "name": "Dr. David Kim",
                "specialization": "Ophthalmology",
                "email": "david.kim@hospital.com",
                "phone": "+1 234 567 8906",
                "experience": 14,
                "qualification": "MD, FACS, Ophthalmologist",
                "consultation_fee": 500.00,
                "opd_timings": "Mon-Fri: 9:00 AM - 5:00 PM",
                "languages": ["English", "Korean"],
                "bio": "Ophthalmologist specializing in cataract surgery, retinal diseases, and refractive surgery. Advanced training in LASIK procedures.",
                "image": "/male-eye-doctor-ophthalmologist-professional-portr.jpg",
                "is_active": True
            },
            {
                "name": "Dr. Lisa Anderson",
                "specialization": "Internal Medicine",
                "email": "lisa.anderson@hospital.com",
                "phone": "+1 234 567 8907",
                "experience": 11,
                "qualification": "MD, Internal Medicine",
                "consultation_fee": 400.00,
                "opd_timings": "Mon-Fri: 8:00 AM - 4:00 PM",
                "languages": ["English"],
                "bio": "Internal medicine physician providing comprehensive adult healthcare. Specializes in diabetes management and preventive care.",
                "image": "/professional-female-internal-medicine-doctor-matur.jpg",
                "is_active": True
            },
            {
                "name": "Dr. Robert Martinez",
                "specialization": "Psychiatry",
                "email": "robert.martinez@hospital.com",
                "phone": "+1 234 567 8908",
                "experience": 13,
                "qualification": "MD, Psychiatrist",
                "consultation_fee": 500.00,
                "opd_timings": "Mon-Thu: 10:00 AM - 6:00 PM",
                "languages": ["English", "Spanish"],
                "bio": "Psychiatrist specializing in mood disorders, anxiety, and adult ADHD. Provides both medication management and therapy.",
                "image": "/professional-asian-male-doctor-in-medical-attire-c.jpg",
                "is_active": True
            }
        ]
        
        doctor_map = {}
        for doc_data in doctors_data:
            existing = db.query(Doctor).filter(Doctor.email == doc_data["email"]).first()
            if not existing:
                spec_name = doc_data.pop("specialization")
                spec = spec_map.get(spec_name)
                if spec:
                    doc_data["specialization_id"] = spec.id
                doc_data["specialization"] = spec_name
                doctor = Doctor(**doc_data)
                db.add(doctor)
                db.flush()
                doctor_map[doc_data["email"]] = doctor
                print(f"  [OK] Created: {doc_data['name']} - {spec_name}")
            else:
                doctor_map[doc_data["email"]] = existing
                print(f"  [EXISTS] {doc_data['name']}")
        
        db.commit()
        
        # 3. Create Patients
        print("\n3. Creating Patients...")
        patients_data = [
            {
                "name": "John Doe",
                "email": "john.doe@email.com",
                "phone": "+1 555 0101",
                "age": 45,
                "gender": "Male",
                "blood_group": "O+",
                "address": "123 Main Street, City, State 12345",
                "emergency_contact": "Jane Doe - +1 555 0102 (Spouse)",
                "medical_history": "Hypertension (2018), Type 2 Diabetes (2020), Previous appendectomy (2015)",
                "allergies": "Penicillin, Shellfish"
            },
            {
                "name": "Sarah Williams",
                "email": "sarah.williams@email.com",
                "phone": "+1 555 0201",
                "age": 32,
                "gender": "Female",
                "blood_group": "A+",
                "address": "456 Oak Avenue, City, State 12346",
                "emergency_contact": "Mike Williams - +1 555 0202 (Husband)",
                "medical_history": "Migraine headaches (since 2015), Seasonal allergies",
                "allergies": "Dust mites, Pollen"
            },
            {
                "name": "Michael Chen",
                "email": "michael.chen@email.com",
                "phone": "+1 555 0301",
                "age": 28,
                "gender": "Male",
                "blood_group": "B+",
                "address": "789 Pine Road, City, State 12347",
                "emergency_contact": "Lisa Chen - +1 555 0302 (Mother)",
                "medical_history": "Asthma (childhood), Sports injury - knee surgery (2022)",
                "allergies": "None known"
            },
            {
                "name": "Emily Rodriguez",
                "email": "emily.rodriguez@email.com",
                "phone": "+1 555 0401",
                "age": 35,
                "gender": "Female",
                "blood_group": "AB+",
                "address": "321 Elm Street, City, State 12348",
                "emergency_contact": "Carlos Rodriguez - +1 555 0402 (Brother)",
                "medical_history": "Eczema (since childhood), Gestational diabetes (2021, resolved)",
                "allergies": "Latex, Certain detergents"
            },
            {
                "name": "David Thompson",
                "email": "david.thompson@email.com",
                "phone": "+1 555 0501",
                "age": 52,
                "gender": "Male",
                "blood_group": "O-",
                "address": "654 Maple Drive, City, State 12349",
                "emergency_contact": "Susan Thompson - +1 555 0502 (Wife)",
                "medical_history": "High cholesterol (2019), Sleep apnea (2020), Previous knee replacement (2021)",
                "allergies": "Sulfa drugs"
            },
            {
                "name": "Jessica Park",
                "email": "jessica.park@email.com",
                "phone": "+1 555 0601",
                "age": 29,
                "gender": "Female",
                "blood_group": "A-",
                "address": "987 Cedar Lane, City, State 12350",
                "emergency_contact": "James Park - +1 555 0602 (Father)",
                "medical_history": "Anxiety disorder (2020), Regular eye checkups for myopia",
                "allergies": "None known"
            }
        ]
        
        patient_map = {}
        for patient_data in patients_data:
            existing = db.query(Patient).filter(Patient.email == patient_data["email"]).first()
            if not existing:
                patient = Patient(**patient_data)
                db.add(patient)
                db.flush()
                patient_map[patient_data["email"]] = patient
                print(f"  [OK] Created: {patient_data['name']} (Age: {patient_data['age']})")
            else:
                patient_map[patient_data["email"]] = existing
                print(f"  [EXISTS] {patient_data['name']}")
        
        db.commit()
        
        # 4. Create Appointments
        print("\n4. Creating Appointments...")
        doctors_list = list(doctor_map.values())
        patients_list = list(patient_map.values())
        
        # Generate dates for next 30 days
        base_date = datetime.now()
        appointment_times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
        
        appointments_data = []
        for i in range(15):  # Create 15 sample appointments
            appointment_date = (base_date + timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d")
            appointment_time = random.choice(appointment_times)
            doctor = random.choice(doctors_list)
            patient = random.choice(patients_list)
            status = random.choice(["pending", "confirmed", "completed", "confirmed"])
            
            appointments_data.append({
                "patient_name": patient.name,
                "patient_email": patient.email,
                "patient_phone": patient.phone,
                "patient_age": patient.age,
                "patient_gender": patient.gender,
                "doctor_id": doctor.id,
                "specialization": doctor.specialization,
                "appointment_date": appointment_date,
                "appointment_time": appointment_time,
                "status": status,
                "notes": f"Follow-up appointment" if status == "completed" else "Regular consultation"
            })
        
        for apt_data in appointments_data:
            appointment = Appointment(**apt_data)
            db.add(appointment)
            print(f"  [OK] Created: {apt_data['patient_name']} with {apt_data['specialization']} on {apt_data['appointment_date']}")
        
        db.commit()
        
        # 5. Create Banners
        print("\n5. Creating Banners...")
        banners_data = [
            {
                "title": "Advanced Medical Technology at Your Service",
                "description": "Experience world-class healthcare with our state-of-the-art medical equipment and cutting-edge treatment protocols.",
                "image": "/professional-doctor-consulting-with-happy-family-i.jpg",
                "link": "/book",
                "button_text": "Book Appointment",
                "is_active": True,
                "order": 1
            },
            {
                "title": "24/7 Emergency Care When You Need It Most",
                "description": "Our emergency department is always ready to provide immediate care with experienced specialists available around the clock.",
                "image": "/experienced-male-cardiologist-doctor-professional-.jpg",
                "link": "/services",
                "button_text": "Learn More",
                "is_active": True,
                "order": 2
            },
            {
                "title": "Compassionate Care for Your Entire Family",
                "description": "From pediatrics to geriatrics, we offer comprehensive healthcare services tailored to every member of your family.",
                "image": "/asian-male-pediatrician-doctor-gentle-professional.jpg",
                "link": "/services",
                "button_text": "View Services",
                "is_active": True,
                "order": 3
            }
        ]
        
        for banner_data in banners_data:
            existing = db.query(Banner).filter(Banner.title == banner_data["title"]).first()
            if not existing:
                banner = Banner(**banner_data)
                db.add(banner)
                print(f"  [OK] Created: {banner_data['title']}")
            else:
                print(f"  [EXISTS] {banner_data['title']}")
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("[SUCCESS] Sample data population completed successfully!")
        print("=" * 60)
        print(f"\nSummary:")
        print(f"  • Specializations: {len(spec_map)}")
        print(f"  • Doctors: {len(doctor_map)}")
        print(f"  • Patients: {len(patient_map)}")
        print(f"  • Appointments: {len(appointments_data)}")
        print(f"  • Banners: {len(banners_data)}")
        print("\nYou can now view the data in your admin dashboard!")
        
    except Exception as e:
        print(f"\n[ERROR] {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    populate_data()

