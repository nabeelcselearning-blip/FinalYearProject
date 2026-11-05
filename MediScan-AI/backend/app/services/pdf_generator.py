"""
PDF Export Generator for MediScan AI using ReportLab.
Generates printable, formatted medical report PDFs with patient profile, biomarker breakdown tables,
risk assessment badge, educational summaries, and mandatory medical disclaimers.
"""

import os
import io
from datetime import datetime
from typing import Dict, Any, List

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def get_status_severity_color(status_val: str, color_code: str = "") -> dict:
    """
    Returns text hex color, background hex tint, and label formatted based on severity level.
    Red: Critical / High / Severe
    Amber: Moderate / Low / Borderline / Warning / Slightly High / Slightly Low
    Green: Normal / Optimal / Healthy
    """
    st = str(status_val or "normal").lower().strip().replace("-", "_").replace(" ", "_")
    cc = str(color_code or "").lower().strip()

    # 1. Critical / High Severity -> Bold Crimson Red (#DC2626)
    if "critical" in st or "high" in st or st in ["red", "danger", "critical_high", "critical_low", "severe", "abnormal"] or cc == "red":
        return {
            "hex": "#DC2626",
            "bg": "#FEF2F2",
            "label": st.replace("_", " ").title()
        }
    # 2. Moderate / Warning / Low Severity -> Deep Warm Amber Gold (#D97706)
    elif "moderate" in st or "warning" in st or "low" in st or "borderline" in st or st in ["yellow", "orange", "slightly_high", "slightly_low"] or cc in ["yellow", "orange"]:
        return {
            "hex": "#D97706",
            "bg": "#FFFBEB",
            "label": st.replace("_", " ").title()
        }
    # 3. Normal / Optimal Severity -> Rich Emerald Green (#059669)
    elif st in ["normal", "optimal", "healthy", "ok", "green"] or cc == "green":
        return {
            "hex": "#059669",
            "bg": "#ECFDF5",
            "label": "Normal"
        }
    else:
        return {
            "hex": "#0284C7",
            "bg": "#F0F9FF",
            "label": st.replace("_", " ").title()
        }


def generate_report_pdf_bytes(report_data: Dict[str, Any], user_profile: Dict[str, Any]) -> bytes:
    """Generate PDF binary stream for a report."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=colors.HexColor('#0F172A'),
        alignment=TA_LEFT,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=15
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor('#0284C7'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=colors.HexColor('#334155'),
        leading=13
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        textColor=colors.HexColor('#94A3B8'),
        leading=11,
        alignment=TA_CENTER
    )

    elements = []

    # 1. Header with dynamic report name
    raw_filename = report_data.get("file_name", "Medical Laboratory Insights Report")
    clean_report_name = raw_filename
    for ext in [".pdf", ".png", ".jpg", ".jpeg", ".PDF", ".PNG", ".JPG", ".JPEG"]:
        if clean_report_name.endswith(ext):
            clean_report_name = clean_report_name[:-len(ext)]
            break
    clean_report_name = clean_report_name.replace("_", " ").strip()

    elements.append(Paragraph(f"{clean_report_name}", title_style))
    elements.append(Paragraph(f"MediScan AI Clinical Analysis | Generated on {datetime.now().strftime('%B %d, %Y')}", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#E2E8F0'), spaceAfter=15))

    # 2. Patient & Report Details Table
    upload_dt = report_data.get("upload_date", datetime.now().strftime("%Y-%m-%d"))
    if isinstance(upload_dt, datetime):
        upload_dt = upload_dt.strftime("%Y-%m-%d")

    risk_cat = report_data.get('health_risk_category', 'Low')
    risk_style = get_status_severity_color(risk_cat)
    risk_hex = risk_style["hex"]

    patient_info_data = [
        [
            Paragraph(f"<b>Patient Age:</b> {user_profile.get('age', '35')}", body_style),
            Paragraph(f"<b>Gender:</b> {str(user_profile.get('gender', 'Male')).title()}", body_style),
            Paragraph(f"<b>Report ID:</b> {report_data.get('id', 'RPT-101')[:12]}", body_style)
        ],
        [
            Paragraph(f"<b>Lab Name:</b> {report_data.get('laboratory_name', 'Clinical Diagnostics')}", body_style),
            Paragraph(f"<b>Upload Date:</b> {upload_dt}", body_style),
            Paragraph(f"<b>Health Risk Category:</b> <font color='{risk_hex}'><b>{risk_cat}</b></font>", body_style)
        ]
    ]

    info_table = Table(patient_info_data, colWidths=[180, 180, 180])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 15))

    # 3. Overall Health Score & Executive Summary
    elements.append(Paragraph("Executive Educational Summary", section_heading))
    summary_txt = report_data.get("ai_summary_text") or (
        report_data.get("ai_summary_json", {}).get("plain_language_summary", "Summary of laboratory findings.")
    )
    elements.append(Paragraph(summary_txt, body_style))
    elements.append(Spacer(1, 15))

    # 4. Biomarkers Table with Severity Color-Coding
    elements.append(Paragraph("Biomarker Analysis Panel", section_heading))

    table_data = [
        [
            Paragraph("<b>Test Name</b>", body_style),
            Paragraph("<b>Measured Value</b>", body_style),
            Paragraph("<b>Reference Range</b>", body_style),
            Paragraph("<b>Status & Severity</b>", body_style)
        ]
    ]

    table_styles = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]

    biomarkers = report_data.get("biomarkers", [])
    for idx, b in enumerate(biomarkers, start=1):
        raw_status = b.get("status", "normal")
        color_code = b.get("color_code", "")
        sev = get_status_severity_color(raw_status, color_code)

        s_hex = sev["hex"]
        s_lbl = sev["label"]
        display_status = f"<font color='{s_hex}'><b>● {s_lbl}</b></font>"
        
        u_str = str(b.get('unit', '')).strip()
        invalid_tokens = {'male', 'female', 'm', 'f', 'high', 'low', 'normal', 'abnormal', 'critical', 'result', 'ref', 'range', 'flag', 'status'}
        if not u_str or u_str.lower() in invalid_tokens or 'male' in u_str.lower() or 'female' in u_str.lower():
            c_name = str(b.get('canonical_name', '')).lower()
            from app.core.medical_kb import MEDICAL_KNOWLEDGE_BASE
            u_str = ''
            for _, kb in MEDICAL_KNOWLEDGE_BASE.items():
                if kb['canonical_name'].lower() == c_name:
                    u_str = kb['unit']
                    break
            if not u_str:
                u_str = 'mg/dL' if any(w in c_name for w in ['urea', 'glucose', 'cholesterol', 'creatinine']) else ''

        # Color value text if critical/high
        val_text = f"<b>{b.get('value')}</b> {u_str}"
        if s_hex == "#DC2626":
            val_text = f"<font color='#DC2626'><b>{b.get('value')}</b> {u_str}</font>"

        table_data.append([
            Paragraph(f"<b>{b.get('canonical_name')}</b><br/><font color='#64748B' size=7.5>{b.get('category', 'General')}</font>", body_style),
            Paragraph(val_text, body_style),
            Paragraph(f"{b.get('reference_range_str', '--')}", body_style),
            Paragraph(display_status, body_style)
        ])

        # Light row background tint for non-normal severity
        if s_hex != "#059669":
            table_styles.append(('BACKGROUND', (3, idx), (3, idx), colors.HexColor(sev["bg"])))

    bio_table = Table(table_data, colWidths=[160, 120, 140, 120])
    bio_table.setStyle(TableStyle(table_styles))
    elements.append(bio_table)
    elements.append(Spacer(1, 15))

    # 5. Evidence-Informed Follow-Up Recommendations
    try:
        from app.services.recommendation_engine import generate_followup_recommendations
        rec_list = generate_followup_recommendations(biomarkers)
        if rec_list:
            elements.append(Paragraph("Evidence-Informed Follow-Up Test Recommendations", section_heading))
            rec_table_data = [
                [
                    Paragraph("<b>Recommended Test</b>", body_style),
                    Paragraph("<b>Priority</b>", body_style),
                    Paragraph("<b>Suggested Timeline</b>", body_style),
                    Paragraph("<b>Clinical Reason</b>", body_style)
                ]
            ]
            for r in rec_list:
                p_color = "#DC2626" if r["priority"] in ["Important", "High"] else "#0284C7" if r["priority"] == "Recommended" else "#64748B"
                rec_table_data.append([
                    Paragraph(f"<b>{r['test_name']}</b><br/><font color='#64748B' size=7.5>Based on {r['trigger_biomarker']}</font>", body_style),
                    Paragraph(f"<font color='{p_color}'><b>{r['priority']}</b></font>", body_style),
                    Paragraph(r['suggested_timeline'], body_style),
                    Paragraph(r['reason'], body_style)
                ])

            rec_table = Table(rec_table_data, colWidths=[140, 90, 110, 200])
            rec_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F8FAFC')),
                ('PADDING', (0, 0), (-1, -1), 5),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            elements.append(rec_table)
            elements.append(Spacer(1, 15))
    except Exception as err:
        print(f"[PDF Recommendation Engine Error]: {err}")

    # 6. Medical Disclaimer
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=10))
    disclaimer_text = (
        "<b>MEDICAL DISCLAIMER:</b> MediScan AI is intended solely for educational and informational purposes. "
        "It does not diagnose, treat, cure, or prevent any disease. AI-generated analyses may contain inaccuracies. "
        "Always consult a qualified healthcare professional before making any medical decisions based on your laboratory reports."
    )
    elements.append(Paragraph(disclaimer_text, disclaimer_style))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
