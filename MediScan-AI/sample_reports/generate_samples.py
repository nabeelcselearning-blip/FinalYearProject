"""
Generates realistic sample laboratory PDF reports for testing MediScan AI OCR and parsing.
"""

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def create_sample_pdf(filename: str, title: str, biomarkers: list):
    doc = SimpleDocTemplate(filename, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    
    elements = [
        Paragraph(f"<b>{title}</b>", styles['Heading1']),
        Paragraph("Patient: Alex Morgan | Age: 38 | Gender: Male | Date: 2026-07-20", styles['Normal']),
        Paragraph("Facility: Quest Diagnostics Laboratory", styles['Normal']),
        Spacer(1, 15)
    ]
    
    table_data = [["Test Name", "Result", "Unit", "Reference Range"]]
    for b in biomarkers:
        table_data.append([b[0], str(b[1]), b[2], b[3]])
        
    t = Table(table_data, colWidths=[180, 100, 100, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 6)
    ]))
    elements.append(t)
    doc.build(elements)

if __name__ == "__main__":
    sample_1 = [
        ["Hemoglobin", 14.2, "g/dL", "13.8 - 17.2"],
        ["WBC", 10200, "/uL", "4500 - 11000"],
        ["Total Cholesterol", 242, "mg/dL", "125 - 200"],
        ["HDL Cholesterol", 39, "mg/dL", "40 - 90"],
        ["LDL Cholesterol", 158, "mg/dL", "50 - 100"],
        ["Triglycerides", 215, "mg/dL", "40 - 150"],
        ["Fasting Glucose", 112, "mg/dL", "70 - 99"],
        ["HbA1c", 6.2, "%", "4.0 - 5.6"],
        ["Vitamin D (25-OH)", 19, "ng/mL", "30 - 100"],
        ["ALT (SGPT)", 52, "U/L", "7 - 45"],
        ["Serum Creatinine", 1.1, "mg/dL", "0.7 - 1.3"],
        ["TSH", 3.2, "uIU/mL", "0.45 - 4.5"]
    ]
    create_sample_pdf("sample_reports/sample_comprehensive_lab_report.pdf", "QUEST DIAGNOSTICS - COMPREHENSIVE MEDICAL REPORT", sample_1)
    print("Created sample_reports/sample_comprehensive_lab_report.pdf successfully.")
