import sys
import os
import uvicorn

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

if __name__ == "__main__":
    print("Starting Japanese Learning & JLPT Platform Backend API...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
