"""Script to create admin user for SREE SAROJAA clinic"""
import os
import sys

# Set the database URL
os.environ["DATABASE_URL"] = "postgresql://sree_sarojaa_user:SreeSarojaa%402025%21Secure@localhost:5432/sree_sarojaa_hospital"

from app.database import SessionLocal
from app.models import Admin
from app.auth import get_password_hash, verify_password

db = SessionLocal()
try:
    # Check if admin exists
    admin = db.query(Admin).filter(Admin.email == "admin@sreesarojaa.com").first()
    
    if admin:
        print(f"[EXISTS] Admin already exists: {admin.email}")
        print(f"Name: {admin.name}")
        # Test password verification
        result = verify_password("admin123", admin.password)
        print(f"Password verification test: {result}")
        if not result:
            print("[WARNING] Password verification failed! Resetting password...")
            admin.password = get_password_hash("admin123")
            db.commit()
            print("[OK] Password reset successfully!")
    else:
        # Create admin
        hashed_password = get_password_hash("admin123")
        new_admin = Admin(
            name="Admin",
            email="admin@sreesarojaa.com",
            password=hashed_password
        )
        db.add(new_admin)
        db.commit()
        print("[OK] Admin created successfully!")
        print(f"Email: admin@sreesarojaa.com")
        print(f"Password: admin123")
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    db.rollback()
finally:
    db.close()

