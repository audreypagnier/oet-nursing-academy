"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────── */

type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

type Scenario = {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  type: string;
  transcript: string;
  questions: Question[];
};

/* ─── Scenarios ───────────────────────────────────────────────── */

const SCENARIOS: Scenario[] = [
  {
    id: "sc1",
    title: "Handover: Post-Cardiac Surgery Patient",
    tag: "Cardiologie",
    tagColor: "bg-rose-100 text-rose-700",
    type: "Transmission infirmière",
    transcript: `[Night nurse to day nurse during shift handover]

"Good morning. I'm handing over Mr. Raymond Walsh, 72, in Bed 4. He's on day two post CABG — coronary artery bypass graft. Overnight he was haemodynamically stable. His BP has been ranging between 118 over 70 and 132 over 82, and his heart rate has stayed between 64 and 72 — sinus rhythm on the monitor throughout.

He had one episode of mild hypotension at around 2 a.m. — BP dropped to 96 over 58. I administered a 250 ml normal saline bolus as per the protocol, and his BP came back up to 112 over 74 within twenty minutes. I notified the registrar at the time, who reviewed him and was satisfied.

His urine output has been adequate — around 45 to 50 ml per hour. His drain output is 30 ml over the past eight hours, which is within normal limits. His chest drain is still in situ and draining serosanguinous fluid.

He's on oxygen at 2 litres per minute via nasal prongs, and his sats are sitting at 97 to 98 percent. He had his 6 a.m. medications including metoprolol, aspirin, and his statin. He's been nil by mouth since midnight in case he needs a procedure today, but that's pending the surgical team's review.

He's comfortable and reported his pain as 3 out of 10 this morning. His family have been contacted and are expected to visit this afternoon."`,
    questions: [
      {
        id: "sc1q1",
        question: "What intervention was performed when Mr. Walsh's blood pressure dropped at 2 a.m.?",
        options: [
          "He was given an IV vasopressor infusion",
          "A 250 ml normal saline bolus was administered",
          "His oxygen flow rate was increased",
          "He was transferred to the ICU",
        ],
        correct: 1,
        explanation: "The night nurse administered a 250 ml normal saline bolus as per the hypotension protocol, which successfully restored Mr. Walsh's BP to 112/74 within twenty minutes. Vasopressors and ICU transfer were not required.",
      },
      {
        id: "sc1q2",
        question: "Why has Mr. Walsh been kept nil by mouth since midnight?",
        options: [
          "He was experiencing post-operative nausea",
          "His swallowing reflex had not been assessed",
          "A procedure is pending review by the surgical team",
          "His blood glucose was poorly controlled",
        ],
        correct: 2,
        explanation: "The nurse stated he was nil by mouth in case a procedure is needed, pending the surgical team's morning review. This is a precautionary measure prior to any potential intervention requiring anaesthesia.",
      },
      {
        id: "sc1q3",
        question: "Which of the following best describes Mr. Walsh's overnight cardiac monitoring?",
        options: [
          "He had intermittent atrial fibrillation",
          "He remained in sinus rhythm throughout",
          "He required cardioversion at 2 a.m.",
          "His heart rate was consistently above 90 bpm",
        ],
        correct: 1,
        explanation: "The night nurse confirmed the patient was in sinus rhythm throughout the night with a heart rate between 64 and 72 bpm. There was no mention of arrhythmia or cardioversion.",
      },
    ],
  },
  {
    id: "sc2",
    title: "Patient Consultation: Chest Pain Assessment",
    tag: "Urgences",
    tagColor: "bg-red-100 text-red-700",
    type: "Consultation infirmière",
    transcript: `[Emergency department nurse assessing a patient]

Nurse: "Hello, Mr. Patel. I'm Sarah, one of the nurses here. Can you tell me what's brought you in today?"

Patient: "I've been having this chest pain since about midday. It started when I was walking to the shops — it was quite crushing, kind of tight. I had to stop and sit down."

Nurse: "And where exactly is the pain? Can you point to it?"

Patient: "Right here in the middle of my chest. And it went up into my jaw and down my left arm. That's when I got really scared."

Nurse: "I understand. On a scale of 0 to 10, how would you rate the pain now?"

Patient: "It's about a 6. It was a 9 when it first started but it's eased off a bit. I took an aspirin at home — my wife told me to."

Nurse: "Good, that was the right thing to do. Are you sweating at all, or feeling sick?"

Patient: "Yes, I was sweating a lot when it started. I feel a bit nauseous still."

Nurse: "OK. Do you have any history of heart problems? Any previous chest pain like this?"

Patient: "I had a stent put in my left coronary about four years ago. I'm on clopidogrel and a statin. I've never had pain quite like this before though."

Nurse: "Thank you, Mr. Patel. I'm going to get a 12-lead ECG done straight away and take some blood, including troponin levels. The doctor will be with you very shortly."`,
    questions: [
      {
        id: "sc2q1",
        question: "Which combination of symptoms most strongly suggests a cardiac cause for Mr. Patel's chest pain?",
        options: [
          "Nausea and sweating only",
          "Crushing chest pain radiating to the jaw and left arm",
          "Chest pain that eased after sitting down",
          "Pain starting during physical activity",
        ],
        correct: 1,
        explanation: "Crushing chest pain radiating to the jaw and left arm is a classic presentation of acute myocardial ischaemia. While the other symptoms (diaphoresis, nausea, exertional onset) are also relevant, radiation to the jaw and left arm is the most specific indicator of cardiac origin.",
      },
      {
        id: "sc2q2",
        question: "Why did the nurse prioritise ordering a 12-lead ECG immediately?",
        options: [
          "To measure Mr. Patel's blood pressure accurately",
          "Because he had not taken his medications",
          "To detect possible myocardial ischaemia or infarction",
          "To assess his respiratory function",
        ],
        correct: 2,
        explanation: "A 12-lead ECG is the first-line investigation for suspected acute coronary syndrome. It can identify ST changes, new bundle branch block, or other patterns consistent with ischaemia or infarction, which would guide urgent management.",
      },
      {
        id: "sc2q3",
        question: "What is the significance of Mr. Patel's medical history in this consultation?",
        options: [
          "It confirms he cannot be given aspirin",
          "It suggests his symptoms are likely non-cardiac",
          "A previous coronary stent increases the risk of recurrent cardiac events",
          "His clopidogrel means no further antiplatelet therapy is needed",
        ],
        correct: 2,
        explanation: "A history of coronary artery disease with a previous stent significantly increases the risk of recurrent ischaemia or stent thrombosis. This makes his current presentation more urgent and raises the index of suspicion for an acute coronary syndrome.",
      },
    ],
  },
  {
    id: "sc3",
    title: "Ward Round Briefing: Fluid Balance Concern",
    tag: "Soins généraux",
    tagColor: "bg-green-100 text-green-700",
    type: "Tour médical",
    transcript: `[Nurse briefing the medical team during a ward round]

"Good morning, everyone. This is Mrs. Evelyn Tran, 81, in Bed 7. She was admitted three days ago with acute decompensated heart failure. She's on a fluid restriction of 1,200 ml per 24 hours and is receiving IV furosemide 40 mg twice daily.

Over the past 48 hours she's had a net negative fluid balance of approximately 1.4 litres, which is encouraging. However, this morning her sodium came back at 129 — so she's hyponatraemic. Her potassium is 3.2, which is borderline low. We're monitoring her renal function as her creatinine has risen from 92 on admission to 118 this morning.

On assessment she's alert and oriented, but she does report mild dizziness on standing. Her BP lying down is 108 over 64 and on standing it drops to 88 over 52, so there's significant postural hypotension. Her chest is clearer than admission — we can still hear some fine bibasal crackles but they've reduced. Her oxygen saturations are 94 percent on 2 litres of oxygen, up from 88 percent on admission.

Her weight this morning is 68.4 kg — she was 71.2 kg on admission. She's mobilising with a frame but needs supervision due to the dizziness. I've held her morning dose of furosemide pending the team's review given the electrolyte findings."`,
    questions: [
      {
        id: "sc3q1",
        question: "Why did the nurse hold the morning furosemide dose?",
        options: [
          "The patient refused to take her medications",
          "The furosemide was contraindicated with her other drugs",
          "Electrolyte abnormalities and rising creatinine warranted team review first",
          "Her fluid balance was still positive",
        ],
        correct: 2,
        explanation: "The nurse appropriately withheld the furosemide given hyponatraemia (Na 129), borderline hypokalaemia (K 3.2), and a rising creatinine — all signs that continued aggressive diuresis could worsen renal function and electrolyte imbalance. Team review was needed before continuing.",
      },
      {
        id: "sc3q2",
        question: "What does the significant postural hypotension indicate in Mrs. Tran's case?",
        options: [
          "She is still fluid-overloaded",
          "She may be over-diuresed and relatively hypovolaemic",
          "Her heart failure has worsened since admission",
          "Her BP medication needs to be increased",
        ],
        correct: 1,
        explanation: "A BP drop from 108/64 lying to 88/52 standing is significant postural hypotension, suggesting the patient may now be relatively volume-depleted from diuresis. Combined with rising creatinine and dizziness, this indicates she may have been over-diuresed.",
      },
      {
        id: "sc3q3",
        question: "Which finding most clearly indicates that Mrs. Tran's heart failure is improving?",
        options: [
          "Her sodium level of 129",
          "Her creatinine rising to 118",
          "Reduced bibasal crackles and improved oxygen saturations",
          "Her weight loss of 2.8 kg",
        ],
        correct: 2,
        explanation: "Reduced bibasal crackles (a sign of pulmonary oedema) and improved oxygen saturations from 88% to 94% directly indicate improved respiratory function and reduced pulmonary congestion — the primary goal of treatment in decompensated heart failure.",
      },
    ],
  },
  {
    id: "sc4",
    title: "Phone Consultation: Patient Calling About Medication",
    tag: "Pharmacologie",
    tagColor: "bg-blue-100 text-blue-700",
    type: "Appel téléphonique",
    transcript: `[Nurse receiving a phone call from a patient]

Nurse: "Good afternoon, respiratory clinic. This is James speaking."

Patient: "Hello. My name is Dorothy Clarke. I was seen at your clinic last week and I was started on a new inhaler — the purple one. I just wanted to check if I'm using it correctly because I don't think it's helping."

Nurse: "Of course, Mrs. Clarke. That would be the Symbicort — the combined preventer and reliever. Can you describe how you're using it?"

Patient: "I shake it, then I breathe in and press the button at the same time and breathe in quickly."

Nurse: "That's actually a good technique for a pressurised inhaler, but the Symbicort is a dry powder inhaler — a Turbohaler. You don't shake it, and you need to breathe in quite forcefully and deeply, not quickly. The powder only releases when you inhale strongly."

Patient: "Oh, I didn't know that. And I've only been using it when I feel breathless."

Nurse: "That's another important point. The Symbicort is a preventer inhaler — it needs to be taken regularly every day, morning and evening, even when you feel well. Are you also using a blue reliever inhaler?"

Patient: "Yes, I have a blue Ventolin. I've been using that about four times a day."

Nurse: "Using your reliever four times a day suggests your asthma isn't well controlled at the moment, especially since you've been using the preventer incorrectly. I'd like to arrange for you to come in so our asthma nurse specialist can demonstrate the Turbohaler technique properly. Is that something you'd be able to do?"

Patient: "Yes, that would be very helpful, thank you."`,
    questions: [
      {
        id: "sc4q1",
        question: "What was the main error in Mrs. Clarke's inhaler technique?",
        options: [
          "She was not rinsing her mouth after use",
          "She was shaking and inhaling too quickly instead of inhaling forcefully",
          "She was using the wrong spacer device",
          "She was storing the inhaler in the fridge",
        ],
        correct: 1,
        explanation: "Mrs. Clarke was using the Turbohaler (dry powder inhaler) as if it were a pressurised metered-dose inhaler — shaking it and inhaling quickly. The correct technique requires no shaking and a deep, forceful inhalation to activate the powder mechanism.",
      },
      {
        id: "sc4q2",
        question: "What does Mrs. Clarke's use of her blue reliever inhaler four times daily indicate?",
        options: [
          "Her asthma is well controlled",
          "She should stop using the preventer inhaler",
          "Her asthma is poorly controlled",
          "She has developed a tolerance to Ventolin",
        ],
        correct: 2,
        explanation: "Using a short-acting beta-agonist (salbutamol/Ventolin) more than twice per week indicates poorly controlled asthma. Four times daily use is a significant sign of inadequate disease control and warrants review of her management.",
      },
      {
        id: "sc4q3",
        question: "Why is it important that Mrs. Clarke takes Symbicort every day, even when symptom-free?",
        options: [
          "Because missing a dose causes immediate withdrawal symptoms",
          "Because it is a preventer that reduces underlying airway inflammation over time",
          "Because it also acts as a reliever and replaces Ventolin",
          "Because it needs to build up to a therapeutic level each morning",
        ],
        correct: 1,
        explanation: "Preventer inhalers containing inhaled corticosteroids (like Symbicort) work by reducing chronic airway inflammation. They must be taken regularly to maintain this effect, regardless of symptoms. They do not provide immediate symptom relief and should not replace a reliever inhaler.",
      },
    ],
  },
  {
    id: "sc5",
    title: "Discharge Education: Hip Replacement",
    tag: "Orthopédie",
    tagColor: "bg-orange-100 text-orange-700",
    type: "Éducation au patient",
    transcript: `[Nurse providing discharge education to a patient]

"Mr. Fontaine, before you go home today I want to go through some important information about your recovery after your hip replacement. Please feel free to stop me if anything is unclear.

First, the hip precautions. For the next six weeks, there are three movements you must avoid to prevent the risk of dislocating your new hip. Do not bend your hip more than 90 degrees — so no bending forward to pick things up from the floor. Do not cross your legs or ankles. And do not rotate your foot inward. These restrictions apply whether you're sitting, lying down, or moving around.

For mobility, you'll be going home with a walking frame. You should use it every time you walk, even short distances around the house, until your physiotherapist clears you to move on to a stick or walk unaided. Remember to take it step by step with the stairs — leading with your stronger leg going up, and the operated leg going down. If in doubt: good leg to heaven, bad leg to hell.

Regarding wound care, your wound has staples which will be removed by your community nurse at 12 to 14 days post-operatively. Keep the area dry and covered until then — no baths or swimming. Shower with the dressing protected. If you notice increasing redness, warmth, discharge, or if you develop a fever above 38 degrees, contact us or go to your nearest emergency department.

Your pain medications are in this bag — regular paracetamol four times daily and ibuprofen with meals twice daily. You also have a blister pack of rivaroxaban — that's a blood thinner to reduce the risk of clots. You must take one tablet daily for 35 days. Do not miss doses.

Your follow-up appointment with the orthopaedic surgeon is in six weeks. Your physio outpatient appointment letter will arrive in the post within the next week."`,
    questions: [
      {
        id: "sc5q1",
        question: "Which movement must Mr. Fontaine avoid to prevent hip dislocation?",
        options: [
          "Keeping his foot flat on the floor when sitting",
          "Extending the operated hip while lying on his back",
          "Crossing his legs or ankles",
          "Using a raised toilet seat",
        ],
        correct: 2,
        explanation: "The three standard hip precautions after total hip replacement are: no hip flexion beyond 90°, no leg crossing, and no internal rotation. Crossing the legs or ankles is explicitly listed as one of the prohibited movements to prevent prosthetic dislocation.",
      },
      {
        id: "sc5q2",
        question: "For how long must Mr. Fontaine take rivaroxaban?",
        options: [
          "For 12 to 14 days until the staples are removed",
          "Until his follow-up appointment in six weeks",
          "For 35 days without missing doses",
          "Only if he develops leg pain or swelling",
        ],
        correct: 2,
        explanation: "The nurse explicitly stated that rivaroxaban (an anticoagulant to prevent venous thromboembolism) must be taken once daily for 35 days. Missing doses would increase the risk of deep vein thrombosis or pulmonary embolism following major orthopaedic surgery.",
      },
      {
        id: "sc5q3",
        question: "Which symptom should prompt Mr. Fontaine to seek urgent medical attention?",
        options: [
          "Mild stiffness in the mornings",
          "Difficulty bending to 90 degrees",
          "Increasing wound redness, discharge, or fever above 38°C",
          "Needing the walking frame for short distances",
        ],
        correct: 2,
        explanation: "Signs of wound infection — increasing redness, warmth, discharge, or a temperature above 38°C — require urgent assessment. These may indicate a surgical site infection, which is a serious complication after joint replacement surgery.",
      },
    ],
  },
  {
    id: "sc6",
    title: "Handover: Deteriorating Paediatric Patient",
    tag: "Pédiatrie",
    tagColor: "bg-pink-100 text-pink-700",
    type: "Transmission infirmière",
    transcript: `[Paediatric nurse handover — day shift to evening shift]

"Hi Claire, I'm handing over Liam Chen, aged 6, in Room 3. He was admitted yesterday evening with an acute asthma exacerbation. He's had a rough afternoon and I want to flag some concerns.

At 2 p.m. his respiratory rate was 28 and his oxygen saturations were 95 percent on 2 litres of oxygen via nasal prongs. He was wheezy on auscultation, predominantly in the lower zones. He was given his regular nebulised salbutamol as prescribed.

However, at 4:30 his RR had increased to 36, his sats had dropped to 91 percent, and he was visibly using his accessory muscles — I could see intercostal and subcostal recession. He was also more anxious and restless. I escalated to the paediatric registrar immediately. He reviewed Liam and prescribed back-to-back salbutamol nebs every 20 minutes, started ipratropium bromide alongside it, and added IV hydrocortisone.

His latest sats at 5 p.m. are 94 percent on 4 litres of oxygen. His RR is now 30. He's still wheezy but slightly improved. He's been moved onto a non-rebreather mask. His mum, Mrs. Chen, is at the bedside — she's very anxious. Please keep her updated.

PEWS score at last check was 6. Please reassess in 30 minutes and call the registrar if it rises above 7 or if sats drop below 92 percent again. He's nil by mouth pending the team's review."`,
    questions: [
      {
        id: "sc6q1",
        question: "Which clinical findings at 4:30 prompted the nurse to escalate to the registrar?",
        options: [
          "A PEWS score of 6 and a drop in temperature",
          "Worsening wheeze, rising respiratory rate, falling sats, and accessory muscle use",
          "The child refusing his nebuliser treatment",
          "A new ECG abnormality",
        ],
        correct: 1,
        explanation: "The combination of increasing respiratory rate (36), falling saturations (91%), visible accessory muscle use (intercostal and subcostal recession), and increasing agitation are signs of a worsening acute asthma exacerbation requiring urgent medical review and intensified treatment.",
      },
      {
        id: "sc6q2",
        question: "What is the purpose of adding ipratropium bromide to Liam's treatment?",
        options: [
          "To reduce airway inflammation like corticosteroids",
          "To provide a second bronchodilator with a different mechanism of action",
          "To sedate the child and reduce his anxiety",
          "To treat a suspected respiratory infection",
        ],
        correct: 1,
        explanation: "Ipratropium bromide is an anticholinergic bronchodilator that works via a different pathway to salbutamol (a beta-2 agonist). Combining them in acute severe asthma provides additive bronchodilation. It is not a corticosteroid, sedative, or antibiotic.",
      },
      {
        id: "sc6q3",
        question: "What threshold should trigger the evening nurse to call the registrar?",
        options: [
          "If Liam's PEWS score reaches 6 or his RR exceeds 30",
          "If Liam's PEWS score rises above 7 or sats fall below 92%",
          "If Mrs. Chen asks to speak to a doctor",
          "If Liam refuses his next nebuliser",
        ],
        correct: 1,
        explanation: "The handing-over nurse explicitly stated to call the registrar if the PEWS score rises above 7 or if saturations drop below 92%. These are the escalation thresholds set by the registrar, representing a deterioration from the current position.",
      },
    ],
  },
  {
    id: "sc7",
    title: "Pre-operative Briefing: Consent and Preparation",
    tag: "Bloc opératoire",
    tagColor: "bg-indigo-100 text-indigo-700",
    type: "Préparation chirurgicale",
    transcript: `[Theatre nurse conducting pre-operative assessment]

"Good morning, Mrs. Okonkwo. I'm Diane, the perioperative nurse who'll be looking after you before your operation today. I just need to go through a few checks with you. Is that alright?"

Patient: "Yes, of course."

Nurse: "Can you confirm your full name and date of birth for me?"

Patient: "Susan Okonkwo, 14th of March 1958."

Nurse: "Thank you. And can you tell me what procedure you're having today?"

Patient: "I'm having my gallbladder out. A laparoscopic cholecystectomy."

Nurse: "That's right. And have you signed your consent form?"

Patient: "Yes, I signed it yesterday when I saw the surgeon. He explained about the risks — bleeding, infection, and that there's a small chance they might need to convert to open surgery."

Nurse: "Correct. Now, when did you last eat or drink anything?"

Patient: "I had a cup of water at 6 this morning. Nothing else since midnight."

Nurse: "Good. Six hours fasting for solids and two hours for clear fluids is our standard. A cup of water at 6 a.m. is within the guideline as your procedure isn't until 10 a.m. Do you have any allergies I should be aware of?"

Patient: "Yes — I'm allergic to penicillin. I come out in a rash."

Nurse: "Very important, thank you. That will be highlighted on your wristband and flagged in your notes and to the anaesthetist. Have you removed all jewellery, nail polish, and contact lenses?"

Patient: "Yes, I took everything off. I'm wearing my wedding ring but it's taped."

Nurse: "That's fine as long as it's taped. And your next of kin, are they aware you're having surgery today?"

Patient: "Yes, my daughter is waiting in the family room. She'll take me home afterwards."

Nurse: "Perfect. We'll keep her updated throughout. Is there anything you're worried about, Mrs. Okonkwo?"

Patient: "Just a bit nervous about the anaesthetic. I felt very sick after my last operation years ago."

Nurse: "That's very helpful to know. I'll make sure the anaesthetist is aware so they can use anti-emetics preventively. You're in good hands."`,
    questions: [
      {
        id: "sc7q1",
        question: "Why is Mrs. Okonkwo's penicillin allergy particularly important to document at this stage?",
        options: [
          "She may need an antibiotic during or after surgery",
          "Penicillin is used routinely as an anaesthetic agent",
          "It will affect the type of laparoscopic instruments used",
          "It determines whether open surgery is required",
        ],
        correct: 0,
        explanation: "Prophylactic antibiotics are routinely given before surgery to reduce the risk of surgical site infection. Knowing about a penicillin allergy ensures an alternative antibiotic class is selected and is critical for patient safety. It also needs to be communicated to all members of the theatre team.",
      },
      {
        id: "sc7q2",
        question: "Mrs. Okonkwo drank water at 6 a.m. for a 10 a.m. procedure. Is this within fasting guidelines?",
        options: [
          "No — patients must fast from all fluids from midnight",
          "Yes — clear fluids are permitted up to 2 hours before the procedure",
          "Only if the anaesthetist gives specific permission",
          "No — water is only permitted up to 4 hours before surgery",
        ],
        correct: 1,
        explanation: "Standard pre-operative fasting guidelines allow clear fluids (including water) up to 2 hours before anaesthesia. Mrs. Okonkwo's procedure is at 10 a.m. and she drank water at 6 a.m. — that is 4 hours prior, well within the guideline.",
      },
      {
        id: "sc7q3",
        question: "What action will the nurse take regarding Mrs. Okonkwo's previous post-operative nausea?",
        options: [
          "Postpone the procedure until the anaesthetist reviews her history",
          "Inform the anaesthetist so prophylactic anti-emetics can be planned",
          "Document it in the notes but not inform the surgical team",
          "Reassure the patient that modern anaesthesia never causes nausea",
        ],
        correct: 1,
        explanation: "A history of post-operative nausea and vomiting (PONV) is a known risk factor for recurrence. The nurse correctly states she will ensure the anaesthetist is aware so prophylactic anti-emetics can be incorporated into the anaesthetic plan.",
      },
    ],
  },
  {
    id: "sc8",
    title: "Mental Health Assessment: Anxiety and Self-Care",
    tag: "Santé mentale",
    tagColor: "bg-teal-100 text-teal-700",
    type: "Entretien clinique",
    transcript: `[Community mental health nurse conducting an assessment visit]

Nurse: "Thank you for letting me come in today, Marcus. How have things been since we last spoke?"

Patient: "Not great, honestly. I've been struggling to get out of bed most mornings. Some days I don't eat until the evening."

Nurse: "I'm sorry to hear that. Can you tell me more about your sleep — are you getting any?"

Patient: "I fall asleep okay but I wake up around 3 or 4 a.m. and can't get back to sleep. Then I feel exhausted all day but can't nap either."

Nurse: "And your mood — how would you describe it on most days?"

Patient: "Pretty low. Some days it's okay, maybe a 4 or 5 out of 10. But there are days where it's a 1 or 2. I don't see the point in much."

Nurse: "When you say you don't see the point — I want to ask you directly, Marcus. Have you had any thoughts of harming yourself or ending your life?"

Patient: "I've had thoughts about not wanting to be here. But I haven't made any plans or anything."

Nurse: "Thank you for being honest with me. Those thoughts are important to take seriously. Have you been taking your sertraline?"

Patient: "On and off. I forget sometimes. And I read online it can cause weight gain so I've been scared to take it."

Nurse: "I understand that concern. Let's talk about that because sertraline is quite unlikely to cause weight gain at your dose, and stopping it suddenly — or taking it inconsistently — can actually make your mood more unstable. It works best when taken every day."

Patient: "I didn't know that."

Nurse: "That's okay — it's important we clarify these things. I'm also going to let your care coordinator know about the thoughts you mentioned today, and I'll arrange for the psychiatrist to call you this week. Is that alright with you?"

Patient: "Yes, that's fine."`,
    questions: [
      {
        id: "sc8q1",
        question: "What is the clinical significance of Marcus waking at 3–4 a.m. and feeling exhausted all day?",
        options: [
          "It suggests he has a sleep apnoea disorder",
          "It is a common side effect of his sertraline",
          "Early morning waking is a typical feature of clinical depression",
          "It indicates he is drinking too much caffeine",
        ],
        correct: 2,
        explanation: "Early morning waking (waking in the early hours and being unable to return to sleep) is a recognised symptom of clinical depression, often described as part of a diurnal variation in mood. It is distinct from initial insomnia (difficulty falling asleep) and is clinically significant.",
      },
      {
        id: "sc8q2",
        question: "Why did the nurse ask Marcus directly about thoughts of self-harm?",
        options: [
          "It is a routine question asked at every appointment regardless of presentation",
          "His statement about 'not seeing the point' indicated a need to assess suicide risk",
          "He had previously been admitted following a self-harm episode",
          "His medication dose needed to be adjusted based on his risk level",
        ],
        correct: 1,
        explanation: "When a patient says they 'don't see the point' in things, this is a verbal cue that warrants direct questioning about suicidal ideation. Safe and direct questioning about self-harm and suicide is a key clinical skill in mental health assessment and does not increase risk.",
      },
      {
        id: "sc8q3",
        question: "What risk does the nurse explain regarding Marcus taking sertraline inconsistently?",
        options: [
          "He is at risk of serotonin syndrome",
          "Inconsistent dosing can cause renal impairment over time",
          "Stopping or taking it irregularly can destabilise his mood further",
          "Missing doses will cause immediate severe withdrawal effects",
        ],
        correct: 2,
        explanation: "The nurse correctly explains that taking antidepressants inconsistently or stopping them suddenly can worsen mood instability. SSRIs like sertraline require consistent daily dosing to maintain therapeutic levels and stable mood. Abrupt discontinuation can also cause discontinuation syndrome.",
      },
    ],
  },
  {
    id: "sc9",
    title: "Medical Briefing: Sepsis Protocol Activation",
    tag: "Soins intensifs",
    tagColor: "bg-yellow-100 text-yellow-700",
    type: "Briefing d'équipe",
    transcript: `[Senior nurse briefing the rapid response team]

"Team, thank you for attending so quickly. I've activated the sepsis protocol for Mr. Geoffrey Adler in Bay 2. He's 78, admitted three days ago with a urinary tract infection.

His observations at 14:45 were: temperature 38.9°C, heart rate 118 bpm and irregular, respiratory rate 26, blood pressure 88 over 52, and oxygen saturations 91 percent on room air. He has a GCS of 13 — he's confused and not orientating well to time. His NEWS score has reached 11, which triggered the rapid response call.

I've already started the first actions of the sepsis six. We've given him high-flow oxygen via non-rebreather mask and his sats have come up to 96 percent. Blood cultures — two sets from two different sites — were taken before I started the antibiotics. He's received the first dose of IV co-amoxiclav as per the trust protocol. I've inserted a urinary catheter and his urine is visibly dark and cloudy — I've sent a specimen for culture. His urine output in the last two hours has been only 15 ml.

I've taken bloods for FBC, U&Es, CRP, and lactate. We're waiting on the lactate result. A large-bore IV cannula is in situ in his right antecubital fossa and I've started a 500 ml crystalloid bolus.

He has a daughter — Mrs. Pearce — who is on her way in. She'll need to be updated when she arrives. I'll hand over formally to Dr. Kamara when he's ready."`,
    questions: [
      {
        id: "sc9q1",
        question: "Which of Mr. Adler's observations most directly indicates end-organ hypoperfusion?",
        options: [
          "Temperature of 38.9°C",
          "Heart rate of 118 bpm",
          "Urine output of only 15 ml over two hours",
          "Oxygen saturations of 91% on room air",
        ],
        correct: 2,
        explanation: "Oliguria (urine output <0.5 ml/kg/hr) is a direct sign of renal hypoperfusion and is one of the key indicators of organ dysfunction in sepsis. A urine output of only 15 ml over two hours in an adult is critically low and suggests significant haemodynamic compromise.",
      },
      {
        id: "sc9q2",
        question: "Why were blood cultures taken before administering antibiotics?",
        options: [
          "Antibiotics are more effective when given after cultures",
          "To identify the causative organism before antibiotics alter culture results",
          "Culture results determine the antibiotic dose",
          "It is a legal requirement before any IV medication",
        ],
        correct: 1,
        explanation: "Blood cultures must be obtained before antibiotics are given because antibiotics can kill or suppress the growth of bacteria, potentially resulting in false-negative culture results. Identifying the causative organism and its sensitivities enables targeted antibiotic therapy — a key principle of the Sepsis Six.",
      },
      {
        id: "sc9q3",
        question: "What is the clinical significance of ordering a serum lactate in this situation?",
        options: [
          "Lactate levels confirm the source of infection",
          "Elevated lactate indicates tissue hypoxia and poor tissue perfusion in sepsis",
          "Lactate is used to guide the choice of antibiotic",
          "A normal lactate rules out sepsis entirely",
        ],
        correct: 1,
        explanation: "Serum lactate is a marker of tissue hypoxia. Elevated lactate (>2 mmol/L) in the context of suspected infection indicates tissue hypoperfusion and is used to diagnose septic shock and guide the urgency of resuscitation. It is a key component of the sepsis workup.",
      },
    ],
  },
  {
    id: "sc10",
    title: "Patient Education: Diabetes Self-Management",
    tag: "Endocrinologie",
    tagColor: "bg-purple-100 text-purple-700",
    type: "Éducation au patient",
    transcript: `[Diabetic specialist nurse educating a newly diagnosed patient]

Nurse: "Welcome, Mrs. Beaumont. As we discussed with the doctor, you've been diagnosed with type 2 diabetes. My role today is to help you understand what that means and what you can do to manage it well. Is that alright?"

Patient: "Yes, though I have to be honest — I'm quite overwhelmed."

Nurse: "That's completely understandable. Let's take it step by step. The most important things to understand today are blood glucose monitoring, your new medication, and which warning signs to look out for. We can cover diet and exercise in a follow-up session.

So first — blood glucose monitoring. We've prescribed you a glucose meter, and we'd like you to check your blood sugar twice a day — before breakfast and before your evening meal. Your target range is 4 to 7 millimoles per litre before meals. If it's consistently above 10, please call the clinic.

Your new medication is metformin. You'll start at a low dose — 500 mg once daily with your main meal — to reduce the chance of stomach upset. After two weeks we'll increase it to twice daily. Metformin works by helping your body use insulin more effectively. It doesn't cause hypoglycaemia on its own, but it's still important to know the signs of low blood sugar in case you're ever prescribed additional medications.

Hypoglycaemia — or a low blood sugar — is usually below 4 mmol/L. Symptoms include shaking, sweating, feeling faint, confusion, or heart racing. If that happens, take 15 to 20 grams of fast-acting glucose — that's about 5 to 6 glucose tablets or a small glass of fruit juice. Then follow it with a longer-acting snack like a biscuit or piece of toast.

And lastly — your annual checks. Every year you'll need blood tests, a kidney function check, eye screening, and a foot check. These are really important for catching any complications early."`,
    questions: [
      {
        id: "sc10q1",
        question: "When should Mrs. Beaumont check her blood glucose, and what is her target range?",
        options: [
          "Once daily in the morning; target 6–9 mmol/L",
          "Before breakfast and before the evening meal; target 4–7 mmol/L",
          "After each meal; target below 10 mmol/L",
          "Only when she feels unwell; target below 7 mmol/L",
        ],
        correct: 1,
        explanation: "The nurse instructed Mrs. Beaumont to monitor her blood glucose twice daily — before breakfast and before the evening meal — with a target range of 4 to 7 mmol/L before meals. These are standard targets for type 2 diabetes management.",
      },
      {
        id: "sc10q2",
        question: "Why is metformin started at a low dose and increased gradually?",
        options: [
          "Because it takes time to reach a therapeutic blood level",
          "To monitor for hypoglycaemia before increasing the dose",
          "To reduce the risk of gastrointestinal side effects",
          "Because the kidneys need time to adjust to the medication",
        ],
        correct: 2,
        explanation: "Metformin commonly causes gastrointestinal side effects (nausea, diarrhoea, abdominal discomfort) when started, particularly at higher doses. A gradual dose titration — starting low and increasing after two weeks — significantly reduces these side effects and improves tolerability.",
      },
      {
        id: "sc10q3",
        question: "What is the correct first action if Mrs. Beaumont experiences hypoglycaemia symptoms?",
        options: [
          "Lie down and wait for the symptoms to pass",
          "Call 000 immediately",
          "Take 15–20 g of fast-acting glucose, then follow with a longer-acting snack",
          "Inject insulin to stabilise her blood sugar",
        ],
        correct: 2,
        explanation: "The standard 'Rule of 15' for treating hypoglycaemia is to take 15–20 g of fast-acting glucose (e.g., glucose tablets or fruit juice), then recheck blood sugar and follow up with a slower-release snack to prevent a secondary drop. Insulin would worsen hypoglycaemia. Metformin alone does not typically cause hypoglycaemia.",
      },
    ],
  },
];

/* ─── Score calculation ───────────────────────────────────────── */

function calcScore(correct: number, total: number): { grade: string; oet: string } {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  if (pct >= 90) return { grade: "A", oet: "≥ 400" };
  if (pct >= 70) return { grade: "B", oet: "350–399" };
  if (pct >= 50) return { grade: "C", oet: "300–349" };
  return { grade: "< C", oet: "< 300" };
}

const STORAGE_KEY = "oet_listening_completed";
const DATES_KEY   = "oet_listening_completed_dates"; // Record<id, "YYYY-MM-DD">
const TOTAL = SCENARIOS.length;

/* ─── Main page ───────────────────────────────────────────────── */

export default function ListeningClient() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { completed: string[]; answers: Record<string, Record<number, number>> };
        setCompleted(new Set(parsed.completed ?? []));
        setAnswers(parsed.answers ?? {});
      }
    } catch {}
    setHydrated(true);
  }, []);

  function persist(nextCompleted: Set<string>, nextAnswers: Record<string, Record<number, number>>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: [...nextCompleted], answers: nextAnswers }));
    } catch {}
  }

  function handleAnswer(scenarioId: string, qIndex: number, optionIndex: number) {
    const nextAnswers = {
      ...answers,
      [scenarioId]: { ...(answers[scenarioId] ?? {}), [qIndex]: optionIndex },
    };
    setAnswers(nextAnswers);
    const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
    const allAnswered = scenario.questions.every((_, i) => nextAnswers[scenarioId]?.[i] !== undefined);
    const nextCompleted = new Set(completed);
    if (allAnswered) {
      nextCompleted.add(scenarioId);
      try {
        const today = new Date().toISOString().slice(0, 10);
        const dates = JSON.parse(localStorage.getItem(DATES_KEY) ?? "{}") as Record<string, string>;
        dates[scenarioId] = today;
        localStorage.setItem(DATES_KEY, JSON.stringify(dates));
      } catch {}
    }
    setCompleted(nextCompleted);
    persist(nextCompleted, nextAnswers);
  }

  const completedCount = hydrated ? completed.size : 0;
  const allCorrect = SCENARIOS.reduce((sum, s) => {
    const sc = answers[s.id] ?? {};
    return sum + s.questions.filter((q, i) => sc[i] === q.correct).length;
  }, 0);
  const totalAnswered = SCENARIOS.reduce((sum, s) => sum + Object.keys(answers[s.id] ?? {}).length, 0);
  const scoreInfo = calcScore(allCorrect, totalAnswered);
  const active = SCENARIOS.find((s) => s.id === activeId) ?? null;

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
          <Link href="/progress" className="hover:text-[#0B1E4B] transition-colors">Progression</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Title + progress */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Compréhension orale</p>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-[#0B1E4B]">Listening OET</h1>
              <span className="text-sm font-semibold text-[#0B1E4B] flex-shrink-0">
                {completedCount} / {TOTAL} complétés
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / TOTAL) * 100}%` }}
              />
            </div>
            {hydrated && totalAnswered > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm text-gray-500">Score estimé :</span>
                <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${
                  scoreInfo.grade === "A" ? "bg-green-100 text-green-700" :
                  scoreInfo.grade === "B" ? "bg-[#00C2C7]/15 text-[#009DA1]" :
                  scoreInfo.grade === "C" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  Grade {scoreInfo.grade}
                </span>
                <span className="text-xs text-gray-400">OET {scoreInfo.oet} — {allCorrect}/{totalAnswered} correctes</span>
              </div>
            )}
          </div>

          {/* Instructions banner */}
          {!active && (
            <div className="mb-6 p-4 bg-[#00C2C7]/8 border border-[#00C2C7]/25 rounded-xl flex gap-3 items-start">
              <span className="text-lg mt-0.5">🎧</span>
              <p className="text-sm text-[#0B1E4B]/80 leading-relaxed">
                Écoutez chaque scénario clinique, puis répondez aux 3 questions <strong>sans relire le transcript</strong>. La transcription est révélée après avoir soumis vos réponses.
              </p>
            </div>
          )}

          {/* Scenario list */}
          {!active && (
            <div className="space-y-3">
              {SCENARIOS.map((s, idx) => {
                const isCompleted = hydrated && completed.has(s.id);
                const sc = answers[s.id] ?? {};
                const correct = s.questions.filter((q, i) => sc[i] === q.correct).length;
                const answeredCount = Object.keys(sc).length;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveId(s.id)}
                    className={`w-full text-left bg-white border rounded-2xl p-5 transition-all hover:shadow-md flex items-start gap-4 ${
                      isCompleted ? "border-green-200" : "border-gray-200 hover:border-[#00C2C7]/40"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted ? "bg-green-100 text-green-600" : "bg-[#0B1E4B]/8 text-[#0B1E4B]"
                    }`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.tagColor}`}>{s.tag}</span>
                        <span className="text-xs text-gray-400">{s.type}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">🎧 audio</span>
                      </div>
                      <p className="font-semibold text-[#0B1E4B] text-sm leading-snug">{s.title}</p>
                      {hydrated && answeredCount > 0 && !isCompleted && (
                        <p className="text-xs text-gray-400 mt-1">{answeredCount}/3 questions répondues</p>
                      )}
                      {isCompleted && (
                        <p className="text-xs text-green-600 font-medium mt-1">{correct}/3 correctes</p>
                      )}
                    </div>
                    <svg className="flex-shrink-0 w-4 h-4 text-gray-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}

          {/* Active scenario */}
          {active && (
            <ScenarioView
              scenario={active}
              savedAnswers={answers[active.id] ?? {}}
              onAnswer={(qi, oi) => handleAnswer(active.id, qi, oi)}
              onBack={() => setActiveId(null)}
            />
          )}

          {/* Footer nav */}
          {!active && (
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/reading"
                className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                ← Reading OET
              </Link>
              <Link
                href="/mock-exam"
                className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                Examen blanc →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── Audio player ────────────────────────────────────────────── */

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => { setDuration(el.duration); setLoaded(true); };
    const onTime   = () => setCurrentTime(el.currentTime);
    const onEnded  = () => setPlaying(false);
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [src]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrentTime(t);
  }

  function fmt(s: number) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  return (
    <div className="bg-[#0B1E4B] rounded-2xl p-5">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        {/* Play/pause */}
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Lire"}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00C2C7] hover:bg-[#009DA1] flex items-center justify-center transition-colors"
        >
          {playing ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress bar + time */}
        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={seek}
            disabled={!loaded}
            className="w-full h-1.5 rounded-full accent-[#00C2C7] cursor-pointer disabled:opacity-40"
          />
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>{fmt(currentTime)}</span>
            <span>{loaded ? fmt(duration) : "—"}</span>
          </div>
        </div>
      </div>

      <p className="text-white/50 text-xs mt-3 text-center">
        Audio generated for training purposes.
      </p>
    </div>
  );
}

/* ─── Scenario view ───────────────────────────────────────────── */

function ScenarioView({
  scenario,
  savedAnswers,
  onAnswer,
  onBack,
}: {
  scenario: Scenario;
  savedAnswers: Record<number, number>;
  onAnswer: (qIndex: number, optionIndex: number) => void;
  onBack: () => void;
}) {
  // Local answer state so we can control submit timing
  const [pending, setPending] = useState<Record<number, number>>(savedAnswers);
  const [submitted, setSubmitted] = useState(
    scenario.questions.every((_, i) => savedAnswers[i] !== undefined)
  );
  const [showTranscript, setShowTranscript] = useState(false);

  const allPending = scenario.questions.every((_, i) => pending[i] !== undefined);
  const correctCount = scenario.questions.filter((q, i) => pending[i] === q.correct).length;

  function pick(qi: number, oi: number) {
    if (submitted) return;
    setPending((p) => ({ ...p, [qi]: oi }));
  }

  function submit() {
    // Persist each answer
    scenario.questions.forEach((_, qi) => {
      if (pending[qi] !== undefined) onAnswer(qi, pending[qi]);
    });
    setSubmitted(true);
  }

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B1E4B] transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </button>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scenario.tagColor}`}>{scenario.tag}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{scenario.type}</span>
        </div>
        <h2 className="text-xl font-bold text-[#0B1E4B]">{scenario.title}</h2>
      </div>

      {/* Audio player */}
      <div className="mb-6">
        <AudioPlayer src={`/audio/${scenario.id}.m4a`} />
      </div>

      {/* Questions */}
      <div className="space-y-5 mb-6">
        {scenario.questions.map((q, qi) => {
          const selected = pending[qi];
          const isAnswered = submitted && selected !== undefined;
          const isCorrect = selected === q.correct;

          return (
            <div key={q.id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-semibold text-[#0B1E4B] mb-4 leading-snug">
                <span className="text-[#00C2C7] mr-2">Q{qi + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2.5">
                {q.options.map((opt, oi) => {
                  let style = "border-gray-200 text-gray-700 hover:border-[#0B1E4B]/30 hover:bg-gray-50";
                  if (!submitted && selected === oi) style = "border-[#0B1E4B] bg-[#0B1E4B]/5 text-[#0B1E4B]";
                  if (isAnswered) {
                    if (oi === q.correct) style = "border-green-400 bg-green-50 text-green-800";
                    else if (oi === selected) style = "border-red-300 bg-red-50 text-red-700";
                    else style = "border-gray-100 text-gray-400";
                  }

                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => pick(qi, oi)}
                      className={`w-full text-left border rounded-xl px-4 py-3 text-sm transition-all flex items-start gap-3 ${style} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 text-xs font-bold ${
                        isAnswered && oi === q.correct ? "border-green-500 bg-green-500 text-white" :
                        isAnswered && oi === selected ? "border-red-400 bg-red-400 text-white" :
                        !submitted && selected === oi ? "border-[#0B1E4B] bg-[#0B1E4B] text-white" :
                        "border-gray-300"
                      }`}>
                        {isAnswered && oi === q.correct ? "✓" :
                         isAnswered && oi === selected ? "✗" :
                         String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed ${
                  isCorrect ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"
                }`}>
                  <span className="font-semibold mr-1">{isCorrect ? "Correct !" : "Incorrect."}</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={submit}
          disabled={!allPending}
          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all ${
            allPending
              ? "bg-[#0B1E4B] hover:bg-[#0B1E4B]/90 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {allPending ? "Valider mes réponses" : `Répondez aux ${scenario.questions.length} questions pour valider`}
        </button>
      )}

      {/* Result card + transcript reveal */}
      {submitted && (
        <div className="mt-2 space-y-4">
          <div className="p-5 bg-[#0B1E4B] rounded-2xl text-center">
            <p className="text-white/70 text-sm mb-1">Résultat</p>
            <p className="text-3xl font-bold text-[#00C2C7]">{correctCount} / {scenario.questions.length}</p>
            <p className="text-white/60 text-sm mt-1">
              {correctCount === 3 ? "Parfait — excellent travail !" :
               correctCount === 2 ? "Bon résultat — continuez !" :
               "À retravailler — relisez le transcript."}
            </p>
          </div>

          {/* Transcript reveal */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowTranscript((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-[#0B1E4B] hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>📄</span> Voir la transcription
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showTranscript ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showTranscript && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="pt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono">
                  {scenario.transcript}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onBack}
            className="w-full bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Scénario suivant →
          </button>
        </div>
      )}
    </div>
  );
}
