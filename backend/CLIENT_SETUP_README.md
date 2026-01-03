# SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC - Database Setup Guide

This guide will help you set up a dedicated database for SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC following the B2B SaaS model with one database per hospital.

## Prerequisites

- PostgreSQL installed and running
- Python 3.8+ installed
- Backend dependencies installed (`pip install -r requirements.txt`)

## Step 1: Create Database and User

Run the setup script to create the dedicated database and user:

```bash
cd backend
python setup_client_db.py
```

This script will:
- ✅ Create database: `sree_sarojaa_hospital`
- ✅ Create user: `sree_sarojaa_user` with secure password
- ✅ Grant all privileges to the user
- ✅ Create all necessary tables
- ✅ Create default admin user

**Default Admin Credentials:**
- Email: `admin@sreesarojaa.com`
- Password: `admin123`

⚠️ **Important:** Change the admin password after first login!

## Step 2: Update Environment Variables

Update your `.env` file (or set environment variables) with the client database URL:

```env
DATABASE_URL=postgresql://sree_sarojaa_user:SreeSarojaa@2025!Secure@localhost:5432/sree_sarojaa_hospital
```

**Note:** Replace `localhost:5432` with your actual database host and port if different.

## Step 3: Populate Doctors

Run the doctor population script to add all 12 doctors:

```bash
python populate_sreesarojaa_doctors.py
```

This will create:
- ✅ 8 Specializations (Orthodontist, Oral Maxillofacial Surgeon, Prosthodontist, Endodontist, Pedodontist, Periodontist, Implantologist, General Dentist)
- ✅ 12 Doctors with their qualifications and specializations

## Step 4: Verify Setup

Start the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Test the API:
- Visit `http://localhost:8000/docs` for API documentation
- Test doctor endpoints: `http://localhost:8000/api/doctors`

## Step 5: Frontend Updates

The frontend has been updated with:
- ✅ Contact page with clinic details
- ✅ Footer with clinic information
- ✅ Map location (Google Maps link provided)

**Contact Details Updated:**
- Clinic Name: SREE SAROJAA MULTI SPECIALTY DENTAL CLINIC
- Address: Near Vincent Bus Stop, Cherry Road, Kumaraswamypatti, Salem - 636007
- Phone: 0427 2313339 / 8946088182
- Map: https://maps.app.goo.gl/kSZG5kJjMN8XUCsR7

## Database Credentials (Keep Secure)

**Database Name:** `sree_sarojaa_hospital`
**Database User:** `sree_sarojaa_user`
**Database Password:** `SreeSarojaa@2025!Secure`

⚠️ **Security Note:** 
- Change the database password in production
- Never commit credentials to version control
- Use environment variables for all sensitive data

## Manual Database Creation (Alternative)

If the script fails, you can create the database manually:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE sree_sarojaa_hospital;

-- Create user
CREATE USER sree_sarojaa_user WITH PASSWORD 'SreeSarojaa@2025!Secure';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sree_sarojaa_hospital TO sree_sarojaa_user;

-- Connect to the new database
\c sree_sarojaa_hospital

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO sree_sarojaa_user;
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials
- Verify network connectivity

### Permission Denied
- Ensure you're running as a user with PostgreSQL privileges
- Check user permissions in PostgreSQL

### Tables Not Created
- Run `python setup_client_db.py` again
- Check database connection string
- Verify SQLAlchemy models are correct

## Next Steps for Deployment

1. **Backend Deployment (Railway/Render):**
   - Set `DATABASE_URL` environment variable
   - Deploy FastAPI application
   - Test API endpoints

2. **Frontend Deployment (Vercel):**
   - Set `NEXT_PUBLIC_API_URL` to backend URL
   - Deploy Next.js application

3. **Database Backups:**
   - Set up automated backups
   - Document backup/restore procedures
   - Provide backup access to client if needed

## Client Handover Checklist

- [ ] Database created and populated
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Admin credentials provided
- [ ] Database backup created
- [ ] Documentation provided
- [ ] Client training scheduled (if needed)

## Support

For issues or questions, refer to the main project documentation or contact the development team.

