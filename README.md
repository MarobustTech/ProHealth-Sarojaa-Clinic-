# Hospital Appointment Management System

A comprehensive full-stack hospital management system built with Next.js (React) and FastAPI (Python). This system allows hospitals to manage appointments, doctors, patients, specializations, and banners through an intuitive admin dashboard.

## 🚀 Features

### User Frontend
- **Homepage** with hero section and service overview
- **Doctor Listing** with filtering by specialization
- **Appointment Booking** with date/time selection
- **Service Information** pages
- **About & Contact** pages
- **Responsive Design** for all devices

### Admin Dashboard
- **Dashboard Overview** with statistics and quick actions
- **Doctor Management** - Add, edit, delete, and toggle active status
- **Patient Management** - View patient details and appointment history
- **Specialization Management** - Manage medical specializations
- **Appointment Management** - View and manage all appointments
- **Banner Management** - Manage homepage banners
- **Authentication** - Secure admin login/registration

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Documentation**: Automatic Swagger/OpenAPI

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.9+
- **PostgreSQL** 12+
- **Git**

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Praveenraj1618/Hospital-Appointment-System.git
cd Hospital-Appointment-System
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # Or create manually
```

Edit `.env` file with your database credentials:
```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/hospital_db
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### 3. Database Setup

```bash
# Run database setup script
python setup_db.py
```

This will:
- Create the database if it doesn't exist
- Create all necessary tables
- Create a default admin user (email: `admin@hospital.com`, password: `admin123`)

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Create .env.local file
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend

# Activate virtual environment (if not already active)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or use the provided scripts:
# Windows:
start.bat
# Linux/Mac:
./start.sh
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### Start Frontend Server

```bash
cd frontend

# Development mode
npm run dev
# or
yarn dev
# or
pnpm dev
```

Frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
Hospital-Appointment-System/
├── backend/
│   ├── app/
│   │   ├── routers/          # API route handlers
│   │   │   ├── admin.py       # Admin authentication
│   │   │   ├── doctors.py     # Doctor management
│   │   │   ├── patients.py    # Patient management
│   │   │   ├── appointments.py # Appointment management
│   │   │   ├── specializations.py # Specialization management
│   │   │   └── banners.py     # Banner management
│   │   ├── models.py          # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── database.py        # Database configuration
│   │   └── auth.py            # Authentication utilities
│   ├── main.py                # FastAPI application entry
│   ├── requirements.txt       # Python dependencies
│   ├── setup_db.py            # Database setup script
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── app/                   # Next.js app directory
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── book/              # Appointment booking
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utility functions
│   └── package.json           # Node dependencies
│
└── README.md
```

## 🔐 Default Admin Credentials

After running `setup_db.py`, you can login with:
- **Email**: `admin@hospital.com`
- **Password**: `admin123`

**⚠️ Important**: Change the default password after first login!

## 📝 API Endpoints

### Admin
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get dashboard statistics

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `PATCH /api/doctors/{id}/toggle-active` - Toggle doctor active status
- `DELETE /api/doctors/{id}` - Delete doctor

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/{id}/status` - Update appointment status

### Specializations
- `GET /api/specializations` - Get all specializations
- `GET /api/specializations/active` - Get active specializations
- `POST /api/specializations` - Create specialization
- `PUT /api/specializations/{id}` - Update specialization
- `PATCH /api/specializations/{id}/toggle-active` - Toggle active status
- `DELETE /api/specializations/{id}` - Delete specialization

### Banners
- `GET /api/banners` - Get all banners
- `POST /api/banners` - Create banner
- `PUT /api/banners/{id}` - Update banner
- `PATCH /api/banners/{id}/toggle-active` - Toggle active status
- `DELETE /api/banners/{id}` - Delete banner

Full API documentation available at `/docs` when backend is running.

## 🗄️ Database Schema

### Key Tables
- **admins** - Admin users
- **doctors** - Doctor information
- **patients** - Patient records
- **appointments** - Appointment bookings
- **specializations** - Medical specializations
- **banners** - Homepage banners

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable management
- Input validation with Pydantic

## 🧪 Development

### Running Migrations

If you need to update the database schema:

```bash
cd backend
python migrate_doctors_schema.py  # Example migration
```

### Adding Sample Data

```bash
cd backend
python populate_sample_data.py
```

## 📦 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure PostgreSQL database is accessible
3. Run migrations if needed
4. Deploy using platforms like:
   - Heroku
   - Railway
   - Render
   - AWS/GCP/Azure

### Frontend Deployment

1. Set `NEXT_PUBLIC_API_URL` environment variable
2. Build the application: `npm run build`
3. Deploy to:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Praveenraj1618**

- GitHub: [@Praveenraj1618](https://github.com/Praveenraj1618)
- Repository: [Hospital-Appointment-System](https://github.com/Praveenraj1618/Hospital-Appointment-System)

## 🙏 Acknowledgments

- FastAPI for the excellent Python framework
- Next.js team for the amazing React framework
- All open-source contributors whose packages made this possible

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Note**: This is a development project. For production use, ensure proper security measures, error handling, and testing are in place.

