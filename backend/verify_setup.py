"""
Script to verify database setup and show table information
"""
from sqlalchemy import inspect, text
from app.database import engine, DATABASE_URL
from app.models import Admin, Doctor, Specialization, Appointment, Patient, Banner

def verify_database():
    """Verify database connection and tables"""
    print("Verifying Hospital Management System database setup...")
    print("-" * 60)
    
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✓ PostgreSQL connected: {version.split(',')[0]}")
            print(f"✓ Database URL: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
            print()
        
        # Check tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        expected_tables = ['admins', 'doctors', 'specializations', 'appointments', 'patients', 'banners']
        
        print("Table Status:")
        print("-" * 60)
        for table in expected_tables:
            if table in tables:
                # Get row count
                with engine.connect() as conn:
                    result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
                    count = result.fetchone()[0]
                print(f"✓ {table:20s} - EXISTS ({count} records)")
            else:
                print(f"✗ {table:20s} - MISSING")
        
        print()
        print("All Tables Found:")
        for table in tables:
            if table in expected_tables:
                print(f"  - {table}")
        
        # Check for admin user
        print()
        print("Checking default admin...")
        from app.database import SessionLocal
        db = SessionLocal()
        try:
            admin = db.query(Admin).filter(Admin.email == "admin@hospital.com").first()
            if admin:
                print(f"✓ Default admin exists: {admin.email}")
            else:
                print("✗ Default admin not found. Run setup_db.py to create one.")
        except Exception as e:
            print(f"✗ Error checking admin: {e}")
        finally:
            db.close()
        
        print()
        print("-" * 60)
        print("Verification complete!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        print()
        print("Troubleshooting:")
        print("1. Make sure PostgreSQL is running")
        print("2. Verify database credentials in app/database.py")
        print("3. Create database manually: CREATE DATABASE hospital_db;")
        print("4. Run setup_db.py to create tables")

if __name__ == "__main__":
    verify_database()

