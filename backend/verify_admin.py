"""Verify admin user in the client database"""
import os
os.environ["DATABASE_URL"] = "postgresql://sree_sarojaa_user:SreeSarojaa%402025%21Secure@localhost:5432/sree_sarojaa_hospital"

from app.database import SessionLocal, DATABASE_URL
from app.models import Admin
from app.auth import verify_password

print(f"Using DATABASE_URL: {DATABASE_URL}")
print()

db = SessionLocal()
try:
    # List all admins
    all_admins = db.query(Admin).all()
    print(f"Total admins in database: {len(all_admins)}")
    for admin in all_admins:
        print(f"  - ID: {admin.id}, Email: {admin.email}, Name: {admin.name}")
    
    # Check specific admin
    admin = db.query(Admin).filter(Admin.email == "admin@sreesarojaa.com").first()
    if admin:
        print(f"\n[OK] Admin found: {admin.email}")
        print(f"Password hash: {admin.password[:30]}...")
        result = verify_password("admin123", admin.password)
        print(f"Password 'admin123' verification: {result}")
    else:
        print("\n[ERROR] Admin not found!")
        print("Creating admin now...")
        from app.auth import get_password_hash
        new_admin = Admin(
            name="Admin",
            email="admin@sreesarojaa.com",
            password=get_password_hash("admin123")
        )
        db.add(new_admin)
        db.commit()
        print("[OK] Admin created!")
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()

