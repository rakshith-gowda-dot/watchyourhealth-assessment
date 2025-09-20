# Assessment Management System

A configurable MERN-based system for managing healthcare assessments.  
This project is designed to be flexible, extensible, and easy to maintain — new assessments, fields, and scoring logic can be added through configuration files without code changes.

---

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd assessment-system
npm install
Run Development Server
bash
Copy code
npm start
Configuration Files
config/assessments.js
Defines assessment types, metadata, score ranges, and interpretation rules.

config/sections.js
Maps assessment types to fields, validation rules, and calculation formulas.

Adding New Assessment Types
Step 1: Define the Assessment
javascript
Copy code
// config/assessments.js
const assessmentTypes = {
  NEW_ASSESSMENT: {
    id: 'new_assessment',
    name: 'New Assessment Tool',
    category: 'custom_category',
    duration: 15,
    scoreRange: { min: 0, max: 100 },
    interpretation: {
      low: { min: 0, max: 33, label: 'Low Risk' },
      medium: { min: 34, max: 66, label: 'Medium Risk' },
      high: { min: 67, max: 100, label: 'High Risk' }
    }
  }
};
Step 2: Create Section Configuration
javascript
Copy code
// config/sections.js
const sectionConfig = {
  new_assessment: {
    fields: {
      risk_factor_1: { type: 'number', label: 'Risk Factor 1 (0-40)', min: 0, max: 40, required: true },
      risk_factor_2: { type: 'number', label: 'Risk Factor 2 (0-35)', min: 0, max: 35, required: true },
      risk_factor_3: { type: 'number', label: 'Risk Factor 3 (0-25)', min: 0, max: 25, required: true },
      clinical_notes: { type: 'textarea', label: 'Clinical Notes', required: false, maxLength: 500 }
    },
    calculations: {
      total_score: { formula: 'risk_factor_1 + risk_factor_2 + risk_factor_3', label: 'Total Risk Score' },
      risk_level: {
        formula: 'total_score <= 33 ? "Low" : total_score <= 66 ? "Medium" : "High"',
        label: 'Risk Level'
      }
    }
  }
};
Modifying Field Mappings
Update existing fields or add new ones:

javascript
Copy code
// config/sections.js
const sectionConfig = {
  moca: {
    fields: {
      visuospatial: {
        type: 'number',
        label: 'Visuospatial/Executive Function (0-5)',
        min: 0, max: 5, required: true,
        description: 'Assessment of executive and visuospatial abilities'
      },
      new_cognitive_field: {
        type: 'select',
        label: 'Additional Cognitive Measure',
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'mild', label: 'Mild Impairment' },
          { value: 'moderate', label: 'Moderate Impairment' },
          { value: 'severe', label: 'Severe Impairment' }
        ]
      }
    },
    calculations: {
      total_score: {
        formula: 'visuospatial + naming + memory + attention + language + abstraction + delayed_recall + orientation + (new_cognitive_field === "normal" ? 0 : 1)',
        label: 'Updated MoCA Score'
      }
    }
  }
};
Updating Classification Ranges
javascript
Copy code
// config/assessments.js
const assessmentTypes = {
  MOCA: {
    id: 'moca',
    name: 'Montreal Cognitive Assessment',
    category: 'cognitive',
    duration: 15,
    scoreRange: { min: 0, max: 30 },
    interpretation: {
      normal:   { min: 25, max: 30, label: 'Normal Cognitive Function' },
      mild:     { min: 18, max: 24, label: 'Mild Cognitive Impairment' },
      moderate: { min: 10, max: 17, label: 'Moderate Cognitive Impairment' },
      severe:   { min: 0,  max: 9,  label: 'Severe Cognitive Impairment' }
    }
  }
};
Data Structure (Session ID Based)
javascript
Copy code
// data/data.js
const sampleData = {
  patients: [{ id: 'PAT-000001', name: 'John Doe', date_of_birth: '1950-05-15', gender: 'male' }],
  sessions: [{ session_id: 'SESS-2023-001', patient_id: 'PAT-000001', date: '2023-10-15', clinician: 'Dr. Smith' }],
  assessments: [{
    session_id: 'SESS-2023-001',
    assessment_type: 'moca',
    scores: { visuospatial: 4, naming: 3, memory: 4, attention: 5, language: 2, abstraction: 1, delayed_recall: 3, orientation: 6 },
    calculated_scores: { total_score: 28 },
    interpretation: 'normal'
  }]
};
Query Examples
javascript
Copy code
function getAssessmentsBySession(sessionId) {
  return sampleData.assessments.filter(a => a.session_id === sessionId);
}

function getPatientBySession(sessionId) {
  const session = sampleData.sessions.find(s => s.session_id === sessionId);
  return session ? sampleData.patients.find(p => p.id === session.patient_id) : null;
}

function getSessionsByPatient(patientId) {
  return sampleData.sessions.filter(s => s.patient_id === patientId);
}
