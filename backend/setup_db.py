"""
Database setup script for Hospital Management System
Run this script to create the database and tables
"""
import sys
from sqlalchemy import create_engine, text
from app.database import Base, engine, DATABASE_URL
from app.models import Admin, Doctor, Specialization, Appointment, Patient, Banner
from app.auth import get_password_hash

def create_database():
    """Create the database if it doesn't exist"""
    # Extract database name from URL
    db_name = DATABASE_URL.split('/')[-1]
    # Connect to postgres database to create the target database
    postgres_url = DATABASE_URL.rsplit('/', 1)[0] + '/postgres'
    
    try:
        temp_engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")
        with temp_engine.connect() as conn:
            # Check if database exists
            result = conn.execute(text(
                "SELECT 1 FROM pg_database WHERE datname = :db_name"
            ), {"db_name": db_name})
            exists = result.fetchone()
            
            if not exists:
                conn.execute(text(f'CREATE DATABASE "{db_name}"'))
                print(f"Database '{db_name}' created successfully")
            else:
                print(f"Database '{db_name}' already exists")
        return True
    except Exception as e:
        error_msg = str(e).lower()
        if "already exists" in error_msg or "duplicate" in error_msg:
            print(f"Database '{db_name}' already exists")
            return True
        else:
            print(f"Error creating database: {e}")
            print("You may need to create it manually:")
            print(f"  CREATE DATABASE {db_name};")
            return False
    finally:
        if 'temp_engine' in locals():
            temp_engine.dispose()

def create_tables():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

def create_default_admin():
    """Create a default admin user"""
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).filter(Admin.email == "admin@hospital.com").first()
        if existing_admin:
            print("Default admin already exists")
            return
        
        # Create default admin with proper password hashing
        hashed_password = get_password_hash("admin123")
        admin = Admin(
            name="Admin",
            email="admin@hospital.com",
            password=hashed_password
        )
        db.add(admin)
        db.commit()
        print("Default admin created:")
        print("  Email: admin@hospital.com")
        print("  Password: admin123")
    except Exception as e:
        print(f"Error creating default admin: {e}")
        print("You can create an admin manually via the API after starting the server")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Setting up Hospital Management System database...")
    print("-" * 50)
    
    # Create database
    if not create_database():
        print("Continuing with existing database...")
    
    # Create tables
    if not create_tables():
        print("Error setting up tables. Please check your database connection.")
        sys.exit(1)
    
    # Create default admin
    create_default_admin()
    
    print("-" * 50)
    print("Database setup completed!")
    print("\nYou can now start the server with:")
    print("  uvicorn main:app --reload --host 0.0.0.0 --port 8000")

