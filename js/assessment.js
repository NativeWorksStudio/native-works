import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ── FIREBASE CONFIGURATION BLOCK ───────────────────────────────────────────
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "PLACEHOLDER_AUTH_DOMAIN",
  projectId: "PLACEHOLDER_PROJECT_ID",
  storageBucket: "PLACEHOLDER_STORAGE_BUCKET",
  messagingSenderId: "PLACEHOLDER_MESSAGING_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID",
  measurementId: "PLACEHOLDER_MEASUREMENT_ID"
};

const firebaseReady = !Object.values(firebaseConfig).some(v => v.startsWith('PLACEHOLDER'));

let db = null;
if (firebaseReady) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firebase initialization failed:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  // Remove native 'required' attribute from radio/checkbox inputs to manage them with custom validation
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.removeAttribute('required');
  });

  let currentStep = 1;
  const totalSteps = 5;
  const selectedTrack = 'creator';

  // DOM references
  const stepCountText = document.getElementById('step-count');
  const stepLabelText = document.getElementById('step-label');
  const progressBar   = document.getElementById('progress-line');
  const progressWrapper = document.querySelector('.assessment-progress-wrapper');

  const steps = {
    1: document.getElementById('step-1'),
    2: document.getElementById('step-2'),
    3: document.getElementById('step-3'),
    4: document.getElementById('step-4'),
    5: document.getElementById('step-5')
  };

  const btnNext   = document.getElementById('btn-next');
  const btnBack   = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');

  const lang = document.documentElement.lang || 'en';
  const TRANSLATIONS = {
    en: {
      stepNames: {
        1: 'Why Now',
        2: 'Audience & Scale',
        3: 'Friction & Automation',
        4: 'Independence & AI',
        5: 'Looking Ahead'
      },
      errorAllQuestions: 'Please answer all questions to proceed.',
      errorAllFields: 'Please fill in your name, channel name and email to continue.',
      finalStep: 'Final Step →',
      nextStep: 'Next Step →'
    },
    da: {
      stepNames: {
        1: 'Hvorfor nu',
        2: 'Publikum & Skala',
        3: 'Friktion & Automatisering',
        4: 'Uafhængighed & AI',
        5: 'Fremtiden'
      },
      errorAllQuestions: 'Besvar venligst alle spørgsmål for at fortsætte.',
      errorAllFields: 'Udfyld venligst dit navn, kanalnavn og e-mail for at fortsætte.',
      finalStep: 'Sidste Trin →',
      nextStep: 'Næste Trin →'
    },
    it: {
      stepNames: {
        1: 'Perché Ora',
        2: 'Pubblico & Scala',
        3: 'Attrito & Automazione',
        4: 'Indipendenza & IA',
        5: 'Sguardo al Futuro'
      },
      errorAllQuestions: 'Rispondi a tutte le domande per procedere.',
      errorAllFields: 'Inserisci il tuo nome, nome del canale ed email per continuare.',
      finalStep: 'Ultimo Passaggio →',
      nextStep: 'Passaggio Successivo →'
    }
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const stepNames = t.stepNames;

  /* ── CARD INTERACTION (Wizard Radios & Checkboxes) ──────────────── */

  document.querySelectorAll('.option-card').forEach(card => {
    const input = card.querySelector('input[type="radio"], input[type="checkbox"]');
    if (!input) return;

    if (input.checked) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    }

    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));

    card.addEventListener('click', (e) => {
      if (e.target !== input) return;

      const isCheckbox = input.type === 'checkbox';

      if (isCheckbox) {
        card.classList.toggle('selected', input.checked);
        card.setAttribute('aria-checked', input.checked ? 'true' : 'false');
      } else {
        // Deselect siblings in the same group
        const groupName = input.getAttribute('name');
        document.querySelectorAll(`.option-card input[name="${groupName}"]`).forEach(sib => {
          const sibCard = sib.closest('.option-card');
          if (sibCard) {
            sibCard.classList.remove('selected');
            sibCard.setAttribute('aria-checked', 'false');
          }
        });

        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
      }

      document.body.classList.add('cursor-hover');
      setTimeout(() => document.body.classList.remove('cursor-hover'), 200);

      // Validate step silently on input selection
      validateCurrentStep(false);
    });

    input.addEventListener('focus', () => card.classList.add('focus-within'));
    input.addEventListener('blur',  () => card.classList.remove('focus-within'));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
  });

  /* ── STEP VALIDATION ────────────────────────────────────────────── */

  function validateCurrentStep(showAlert = true) {
    if (currentStep > totalSteps) return true;

    const stepEl = steps[currentStep];

    // Validate active radio groups inside current step
    let allGroupsChecked = true;
    const groupNames = new Set();
    
    // Find radio and checkbox groups on this step
    stepEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r => {
      if (r.name) groupNames.add(r.name);
    });

    groupNames.forEach(name => {
      // Checkboxes don't strictly require selection unless design dictates it, but radios do
      const inputSample = stepEl.querySelector(`input[name="${name}"]`);
      if (inputSample && inputSample.type === 'radio') {
        if (!stepEl.querySelector(`input[name="${name}"]:checked`)) {
          allGroupsChecked = false;
        }
      }
    });

    // On Step 5 (Contact & Vision), validate required text / email fields and checkboxes
    let allTextFilled = true;
    if (currentStep === totalSteps) {
      const q9Checked = stepEl.querySelector('input[name="creator_q9"]:checked');
      const q10Checked = stepEl.querySelector('input[name="creator_q10"]:checked');
      if (!q9Checked || !q10Checked) {
        allGroupsChecked = false;
      }

      stepEl.querySelectorAll('input[type="text"][required], input[type="email"][required]').forEach(input => {
        if (!input.value.trim()) {
          allTextFilled = false;
          if (showAlert) {
            input.style.borderColor = 'var(--true-north)';
            input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
          }
        }
      });
    }

    if (!allGroupsChecked || !allTextFilled) {
      if (showAlert) {
        const msg = !allGroupsChecked 
          ? t.errorAllQuestions 
          : t.errorAllFields;
        showErrorMessage(stepEl, msg);

        stepEl.querySelectorAll('.options-grid').forEach(grid => {
          grid.style.animation = 'none';
          void grid.offsetWidth;
          grid.style.animation = 'shake 0.4s ease';
        });
      }
      return false;
    }

    clearErrorMessage(stepEl);
    return true;
  }

  function showErrorMessage(stepEl, message) {
    let errorMsg = stepEl.querySelector('.wizard-error-msg');
    if (!errorMsg) {
      errorMsg = document.createElement('p');
      errorMsg.className = 'wizard-error-msg';
      errorMsg.style.cssText = 'color:var(--true-north);font-size:12px;margin-top:16px;text-align:center;letter-spacing:1px;text-transform:uppercase;';
      stepEl.querySelector('.wizard-step-header')?.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  function clearErrorMessage(stepEl) {
    stepEl.querySelector('.wizard-error-msg')?.remove();
  }

  /* ── WIZARD NAVIGATION & UI UPDATES ─────────────────────────────── */

  function updateWizardUI() {
    Object.keys(steps).forEach(num => {
      const el = steps[num];
      const active = parseInt(num) === currentStep;
      el.classList.toggle('active', active);
      if (active) {
        const title = el.querySelector('.wizard-step-title');
        if (title) { 
          title.setAttribute('tabindex', '-1'); 
          title.focus(); 
          if (progressWrapper) {
            title.after(progressWrapper);
          }
        }
      }
    });

    stepCountText.textContent = `0${currentStep} / 0${totalSteps}`;
    stepLabelText.textContent = stepNames[currentStep];
    progressBar.style.width  = `${(currentStep / totalSteps) * 100}%`;

    btnBack.classList.toggle('wizard-btn-hidden', currentStep === 1);

    if (currentStep < totalSteps) {
      btnNext.textContent = currentStep === totalSteps - 1 ? t.finalStep : t.nextStep;
      btnNext.classList.remove('wizard-btn-hidden');
      btnSubmit.classList.add('wizard-btn-hidden');
    } else {
      calculateRouting();
      btnNext.classList.add('wizard-btn-hidden');
      btnSubmit.classList.remove('wizard-btn-hidden');
    }

    document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  btnNext.addEventListener('click', () => {
    if (validateCurrentStep(true)) {
      currentStep++;
      updateWizardUI();
    }
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateWizardUI();
    }
  });

  /* ── ROUTING & SCORING LOGIC ────────────────────────────────────── */

  const radioVal = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';

  const checkboxValues = name => {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
      .map(cb => cb.value);
  };

  const creatorLabels = {
    q1:  { A: "A platform did something that scared me", B: "I'm growing and feel dependency tightening", C: "I want to take ownership before something happens", D: "I'm curious — explore owned setups" },
    q2:  { A: "Reach dropped suddenly without explanation", B: "A platform changed rules, cuts, or policies", C: "Someone I follow lost their account and business", D: "Nothing specific — timing feels right" },
    q3:  { A: "Under 5,000", B: "5,000 to 50,000", C: "50,000 to 500,000", D: "Over 500,000" },
    q4:  { A: "Platform ad revenue / payouts", B: "Brand deals / sponsorships", C: "Direct audience support (memberships/subs)", D: "Products / services sold directly" },
    q5:  { A: "My account itself — one strike and over", B: "My reach — algorithm decides if I exist", C: "My audience contact — don't own relationship", D: "My payments and payouts — platform processors" },
    q6:  { A: "Give me back time to make better work", B: "Help me stay consistent without burning out", C: "Reply to DMs and comments automatically", D: "Run operational layer of business" },
    q7:  { A: "Almost nothing — audience lives there", B: "Subscriber emails, if collected", C: "Most of it — backups and direct channels", D: "Everything — platform is one channel among many" },
    q8:  { A: "Public AI is fine", B: "Dedicated hosting (VPS)", C: "Fully mine — data & AI on hardware I control" },
    q9:  { A: "Less anxious about platform dependence", B: "Earning more directly", C: "Running own publishing and payment infrastructure", D: "Fully independent — audience, keys, rules" },
    q10: { A: "Email is fine", B: "A short call to start", C: "A video meeting", D: "In person" }
  };

  function calculateRouting() {
    document.getElementById('payload-track').value = "CREATOR";

    const q1  = radioVal('creator_q1');
    const q2  = radioVal('creator_q2');
    const q3  = radioVal('creator_q3');
    const q4  = radioVal('creator_q4');
    const q5  = radioVal('creator_q5');
    const q6Keys = checkboxValues('creator_q6');
    const q7  = radioVal('creator_q7');
    const q8  = radioVal('creator_q8');
    const q9Keys = checkboxValues('creator_q9');
    const q10 = radioVal('creator_q10');

    // Populate hidden answers payload
    document.getElementById('payload-q1').value  = creatorLabels.q1[q1]   || q1;
    document.getElementById('payload-q2').value  = creatorLabels.q2[q2]   || q2;
    document.getElementById('payload-q3').value  = creatorLabels.q3[q3]   || q3;
    document.getElementById('payload-q4').value  = creatorLabels.q4[q4]   || q4;
    document.getElementById('payload-q5').value  = creatorLabels.q5[q5]   || q5;
    document.getElementById('payload-q6').value  = q6Keys.map(k => creatorLabels.q6[k] || k).join(', ');
    document.getElementById('payload-q7').value  = creatorLabels.q7[q7]   || q7;
    document.getElementById('payload-q8').value  = creatorLabels.q8[q8]   || q8;
    document.getElementById('payload-q9').value  = q9Keys.map(k => creatorLabels.q9[k] || k).join(', ');
    document.getElementById('payload-q10').value = creatorLabels.q10[q10] || q10;

    // ── CREATOR SCORING VECTORS ──
    const scores = {};

    // 1. Urgency (inputs: Q1, Q2, Q5)
    let uScore = 0;
    if (q1 === 'A') uScore += 2; else if (q1 === 'B' || q1 === 'C') uScore += 1;
    if (q2 === 'A' || q2 === 'B') uScore += 2; else if (q2 === 'C') uScore += 1;
    if (q5 === 'A' || q5 === 'B') uScore += 1;
    scores.urgency = Math.min(4, Math.max(0, uScore));

    // 2. Sophistication (inputs: Q8)
    let sScore = 0;
    if (q8 === 'C') sScore += 3; else if (q8 === 'B') sScore += 2;
    scores.sophistication = Math.min(4, Math.max(0, sScore));

    // 3. Sovereignty (inputs: Q7, Q8, Q9)
    let sovScore = 0;
    if (q7 === 'D') sovScore += 2; else if (q7 === 'C') sovScore += 1;
    if (q8 === 'C') sovScore += 2; else if (q8 === 'B') sovScore += 1; else if (q8 === 'A') sovScore -= 1;
    if (q9Keys.includes('D')) sovScore += 2; else if (q9Keys.includes('C')) sovScore += 1;
    scores.sovereignty = Math.min(4, Math.max(0, sovScore));

    // 4. Automation (inputs: Q6)
    let aScore = 0;
    if (q6Keys.includes('C') || q6Keys.includes('D')) aScore += 2;
    if (q6Keys.includes('A')) aScore += 1;
    if (q6Keys.includes('B')) aScore += 1;
    scores.automation = Math.min(4, Math.max(0, aScore));

    // 5. Earning (inputs: Q3, Q4)
    let eScore = 0;
    if (q3 === 'D') eScore += 3; else if (q3 === 'C') eScore += 2; else if (q3 === 'B') eScore += 1;
    if (q4 === 'D' || q4 === 'C') eScore += 1;
    scores.earning = Math.min(4, Math.max(0, eScore));

    // ── CREATOR RECOMMENDATION MAPPING ──
    let recProduct = '';
    let recPosture = '';

    if (scores.sovereignty >= 3 && scores.sophistication >= 2 && scores.earning >= 3) {
      recProduct = 'Stack + Chain';
      recPosture = 'Peer-to-peer pitch. They\'re already sovereign-fluent.';
    } else if (scores.sovereignty >= 3 && scores.sophistication <= 1 && scores.earning >= 2) {
      recProduct = 'Publisher + Sovereign Ready';
      recPosture = 'Guided onboarding. Lead with the platform-fear answer.';
    } else if (scores.sovereignty >= 3 && scores.earning <= 1) {
      recProduct = 'Publisher';
      recPosture = 'Affordable entry. Establish the relationship.';
    } else if (scores.automation >= 3 && scores.earning >= 2) {
      recProduct = 'Publisher + Agent';
      recPosture = 'Lead with automation. Sovereignty as the "and by the way."';
    } else if (scores.urgency === 4 && scores.earning >= 2) {
      recProduct = 'Publisher (stops the bleeding)';
      recPosture = 'They\'re scared. The product is whatever stops the platform bleeding fastest.';
    } else if (q4 === 'D' && scores.earning >= 3) {
      recProduct = 'Till + Stack + Publisher';
      recPosture = 'They already sell. Add sovereign payments and identity, then graduate.';
    } else if (q4 === 'C' && scores.sovereignty >= 3) {
      recProduct = 'Publisher + Stack';
      recPosture = 'The classic creator-to-sovereign migration. High conversion.';
    } else if (q3 === 'D' && scores.sophistication >= 2) {
      recProduct = 'Empire (creator edition)';
      recPosture = 'Top-tier creators with team and infrastructure needs.';
    } else if (scores.urgency <= 1 && scores.sovereignty <= 1 && scores.earning <= 1) {
      recProduct = 'Nurture';
      recPosture = 'Aspiring creators, curious browsers. Don\'t burn the team\'s time.';
    } else if (Object.values(scores).every(v => v <= 1)) {
      recProduct = 'No call. Polite acknowledgment.';
      recPosture = 'Tourists.';
    } else {
      recProduct = 'Publisher + Sovereign Ready';
      recPosture = 'Standard balanced creator engagement path.';
    }

    const scoreStr = Object.keys(scores).map(v => `${v.toUpperCase()}: ${scores[v]}/4`).join(' — ');
    document.getElementById('payload-scores').value          = scoreStr;
    document.getElementById('payload-recommendation').value  = `${recProduct} [Posture: ${recPosture}]`;

    // Map hidden fields to actual question text for FormSubmit emails
    const creatorQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — How large is your audience?",
      q4: "Q04 — Where does most of your income come from?",
      q5: "Q05 — What is the most fragile part of your operation?",
      q6: "Q06 — Where would automation help you most?",
      q7: "Q07 — If your main platform shut you down tomorrow, what could you keep?",
      q8: "Q08 — How do you want to manage your audience data and AI?",
      q9: "Q09 — Where would you like to be twelve months from now?",
      q10: "Q10 — How would you like us to reach out?"
    };

    for (let i = 1; i <= 10; i++) {
      const payloadInput = document.getElementById(`payload-q${i}`);
      if (payloadInput) {
        payloadInput.name = creatorQuestionTexts[`q${i}`] || `q${i}`;
      }
    }
  }

  /* ── FORM SUBMIT LOGIC ──────────────────────────────────────────── */

  form.addEventListener('submit', (e) => {
    calculateRouting();

    const recType    = document.getElementById('payload-recommendation').value;
    const clientName = document.getElementById('client-name')?.value    || '';
    const clientCo   = document.getElementById('client-company')?.value || '';
    const subjectEl  = form.querySelector('input[name="_subject"]');

    if (subjectEl && recType) {
      const co = clientCo ? ` — ${clientCo}` : '';
      subjectEl.value = `Creator Assessment [${recType}]${co} — ${clientName}`;
    }

    const nextEl = form.querySelector('input[name="_next"]');
    if (nextEl) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        const currentPath = window.location.pathname;
        const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        nextEl.value = `${window.location.origin}${dirPath}/thank-you.html`;
      }
    }

    const answers = {};
    for (let i = 1; i <= 10; i++) {
      answers[`q${i}`] = document.getElementById(`payload-q${i}`)?.value || '';
    }

    const creatorQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — How large is your audience?",
      q4: "Q04 — Where does most of your income come from?",
      q5: "Q05 — What is the most fragile part of your operation?",
      q6: "Q06 — Where would automation help you most?",
      q7: "Q07 — If your main platform shut you down tomorrow, what could you keep?",
      q8: "Q08 — How do you want to manage your audience data and AI?",
      q9: "Q09 — Where would you like to be twelve months from now?",
      q10: "Q10 — How would you like us to reach out?"
    };

    const questionAnswers = {};
    for (let i = 1; i <= 10; i++) {
      const qText = creatorQuestionTexts[`q${i}`];
      if (qText) {
        questionAnswers[qText] = answers[`q${i}`];
      }
    }

    e.preventDefault();

    let submitted = false;
    const submitForm = () => {
      if (submitted) return;
      submitted = true;

      form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.disabled = true;
      });

      form.submit();
    };

    if (db) {
      const submitFallback = setTimeout(() => {
        console.warn("Firestore timeout — submitting form directly.");
        submitForm();
      }, 4000);

      addDoc(collection(db, "submissions"), {
        timestamp: new Date().toISOString(),
        track: selectedTrack,
        name: clientName,
        email: document.getElementById('client-email')?.value || '',
        company: clientCo,
        phone: document.getElementById('client-phone')?.value || '',
        message: document.getElementById('client-message')?.value || '',
        scores: document.getElementById('payload-scores')?.value || '',
        recommendation: recType,
        answers: answers,
        questionAnswers: questionAnswers
      }).catch(err => {
        console.warn("Firestore write failed:", err);
      }).finally(() => {
        clearTimeout(submitFallback);
        submitForm();
      });
    } else {
      submitForm();
    }
  });

  updateWizardUI();
});
