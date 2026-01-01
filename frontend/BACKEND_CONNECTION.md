# Backend Connection Guide

## ✅ All Issues Fixed

### 1. **API URL Configuration**
- ✅ All API endpoints now use port **8000** (was 5000)
- ✅ Default fallback: `http://localhost:8000`
- ✅ Environment variable: `NEXT_PUBLIC_API_URL` in `.env.local`

### 2. **Authentication**
- ✅ Removed all demo mode functionality
- ✅ Proper JWT token handling
- ✅ Auto-redirect to login on 401 errors
- ✅ Better error messages

### 3. **Connection Status**
- ✅ Added connection status indicator
- ✅ Backend health check on login
- ✅ Clear error messages if backend is down

## 🔧 Setup Instructions

### 1. **Backend Setup**
Make sure your backend is running:
```powershell
cd backend
uvicorn main:app --reload --port 8000
```

### 2. **Frontend Setup**
Make sure `.env.local` exists in `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. **Login Credentials**
- **Email:** `admin@hospital.com`
- **Password:** `admin123`

## 🧪 Testing Connection

### Test Backend Health:
```powershell
Invoke-WebRequest -Uri http://localhost:8000/health
```

### Test Login:
```powershell
$body = @{email='admin@hospital.com'; password='admin123'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:8000/api/admin/login -Method POST -Body $body -ContentType 'application/json'
```

## 🐛 Troubleshooting

### 401 Unauthorized Error
1. **Check if you're logged in:**
   - Open browser console (F12)
   - Go to Application → Local Storage
   - Check if `adminToken` exists

2. **If no token:**
   - Go to `/admin/login`
   - Log in with credentials above

3. **If token exists but still 401:**
   - Token might be expired
   - Clear localStorage and log in again
   - Check backend is running

### Backend Not Connected
1. **Check backend is running:**
   ```powershell
   netstat -ano | findstr :8000
   ```

2. **Start backend:**
   ```powershell
   cd backend
   uvicorn main:app --reload --port 8000
   ```

3. **Check database:**
   - Make sure PostgreSQL is running
   - Database `hospital_db` exists
   - Tables are created (run `python setup_db.py`)

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] PostgreSQL running and database exists
- [ ] `.env.local` file exists with correct API URL
- [ ] Frontend restarted after changes
- [ ] Logged in with real credentials (not demo mode)
- [ ] Connection status shows "Backend connected successfully"

## 📝 What Was Fixed

1. ✅ All API URLs changed from port 5000 → 8000
2. ✅ Removed all demo mode code
3. ✅ Added proper error handling for 401 errors
4. ✅ Added connection status indicator
5. ✅ Added backend health check on login
6. ✅ Improved error messages
7. ✅ Auto-redirect to login on authentication failure

