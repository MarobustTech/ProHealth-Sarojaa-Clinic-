import asyncio
import httpx
import os
import sys

# You can run this locally to test your production backend
# Usage: python debug_bot.py <YOUR_BACKEND_URL>
# Example: python debug_bot.py https://backend-production.up.railway.app

async def test_backend(url):
    print(f"🔍 Testing Backend URL: {url}")
    print("-" * 50)

    async with httpx.AsyncClient(timeout=20) as client:
        # 1. Health Check
        print("1️⃣  Testing Health Endpoint (/health)...")
        try:
            resp = await client.get(f"{url}/health")
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            if resp.status_code == 200:
                print("✅ Health Check Passed")
            else:
                print("❌ Health Check Failed")
        except Exception as e:
            print(f"❌ Connection Error: {e}")
            return

        print("\n" + "-" * 50)

        # 2. Test Doctors Endpoint
        print("2️⃣  Testing Doctors Endpoint (/api/bot/doctors)...")
        try:
            resp = await client.get(f"{url}/api/bot/doctors")
            print(f"Status: {resp.status_code}")
            
            if resp.status_code == 200:
                data = resp.json()
                print(f"✅ Success! Found {len(data)} doctors.")
                if len(data) > 0:
                    print(f"First Doctor: {data[0]['name']} - {data[0]['specialization']}")
                else:
                    print("⚠️  Warning: Doctor list is empty! Database might need seeding.")
            else:
                print(f"❌ Failed: {resp.text}")

        except Exception as e:
            print(f"❌ Error fetching doctors: {e}")

        print("\n" + "-" * 50)

        # 3. Test Specialization (AI)
        print("3️⃣  Testing Specialization Detection (/api/bot/ai/specialization)...")
        try:
            payload = {"text": "I need braces"}
            resp = await client.post(f"{url}/api/bot/ai/specialization", json=payload)
            print(f"Input: 'I need braces'")
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
        except Exception as e:
            print(f"❌ Error testing AI: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python debug_bot.py <YOUR_BACKEND_URL>")
        print("Example: python debug_bot.py https://backend-production.up.railway.app")
    else:
        # Ensure URL doesn't have trailing slash
        backend_url = sys.argv[1].rstrip("/")
        if not backend_url.startswith("http"):
             backend_url = "https://" + backend_url
             
        asyncio.run(test_backend(backend_url))
