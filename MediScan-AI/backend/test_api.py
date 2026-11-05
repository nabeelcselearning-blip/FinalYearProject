from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
BASE_URL = "/api/v1"

def run_tests():
    print("Testing Backend APIs...")
    # 1. Health check
    res = client.get("/")
    assert res.status_code == 200, f"Root API failed: {res.status_code}"
    print("[SUCCESS] Root API online.")
    
    # 2. Get Profile
    res = client.get(f"{BASE_URL}/profile/")
    assert res.status_code == 200, f"Get Profile failed: {res.status_code}"
    print(f"[SUCCESS] Profile API online: {res.json()['gender']}, age {res.json()['age']}.")
    
    # 3. List Reports
    res = client.get(f"{BASE_URL}/reports/")
    assert res.status_code == 200, f"List Reports failed: {res.status_code}"
    reports = res.json()
    print(f"[SUCCESS] Reports API online: {len(reports)} seeded reports retrieved.")
    
    # 4. Upload Sample PDF Report
    with open("../sample_reports/sample_comprehensive_lab_report.pdf", "rb") as f:
        files = {"file": ("sample_report.pdf", f, "application/pdf")}
        res = client.post(f"{BASE_URL}/reports/upload", files=files)
    assert res.status_code == 200, f"Upload Report failed: {res.status_code} - {res.text}"
    uploaded_report = res.json()
    print(f"[SUCCESS] Report Upload & OCR Pipeline success! ID: {uploaded_report['id']}, Score: {uploaded_report['overall_health_score']}, Risk: {uploaded_report['health_risk_category']}.")
    
    # 5. Export PDF Endpoint Test
    res = client.get(f"{BASE_URL}/reports/{uploaded_report['id']}/pdf")
    assert res.status_code == 200, f"PDF Export failed: {res.status_code}"
    assert res.headers["content-type"] == "application/pdf"
    print("[SUCCESS] PDF Export API online & returning printable PDF bytes.")

    # 6. Chat Assistant Test
    res = client.post(f"{BASE_URL}/chat/", json={"message": "What is HDL cholesterol and why is it important?"})
    assert res.status_code == 200, f"Chat API failed: {res.status_code}"
    reply = res.json()["reply"]
    print(f"[SUCCESS] Groq AI Assistant reply received: '{reply[:80]}...'")

    # 7. Cleanup test uploaded report
    res = client.delete(f"{BASE_URL}/reports/{uploaded_report['id']}")
    assert res.status_code == 200, f"Cleanup delete report failed: {res.status_code}"
    print("[SUCCESS] Test report cleaned up from database.")

    print("\nALL BACKEND API TESTS PASSED 100% SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
