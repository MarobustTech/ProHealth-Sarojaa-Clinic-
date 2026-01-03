# Hospital Management System

A comprehensive hospital management system with admin dashboard and patient appointment booking system.

## 🏥 Features

### Admin Dashboard
- **Doctor Management**: Add, edit, delete, and toggle doctor status
- **Patient Management**: View patient details, appointment history, and medical records
- **Specialization Management**: Manage medical specializations with active/inactive status
- **Appointment Management**: View and manage all appointments
- **Banner Management**: Manage homepage banners
- **Dashboard Statistics**: Real-time statistics and quick actions

### Patient Portal
- **Appointment Booking**: Easy appointment booking with doctor selection
- **Service Selection**: Browse available specializations
- **Doctor Profiles**: View doctor information and availability
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Relational database
- **SQLAlchemy**: ORM for database operations
- **JWT**: Authentication and authorization
- **bcrypt**: Password hashing

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful UI components
- **Lucide Icons**: Modern icon library

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- npm or yarn or pnpm

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Praveenraj1618/Hospital-Appointment-System.git
cd Hospital-Appointment-System
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Setup database
python setup_db.py

# Run migrations (if needed)
python migrate_doctors_schema.py

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hospital_db

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
Hospital_Sys/
├── backend/
│   ├── app/
│   │   ├── routers/        # API routes
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # Database configuration
│   │   └── auth.py          # Authentication logic
│   ├── main.py              # FastAPI application
│   ├── setup_db.py          # Database setup script
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── app/                 # Next.js app directory
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── book/            # Appointment booking
│   │   └── page.tsx         # Homepage
│   ├── components/         # React components
│   ├── lib/                 # Utility functions
│   └── public/             # Static assets
│
└── README.md
```


## 🧪 Testing

### Verify System

```bash
cd backend
python verify_system.py
```

This will check:
- Database connection
- Table existence
- Schema validation
- API endpoints
- Sample data

## 🗄️ Database Schema

### Key Tables
- **doctors**: Doctor information (name, qualification, specialization required)
- **specializations**: Medical specializations
- **patients**: Patient records
- **appointments**: Appointment bookings
- **admins**: Admin users
- **banners**: Homepage banners

### Doctor Requirements
- **Required Fields**: Name, Qualification, Specialization
- **Optional Fields**: Email, Phone, Experience, Consultation Fee, OPD Timings, Languages, Bio, Profile Picture

## 🚀 Deployment

### Option 1: Deploy to Railway (Backend) + Vercel (Frontend)

#### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `MarobustTech/ProHealth-Sarojaa-Clinic-`
   - Select the `backend` directory

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provision a database

4. **Configure Environment Variables**
   - Go to your backend service → "Variables"
   - Add the following:
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     SECRET_KEY=<generate-a-secure-random-string>
     ENVIRONMENT=production
     ```

5. **Deploy**
   - Railway will automatically deploy
   - Note your backend URL: `https://your-app.railway.app`

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import `MarobustTech/ProHealth-Sarojaa-Clinic-`
   - Set **Root Directory** to `frontend`

3. **Configure Environment Variables**
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at: `https://your-app.vercel.app`

5. **Update Backend CORS**
   - Go back to Railway backend
   - Update `main.py` CORS to include your Vercel URL:
     ```python
     allow_origins=["https://your-app.vercel.app"]
     ```
   - Commit and push changes

### Option 2: Deploy to Render (All-in-One)

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add PostgreSQL**
   - New → PostgreSQL
   - Copy the Internal Database URL

4. **Set Environment Variables**
   - Add `DATABASE_URL` with the PostgreSQL URL
   - Add `SECRET_KEY`

5. **Deploy Frontend**
   - New → Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`

### Production Checklist

- [ ] Backend deployed and accessible
- [ ] Database connected and tables created
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS updated with production URLs
- [ ] Test appointment booking flow
- [ ] Test admin dashboard access

### Post-Deployment

**Update CORS for Security**
After deployment, update `backend/main.py`:
```python
allow_origins=[
    "https://your-production-frontend.vercel.app",
    "https://your-custom-domain.com"  # if applicable
]
```

**Access Your Application**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.railway.app`
- API Docs: `https://your-backend.railway.app/docs`


## 📄 License

This project is private and proprietary.

## 👤 Author

**Praveenraj1618**

- GitHub: [@Praveenraj1618](https://github.com/Praveenraj1618)

## 🤝 Contributing

This is a private project. Contributions are not accepted at this time.

## 📞 Support

For support, please contact the repository owner.

## 🔄 Recent Updates

### v1.0.0
- ✅ Doctor form: Only Name, Qualification, and Specialization are required
- ✅ Patient appointment counts fixed
- ✅ Database schema migration completed
- ✅ Comprehensive system verification
- ✅ All API endpoints connected and working

---

**Made with ❤️ for Hospital Management**

