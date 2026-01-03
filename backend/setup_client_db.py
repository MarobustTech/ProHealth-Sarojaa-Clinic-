"""
Database setup script for SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC
This script creates a dedicated database and user for the client
"""
import sys
from sqlalchemy import create_engine, text
import os
from urllib.parse import urlparse, urlunparse, quote

# Client database configuration
CLIENT_DB_NAME = "sree_sarojaa_hospital"
CLIENT_DB_USER = "sree_sarojaa_user"
CLIENT_DB_PASSWORD = "SreeSarojaa@2025!Secure"  # Strong password - change in production

# Get the database URL from environment or use default from database.py
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:12345678@localhost:5432/hospital_db"
)

# Parse the database URL to extract connection components
def parse_db_url(db_url):
    """Parse database URL and return components"""
    # Handle postgresql+psycopg2:// format
    if db_url.startswith("postgresql+psycopg2://"):
        db_url = db_url.replace("postgresql+psycopg2://", "postgresql://")
    
    parsed = urlparse(db_url)
    
    # Extract components
    username = parsed.username or "postgres"
    password = parsed.password or "12345678"
    hostname = parsed.hostname or "localhost"
    port = parsed.port or 5432
    database = parsed.path.lstrip('/') if parsed.path else "postgres"
    
    # Build base URL (without database name)
    base_url = f"postgresql://{username}:{password}@{hostname}:{port}"
    
    return {
        "username": username,
        "password": password,
        "hostname": hostname,
        "port": port,
        "database": database,
        "base_url": base_url
    }

# Parse the existing database URL
db_config = parse_db_url(DATABASE_URL)
BASE_DB_URL = db_config["base_url"]

def create_client_database():
    """Create the client database if it doesn't exist"""
    # Connect to postgres database to create the target database
    postgres_url = f"{BASE_DB_URL}/postgres"
    
    try:
        temp_engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")
        with temp_engine.connect() as conn:
            # Check if database exists
            result = conn.execute(text(
                "SELECT 1 FROM pg_database WHERE datname = :db_name"
            ), {"db_name": CLIENT_DB_NAME})
            exists = result.fetchone()
            
            if not exists:
                conn.execute(text(f'CREATE DATABASE "{CLIENT_DB_NAME}"'))
                print(f"[OK] Database '{CLIENT_DB_NAME}' created successfully")
            else:
                print(f"[EXISTS] Database '{CLIENT_DB_NAME}' already exists")
        return True
    except Exception as e:
        error_msg = str(e).lower()
        if "already exists" in error_msg or "duplicate" in error_msg:
            print(f"[EXISTS] Database '{CLIENT_DB_NAME}' already exists")
            return True
        else:
            print(f"[ERROR] Error creating database: {e}")
            print("You may need to create it manually:")
            print(f"  CREATE DATABASE {CLIENT_DB_NAME};")
            return False
    finally:
        if 'temp_engine' in locals():
            temp_engine.dispose()

def create_client_user():
    """Create a dedicated database user for the client"""
    postgres_url = f"{BASE_DB_URL}/postgres"
    
    try:
        temp_engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")
        with temp_engine.connect() as conn:
            # Check if user exists
            result = conn.execute(text(
                "SELECT 1 FROM pg_user WHERE usename = :username"
            ), {"username": CLIENT_DB_USER})
            exists = result.fetchone()
            
            if not exists:
                # Create user
                conn.execute(text(
                    f"CREATE USER {CLIENT_DB_USER} WITH PASSWORD :password"
                ), {"password": CLIENT_DB_PASSWORD})
                print(f"[OK] User '{CLIENT_DB_USER}' created successfully")
            else:
                print(f"[EXISTS] User '{CLIENT_DB_USER}' already exists")
                # Update password
                try:
                    conn.execute(text(
                        f"ALTER USER {CLIENT_DB_USER} WITH PASSWORD :password"
                    ), {"password": CLIENT_DB_PASSWORD})
                    print(f"[OK] Password updated for user '{CLIENT_DB_USER}'")
                except Exception as e:
                    print(f"[WARNING] Could not update password: {e}")
            
            # Grant privileges on database
            conn.execute(text(
                f'GRANT ALL PRIVILEGES ON DATABASE "{CLIENT_DB_NAME}" TO {CLIENT_DB_USER}'
            ))
            print(f"[OK] Privileges granted to '{CLIENT_DB_USER}' on '{CLIENT_DB_NAME}'")
            
        # Now grant schema privileges by connecting to the client database
        client_db_url = f"{BASE_DB_URL}/{CLIENT_DB_NAME}"
        client_engine = create_engine(client_db_url, isolation_level="AUTOCOMMIT")
        with client_engine.connect() as conn:
            # Grant usage on schema
            conn.execute(text(f'GRANT USAGE ON SCHEMA public TO {CLIENT_DB_USER}'))
            # Grant all privileges on all tables in schema
            conn.execute(text(f'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO {CLIENT_DB_USER}'))
            # Grant all privileges on all sequences in schema
            conn.execute(text(f'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO {CLIENT_DB_USER}'))
            # Set default privileges for future tables
            conn.execute(text(f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO {CLIENT_DB_USER}'))
            conn.execute(text(f'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO {CLIENT_DB_USER}'))
            print(f"[OK] Schema privileges granted to '{CLIENT_DB_USER}'")
        client_engine.dispose()
            
        return True
    except Exception as e:
        print(f"[ERROR] Error creating user: {e}")
        print("You may need to create it manually:")
        print(f"  CREATE USER {CLIENT_DB_USER} WITH PASSWORD '{CLIENT_DB_PASSWORD}';")
        print(f"  GRANT ALL PRIVILEGES ON DATABASE {CLIENT_DB_NAME} TO {CLIENT_DB_USER};")
        return False
    finally:
        if 'temp_engine' in locals():
            temp_engine.dispose()

def create_tables():
    """Create all database tables in the client database"""
    from app.database import Base
    from app.models import Admin, Doctor, Specialization, Appointment, Patient, Banner
    
    # Update engine to use client database
    client_db_url = f"{BASE_DB_URL}/{CLIENT_DB_NAME}"
    client_engine = create_engine(client_db_url)
    
    try:
        Base.metadata.create_all(bind=client_engine)
        print("[OK] Tables created successfully")
        return True
    except Exception as e:
        print(f"[ERROR] Error creating tables: {e}")
        return False
    finally:
        if 'client_engine' in locals():
            client_engine.dispose()

def create_default_admin():
    """Create a default admin user for the client"""
    from sqlalchemy.orm import sessionmaker
    from app.models import Admin
    from app.auth import get_password_hash
    
    # Update engine to use client database
    client_db_url = f"{BASE_DB_URL}/{CLIENT_DB_NAME}"
    client_engine = create_engine(client_db_url)
    ClientSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=client_engine)
    
    db = ClientSessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).filter(Admin.email == "admin@sreesarojaa.com").first()
        if existing_admin:
            print("[EXISTS] Default admin already exists")
            return
        
        # Create default admin
        hashed_password = get_password_hash("admin123")
        admin = Admin(
            name="Admin",
            email="admin@sreesarojaa.com",
            password=hashed_password
        )
        db.add(admin)
        db.commit()
        print("[OK] Default admin created:")
        print("  Email: admin@sreesarojaa.com")
        print("  Password: admin123")
    except Exception as e:
        print(f"[ERROR] Error creating default admin: {e}")
        db.rollback()
    finally:
        db.close()
        if 'client_engine' in locals():
            client_engine.dispose()

if __name__ == "__main__":
    print("=" * 70)
    print("Setting up database for SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC")
    print("=" * 70)
    print()
    print(f"Connecting to PostgreSQL at: {db_config['hostname']}:{db_config['port']}")
    print(f"Using admin user: {db_config['username']}")
    print()
    
    # Create database
    if not create_client_database():
        print("[WARNING] Continuing with existing database...")
    
    # Create user
    if not create_client_user():
        print("[WARNING] User creation failed. Please create manually.")
    
    # Create tables
    # Note: We need to temporarily update the database URL
    original_db_url = os.getenv("DATABASE_URL")
    client_db_url = f"{BASE_DB_URL}/{CLIENT_DB_NAME}"
    os.environ["DATABASE_URL"] = client_db_url
    
    # Update database.py to use the new URL
    from sqlalchemy.orm import sessionmaker
    import app.database as db_module
    db_module.DATABASE_URL = client_db_url
    db_module.engine = create_engine(client_db_url)
    db_module.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_module.engine)
    
    if not create_tables():
        print("[ERROR] Error setting up tables. Please check your database connection.")
        sys.exit(1)
    
    # Create default admin
    create_default_admin()
    
    # Restore original database URL
    if original_db_url:
        os.environ["DATABASE_URL"] = original_db_url
    else:
        os.environ.pop("DATABASE_URL", None)
    
    print()
    print("=" * 70)
    print("[SUCCESS] Database setup completed!")
    print("=" * 70)
    print()
    print("Next Steps:")
    print(f"1. Update your .env file with:")
    encoded_pwd = quote(CLIENT_DB_PASSWORD, safe='')
    print(f"   DATABASE_URL=postgresql://{CLIENT_DB_USER}:{encoded_pwd}@{db_config['hostname']}:{db_config['port']}/{CLIENT_DB_NAME}")
    print()
    print("2. Run the doctor population script:")
    print("   python populate_sreesarojaa_doctors.py")
    print()
    print("3. Start the server:")
    print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")

