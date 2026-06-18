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

  // Remove native 'required' to manage validation manually
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.removeAttribute('required');
  });

  let currentStep = 1;
  const totalSteps = 4;
  const selectedTrack = 'business_ceo';

  // DOM references
  const stepCountText = document.getElementById('step-count');
  const stepLabelText = document.getElementById('step-label');
  const progressBar   = document.getElementById('progress-line');
  const progressWrapper = document.querySelector('.assessment-progress-wrapper');

  const steps = {
    1: document.getElementById('step-1'),
    2: document.getElementById('step-2'),
    3: document.getElementById('step-3'),
    4: document.getElementById('step-4')
  };

  const btnNext   = document.getElementById('btn-next');
  const btnBack   = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');

  const stepNames = {
    1: 'Strategic Context',
    2: 'Scale & Domain',
    3: 'Friction & Automation',
    4: 'Looking Ahead'
  };

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
    let allGroupsChecked = true;
    const groupNames = new Set();
    
    stepEl.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r => {
      if (r.name) groupNames.add(r.name);
    });

    groupNames.forEach(name => {
      if (!stepEl.querySelector(`input[name="${name}"]:checked`)) {
        allGroupsChecked = false;
      }
    });

    let allTextFilled = true;
    if (currentStep === totalSteps) {
      const q7Checked = stepEl.querySelector('input[name="ceo_q7"]:checked');
      const q8Checked = stepEl.querySelector('input[name="ceo_q8"]:checked');
      if (!q7Checked || !q8Checked) {
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
          ? 'Please answer all questions to proceed.' 
          : 'Please fill in your name, company and email details to continue.';
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
      btnNext.textContent = currentStep === totalSteps - 1 ? 'Final Step →' : 'Next Step →';
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

  const ceoLabels = {
    q1:  { A: "We're behind on AI adoption and we know it", B: "We've started experimenting and want a real pipeline", C: "We're doing well and want to scale our automation", D: "We're not sure — we want an outside read on our readiness" },
    q2:  { A: "A competitor launched an AI feature and we noticed", B: "Our operational team is stretched thin", C: "Leadership decided data security & AI is our top priority", D: "Nothing specific — the timing just feels right" },
    q3:  { A: "Under 50 people", B: "50 to 250 people", C: "250 to 1,000 people", D: "Over 1,000 people" },
    q4:  { A: "Makes or moves physical goods / logistics", B: "Sells professional services or expertise", C: "Serves consumers directly (B2C / e-commerce)", D: "Builds technology, software, or media platforms" },
    q5:  { A: "Front office — sales, marketing, client communication", B: "Back office — admin, finance, reporting, HR", C: "Operations — production, logistics, client onboarding", D: "Across the board — repetitive work is everywhere" },
    q6:  { A: "Give the team back time for higher-value work", B: "Help us scale operations without hiring proportionally", C: "Improve quality and compliance consistency", D: "Run the operational layer of our business for us" },
    q7:  { A: "Clearer on what AI can and cannot do for us", B: "Two or three concrete things working in production", C: "AI agents woven into how the company runs daily", D: "Fully private — our private models, data, and hardware" },
    q8:  { A: "Email is fine", B: "A short call to start", C: "A video meeting", D: "In person" }
  };

  function calculateRouting() {
    document.getElementById('payload-track').value = "BUSINESS_CEO";

    const q1  = radioVal('ceo_q1');
    const q2  = radioVal('ceo_q2');
    const q3  = radioVal('ceo_q3');
    const q4  = radioVal('ceo_q4');
    const q5Keys = checkboxValues('ceo_q5');
    const q6Keys = checkboxValues('ceo_q6');
    const q7Keys = checkboxValues('ceo_q7');
    const q8  = radioVal('ceo_q8');

    // Populate hidden answers payload
    document.getElementById('payload-q1').value  = ceoLabels.q1[q1]   || q1;
    document.getElementById('payload-q2').value  = ceoLabels.q2[q2]   || q2;
    document.getElementById('payload-q3').value  = ceoLabels.q3[q3]   || q3;
    document.getElementById('payload-q4').value  = ceoLabels.q4[q4]   || q4;
    document.getElementById('payload-q5').value  = q5Keys.map(k => ceoLabels.q5[k] || k).join(', ');
    document.getElementById('payload-q6').value  = q6Keys.map(k => ceoLabels.q6[k] || k).join(', ');
    document.getElementById('payload-q7').value  = q7Keys.map(k => ceoLabels.q7[k] || k).join(', ');
    document.getElementById('payload-q8').value  = ceoLabels.q8[q8]   || q8;

    // ── BUSINESS CEO SCORING VECTORS ──
    const scores = {};

    // 1. Urgency (inputs: Q1, Q2, Q7)
    let uScore = 0;
    if (q1 === 'A') uScore += 2; else if (q1 === 'B' || q1 === 'C') uScore += 1;
    if (q2 === 'A' || q2 === 'C') uScore += 2; else if (q2 === 'B') uScore += 1;
    if (q7Keys.includes('D')) uScore += 1;
    scores.urgency = Math.min(4, Math.max(0, uScore));

    // 2. Automation (inputs: Q5, Q6)
    let aScore = 0;
    if (q5Keys.includes('D') || q5Keys.includes('C')) aScore += 1;
    if (q6Keys.includes('D')) aScore += 2;
    else if (q6Keys.some(k => ['A', 'B', 'C'].includes(k))) aScore += 1;
    scores.automation = Math.min(4, Math.max(0, aScore));

    // 3. Sovereignty (inputs: Q7)
    let sovScore = 0;
    if (q7Keys.includes('D')) sovScore += 3;
    else if (q7Keys.includes('C')) sovScore += 2;
    else if (q7Keys.includes('B')) sovScore += 1;
    scores.sovereignty = Math.min(4, Math.max(0, sovScore));

    // 4. Budget (inputs: Q3, Q4, Role field)
    let bScore = 0;
    if (q3 === 'D') bScore += 2; else if (q3 === 'C' || q3 === 'B') bScore += 1;
    if (q4 === 'B' || q4 === 'D') bScore += 1;
    
    const roleText = (document.getElementById('client-role')?.value || '').toLowerCase();
    const highAuthority = ['ceo', 'founder', 'owner', 'partner', 'president', 'executive', 'director', 'coo'];
    const lowAuthority = ['analyst', 'coordinator', 'intern', 'student'];
    
    if (highAuthority.some(k => roleText.includes(k))) bScore += 1;
    else if (lowAuthority.some(k => roleText.includes(k))) bScore -= 1;
    scores.budget = Math.min(4, Math.max(0, bScore));

    // ── BUSINESS CEO RECOMMENDATION MAPPING ──
    let recProduct = '';
    let recPosture = '';

    if (scores.sovereignty >= 3 && scores.budget >= 3 && q3 === 'D') {
      recProduct = 'Empire';
      recPosture = 'Long sales cycle, enterprise-grade pitch';
    } else if (scores.sovereignty >= 3 && scores.budget >= 3) {
      recProduct = 'Stack + Private';
      recPosture = 'Lead with private stack pitch directly. They\'re already there.';
    } else if (scores.sovereignty >= 3 && scores.budget >= 1) {
      recProduct = 'Stack';
      recPosture = 'Ownership without enterprise pricing';
    } else if (scores.automation >= 3 && scores.sovereignty <= 2 && scores.budget >= 2) {
      recProduct = 'Foundation + Agent';
      recPosture = 'Lead with automation ROI. Ownership as the why-NativeWorks-not-someone-else.';
    } else if (scores.automation >= 3 && scores.sovereignty <= 2 && scores.budget <= 1) {
      recProduct = 'Foundation';
      recPosture = 'Get them in. Show value. Earn the ownership conversation.';
    } else {
      recProduct = 'Foundation + Agent';
      recPosture = 'Standard balanced business engagement path.';
    }

    const scoreStr = Object.keys(scores).map(v => `${v.toUpperCase()}: ${scores[v]}/4`).join(' — ');
    document.getElementById('payload-scores').value          = scoreStr;
    document.getElementById('payload-recommendation').value  = `${recProduct} [Posture: ${recPosture}]`;

    const ceoQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — How big is your company?",
      q4: "Q04 — What does your company do?",
      q5: "Q05 — Where does most of the operational friction live? (Select 1 or more)",
      q6: "Q06 — What would you want AI to do for your business ideally?",
      q7: "Q07 — Where would you like to be twelve months from now?",
      q8: "Q08 — How would you like us to reach out?"
    };

    for (let i = 1; i <= 8; i++) {
      const payloadInput = document.getElementById(`payload-q${i}`);
      if (payloadInput) {
        payloadInput.name = ceoQuestionTexts[`q${i}`] || `q${i}`;
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
      subjectEl.value = `CEO Business Assessment [${recType}]${co} — ${clientName}`;
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
    for (let i = 1; i <= 8; i++) {
      answers[`q${i}`] = document.getElementById(`payload-q${i}`)?.value || '';
    }

    const ceoQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — How big is your company?",
      q4: "Q04 — What does your company do?",
      q5: "Q05 — Where does most of the operational friction live? (Select 1 or more)",
      q6: "Q06 — What would you want AI to do for your business ideally?",
      q7: "Q07 — Where would you like to be twelve months from now?",
      q8: "Q08 — How would you like us to reach out?"
    };

    const questionAnswers = {};
    for (let i = 1; i <= 8; i++) {
      const qText = ceoQuestionTexts[`q${i}`];
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
