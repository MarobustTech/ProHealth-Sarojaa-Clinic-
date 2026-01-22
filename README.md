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


## 📄 License

This project is private and proprietary.

## 👤 Author

**Praveenraj1618**

- GitHub: [@Praveenraj1618](https://github.com/Praveenraj1618)

## 🤝 Contributing

This is a private project. Contributions are not accepted at this time.

## 📞 Support

For support, please contact the repository owner.

**Made with ❤️ for Hospital Management**

