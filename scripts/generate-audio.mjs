/**
 * Generate M4A audio files for all OET Listening scenarios.
 * Uses macOS `say` + `afconvert` — no external dependencies.
 *
 * Run: node scripts/generate-audio.mjs
 */

import { execSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "audio");
mkdirSync(OUT_DIR, { recursive: true });

// Voices: Daniel (en_GB) for narration — clear, clinical British accent suits OET
const VOICE = "Daniel";
const RATE = 175; // words per minute — slightly slower than default for clarity

const SCENARIOS = [
  {
    id: "sc1",
    transcript: `Good morning. I'm handing over Mr. Raymond Walsh, 72, in Bed 4. He's on day two post CABG — coronary artery bypass graft. Overnight he was haemodynamically stable. His blood pressure has been ranging between 118 over 70 and 132 over 82, and his heart rate has stayed between 64 and 72 — sinus rhythm on the monitor throughout.

He had one episode of mild hypotension at around 2 a.m. — blood pressure dropped to 96 over 58. I administered a 250 millilitre normal saline bolus as per the protocol, and his blood pressure came back up to 112 over 74 within twenty minutes. I notified the registrar at the time, who reviewed him and was satisfied.

His urine output has been adequate — around 45 to 50 millilitres per hour. His drain output is 30 millilitres over the past eight hours, which is within normal limits. His chest drain is still in situ and draining serosanguinous fluid.

He's on oxygen at 2 litres per minute via nasal prongs, and his sats are sitting at 97 to 98 percent. He had his 6 a.m. medications including metoprolol, aspirin, and his statin. He's been nil by mouth since midnight in case he needs a procedure today, but that's pending the surgical team's review.

He's comfortable and reported his pain as 3 out of 10 this morning. His family have been contacted and are expected to visit this afternoon.`,
  },
  {
    id: "sc2",
    transcript: `Hello, Mr. Patel. I'm Sarah, one of the nurses here. Can you tell me what's brought you in today?

I've been having this chest pain since about midday. It started when I was walking to the shops — it was quite crushing, kind of tight. I had to stop and sit down.

And where exactly is the pain? Can you point to it?

Right here in the middle of my chest. And it went up into my jaw and down my left arm. That's when I got really scared.

I understand. On a scale of 0 to 10, how would you rate the pain now?

It's about a 6. It was a 9 when it first started but it's eased off a bit. I took an aspirin at home — my wife told me to.

Good, that was the right thing to do. Are you sweating at all, or feeling sick?

Yes, I was sweating a lot when it started. I feel a bit nauseous still.

OK. Do you have any history of heart problems? Any previous chest pain like this?

I had a stent put in my left coronary about four years ago. I'm on clopidogrel and a statin. I've never had pain quite like this before though.

Thank you, Mr. Patel. I'm going to get a 12-lead E-C-G done straight away and take some blood, including troponin levels. The doctor will be with you very shortly.`,
  },
  {
    id: "sc3",
    transcript: `Good morning, everyone. This is Mrs. Evelyn Tran, 81, in Bed 7. She was admitted three days ago with acute decompensated heart failure. She's on a fluid restriction of 1,200 millilitres per 24 hours and is receiving intravenous furosemide 40 milligrams twice daily.

Over the past 48 hours she's had a net negative fluid balance of approximately 1.4 litres, which is encouraging. However, this morning her sodium came back at 129 — so she's hyponatraemic. Her potassium is 3.2, which is borderline low. We're monitoring her renal function as her creatinine has risen from 92 on admission to 118 this morning.

On assessment she's alert and oriented, but she does report mild dizziness on standing. Her blood pressure lying down is 108 over 64 and on standing it drops to 88 over 52, so there's significant postural hypotension. Her chest is clearer than admission — we can still hear some fine bibasal crackles but they've reduced. Her oxygen saturations are 94 percent on 2 litres of oxygen, up from 88 percent on admission.

Her weight this morning is 68.4 kilograms — she was 71.2 kilograms on admission. She's mobilising with a frame but needs supervision due to the dizziness. I've held her morning dose of furosemide pending the team's review given the electrolyte findings.`,
  },
  {
    id: "sc4",
    transcript: `Good afternoon, respiratory clinic. This is James speaking.

Hello. My name is Dorothy Clarke. I was seen at your clinic last week and I was started on a new inhaler — the purple one. I just wanted to check if I'm using it correctly because I don't think it's helping.

Of course, Mrs. Clarke. That would be the Symbicort — the combined preventer and reliever. Can you describe how you're using it?

I shake it, then I breathe in and press the button at the same time and breathe in quickly.

That's actually a good technique for a pressurised inhaler, but the Symbicort is a dry powder inhaler — a Turbohaler. You don't shake it, and you need to breathe in quite forcefully and deeply, not quickly. The powder only releases when you inhale strongly.

Oh, I didn't know that. And I've only been using it when I feel breathless.

That's another important point. The Symbicort is a preventer inhaler — it needs to be taken regularly every day, morning and evening, even when you feel well. Are you also using a blue reliever inhaler?

Yes, I have a blue Ventolin. I've been using that about four times a day.

Using your reliever four times a day suggests your asthma isn't well controlled at the moment, especially since you've been using the preventer incorrectly. I'd like to arrange for you to come in so our asthma nurse specialist can demonstrate the Turbohaler technique properly. Is that something you'd be able to do?

Yes, that would be very helpful, thank you.`,
  },
  {
    id: "sc5",
    transcript: `Mr. Fontaine, before you go home today I want to go through some important information about your recovery after your hip replacement. Please feel free to stop me if anything is unclear.

First, the hip precautions. For the next six weeks, there are three movements you must avoid to prevent the risk of dislocating your new hip. Do not bend your hip more than 90 degrees — so no bending forward to pick things up from the floor. Do not cross your legs or ankles. And do not rotate your foot inward. These restrictions apply whether you're sitting, lying down, or moving around.

For mobility, you'll be going home with a walking frame. You should use it every time you walk, even short distances around the house, until your physiotherapist clears you to move on to a stick or walk unaided. Remember to take it step by step with the stairs — leading with your stronger leg going up, and the operated leg going down. If in doubt: good leg to heaven, bad leg to hell.

Regarding wound care, your wound has staples which will be removed by your community nurse at 12 to 14 days post-operatively. Keep the area dry and covered until then — no baths or swimming. Shower with the dressing protected. If you notice increasing redness, warmth, discharge, or if you develop a fever above 38 degrees, contact us or go to your nearest emergency department.

Your pain medications are in this bag — regular paracetamol four times daily and ibuprofen with meals twice daily. You also have a blister pack of rivaroxaban — that's a blood thinner to reduce the risk of clots. You must take one tablet daily for 35 days. Do not miss doses.

Your follow-up appointment with the orthopaedic surgeon is in six weeks. Your physio outpatient appointment letter will arrive in the post within the next week.`,
  },
  {
    id: "sc6",
    transcript: `Hi Claire, I'm handing over Liam Chen, aged 6, in Room 3. He was admitted yesterday evening with an acute asthma exacerbation. He's had a rough afternoon and I want to flag some concerns.

At 2 p.m. his respiratory rate was 28 and his oxygen saturations were 95 percent on 2 litres of oxygen via nasal prongs. He was wheezy on auscultation, predominantly in the lower zones. He was given his regular nebulised salbutamol as prescribed.

However, at 4:30 his respiratory rate had increased to 36, his sats had dropped to 91 percent, and he was visibly using his accessory muscles — I could see intercostal and subcostal recession. He was also more anxious and restless. I escalated to the paediatric registrar immediately. He reviewed Liam and prescribed back-to-back salbutamol nebs every 20 minutes, started ipratropium bromide alongside it, and added intravenous hydrocortisone.

His latest sats at 5 p.m. are 94 percent on 4 litres of oxygen. His respiratory rate is now 30. He's still wheezy but slightly improved. He's been moved onto a non-rebreather mask. His mum, Mrs. Chen, is at the bedside — she's very anxious. Please keep her updated.

P-E-W-S score at last check was 6. Please reassess in 30 minutes and call the registrar if it rises above 7 or if sats drop below 92 percent again. He's nil by mouth pending the team's review.`,
  },
  {
    id: "sc7",
    transcript: `Good morning, Mrs. Okonkwo. I'm Diane, the perioperative nurse who'll be looking after you before your operation today. I just need to go through a few checks with you. Is that alright?

Yes, of course.

Can you confirm your full name and date of birth for me?

Susan Okonkwo, 14th of March 1958.

Thank you. And can you tell me what procedure you're having today?

I'm having my gallbladder out. A laparoscopic cholecystectomy.

That's right. And have you signed your consent form?

Yes, I signed it yesterday when I saw the surgeon. He explained about the risks — bleeding, infection, and that there's a small chance they might need to convert to open surgery.

Correct. Now, when did you last eat or drink anything?

I had a cup of water at 6 this morning. Nothing else since midnight.

Good. Six hours fasting for solids and two hours for clear fluids is our standard. A cup of water at 6 a.m. is within the guideline as your procedure isn't until 10 a.m. Do you have any allergies I should be aware of?

Yes — I'm allergic to penicillin. I come out in a rash.

Very important, thank you. That will be highlighted on your wristband and flagged in your notes and to the anaesthetist. Have you removed all jewellery, nail polish, and contact lenses?

Yes, I took everything off. I'm wearing my wedding ring but it's taped.

That's fine as long as it's taped. And your next of kin, are they aware you're having surgery today?

Yes, my daughter is waiting in the family room. She'll take me home afterwards.

Perfect. We'll keep her updated throughout. Is there anything you're worried about, Mrs. Okonkwo?

Just a bit nervous about the anaesthetic. I felt very sick after my last operation years ago.

That's very helpful to know. I'll make sure the anaesthetist is aware so they can use anti-emetics preventively. You're in good hands.`,
  },
  {
    id: "sc8",
    transcript: `Thank you for letting me come in today, Marcus. How have things been since we last spoke?

Not great, honestly. I've been struggling to get out of bed most mornings. Some days I don't eat until the evening.

I'm sorry to hear that. Can you tell me more about your sleep — are you getting any?

I fall asleep okay but I wake up around 3 or 4 a.m. and can't get back to sleep. Then I feel exhausted all day but can't nap either.

And your mood — how would you describe it on most days?

Pretty low. Some days it's okay, maybe a 4 or 5 out of 10. But there are days where it's a 1 or 2. I don't see the point in much.

When you say you don't see the point — I want to ask you directly, Marcus. Have you had any thoughts of harming yourself or ending your life?

I've had thoughts about not wanting to be here. But I haven't made any plans or anything.

Thank you for being honest with me. Those thoughts are important to take seriously. Have you been taking your sertraline?

On and off. I forget sometimes. And I read online it can cause weight gain so I've been scared to take it.

I understand that concern. Let's talk about that because sertraline is quite unlikely to cause weight gain at your dose, and stopping it suddenly — or taking it inconsistently — can actually make your mood more unstable. It works best when taken every day.

I didn't know that.

That's okay — it's important we clarify these things. I'm also going to let your care coordinator know about the thoughts you mentioned today, and I'll arrange for the psychiatrist to call you this week. Is that alright with you?

Yes, that's fine.`,
  },
  {
    id: "sc9",
    transcript: `Team, thank you for attending so quickly. I've activated the sepsis protocol for Mr. Geoffrey Adler in Bay 2. He's 78, admitted three days ago with a urinary tract infection.

His observations at 14:45 were: temperature 38.9 degrees, heart rate 118 beats per minute and irregular, respiratory rate 26, blood pressure 88 over 52, and oxygen saturations 91 percent on room air. He has a Glasgow Coma Scale of 13 — he's confused and not orientating well to time. His National Early Warning Score has reached 11, which triggered the rapid response call.

I've already started the first actions of the sepsis six. We've given him high-flow oxygen via non-rebreather mask and his sats have come up to 96 percent. Blood cultures — two sets from two different sites — were taken before I started the antibiotics. He's received the first dose of intravenous co-amoxiclav as per the trust protocol. I've inserted a urinary catheter and his urine is visibly dark and cloudy — I've sent a specimen for culture. His urine output in the last two hours has been only 15 millilitres.

I've taken bloods for full blood count, urea and electrolytes, C-R-P, and lactate. We're waiting on the lactate result. A large-bore intravenous cannula is in situ in his right antecubital fossa and I've started a 500 millilitre crystalloid bolus.

He has a daughter — Mrs. Pearce — who is on her way in. She'll need to be updated when she arrives. I'll hand over formally to Dr. Kamara when he's ready.`,
  },
  {
    id: "sc10",
    transcript: `Welcome, Mrs. Beaumont. As we discussed with the doctor, you've been diagnosed with type 2 diabetes. My role today is to help you understand what that means and what you can do to manage it well. Is that alright?

Yes, though I have to be honest — I'm quite overwhelmed.

That's completely understandable. Let's take it step by step. The most important things to understand today are blood glucose monitoring, your new medication, and which warning signs to look out for. We can cover diet and exercise in a follow-up session.

So first — blood glucose monitoring. We've prescribed you a glucose meter, and we'd like you to check your blood sugar twice a day — before breakfast and before your evening meal. Your target range is 4 to 7 millimoles per litre before meals. If it's consistently above 10, please call the clinic.

Your new medication is metformin. You'll start at a low dose — 500 milligrams once daily with your main meal — to reduce the chance of stomach upset. After two weeks we'll increase it to twice daily. Metformin works by helping your body use insulin more effectively. It doesn't cause hypoglycaemia on its own, but it's still important to know the signs of low blood sugar in case you're ever prescribed additional medications.

Hypoglycaemia — or a low blood sugar — is usually below 4 millimoles per litre. Symptoms include shaking, sweating, feeling faint, confusion, or heart racing. If that happens, take 15 to 20 grams of fast-acting glucose — that's about 5 to 6 glucose tablets or a small glass of fruit juice. Then follow it with a longer-acting snack like a biscuit or piece of toast.

And lastly — your annual checks. Every year you'll need blood tests, a kidney function check, eye screening, and a foot check. These are really important for catching any complications early.`,
  },
];

console.log(`Generating ${SCENARIOS.length} audio files with voice "${VOICE}" at ${RATE} wpm...\n`);

for (const s of SCENARIOS) {
  const aiff = `/tmp/oet_${s.id}.aiff`;
  const out  = join(OUT_DIR, `${s.id}.m4a`);

  // Write transcript to temp text file to avoid shell quoting issues
  const txtFile = `/tmp/oet_${s.id}.txt`;
  writeFileSync(txtFile, s.transcript, "utf8");

  process.stdout.write(`  ${s.id} → generating AIFF...`);
  execSync(`say -v "${VOICE}" -r ${RATE} -f "${txtFile}" -o "${aiff}"`, { stdio: "ignore" });

  process.stdout.write(` converting to M4A...`);
  execSync(`afconvert "${aiff}" "${out}" -d aac -f m4af`, { stdio: "ignore" });

  const stat = execSync(`ls -lh "${out}"`).toString().trim().split(/\s+/)[4];
  console.log(` done (${stat})`);
}

console.log(`\n✓ All audio files written to public/audio/`);
