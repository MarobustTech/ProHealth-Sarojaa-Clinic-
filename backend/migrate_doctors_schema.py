"""
Migration script to update doctors table schema:
- Make email nullable
- Make qualification NOT NULL (with default value for existing records)
"""
import sys
from sqlalchemy import create_engine, text, inspect
from app.database import engine, DATABASE_URL

def check_table_exists():
    """Check if doctors table exists"""
    inspector = inspect(engine)
    return 'doctors' in inspector.get_table_names()

def get_column_info():
    """Get current column information"""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT 
                column_name, 
                is_nullable, 
                data_type,
                column_default
            FROM information_schema.columns 
            WHERE table_name = 'doctors'
            AND column_name IN ('email', 'qualification')
            ORDER BY column_name
        """))
        return {row[0]: {'nullable': row[1] == 'YES', 'type': row[2], 'default': row[3]} 
                for row in result}

def check_existing_data():
    """Check if there are doctors with NULL qualification"""
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM doctors 
            WHERE qualification IS NULL OR qualification = ''
        """))
        return result.scalar()

def migrate():
    """Run the migration"""
    print("Starting doctors table migration...")
    print("-" * 50)
    
    # Check if table exists
    if not check_table_exists():
        print("ERROR: doctors table does not exist!")
        print("Please run setup_db.py first to create the tables.")
        return False
    
    # Get current column info
    print("Checking current schema...")
    column_info = get_column_info()
    
    # Check existing data
    null_qual_count = check_existing_data()
    if null_qual_count > 0:
        print(f"WARNING: Found {null_qual_count} doctors with NULL or empty qualification.")
        print("Setting default value 'Not Specified' for these records...")
    
    try:
        with engine.connect() as conn:
            # Start a transaction
            trans = conn.begin()
            
            try:
                # Step 1: Update NULL qualifications to a default value
                if null_qual_count > 0:
                    conn.execute(text("""
                        UPDATE doctors 
                        SET qualification = 'Not Specified'
                        WHERE qualification IS NULL OR qualification = ''
                    """))
                    conn.commit()
                    print(f"[OK] Updated {null_qual_count} records with default qualification")
                    trans = conn.begin()  # Start new transaction
                
                # Step 2: Make email nullable
                print("Making email column nullable...")
                conn.execute(text("""
                    ALTER TABLE doctors 
                    ALTER COLUMN email DROP NOT NULL
                """))
                print("[OK] Email column is now nullable")
                
                # Step 3: Make qualification NOT NULL
                print("Making qualification column NOT NULL...")
                conn.execute(text("""
                    ALTER TABLE doctors 
                    ALTER COLUMN qualification SET NOT NULL
                """))
                print("[OK] Qualification column is now required")
                
                # Commit all changes
                trans.commit()
                print("\n" + "-" * 50)
                print("Migration completed successfully!")
                return True
                
            except Exception as e:
                trans.rollback()
                raise e
                
    except Exception as e:
        error_msg = str(e).lower()
        if "does not exist" in error_msg or "column" in error_msg:
            print(f"ERROR: {e}")
            print("\nThis might mean the schema is already updated or the column doesn't exist.")
            print("The migration will be skipped.")
            return True  # Not a critical error
        else:
            print(f"ERROR during migration: {e}")
            return False

if __name__ == "__main__":
    success = migrate()
    if not success:
        sys.exit(1)
    print("\nYou can now use the updated doctor form with only Name, Qualification, and Specialization as required fields.")

