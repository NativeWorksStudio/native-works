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
  const selectedTrack = 'business_cto';

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

  const lang = document.documentElement.lang || 'en';
  const TRANSLATIONS = {
    en: {
      stepNames: {
        1: 'Data & Systems',
        2: 'Model & Privacy',
        3: 'Hosting & Hardware',
        4: 'Compliance & Onboarding'
      },
      errorAllQuestions: 'Please answer all questions to proceed.',
      errorAllFields: 'Please fill in your name, company and email details to continue.',
      finalStep: 'Final Step →',
      nextStep: 'Next Step →'
    },
    da: {
      stepNames: {
        1: 'Data & Systemer',
        2: 'Model & Privatliv',
        3: 'Hosting & Hardware',
        4: 'Overholdelse & Integrering'
      },
      errorAllQuestions: 'Besvar venligst alle spørgsmål for at fortsætte.',
      errorAllFields: 'Udfyld venligst dit navn, virksomhed og e-mail for at fortsætte.',
      finalStep: 'Sidste Trin →',
      nextStep: 'Næste Trin →'
    },
    it: {
      stepNames: {
        1: 'Dati & Sistemi',
        2: 'Modello & Privacy',
        3: 'Hosting & Hardware',
        4: 'Conformità & Onboarding'
      },
      errorAllQuestions: 'Rispondi a tutte le domande per procedere.',
      errorAllFields: 'Inserisci il tuo nome, azienda ed email per continuare.',
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
      const inputSample = stepEl.querySelector(`input[name="${name}"]`);
      if (inputSample && inputSample.type === 'radio') {
        if (!stepEl.querySelector(`input[name="${name}"]:checked`)) {
          allGroupsChecked = false;
        }
      }
    });

    let allTextFilled = true;
    if (currentStep === totalSteps) {
      const q7Checked = stepEl.querySelector('input[name="cto_q7"]:checked');
      const q8Checked = stepEl.querySelector('input[name="cto_q8"]:checked');
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

  const ctoLabels = {
    q1:  { A: "Cloud CRMs & SaaS (HubSpot, Notion, Salesforce)", B: "Managed Databases (RDS, PostgreSQL, SQL Server)", C: "Legacy On-Premises (Local network attached storage, local file servers)", D: "Distributed Spreadsheets (Excel / Google Sheets across teams)" },
    q2:  { A: "Communication Suites (Slack, MS Teams)", B: "Task & Project Management (Jira, Monday, Trello)", C: "Customer Support Tools (Zendesk, Intercom)", D: "Document Storage (Google Drive, SharePoint)" },
    q3:  { A: "Public Commercial APIs (GPT, Claude, Gemini)", B: "Hosted Enterprise Instances (Azure OpenAI, Vertex AI, Bedrock)", C: "Open-weights / Self-hosted models (Llama 3, Mistral, Qwen)", D: "No active model deployments (Off-the-shelf tools only)" },
    q4:  { A: "Convenience Priority: We send data to public APIs if they don't train on it", B: "Hybrid Constraint: We use commercial APIs but mask sensitive client data", C: "Strict Autonomy: Zero data leaves our network. Private model instance required" },
    q5:  { A: "Private VPS: Secure European cloud instances (Hetzner, OVH)", B: "Corporate Private Cloud: Our AWS VPC / GCP / Azure Private Link", C: "Bare-Metal On-Premises: Dedicated co-located server racks", D: "Edge Hardware nodes: Running in physical offices (Mac Studio/NVIDIA RTX)" },
    q6:  { A: "Dedicated NVIDIA GPUs (RTX 4090, A100, H100, RTX A6000)", B: "Apple Silicon workstations (M2/M3 Max/Ultra nodes)", C: "Standard CPU instances (No dedicated local GPU inference hardware)", D: "None — We need NativeWorks to specify and procure hardware" },
    q7:  { A: "GDPR (European Data Privacy)", B: "HIPAA (Healthcare data privacy compliance)", C: "SOC 2 Type II / ISO 27001 Security standards", D: "Internal operational corporate security only" },
    q8:  { A: "Direct Remote (Secure VPN, Bastion host, Tailscale, SSH keys)", B: "Co-Working (Screen sharing session under continuous supervision)", C: "Zero-Access (NativeWorks packages container builds; our team deploys)" }
  };

  function calculateRouting() {
    document.getElementById('payload-track').value = "BUSINESS_CTO";

    const q1  = radioVal('cto_q1');
    const q2Keys = checkboxValues('cto_q2');
    const q3  = radioVal('cto_q3');
    const q4  = radioVal('cto_q4');
    const q5  = radioVal('cto_q5');
    const q6  = radioVal('cto_q6');
    const q7Keys = checkboxValues('cto_q7');
    const q8  = radioVal('cto_q8');

    // Populate hidden answers payload
    document.getElementById('payload-q1').value  = ctoLabels.q1[q1]   || q1;
    document.getElementById('payload-q2').value  = q2Keys.map(k => ctoLabels.q2[k] || k).join(', ');
    document.getElementById('payload-q3').value  = ctoLabels.q3[q3]   || q3;
    document.getElementById('payload-q4').value  = ctoLabels.q4[q4]   || q4;
    document.getElementById('payload-q5').value  = ctoLabels.q5[q5]   || q5;
    document.getElementById('payload-q6').value  = ctoLabels.q6[q6]   || q6;
    document.getElementById('payload-q7').value  = q7Keys.map(k => ctoLabels.q7[k] || k).join(', ');
    document.getElementById('payload-q8').value  = ctoLabels.q8[q8]   || q8;

    // ── BUSINESS CTO SCORING VECTORS ──
    const scores = {};

    // 1. Sophistication (inputs: Q3, Q4)
    let sScore = 0;
    if (q3 === 'C') sScore += 2; else if (q3 === 'B') sScore += 1;
    if (q4 === 'C') sScore += 2; else if (q4 === 'B') sScore += 1;
    scores.sophistication = Math.min(4, Math.max(0, sScore));

    // 2. Infrastructure (inputs: Q5, Q6)
    let iScore = 0;
    if (q5 === 'C' || q5 === 'D') iScore += 2; else if (q5 === 'B') iScore += 1;
    if (q6 === 'A' || q6 === 'B') iScore += 2; else if (q6 === 'C') iScore += 1;
    scores.infrastructure = Math.min(4, Math.max(0, iScore));

    // 3. Sovereignty (inputs: Q4, Q5)
    let sovScore = 0;
    if (q4 === 'C') sovScore += 2; else if (q4 === 'B') sovScore += 1; else if (q4 === 'A') sovScore -= 1;
    if (q5 === 'C' || q5 === 'D') sovScore += 2; else if (q5 === 'B') sovScore += 1;
    scores.sovereignty = Math.min(4, Math.max(0, sovScore));

    // 4. Compliance (inputs: Q7)
    let cScore = 0;
    if (q7Keys.includes('A')) cScore += 1;
    if (q7Keys.includes('B')) cScore += 1;
    if (q7Keys.includes('C')) cScore += 2;
    scores.compliance = Math.min(4, Math.max(0, cScore));

    // ── BUSINESS CTO RECOMMENDATION MAPPING ──
    let recProduct = '';
    let recPosture = '';

    if (scores.sovereignty >= 3 && scores.infrastructure >= 3) {
      recProduct = 'Private Cloud / Bare-Metal Node';
      recPosture = 'Full private infrastructure deployment pitch';
    } else if (scores.sovereignty >= 3 && scores.infrastructure <= 2) {
      recProduct = 'Private VPS';
      recPosture = 'European-hosted private virtual servers';
    } else if (scores.sophistication >= 3 && scores.compliance >= 2) {
      recProduct = 'Docker/Kubernetes Enterprise Package';
      recPosture = 'Pre-packaged secure container nodes';
    } else {
      recProduct = 'Private VPS';
      recPosture = 'Standard secure data pipeline setup';
    }

    const scoreStr = Object.keys(scores).map(v => `${v.toUpperCase()}: ${scores[v]}/4`).join(' — ');
    document.getElementById('payload-scores').value          = scoreStr;
    document.getElementById('payload-recommendation').value  = `${recProduct} [Posture: ${recPosture}]`;

    const ctoQuestionTexts = {
      q1: "Q01 — Where is your primary operational data stored?",
      q2: "Q02 — Which operational tools are critical to your team treadmill?",
      q3: "Q03 — Which LLMs or AI APIs do you currently run?",
      q4: "Q04 — What is your posture regarding AI privacy?",
      q5: "Q05 — What is your preferred hosting architecture?",
      q6: "Q06 — Do you have existing hardware resources?",
      q7: "Q07 — Which compliance frameworks govern your data?",
      q8: "Q08 — How do you prefer to grant setup engineers access?"
    };

    for (let i = 1; i <= 8; i++) {
      const payloadInput = document.getElementById(`payload-q${i}`);
      if (payloadInput) {
        payloadInput.name = ctoQuestionTexts[`q${i}`] || `q${i}`;
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
      subjectEl.value = `CTO Technical Assessment [${recType}]${co} — ${clientName}`;
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

    const ctoQuestionTexts = {
      q1: "Q01 — Where is your primary operational data stored?",
      q2: "Q02 — Which operational tools are critical to your team treadmill?",
      q3: "Q03 — Which LLMs or AI APIs do you currently run?",
      q4: "Q04 — What is your posture regarding AI privacy?",
      q5: "Q05 — What is your preferred hosting architecture?",
      q6: "Q06 — Do you have existing hardware resources?",
      q7: "Q07 — Which compliance frameworks govern your data?",
      q8: "Q08 — How do you prefer to grant setup engineers access?"
    };

    const questionAnswers = {};
    for (let i = 1; i <= 8; i++) {
      const qText = ctoQuestionTexts[`q${i}`];
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
