import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta

# Usage: python debug_availability.py <BACKEND_URL>

def test_availability(url):
    print(f"🔍 Testing Availability on: {url}")
    print("-" * 50)

    # 1. Get a Doctor ID
    print("1️⃣  Fetching Doctors List to get an ID...")
    try:
        req = urllib.request.Request(f"{url}/api/bot/doctors")
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                print(f"❌ Failed to get doctors: {response.status}")
                return
            
            data = response.read()
            doctors = json.loads(data)
            
            if not doctors:
                print("❌ No doctors found.")
                return

            doctor = doctors[0]
            doc_id = doctor['id']
            print(f"✅ Found Doctor: {doctor['name']} (ID: {doc_id})")
    except Exception as e:
        print(f"❌ Error fetching doctors: {e}")
        return

    print("\n" + "-" * 50)

    # 2. Check Availability for next 3 days
    print(f"2️⃣  Checking availability for Dr. {doctor['name']}...")
    
    today = datetime.now()
    for i in range(3):
        check_date = today + timedelta(days=i)
        date_str = check_date.strftime("%Y-%m-%d")
        day_name = check_date.strftime("%A")
        
        print(f"\n📅 Checking {date_str} ({day_name})...")
        
        try:
            endpoint = f"{url}/api/bot/availability?doctor_id={doc_id}&date={date_str}"
            req = urllib.request.Request(endpoint)
            with urllib.request.urlopen(req) as response:
            
                if response.status == 200:
                    data = response.read()
                    slots = json.loads(data)
                    available_count = sum(1 for s in slots if s['available'])
                    print(f"    ✅ Status: 200 OK")
                    print(f"    ℹ️  Total Slots: {len(slots)}")
                    print(f"    🟢 Available: {available_count}")
                    if len(slots) > 0:
                        first_slot = slots[0]['time']
                        print(f"    🕒 First Slot: {first_slot}")
                else:
                    print(f"    ❌ Failed: {response.status}")
        except Exception as e:
            print(f"    ❌ Error: {e}")

if __name__ == "__main__":
    url = "https://prohealth-sarojaa-clinic-production.up.railway.app" # Default
    if len(sys.argv) > 1:
        url = sys.argv[1]
    
    url = url.rstrip("/")
    if not url.startswith("http"):
        url = "https://" + url
            
    test_availability(url)
