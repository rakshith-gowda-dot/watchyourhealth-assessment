const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const assessmentData = require('../data/data.js');
const assessmentConfig = require('../config/assessments.js');
const sectionConfig = require('../config/sections.js');
const { getValueByPath, classifyValue } = require('../utils/dataExtractor.js');
const router = express.Router();

// Generate report endpoint
router.post('/generate-report', async (req, res) => {
  try {
    const { session_id } = req.body;
    
    // Get assessment data
    const assessment = assessmentData[session_id];
    if (!assessment) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    // Get configuration for this assessment type
    const config = assessmentConfig[assessment.assessment_id];
    if (!config) {
      return res.status(400).json({ error: "Unsupported assessment type" });
    }
    
    // Extract data for each section
    const reportData = { assessment };
    for (const sectionKey of config.sections) {
      const section = sectionConfig[sectionKey];
      if (!section) continue;
      
      reportData[sectionKey] = {
        title: section.title,
        fields: []
      };
      
      for (const field of section.fields) {
        let value = getValueByPath(assessment, field.path);
        
        // Handle array results and format values
        if (Array.isArray(value)) {
          if (field.format) {
            value = field.format.replace(/{(\d+)}/g, (match, index) => {
              return value[index] !== undefined ? value[index] : match;
            });
          } else {
            value = value.join(', ');
          }
        }
        
        const classification = field.classification ? classifyValue(value, field.classification.ranges) : null;
        
        reportData[sectionKey].fields.push({
          label: field.label,
          value: value,
          unit: field.unit,
          classification: classification
        });
      }
    }
    
    // Generate HTML content
    const htmlContent = generateHTML(reportData, config);
    
    // Generate PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    
    // Generate filename and save PDF
    const filename = `report_${session_id}_${Date.now()}.pdf`;
    const filepath = path.join(reportsDir, filename);
    await page.pdf({ 
      path: filepath, 
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    res.json({ 
      success: true, 
      message: "Report generated successfully",
      filename: filename
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

function generateHTML(data, config) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${config.name} Report</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 0; 
          padding: 20px; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 1000px; 
          margin: 0 auto; 
          background: white; 
          padding: 30px; 
          box-shadow: 0 0 20px rgba(0,0,0,0.1); 
          border-radius: 10px;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding-bottom: 20px; 
          border-bottom: 3px solid #2c5282; 
        }
        h1 { 
          color: #2c5282; 
          margin: 0; 
          font-size: 28px; 
        }
        .subtitle { 
          color: #718096; 
          margin-top: 5px; 
          font-size: 16px; 
        }
        .section { 
          margin-bottom: 30px; 
          border: 1px solid #e2e8f0; 
          padding: 20px; 
          border-radius: 8px; 
          background: white;
        }
        .section-title { 
          color: #2c5282; 
          margin-top: 0; 
          padding-bottom: 10px; 
          border-bottom: 2px solid #e2e8f0; 
          font-size: 20px;
        }
        .field-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          margin-top: 15px;
        }
        .field { 
          padding: 12px; 
          background: #f7fafc; 
          border-radius: 6px; 
          border-left: 4px solid #cbd5e0;
        }
        .field:nth-child(odd) { background-color: #edf2f7; }
        .label { 
          font-weight: bold; 
          color: #4a5568; 
          display: block; 
          margin-bottom: 5px; 
          font-size: 14px;
        }
        .value { 
          font-size: 16px; 
          color: #2d3748; 
        }
        .unit { 
          font-size: 14px; 
          color: #718096; 
        }
        .classification { 
          font-size: 14px; 
          margin-top: 3px; 
          font-style: italic; 
        }
        .low { color: #e53e3e; }
        .medium { color: #d69e2e; }
        .high { color: #dd6b20; }
        .normal { color: #38a169; }
        .excellent { color: #2f855a; font-weight: bold; }
        .footer { 
          margin-top: 40px; 
          text-align: center; 
          color: #718096; 
          font-size: 14px; 
          padding-top: 20px; 
          border-top: 1px solid #e2e8f0;
        }
        @media (max-width: 768px) {
          .field-grid { grid-template-columns: 1fr; }
          .container { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${config.name} Report</h1>
          <div class="subtitle">
            Generated on: ${new Date().toLocaleDateString()} | 
            Session ID: ${data.assessment.session_id}
          </div>
        </div>
        
        ${Object.keys(data).filter(k => k !== 'assessment').map(sectionKey => `
          <div class="section">
            <h2 class="section-title">${data[sectionKey].title}</h2>
            <div class="field-grid">
              ${data[sectionKey].fields.map(field => `
                <div class="field">
                  <span class="label">${field.label}</span>
                  <span class="value">
                    ${field.value !== undefined && field.value !== null ? field.value : 'N/A'}
                    ${field.unit ? `<span class="unit">${field.unit}</span>` : ''}
                  </span>
                  ${field.classification ? `
                    <div class="classification ${field.classification.class}">
                      ${field.classification.label}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Report generated automatically by Assessment Management System</p>
          <p>Confidential - For authorized use only</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;