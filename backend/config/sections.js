module.exports = {
  "key_vitals": {
    title: "Key Body Vitals",
    fields: [
      { 
        label: "Overall Health Score", 
        path: "accuracy", 
        unit: "%",
        classification: {
          ranges: [
            { min: 0, max: 60, label: "Poor", class: "low" },
            { min: 60, max: 80, label: "Fair", class: "medium" },
            { min: 80, max: 100, label: "Good", class: "normal" }
          ]
        }
      },
      { 
        label: "Heart Rate", 
        path: "vitalsMap.vitals.heart_rate", 
        unit: "bpm",
        classification: {
          ranges: [
            { min: 0, max: 60, label: "Low", class: "low" },
            { min: 60, max: 100, label: "Normal", class: "normal" },
            { min: 100, max: 1000, label: "High", class: "high" }
          ]
        }
      },
      { 
        label: "Blood Pressure", 
        path: ["vitalsMap.vitals.bp_sys", "vitalsMap.vitals.bp_dia"], 
        format: "{0}/{1} mmHg",
        classification: {
          ranges: [
            { min: 0, max: 90, label: "Low", class: "low" },
            { min: 90, max: 120, label: "Normal", class: "normal" },
            { min: 120, max: 300, label: "High", class: "high" }
          ]
        }
      },
      { 
        label: "Oxygen Saturation", 
        path: "vitalsMap.vitals.oxy_sat_prcnt", 
        unit: "%",
        classification: {
          ranges: [
            { min: 0, max: 90, label: "Low", class: "low" },
            { min: 90, max: 95, label: "Borderline", class: "medium" },
            { min: 95, max: 100, label: "Normal", class: "normal" }
          ]
        }
      },
      { 
        label: "Respiratory Rate", 
        path: "vitalsMap.vitals.resp_rate", 
        unit: "breaths/min",
        classification: {
          ranges: [
            { min: 0, max: 12, label: "Low", class: "low" },
            { min: 12, max: 20, label: "Normal", class: "normal" },
            { min: 20, max: 100, label: "High", class: "high" }
          ]
        }
      }
    ]
  },
  
  "heart_health": {
    title: "Heart Health",
    fields: [
      { 
        label: "Cardiac Output", 
        path: "vitalsMap.metadata.cardiovascular.cardiac_out", 
        unit: "L/min"
      },
      { 
        label: "Mean Arterial Pressure", 
        path: "vitalsMap.metadata.cardiovascular.map", 
        unit: "mmHg"
      },
      { 
        label: "Heart Rate Variability (SDNN)", 
        path: "vitalsMap.metadata.heart_scores.sdnn", 
        unit: "ms"
      },
      { 
        label: "Stress Index", 
        path: "vitalsMap.metadata.heart_scores.stress_index", 
        unit: ""
      }
    ]
  },
  
  "stress_level": {
    title: "Stress Level",
    fields: [
      { 
        label: "Wellness Score", 
        path: "vitalsMap.wellness_score", 
        unit: "%",
        classification: {
          ranges: [
            { min: 0, max: 60, label: "High Stress", class: "high" },
            { min: 60, max: 80, label: "Moderate Stress", class: "medium" },
            { min: 80, max: 100, label: "Low Stress", class: "normal" }
          ]
        }
      },
      { 
        label: "RMSSD", 
        path: "vitalsMap.metadata.heart_scores.rmssd", 
        unit: "ms",
        classification: {
          ranges: [
            { min: 0, max: 20, label: "High Stress", class: "high" },
            { min: 20, max: 50, label: "Moderate Stress", class: "medium" },
            { min: 50, max: 1000, label: "Low Stress", class: "normal" }
          ]
        }
      },
      { 
        label: "pNN50", 
        path: "vitalsMap.metadata.heart_scores.pNN50_per", 
        unit: "%"
      }
    ]
  },
  
  "fitness_levels": {
    title: "Fitness Levels",
    fields: [
      { 
        label: "VO2 Max", 
        path: "vitalsMap.metadata.physiological_scores.vo2max", 
        unit: "ml/kg/min",
        classification: {
          ranges: [
            { min: 0, max: 30, label: "Poor", class: "low" },
            { min: 30, max: 40, label: "Fair", class: "medium" },
            { min: 40, max: 50, label: "Good", class: "normal" },
            { min: 50, max: 100, label: "Excellent", class: "excellent" }
          ]
        }
      },
      { 
        label: "Cardiovascular Endurance", 
        path: "exercises[?(@.id==235)].setList[0].time", 
        unit: "seconds",
        classification: {
          ranges: [
            { min: 0, max: 30, label: "Excellent", class: "excellent" },
            { min: 30, max: 60, label: "Good", class: "normal" },
            { min: 60, max: 1000, label: "Needs Improvement", class: "low" }
          ]
        }
      },
      { 
        label: "Exercise Intensity", 
        path: "vitalsMap.metadata.physiological_scores.intensity", 
        unit: ""
      }
    ]
  },
  
  "posture": {
    title: "Posture Analysis",
    fields: [
      { 
        label: "Frontal Posture Score", 
        path: "exercises[0].analysisScore", 
        unit: "%",
        classification: {
          ranges: [
            { min: 0, max: 70, label: "Needs Improvement", class: "low" },
            { min: 70, max: 85, label: "Fair", class: "medium" },
            { min: 85, max: 100, label: "Good", class: "normal" }
          ]
        }
      },
      { 
        label: "Lateral Posture Score", 
        path: "exercises[1].analysisScore", 
        unit: "%",
        classification: {
          ranges: [
            { min: 0, max: 70, label: "Needs Improvement", class: "low" },
            { min: 70, max: 85, label: "Fair", class: "medium" },
            { min: 85, max: 100, label: "Good", class: "normal" }
          ]
        }
      },
      { 
        label: "Squat Accuracy", 
        path: "exercises[?(@.id==259)].setList[0].additionalFields[?(@.fieldName=='accuracy')].fieldValue", 
        unit: "%"
      }
    ]
  },
  
  "body_composition": {
    title: "Body Composition",
    fields: [
      { 
        label: "BMI", 
        path: "bodyCompositionData.BMI", 
        unit: "",
        classification: {
          ranges: [
            { min: 0, max: 18.5, label: "Underweight", class: "low" },
            { min: 18.5, max: 25, label: "Normal", class: "normal" },
            { min: 25, max: 30, label: "Overweight", class: "medium" },
            { min: 30, max: 100, label: "Obese", class: "high" }
          ]
        }
      },
      { 
        label: "Body Fat Percentage", 
        path: "bodyCompositionData.BFC", 
        unit: "%",
        classification: {
          ranges: [
            { min: 0, max: 15, label: "Low", class: "low" },
            { min: 15, max: 25, label: "Normal", class: "normal" },
            { min: 25, max: 100, label: "High", class: "high" }
          ]
        }
      },
      { 
        label: "Lean Mass", 
        path: "bodyCompositionData.LM", 
        unit: "kg"
      },
      { 
        label: "Fat Mass", 
        path: "bodyCompositionData.FM", 
        unit: "kg"
      },
      { 
        label: "Basal Metabolic Rate", 
        path: "bodyCompositionData.BMR", 
        unit: "kcal"
      }
    ]
  },
  
  "cardiovascular_endurance": {
    title: "Cardiovascular Endurance",
    fields: [
      { 
        label: "Jog Test Time", 
        path: "exercises[2].setList[0].time", 
        unit: "seconds",
        classification: {
          ranges: [
            { min: 0, max: 30, label: "Excellent", class: "excellent" },
            { min: 30, max: 60, label: "Good", class: "normal" },
            { min: 60, max: 1000, label: "Needs Improvement", class: "low" }
          ]
        }
      },
      { 
        label: "Max Heart Rate", 
        path: "vitalsMap.metadata.heart_scores.HRMax", 
        unit: "bpm"
      },
      { 
        label: "Heart Rate Reserve", 
        path: "vitalsMap.metadata.heart_scores.HRR", 
        unit: "bpm"
      },
      { 
        label: "Target Heart Rate Range", 
        path: "vitalsMap.metadata.heart_scores.THRR", 
        unit: ""
      }
    ]
  }
};