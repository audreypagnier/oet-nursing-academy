"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────── */

type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type Exercise = {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  text: string;
  questions: Question[];
};

/* ─── Exercises ───────────────────────────────────────────────── */

const EXERCISES: Exercise[] = [
  {
    id: "ex1",
    title: "Post-operative Wound Assessment",
    tag: "Chirurgie",
    tagColor: "bg-blue-100 text-blue-700",
    text: `Mrs. Patricia Moore, 67, underwent a right hip replacement three days ago. During the morning shift handover, the night nurse reported that the surgical wound dressing was intact and there was no sign of bleeding. However, during the morning assessment at 08:15, the nurse noted that the wound edges appeared slightly erythematous with localised warmth on palpation. There was a small amount of serosanguinous discharge on the inner dressing. Mrs. Moore's temperature was 37.9°C, pulse 88 bpm, BP 128/76 mmHg. She reported mild pain at the wound site, rated 4/10. The wound was cleaned with normal saline, a fresh dressing was applied, and the findings were documented in the patient's notes. The surgical team was notified and prescribed a wound swab for culture and sensitivity.`,
    questions: [
      {
        id: "ex1q1",
        question: "What finding prompted the nurse to notify the surgical team?",
        options: [
          "The patient reported pain rated 4/10",
          "The wound showed signs of erythema, warmth, and serosanguinous discharge",
          "The dressing had not been changed overnight",
          "The patient's blood pressure was elevated",
        ],
        correct: 1,
        explanation: "The combination of erythema (redness), localised warmth, and serosanguinous discharge are early signs of potential wound infection, which warranted escalation to the surgical team. Pain alone at 4/10 and normal observations would not necessarily require immediate notification.",
      },
      {
        id: "ex1q2",
        question: "What is the purpose of ordering a wound swab for culture and sensitivity?",
        options: [
          "To measure the size of the wound",
          "To identify the type of dressing required",
          "To identify the causative organism and guide antibiotic therapy",
          "To confirm the wound is healing normally",
        ],
        correct: 2,
        explanation: "A culture and sensitivity swab identifies which microorganism is causing the infection and which antibiotics it is sensitive to, allowing targeted treatment. It does not assess wound size or determine dressing type.",
      },
      {
        id: "ex1q3",
        question: "Which of Mrs. Moore's vital signs is most consistent with early infection?",
        options: [
          "BP 128/76 mmHg",
          "Pulse 88 bpm",
          "Temperature 37.9°C",
          "Pain score 4/10",
        ],
        correct: 2,
        explanation: "A temperature of 37.9°C is a low-grade fever (normal is up to 37.5°C), which is consistent with the early inflammatory response to infection. While all findings should be monitored, the elevated temperature is the vital sign most directly associated with infection.",
      },
    ],
  },
  {
    id: "ex2",
    title: "Insulin Administration Protocol",
    tag: "Endocrinologie",
    tagColor: "bg-purple-100 text-purple-700",
    text: `Mr. James Okafor, 54, was admitted with poorly controlled type 2 diabetes mellitus. His blood glucose on admission was 18.4 mmol/L. He is currently prescribed a basal-bolus insulin regimen: 24 units of insulin glargine at 22:00 and insulin aspart 6 units with meals. At 12:30, prior to his lunch, his capillary blood glucose (CBG) was 14.2 mmol/L. The nurse prepared the insulin aspart dose but noted that the insulin pen contained only 4 units. The nurse did not administer the incomplete dose and instead obtained a new insulin pen from the medication fridge, confirmed the correct insulin type against the prescription chart, checked the expiry date, and administered the full 6-unit dose subcutaneously into the abdomen, rotating the injection site from the morning dose location. The administration was documented immediately after the injection.`,
    questions: [
      {
        id: "ex2q1",
        question: "Why did the nurse obtain a new insulin pen rather than administering the 4 available units?",
        options: [
          "The insulin pen was the wrong brand",
          "Administering an incomplete dose would not have complied with the prescribed regimen",
          "The patient refused the injection",
          "Insulin aspart should not be given before lunch",
        ],
        correct: 1,
        explanation: "The prescribed dose was 6 units. Administering only 4 units would mean the patient receives an incorrect, sub-therapeutic dose. Safe medication practice requires that the full prescribed dose be administered, so a new pen was obtained to complete the correct dose.",
      },
      {
        id: "ex2q2",
        question: "Why did the nurse rotate the injection site from the morning dose location?",
        options: [
          "To reduce pain during injection",
          "To prevent lipohypertrophy and ensure consistent insulin absorption",
          "Because the morning site had not yet been cleaned",
          "To comply with hospital policy on documentation",
        ],
        correct: 1,
        explanation: "Repeated injections into the same site cause lipohypertrophy (fatty lumps under the skin), which impairs insulin absorption and leads to unpredictable blood glucose levels. Site rotation is essential practice in insulin administration.",
      },
      {
        id: "ex2q3",
        question: "Which check is specifically mentioned as being performed before administering the new insulin pen?",
        options: [
          "Confirming the patient's allergy status",
          "Checking the patient's weight",
          "Verifying the correct insulin type against the prescription and checking the expiry date",
          "Measuring blood glucose again before injection",
        ],
        correct: 2,
        explanation: "The text explicitly states the nurse confirmed the correct insulin type against the prescription chart and checked the expiry date. These are two of the mandatory checks (the 'rights' of medication administration) that must be performed before giving any insulin.",
      },
    ],
  },
  {
    id: "ex3",
    title: "Chest Pain Triage",
    tag: "Cardiologie",
    tagColor: "bg-red-100 text-red-700",
    text: `At 09:45, Mr. David Chen, 61, presented to the emergency department with a 40-minute history of central chest pain radiating to the left jaw and left arm. He described the pain as crushing in nature and rated it 8/10 in severity. He was diaphoretic and appeared pale and anxious. His past medical history includes hypertension and hypercholesterolaemia. He smokes 10 cigarettes per day. On arrival, his vital signs were: BP 158/96 mmHg, HR 104 bpm (irregular), RR 22 breaths/min, SpO2 94% on room air, temperature 36.8°C. A 12-lead ECG was performed within 5 minutes of arrival and showed ST-segment elevation in leads II, III, and aVF. A 300 mg aspirin tablet was administered orally and oxygen was applied via a non-rebreather mask at 15 L/min. The cardiology registrar was called immediately.`,
    questions: [
      {
        id: "ex3q1",
        question: "Based on the ECG findings and symptoms, what condition does Mr. Chen most likely have?",
        options: [
          "Stable angina",
          "Pulmonary embolism",
          "Inferior ST-elevation myocardial infarction (STEMI)",
          "Hypertensive crisis",
        ],
        correct: 2,
        explanation: "ST-elevation in leads II, III, and aVF indicates an inferior STEMI. These leads correspond to the inferior wall of the heart, supplied by the right coronary artery. The clinical presentation — crushing central chest pain radiating to the jaw and arm, diaphoresis, pallor, and tachycardia — is classic for an acute MI.",
      },
      {
        id: "ex3q2",
        question: "Why was aspirin administered on arrival?",
        options: [
          "To reduce the patient's fever",
          "To lower blood pressure",
          "To inhibit platelet aggregation and limit clot formation",
          "To relieve chest pain directly",
        ],
        correct: 2,
        explanation: "Aspirin is an antiplatelet agent. In acute MI, a coronary artery is blocked by a thrombus (blood clot). Aspirin inhibits platelet aggregation, helping to prevent the clot from growing and reducing myocardial damage. It is a first-line intervention in suspected ACS.",
      },
      {
        id: "ex3q3",
        question: "Which finding indicates that Mr. Chen's oxygen saturation requires immediate intervention?",
        options: [
          "His heart rate is 104 bpm",
          "His SpO2 is 94% on room air, below the normal threshold of 95%",
          "His respiratory rate is 22 breaths/min",
          "His blood pressure is 158/96 mmHg",
        ],
        correct: 1,
        explanation: "An SpO2 of 94% on room air is below the acceptable threshold of 95% and indicates mild hypoxaemia. In the context of an acute MI, supplemental oxygen is indicated to maintain adequate tissue oxygenation and reduce myocardial ischaemia.",
      },
    ],
  },
  {
    id: "ex4",
    title: "Diabetic Discharge Planning",
    tag: "Endocrinologie",
    tagColor: "bg-purple-100 text-purple-700",
    text: `Mrs. Fatima Al-Hassan, 49, is being discharged following a five-day admission for a diabetic foot ulcer. She has a 12-year history of type 2 diabetes. Her HbA1c on admission was 78 mmol/mol, indicating poor long-term glycaemic control. During her admission, she received IV antibiotics, wound debridement, and diabetes education. Her discharge medications include metformin 1 g twice daily, empagliflozin 10 mg once daily, and a new insulin pen for subcutaneous injection. Before discharge, the nurse reviewed Mrs. Al-Hassan's understanding of her insulin technique, blood glucose monitoring, and hypoglycaemia recognition. She was provided with a glucometer, lancets, and test strips. A follow-up appointment with the diabetes specialist nurse was arranged for two weeks post-discharge, and a district nurse referral was made for daily wound dressing changes at home.`,
    questions: [
      {
        id: "ex4q1",
        question: "What does an HbA1c of 78 mmol/mol indicate about Mrs. Al-Hassan's diabetes management?",
        options: [
          "Her blood glucose has been well controlled over the past three months",
          "Her blood glucose has been poorly controlled over the past three months",
          "She has recently developed type 1 diabetes",
          "Her kidneys are not functioning properly",
        ],
        correct: 1,
        explanation: "HbA1c reflects average blood glucose levels over approximately three months. The target for most people with type 2 diabetes is below 53 mmol/mol. An HbA1c of 78 mmol/mol is significantly elevated, indicating sustained poor glycaemic control — a key contributing factor to her foot ulcer.",
      },
      {
        id: "ex4q2",
        question: "Why was a district nurse referral made for Mrs. Al-Hassan?",
        options: [
          "To monitor her blood pressure at home",
          "To administer her insulin injections daily",
          "To perform daily wound dressing changes in the community",
          "To organise her follow-up hospital appointment",
        ],
        correct: 2,
        explanation: "The text states the district nurse referral was made for daily wound dressing changes at home. This ensures the diabetic foot ulcer receives consistent professional wound care after discharge, reducing the risk of re-infection or deterioration.",
      },
      {
        id: "ex4q3",
        question: "Which element of patient education was specifically reviewed before Mrs. Al-Hassan's discharge?",
        options: [
          "Dietary meal planning and carbohydrate counting",
          "Insulin technique, blood glucose monitoring, and hypoglycaemia recognition",
          "How to self-refer to specialist services",
          "The mechanism of action of metformin",
        ],
        correct: 1,
        explanation: "The text explicitly states the nurse reviewed insulin technique, blood glucose monitoring, and hypoglycaemia recognition. These are the three critical self-management skills for a patient newly started on insulin, as errors in any of these areas can be life-threatening.",
      },
    ],
  },
  {
    id: "ex5",
    title: "IV Fluid Balance",
    tag: "Soins généraux",
    tagColor: "bg-teal-100 text-teal-700",
    text: `Mr. Thomas Nguyen, 72, was admitted with dehydration secondary to a gastrointestinal illness. He has a history of chronic heart failure (CHF) with an ejection fraction of 35%. On assessment, he appeared dry: his mucous membranes were parched, skin turgor was reduced, and his urine output over the previous 8 hours was 180 mL. His serum sodium was 148 mmol/L and serum creatinine was 142 µmol/L (baseline 98 µmol/L), indicating acute kidney injury (AKI). The medical team prescribed 500 mL of 0.9% sodium chloride over 4 hours. The nurse was aware of his cardiac history and monitored him closely for signs of fluid overload throughout the infusion: increased respiratory rate, new crackles on auscultation, and peripheral oedema. His fluid balance was recorded hourly and his weight was measured before and after the infusion.`,
    questions: [
      {
        id: "ex5q1",
        question: "Why does Mr. Nguyen's cardiac history require close monitoring during IV fluid therapy?",
        options: [
          "Patients with CHF cannot receive any IV fluids",
          "Rapid or excessive fluid administration can precipitate acute pulmonary oedema in patients with reduced cardiac function",
          "0.9% sodium chloride is contraindicated in heart failure",
          "IV fluids will worsen his sodium levels",
        ],
        correct: 1,
        explanation: "Patients with heart failure have a reduced ability to handle large fluid volumes. Administering too much fluid too quickly can overwhelm the heart's pumping capacity, causing fluid to back up into the lungs (pulmonary oedema). Close monitoring allows early detection and intervention.",
      },
      {
        id: "ex5q2",
        question: "What does the rise in serum creatinine from 98 to 142 µmol/L indicate?",
        options: [
          "Normal variation within the reference range",
          "Chronic kidney disease progressing over years",
          "Acute kidney injury, likely due to reduced renal perfusion from dehydration",
          "An adverse effect of IV sodium chloride",
        ],
        correct: 2,
        explanation: "A rise in creatinine above the patient's baseline indicates acute kidney injury (AKI). In the context of dehydration, this is caused by reduced renal perfusion (pre-renal AKI). Correcting the fluid deficit should improve kidney function, which is why cautious IV rehydration is prescribed.",
      },
      {
        id: "ex5q3",
        question: "Which sign would indicate that Mr. Nguyen is developing fluid overload during the infusion?",
        options: [
          "Improved urine output to 50 mL/hour",
          "Decrease in respiratory rate from 18 to 16 breaths/min",
          "New crackles on chest auscultation and increasing respiratory rate",
          "Resolution of dry mucous membranes",
        ],
        correct: 2,
        explanation: "New crackles on auscultation (indicating fluid in the lungs) and an increasing respiratory rate are key early signs of pulmonary oedema caused by fluid overload. Improved urine output and resolution of dry membranes would indicate the fluid therapy is working effectively.",
      },
    ],
  },
  {
    id: "ex6",
    title: "Neurological Assessment — Stroke Signs",
    tag: "Neurologie",
    tagColor: "bg-indigo-100 text-indigo-700",
    text: `At 14:20, a ward nurse was called by the family of Mr. Robert Patel, 69, who reported he had suddenly become confused and was unable to speak clearly. On assessment, Mr. Patel presented with slurred speech (dysarthria), right-sided facial droop, and right arm weakness — he was unable to raise his right arm above shoulder height. His left arm and both legs were unaffected. His GCS was 13/15 (E4 V3 M6). His blood glucose was 5.8 mmol/L, ruling out hypoglycaemia as a cause of his symptoms. His last neurological observations, performed at 13:00, had been entirely normal. The nurse activated the hospital's stroke protocol immediately, recorded the time of symptom onset as 14:20, and ensured Mr. Patel remained nil by mouth pending a formal swallowing assessment.`,
    questions: [
      {
        id: "ex6q1",
        question: "Why is recording the exact time of symptom onset critical in this situation?",
        options: [
          "It is required for nursing documentation only",
          "It determines eligibility for time-sensitive treatments such as thrombolysis, which must be given within a defined window",
          "It helps identify which nurse was responsible at the time",
          "It allows the family to be notified at the correct time",
        ],
        correct: 1,
        explanation: "Thrombolysis (clot-busting medication) can only be given within 4.5 hours of symptom onset for ischaemic stroke. Knowing the exact onset time is essential to determine whether the patient is eligible for this treatment. Every minute of delay increases neurological damage ('time is brain').",
      },
      {
        id: "ex6q2",
        question: "Why was Mr. Patel's blood glucose checked during the initial assessment?",
        options: [
          "Because he has a history of diabetes",
          "To calculate his insulin dose",
          "Hypoglycaemia can mimic stroke symptoms and must be excluded before activating the stroke pathway",
          "Blood glucose is a routine observation for all confused patients",
        ],
        correct: 2,
        explanation: "Hypoglycaemia (low blood sugar) can cause focal neurological symptoms including confusion, slurred speech, and limb weakness that closely mimic a stroke. Checking blood glucose immediately allows this treatable cause to be excluded before committing to the stroke pathway.",
      },
      {
        id: "ex6q3",
        question: "Why was Mr. Patel kept nil by mouth following the stroke assessment?",
        options: [
          "He had refused to eat during the morning shift",
          "Nil by mouth is standard for all patients in hospital",
          "Stroke can impair the swallowing reflex, increasing the risk of aspiration if eating or drinking",
          "He was scheduled for urgent surgery",
        ],
        correct: 2,
        explanation: "Stroke frequently affects the swallowing reflex (dysphagia), which increases the risk of aspiration — food or fluid entering the airway and lungs, potentially causing aspiration pneumonia. All patients with suspected stroke are kept nil by mouth until a formal swallowing assessment is completed.",
      },
    ],
  },
  {
    id: "ex7",
    title: "COPD Exacerbation",
    tag: "Respiratoire",
    tagColor: "bg-cyan-100 text-cyan-700",
    text: `Ms. Sandra Walsh, 63, was admitted with an acute exacerbation of chronic obstructive pulmonary disease (COPD). She has a 40 pack-year smoking history and has been on home nebulisers for two years. On assessment, she was using accessory muscles to breathe and was visibly breathless at rest. Her SpO2 was 86% on room air. She was commenced on controlled oxygen therapy at 28% via a Venturi mask, targeting an SpO2 of 88–92%. Salbutamol 2.5 mg and ipratropium 500 mcg nebulisers were administered back-to-back. A blood gas was taken, which showed pH 7.31, PaCO2 7.2 kPa, PaO2 7.8 kPa, confirming acute type 2 respiratory failure with hypercapnia. Prednisolone 40 mg orally and doxycycline 200 mg were prescribed. The respiratory physiotherapist was also referred to assist with airway clearance.`,
    questions: [
      {
        id: "ex7q1",
        question: "Why is the oxygen target for Ms. Walsh set at 88–92% rather than the standard 94–98%?",
        options: [
          "Higher oxygen levels are not safe for any patient",
          "Patients with COPD may rely on hypoxic drive to breathe; excessive oxygen can suppress this and cause hypoventilation",
          "The Venturi mask cannot deliver oxygen above 92%",
          "Her oxygen saturation is already sufficient at 86%",
        ],
        correct: 1,
        explanation: "Some patients with severe COPD develop hypercapnic respiratory failure and may rely on low oxygen levels (hypoxic drive) to stimulate breathing. Administering high-flow oxygen can remove this drive, causing respiratory depression and worsening CO2 retention. A target SpO2 of 88–92% balances adequate oxygenation with respiratory drive preservation.",
      },
      {
        id: "ex7q2",
        question: "What does the blood gas result (pH 7.31, PaCO2 7.2 kPa) indicate?",
        options: [
          "Metabolic alkalosis",
          "Normal respiratory function",
          "Respiratory acidosis with CO2 retention (type 2 respiratory failure)",
          "Metabolic acidosis due to infection",
        ],
        correct: 2,
        explanation: "A pH below 7.35 is acidotic. Combined with an elevated PaCO2 (normal is 4.7–6.0 kPa), this confirms respiratory acidosis — the lungs are not excreting enough CO2. This pattern is consistent with type 2 respiratory failure, which is common in severe COPD exacerbations.",
      },
      {
        id: "ex7q3",
        question: "What is the rationale for prescribing doxycycline in this exacerbation?",
        options: [
          "To treat a concurrent urinary tract infection",
          "To provide antiviral cover against influenza",
          "Bacterial infection is a common trigger for COPD exacerbations; antibiotics target this cause",
          "Doxycycline is a bronchodilator used in COPD",
        ],
        correct: 2,
        explanation: "Bacterial infection — commonly caused by Haemophilus influenzae, Streptococcus pneumoniae, or Moraxella catarrhalis — is one of the most frequent triggers of COPD exacerbations. Antibiotics such as doxycycline are prescribed when there is evidence of increased sputum purulence or other signs of bacterial infection.",
      },
    ],
  },
  {
    id: "ex8",
    title: "Paediatric Febrile Convulsion",
    tag: "Pédiatrie",
    tagColor: "bg-pink-100 text-pink-700",
    text: `Liam, a 2-year-old boy, was brought to the paediatric emergency department by his parents. They reported that he had experienced a tonic-clonic seizure lasting approximately 90 seconds at home, which stopped spontaneously. He had been unwell for 24 hours with a runny nose and had felt warm to touch. On arrival, his temperature was 39.4°C, HR 138 bpm, RR 28 breaths/min, SpO2 98% on room air, and GCS 15/15. He was alert and interacting with his parents. Neurological examination was normal. A diagnosis of simple febrile convulsion was made. Paracetamol 240 mg was administered to manage his fever. His parents were visibly distressed and expressed fear that their son had epilepsy and would have another seizure. The nurse provided education to the family about febrile convulsions.`,
    questions: [
      {
        id: "ex8q1",
        question: "Which feature of this seizure is consistent with a simple febrile convulsion rather than epilepsy?",
        options: [
          "The child's temperature of 39.4°C",
          "The seizure lasted 90 seconds, was tonic-clonic, occurred with a fever, and stopped spontaneously without medication",
          "The child is 2 years old",
          "The seizure happened at home rather than in hospital",
        ],
        correct: 1,
        explanation: "Simple febrile convulsions are characterised by: occurring in association with fever, lasting less than 15 minutes, stopping spontaneously, and no recurrence within 24 hours. Liam's 90-second tonic-clonic seizure that stopped spontaneously in the context of fever meets these criteria. The age range (6 months–5 years) also fits.",
      },
      {
        id: "ex8q2",
        question: "What is the primary purpose of administering paracetamol to Liam?",
        options: [
          "To prevent further seizures",
          "To treat the underlying viral infection",
          "To reduce fever and improve the child's comfort",
          "To lower his heart rate",
        ],
        correct: 2,
        explanation: "Paracetamol is an antipyretic (fever-reducing) and analgesic. Its primary purpose here is to reduce Liam's temperature and improve his comfort. Evidence does not support the use of antipyretics to prevent recurrent febrile convulsions, but temperature management remains an important part of supportive care.",
      },
      {
        id: "ex8q3",
        question: "What is the most appropriate focus of the nurse's education to Liam's parents?",
        options: [
          "How to perform a lumbar puncture at home",
          "That febrile convulsions are common, generally benign, and not the same as epilepsy",
          "That Liam will require daily anticonvulsant medication",
          "That they should prevent all future fevers to avoid seizures",
        ],
        correct: 1,
        explanation: "Parents are understandably frightened after witnessing a seizure. The nurse should explain that febrile convulsions are common (affecting 2–4% of children), are not caused by epilepsy, rarely cause harm, and most children outgrow them by age 5. Clear, reassuring, evidence-based information addresses the family's fears and promotes informed understanding.",
      },
    ],
  },
  {
    id: "ex9",
    title: "Acute Anxiety Episode in a Surgical Patient",
    tag: "Santé mentale",
    tagColor: "bg-violet-100 text-violet-700",
    text: `Ms. Yuki Tanaka, 38, was admitted for elective cholecystectomy scheduled for the following morning. At 22:30, the nurse was called to her bedside. Ms. Tanaka was sitting upright, visibly distressed, breathing rapidly at 26 breaths/min, and reporting tingling in her hands and feet and tightness in her chest. She stated she was "terrified about the operation" and "cannot calm down". Her SpO2 was 99%, HR 112 bpm, and BP 148/88 mmHg. There was no history of cardiac or respiratory disease. Her ECG was unremarkable and chest auscultation revealed clear equal air entry bilaterally. Blood glucose was 5.6 mmol/L. The nurse explained the findings calmly, sat with Ms. Tanaka, and guided her through slow diaphragmatic breathing. After 10 minutes, her RR had decreased to 18 breaths/min, her tingling had resolved, and she stated she felt "much better". A post-operative anxiety plan was documented in her notes.`,
    questions: [
      {
        id: "ex9q1",
        question: "What is the most likely cause of Ms. Tanaka's tingling hands and feet?",
        options: [
          "Hypoglycaemia",
          "Hyperventilation-induced hypocapnia causing perioral and peripheral paraesthesia",
          "A cardiac arrhythmia",
          "Side effects from pre-operative medication",
        ],
        correct: 1,
        explanation: "Hyperventilation during acute anxiety causes excessive CO2 to be expelled, lowering blood CO2 levels (hypocapnia). This causes vasoconstriction and shifts the oxygen-haemoglobin dissociation curve, resulting in peripheral and perioral tingling (paraesthesia). The normal blood glucose and ECG help exclude metabolic or cardiac causes.",
      },
      {
        id: "ex9q2",
        question: "What was the therapeutic purpose of the nurse guiding Ms. Tanaka through diaphragmatic breathing?",
        options: [
          "To increase her SpO2 from 99% to 100%",
          "To slow her respiratory rate, increase CO2 levels, and reverse the physiological effects of hyperventilation",
          "To administer oxygen more efficiently",
          "To prepare her for anaesthesia the following morning",
        ],
        correct: 1,
        explanation: "Slow diaphragmatic breathing reduces the respiratory rate, allowing CO2 to build back up to normal levels. This reverses hypocapnia and resolves the peripheral tingling. It also activates the parasympathetic nervous system, counteracting the anxiety-driven sympathetic 'fight or flight' response.",
      },
      {
        id: "ex9q3",
        question: "Why were investigations such as ECG and blood glucose performed despite the suspected psychological cause?",
        options: [
          "They are required by hospital protocol before any nursing intervention",
          "To ensure a cardiac event or metabolic cause was excluded before attributing symptoms to anxiety",
          "To prepare documentation for the surgical team",
          "Because the patient had a cardiac history",
        ],
        correct: 1,
        explanation: "Chest tightness, tachycardia, and elevated blood pressure can also be signs of a cardiac event. Similarly, hypoglycaemia can cause anxiety-like symptoms. The nurse performed investigations to safely exclude organic causes before concluding the episode was anxiety-driven — this is sound clinical reasoning even when the history points strongly to a psychological cause.",
      },
    ],
  },
  {
    id: "ex10",
    title: "Chemotherapy Side Effects",
    tag: "Oncologie",
    tagColor: "bg-orange-100 text-orange-700",
    text: `Mrs. Elena Rossi, 52, is receiving her third cycle of cyclophosphamide-based chemotherapy for breast cancer. She attended the oncology day unit reporting nausea, fatigue, and mouth soreness over the past five days. On assessment, she had five oral mucositis lesions visible on the buccal mucosa. Her weight had decreased by 2.1 kg since her previous cycle. Her blood results showed: WBC 2.1 × 10⁹/L (normal 4–11), neutrophils 0.9 × 10⁹/L (normal 1.8–7.5), haemoglobin 98 g/L (normal 120–160 g/L). She was afebrile at 37.2°C. The nurse provided education on oral care using a soft toothbrush and non-alcoholic mouthwash, ensured anti-emetic medication was prescribed, referred her to the dietitian regarding weight loss, and reinforced neutropenic precautions including avoiding crowds, raw foods, and unwell contacts.`,
    questions: [
      {
        id: "ex10q1",
        question: "What do Mrs. Rossi's neutrophil results indicate, and why is this significant?",
        options: [
          "Normal neutrophil count; no additional precautions required",
          "Neutropaenia, meaning she has a significantly reduced ability to fight bacterial infections",
          "An allergic reaction to chemotherapy",
          "Anaemia caused by iron deficiency",
        ],
        correct: 1,
        explanation: "A neutrophil count of 0.9 × 10⁹/L is below the normal range and indicates neutropaenia. Neutrophils are the primary white blood cells that fight bacterial infections. Neutropaenic patients are at high risk of life-threatening infections even from organisms that would not normally cause illness in healthy individuals. This is why neutropenic precautions are essential.",
      },
      {
        id: "ex10q2",
        question: "Why is the use of a non-alcoholic mouthwash recommended for Mrs. Rossi's oral mucositis?",
        options: [
          "Alcohol-based mouthwashes contain antibiotics that are inappropriate for mucositis",
          "Alcohol is drying and irritating to already damaged and inflamed mucosal tissue, worsening pain and healing",
          "Non-alcoholic mouthwash is more effective at killing bacteria",
          "Alcohol interacts with cyclophosphamide chemotherapy",
        ],
        correct: 1,
        explanation: "Oral mucositis causes inflammation and ulceration of the mucosal lining of the mouth. Alcohol has a drying and irritant effect on mucous membranes, which would exacerbate pain and delay healing in already damaged tissue. A gentle, non-alcoholic mouthwash and soft toothbrush minimise further trauma while maintaining oral hygiene.",
      },
      {
        id: "ex10q3",
        question: "Why was a dietitian referral made for Mrs. Rossi?",
        options: [
          "To prescribe her anti-emetic medication",
          "Because her chemotherapy protocol requires a specific diet",
          "To assess and manage significant unintentional weight loss during treatment",
          "To review her fluid intake",
        ],
        correct: 2,
        explanation: "Mrs. Rossi has lost 2.1 kg since her last cycle — a significant unintentional weight loss in the context of chemotherapy. Nausea, mucositis, and fatigue all impair adequate nutrition. Malnutrition during cancer treatment is associated with poorer outcomes, reduced tolerance to chemotherapy, and delayed healing. A dietitian can provide targeted nutritional support.",
      },
    ],
  },
];

/* ─── Score helper ────────────────────────────────────────────── */

function estimatedScore(correct: number, total: number): string {
  if (total === 0) return "—";
  const pct = correct / total;
  // Map to rough OET-style band (300–500 scale)
  const oet = Math.round(300 + pct * 150);
  if (pct >= 0.9) return `${oet} / 500 — Grade A`;
  if (pct >= 0.75) return `${oet} / 500 — Grade B`;
  if (pct >= 0.6) return `${oet} / 500 — Grade C`;
  return `${oet} / 500 — En dessous du seuil B`;
}

/* ─── Component ───────────────────────────────────────────────── */

export default function ReadingClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  // answers: questionId → chosen option index
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // which exercises are open
  const [open, setOpen] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("oet_reading_completed");
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch {}
    setHydrated(true);
  }, []);

  function markCompleted(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem("oet_reading_completed", JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  function answer(qId: string, idx: number, exerciseId: string, exercise: Exercise) {
    if (answers[qId] !== undefined) return; // already answered
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
    // auto-complete exercise when all questions answered
    const allAnswered = exercise.questions.every(
      (q) => q.id === qId || answers[q.id] !== undefined
    );
    if (allAnswered) markCompleted(exerciseId);
  }

  // Compute global stats
  const totalQuestions = EXERCISES.length * 3;
  const answeredCount = Object.keys(answers).length;
  const correctCount = EXERCISES.flatMap((ex) => ex.questions).filter(
    (q) => answers[q.id] === q.correct
  ).length;

  if (!hydrated) {
    return (
      <Shell>
        <div className="w-full max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-10 w-56 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Reading OET</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Textes cliniques</h1>
          <p className="text-sm text-gray-400 mt-1">
            10 exercices originaux avec questions à choix multiples et explications.
          </p>
        </div>

        {/* Progress card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold text-[#0B1E4B] mb-0.5">
                {completed.size} / {EXERCISES.length} exercices complétés
              </p>
              <p className="text-xs text-gray-400">
                {correctCount} bonnes réponses sur {answeredCount} questions répondues
              </p>
            </div>
            {answeredCount > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">Score estimé Reading</p>
                <p className="text-sm font-bold text-[#009DA1]">
                  {estimatedScore(correctCount, answeredCount)}
                </p>
                <p className="text-xs text-gray-300 mt-0.5">Indicatif — pas un résultat officiel OET</p>
              </div>
            )}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#00C2C7] transition-all duration-500"
              style={{ width: `${(completed.size / EXERCISES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise list */}
        <div className="space-y-3">
          {EXERCISES.map((ex, exIndex) => {
            const isOpen = open === ex.id;
            const isDone = completed.has(ex.id);
            const exAnswers = ex.questions.map((q) => answers[q.id]);
            const exCorrect = ex.questions.filter((q, i) => exAnswers[i] === q.correct).length;
            const exAnswered = exAnswers.filter((a) => a !== undefined).length;

            return (
              <div
                key={ex.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isDone ? "border-[#00C2C7]/40 bg-[#00C2C7]/5" : "border-gray-200 bg-white"
                }`}
              >
                {/* Exercise header / toggle */}
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                  onClick={() => setOpen(isOpen ? null : ex.id)}
                >
                  {/* Number / check */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                      isDone
                        ? "bg-[#00C2C7] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isDone ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      exIndex + 1
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[#0B1E4B] text-sm">{ex.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ex.tagColor}`}>
                        {ex.tag}
                      </span>
                    </div>
                    {exAnswered > 0 && (
                      <p className="text-xs text-gray-400">
                        {exCorrect}/{ex.questions.length} bonnes réponses
                      </p>
                    )}
                  </div>

                  <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Exercise body */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100">
                    {/* Clinical text */}
                    <div className="bg-[#F7F9FC] rounded-xl p-4 my-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Texte clinique
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">{ex.text}</p>
                    </div>

                    {/* Questions */}
                    <div className="space-y-5">
                      {ex.questions.map((q, qIndex) => {
                        const chosen = answers[q.id];
                        const answered = chosen !== undefined;
                        const isCorrect = chosen === q.correct;

                        return (
                          <div key={q.id}>
                            <p className="text-sm font-semibold text-[#0B1E4B] mb-3">
                              {qIndex + 1}. {q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((opt, optIdx) => {
                                let style =
                                  "border border-gray-200 text-gray-700 hover:border-[#00C2C7] hover:bg-[#00C2C7]/5";
                                if (answered) {
                                  if (optIdx === q.correct) {
                                    style = "border border-[#00C2C7] bg-[#00C2C7]/10 text-[#007A7E] font-medium";
                                  } else if (optIdx === chosen && !isCorrect) {
                                    style = "border border-red-300 bg-red-50 text-red-600";
                                  } else {
                                    style = "border border-gray-100 text-gray-400 cursor-default";
                                  }
                                }
                                return (
                                  <button
                                    key={optIdx}
                                    disabled={answered}
                                    onClick={() => answer(q.id, optIdx, ex.id, ex)}
                                    className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all ${style}`}
                                  >
                                    <span className="font-semibold mr-2 text-gray-400">
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Feedback */}
                            {answered && (
                              <div
                                className={`mt-3 rounded-xl p-3 text-xs leading-relaxed ${
                                  isCorrect
                                    ? "bg-[#00C2C7]/10 text-[#007A7E]"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                <span className="font-semibold mr-1">
                                  {isCorrect ? "✓ Correct." : "✗ Incorrect."}
                                </span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer nav */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/daily-practice"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            ← Routine du jour
          </Link>
          <Link
            href="/vocabulary"
            className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Vocabulaire médical →
          </Link>
        </div>
      </div>
    </Shell>
  );
}

/* ─── Shell ───────────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
          <Link href="/plan" className="hover:text-[#0B1E4B] transition-colors">Mon plan</Link>
          <Link href="/readiness" className="hover:text-[#0B1E4B] transition-colors">Mon score</Link>
          <Link href="/daily-practice" className="hover:text-[#0B1E4B] transition-colors">Routine du jour</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
