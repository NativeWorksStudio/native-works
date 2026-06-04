import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ── FIREBASE CONFIGURATION BLOCK ───────────────────────────────────────────
// Replace with your project credentials from Firebase Console (Project Settings > Web App)
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "PLACEHOLDER_AUTH_DOMAIN",
  projectId: "PLACEHOLDER_PROJECT_ID",
  storageBucket: "PLACEHOLDER_STORAGE_BUCKET",
  messagingSenderId: "PLACEHOLDER_MESSAGING_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID",
  measurementId: "PLACEHOLDER_MEASUREMENT_ID"
};
// ↑ Sostituisci i valori sopra con le credenziali reali da Firebase Console
// (Project Settings > Your apps > SDK setup and configuration)
// Le chiavi Firebase web sono sicure nel client — protette dalle Security Rules.

// Only init Firebase if credentials have been replaced from placeholders
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

  // Remove native 'required' attribute from all radio inputs to prevent browser validation from blocking submit on hidden steps
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.removeAttribute('required');
  });

  let currentStep = 1;
  const totalSteps = 7;
  let selectedTrack = null; // 'business' | 'creator'

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
    5: document.getElementById('step-5'),
    6: document.getElementById('step-6'),
    7: document.getElementById('step-7')
  };

  const btnNext   = document.getElementById('btn-next');
  const btnBack   = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');

  const stepNames = {
    1: 'Choose Track',
    2: 'Why Now',
    3: 'Your Profile',
    4: 'Operations',
    5: 'AI & Workflows',
    6: 'Data & Sovereignty',
    7: 'Looking Ahead'
  };

  /* ── TRACK SWITCHER INITIALISATION ──────────────────────────────── */

  const trackRadios = document.querySelectorAll('input[name="track_select"]');
  trackRadios.forEach(radio => {
    const card = document.querySelector(`label[for="${radio.id}"]`);
    if (!card) return;

    if (radio.checked) {
      selectedTrack = radio.value;
      card.classList.add('selected');
    }

    card.addEventListener('click', () => {
      radio.checked = true;
      selectedTrack = radio.value;
      
      // Update UI selection classes
      document.querySelectorAll('.path-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Update dynamics for rest of questionnaire
      updateTrackVisibility();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  function updateTrackVisibility() {
    if (!selectedTrack) return;

    // Toggle conditional visual groups
    document.querySelectorAll('.business-only').forEach(el => {
      el.style.display = selectedTrack === 'business' ? 'block' : 'none';
    });
    document.querySelectorAll('.creator-only').forEach(el => {
      el.style.display = selectedTrack === 'creator' ? 'block' : 'none';
    });

    // Toggle 'required' constraints dynamically so hidden tracks don't prevent submit
    document.querySelectorAll('.business-only input[type="radio"]').forEach(r => {
      if (selectedTrack === 'business') {
        r.setAttribute('required', 'required');
      } else {
        r.removeAttribute('required');
      }
    });
    document.querySelectorAll('.creator-only input[type="radio"]').forEach(r => {
      if (selectedTrack === 'creator') {
        r.setAttribute('required', 'required');
      } else {
        r.removeAttribute('required');
      }
    });

    // Update Contact fields labels / requirements dynamically
    const labelRole = document.getElementById('label-role');
    const labelCompany = document.getElementById('label-company');
    const inputRole = document.getElementById('client-role');
    const inputCompany = document.getElementById('client-company');

    if (selectedTrack === 'creator') {
      // Hide Role field completely for creator track as requested
      if (inputRole) {
        const group = inputRole.closest('.form-group');
        if (group) group.style.display = 'none';
        inputRole.removeAttribute('required');
        inputRole.value = '';
      }
      if (labelCompany) labelCompany.innerHTML = 'Channel or Brand Name *';
      if (inputCompany) inputCompany.placeholder = 'Your channel / newsletter name';
    } else {
      // Show and require Role field for business track
      if (inputRole) {
        const group = inputRole.closest('.form-group');
        if (group) group.style.display = 'block';
        inputRole.setAttribute('required', 'required');
      }
      if (labelRole) labelRole.innerHTML = 'Role *';
      if (inputRole) inputRole.placeholder = 'Your role';
      if (labelCompany) labelCompany.innerHTML = 'Company *';
      if (inputCompany) inputCompany.placeholder = 'Company name';
    }
  }

  /* ── CARD INTERACTION (Wizard Radios) ───────────────────────────── */

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
      // Only process when the target is the input itself (the label click will naturally trigger this input click)
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

      // Validate step silently
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

    // Validate track selector on Step 1
    if (currentStep === 1) {
      if (!selectedTrack) {
        if (showAlert) {
          showErrorMessage(stepEl, 'Please select a track to begin.');
        }
        return false;
      }
      clearErrorMessage(stepEl);
      return true;
    }

    // Validate active track radios inside current step
    const trackClass = selectedTrack === 'business' ? '.business-only' : '.creator-only';
    const activeSection = stepEl.querySelector(trackClass);

    let allGroupsChecked = true;
    if (activeSection) {
      const groupNames = new Set();
      activeSection.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(r => {
        if (r.name) groupNames.add(r.name);
      });

      groupNames.forEach(name => {
        if (!activeSection.querySelector(`input[name="${name}"]:checked`)) {
          allGroupsChecked = false;
        }
      });
    }

    // On Step 7, also validate required text / email fields
    let allTextFilled = true;
    if (currentStep === totalSteps) {
      // Step 7 questions validation first
      const q16Checked = stepEl.querySelector(`input[name="${selectedTrack}_q16"]:checked`);
      const q17Checked = stepEl.querySelector(`input[name="${selectedTrack}_q17"]:checked`);
      if (!q16Checked || !q17Checked) {
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
          : 'Please fill in your name, company and contact info to continue.';
        showErrorMessage(stepEl, msg);

        if (!allGroupsChecked && activeSection) {
          activeSection.querySelectorAll('.options-grid').forEach(grid => {
            grid.style.animation = 'none';
            void grid.offsetWidth;
            grid.style.animation = 'shake 0.4s ease';
          });
        }
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

    // Step tracker
    stepCountText.textContent = `0${currentStep} / 0${totalSteps}`;
    
    // Dynamic Step label
    let label = stepNames[currentStep];
    if (currentStep === 3) {
      label = selectedTrack === 'business' ? 'Your Company' : 'Audience & Tenure';
    } else if (currentStep === 4) {
      label = selectedTrack === 'business' ? 'How Work Moves' : 'Income & Fragility';
    }
    stepLabelText.textContent = label;
    progressBar.style.width  = `${(currentStep / totalSteps) * 100}%`;

    // Back button
    btnBack.classList.toggle('wizard-btn-hidden', currentStep === 1);

    // Next / Submit controls
    if (currentStep < totalSteps) {
      btnNext.textContent = currentStep === totalSteps - 1 ? 'Final Step →' : 'Next Step →';
      btnNext.classList.remove('wizard-btn-hidden');
      btnSubmit.classList.add('wizard-btn-hidden');
    } else {
      calculateRouting();
      btnNext.classList.add('wizard-btn-hidden');
      btnSubmit.classList.remove('wizard-btn-hidden');
    }

    // Smooth scroll to top of container
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

  // Helper to extract radio value
  const radioVal = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';

  // Helper to extract checkbox values
  const checkboxValues = name => {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
      .map(cb => cb.value);
  };

  // Labels for payload translation
  const businessLabels = {
    q1:  { A: "We're behind and we know it", B: "We've started experimenting and want a real plan", C: "We're doing well and want to do better", D: "We're not sure — we want an outside read" },
    q2:  { A: "A competitor moved and we noticed", B: "Our team is stretched thin", C: "Leadership decided AI is a priority this year", D: "Nothing specific — the timing just feels right" },
    q3:  { A: "Under 50 people", B: "50 to 250 people", C: "250 to 1,000 people", D: "Over 1,000 people" },
    q4:  { A: "Makes or moves physical things", B: "Sells professional services or expertise", C: "Serves consumers directly", D: "Builds technology or media" },
    q5:  { A: "One city or region", B: "National", C: "European or cross-border", D: "Global" },
    q6:  { A: "Centralised — one team, one place, one playbook", B: "Decentralised — multiple teams running their own way", C: "Outsourced — most operational work sits with partners", D: "Mixed — some inside, some outside, depending on the task" },
    q7:  { A: "Front office — sales, marketing, client communication", B: "Back office — admin, finance, reporting, HR", C: "Operations — production, logistics, service delivery", D: "Across the board — repetition everywhere" },
    q8:  { A: "We don't know where to start", B: "We've tried things and they didn't stick", C: "Leadership is open, the team isn't ready", D: "We're ready, we just need the right plan" },
    q9:  { A: "Communication & Reporting", B: "Customer service", C: "Logistics & Scheduling", D: "Content creation" },
    q10: { A: "Drafting emails & documents", B: "Triaging messages & tasks", C: "Data entry & copy-pasting", D: "Searching for files & info" },
    q11: { A: "Nothing yet", B: "Individuals on the team use AI tools on their own", C: "We've run pilots on specific use cases", D: "AI is already woven into how we work" },
    q12: { A: "Give the team back time for higher-value work", B: "Help us scale without hiring proportionally", C: "Improve consistency across the company", D: "Run the operational layer of our business for us" },
    q13: { A: "Public AI is fine — convenience matters more than privacy", B: "Public AI is acceptable for non-sensitive work", C: "Private setup for anything that touches our business", D: "Fully in-house, on our infrastructure, with maximum privacy" },
    q14: { A: "Mostly spreadsheets and email", B: "Across business tools that don't really talk", C: "Central system most of the company uses", D: "Unified data layer we own and control" },
    q15: { A: "Several, not entirely sure who has what", B: "A few, clearly scoped", C: "Rarely, under contract", D: "None" },
    q16: { A: "Clearer on what AI can and can't do for us", B: "Two or three concrete things working in production", C: "AI woven into how the company runs", D: "Fully sovereign — our AI, our data, our infrastructure" },
    q17: { A: "Email is fine", B: "A short call to start", C: "A video meeting", D: "In person, when it makes sense" }
  };

  const creatorLabels = {
    q1:  { A: "A platform did something that scared me", B: "I'm growing and I can feel the dependency tightening", C: "I want to take ownership before something happens", D: "I'm curious — I've been hearing about this" },
    q2:  { A: "Reach dropped without explanation", B: "A platform changed its rules or its cut", C: "Someone I follow lost their account", D: "Nothing specific — the timing just feels right" },
    q3:  { A: "Video-centric (YouTube, TikTok)", B: "Audio-centric (Podcasts, Spotify)", C: "Text-centric (Substack, Newsletter)", D: "Multi-channel mix" },
    q4:  { A: "Under 5,000", B: "5,000 to 50,000", C: "50,000 to 500,000", D: "Over 500,000" },
    q5:  { A: "Under a year", B: "One to three years", C: "Three to seven years", D: "Long enough that the platforms have changed under me" },
    q6:  { A: "Platform ad revenue or platform payouts", B: "Brand deals and sponsorships", C: "Direct support from my audience — subscriptions, memberships, tips", D: "Products or services I sell directly" },
    q7:  { A: "Heavily — if one platform goes down, my income goes with it", B: "Moderately — some direct sales, but heavily reliant on platform traffic", C: "Minimally — my income comes from channels I control directly" },
    q8:  { A: "My account itself — one strike and it's over", B: "My reach — the algorithm decides whether I exist", C: "My contact with my audience — I don't own the relationship", D: "My payments and payouts — I rely on platform processors" },
    q9:  { A: "Everything around the content (logistics)", B: "Talking to my audience", C: "Running the business", D: "Making the core content" },
    q10: { A: "Repurposing content", B: "Replying to DMs and comments", C: "Reporting & analytics", D: "None, each day is unique" },
    q11: { A: "Nothing yet — I haven't found the right way in", B: "Writing and editing tools, occasionally", C: "Production tools — visuals, voice, transcripts", D: "I'm building real workflows around AI already" },
    q12: { A: "Give me back time to make better work", B: "Help me stay consistent without burning out", C: "Let me reply to my audience properly without it eating my life", D: "Run the operational layer of my business for me" },
    q13: { A: "Almost nothing — my audience lives there", B: "My subscriber emails, if I've been collecting them", C: "Most of it — I have backups and direct channels", D: "Everything — my platform is one channel among many I control" },
    q14: { A: "They're necessary, and I try not to think about it", B: "I'd leave if there were somewhere to go", C: "I'm actively trying to reduce my exposure", D: "I want to own my presence end to end" },
    q15: { A: "Public AI is fine", B: "Dedicated hosting (e.g. VPS) — private setup without running own infrastructure", C: "Fully mine — my AI, my data, on infrastructure I control" },
    q16: { A: "Less anxious about the platforms I depend on", B: "Earning more directly from my audience", C: "Running my own publishing and payment infrastructure", D: "Fully sovereign — my audience, my keys, my rules" },
    q17: { A: "Email is fine", B: "A short call to start", C: "A video meeting", D: "In person, when it makes sense" }
  };

  function calculateRouting() {
    if (!selectedTrack) return;

    // Track hidden field
    document.getElementById('payload-track').value = selectedTrack.toUpperCase();

    let scores = {};
    let recProduct = '';
    let recPosture = '';

    if (selectedTrack === 'business') {
      const q1  = radioVal('business_q1');
      const q2  = radioVal('business_q2');
      const q3  = radioVal('business_q3');
      const q4  = radioVal('business_q4');
      const q5  = radioVal('business_q5');
      const q6  = radioVal('business_q6');
      const q7  = radioVal('business_q7');
      const q8  = radioVal('business_q8');
      const q9  = radioVal('business_q9');
      const q10 = radioVal('business_q10');
      const q11 = radioVal('business_q11');
      const q12 = radioVal('business_q12');
      const q13 = radioVal('business_q13');
      const q14 = radioVal('business_q14');
      const q15 = radioVal('business_q15');
      const q16Keys = checkboxValues('business_q16');
      const q17 = radioVal('business_q17');

      // Populate hidden answers payload
      document.getElementById('payload-q1').value  = businessLabels.q1[q1]   || q1;
      document.getElementById('payload-q2').value  = businessLabels.q2[q2]   || q2;
      document.getElementById('payload-q3').value  = businessLabels.q3[q3]   || q3;
      document.getElementById('payload-q4').value  = businessLabels.q4[q4]   || q4;
      document.getElementById('payload-q5').value  = businessLabels.q5[q5]   || q5;
      document.getElementById('payload-q6').value  = businessLabels.q6[q6]   || q6;
      document.getElementById('payload-q7').value  = businessLabels.q7[q7]   || q7;
      document.getElementById('payload-q8').value  = businessLabels.q8[q8]   || q8;
      document.getElementById('payload-q9').value  = businessLabels.q9[q9]   || q9;
      document.getElementById('payload-q10').value = businessLabels.q10[q10] || q10;
      document.getElementById('payload-q11').value = businessLabels.q11[q11] || q11;
      document.getElementById('payload-q12').value = businessLabels.q12[q12] || q12;
      document.getElementById('payload-q13').value = businessLabels.q13[q13] || q13;
      document.getElementById('payload-q14').value = businessLabels.q14[q14] || q14;
      document.getElementById('payload-q15').value = businessLabels.q15[q15] || q15;
      document.getElementById('payload-q16').value = q16Keys.map(k => businessLabels.q16[k] || k).join(', ');
      document.getElementById('payload-q17').value = businessLabels.q17[q17] || q17;

      // ── BUSINESS SCORING VECTORS ──
      
      // 1. Urgency (inputs: Q1, Q2, Q8)
      let uScore = 0;
      if (q1 === 'A') uScore += 2; else if (q1 === 'B') uScore += 1; else if (q1 === 'C') uScore += 1;
      if (q2 === 'A') uScore += 2; else if (q2 === 'B') uScore += 1; else if (q2 === 'C') uScore += 2;
      if (q8 === 'D') uScore += 1; else if (q8 === 'A') uScore -= 1;
      scores.urgency = Math.min(4, Math.max(0, uScore));

      // 2. Sophistication (inputs: Q11, Q14, Q15)
      let sScore = 0;
      if (q11 === 'D') sScore += 2; else if (q11 === 'C') sScore += 1; else if (q11 === 'B') sScore += 1;
      if (q14 === 'D') sScore += 1; else if (q14 === 'C') sScore += 1;
      if (q15 === 'D') sScore += 1; else if (q15 === 'A') sScore -= 1;
      scores.sophistication = Math.min(4, Math.max(0, sScore));

      // 3. Sovereignty (inputs: Q13, Q16)
      let sovScore = 0;
      if (q13 === 'D') sovScore += 2; else if (q13 === 'C') sovScore += 1; else if (q13 === 'A') sovScore -= 1;
      let q16Score = 0;
      if (q16Keys.includes('D')) q16Score = 2;
      else if (q16Keys.includes('C') || q16Keys.includes('B')) q16Score = 1;
      sovScore += q16Score;
      scores.sovereignty = Math.min(4, Math.max(0, sovScore));

      // 4. Automation (inputs: Q7, Q9, Q10, Q12)
      let aScore = 0;
      if (q12 === 'D') aScore += 2; else if (q12 === 'C') aScore += 1; else if (q12 === 'B') aScore += 1; else if (q12 === 'A') aScore += 1;
      if (q7 === 'D') aScore += 1;
      if (q9 === 'A') aScore += 1;
      if (q10 === 'A' || q10 === 'B' || q10 === 'C') aScore += 1;
      scores.automation = Math.min(4, Math.max(0, aScore));

      // 5. Budget (inputs: Q3, Q5, Q4, Role field)
      let bScore = 0;
      if (q3 === 'D') bScore += 2; else if (q3 === 'C') bScore += 1; else if (q3 === 'B') bScore += 1;
      if (q5 === 'D') bScore += 1; else if (q5 === 'C') bScore += 1;
      if (q4 === 'B' || q4 === 'D') bScore += 1;
      
      const roleText = (document.getElementById('client-role')?.value || '').toLowerCase();
      const highAuthority = ['ceo', 'cto', 'coo', 'founder', 'owner', 'partner', 'director'];
      const midAuthority = ['manager', 'lead', 'head of'];
      const lowAuthority = ['analyst', 'coordinator', 'intern', 'student'];
      
      if (highAuthority.some(k => roleText.includes(k))) bScore += 1;
      else if (lowAuthority.some(k => roleText.includes(k))) bScore -= 1;
      scores.budget = Math.min(4, Math.max(0, bScore));

      // ── BUSINESS RECOMMENDATION MAPPING ──
      
      if (scores.sovereignty >= 3 && scores.budget >= 3 && scores.sophistication >= 3 && q3 === 'D') {
        recProduct = 'Empire';
        recPosture = 'Long sales cycle, enterprise-grade pitch';
      } else if (scores.sovereignty >= 3 && scores.budget >= 3) {
        recProduct = 'Stack + Sovereign';
        recPosture = 'Lead with sovereignty pitch directly. They\'re already there.';
      } else if (scores.sovereignty >= 3 && scores.budget >= 1) {
        recProduct = 'Stack';
        recPosture = 'Sovereignty without enterprise pricing';
      } else if (scores.automation >= 3 && scores.sovereignty <= 2 && scores.budget >= 2) {
        recProduct = 'Foundation + Agent';
        recPosture = 'Lead with automation ROI. Sovereignty as the why-NativeWorks-not-someone-else.';
      } else if (scores.automation >= 3 && scores.sovereignty <= 2 && scores.budget <= 1) {
        recProduct = 'Foundation';
        recPosture = 'Get them in. Show value. Earn the sovereignty conversation.';
      } else if (scores.urgency >= 3 && scores.sophistication <= 2 && scores.sovereignty <= 2 && scores.budget <= 2) {
        recProduct = 'Foundation (free trial of an automation idea)';
        recPosture = 'Fast prospect, unclear product fit. Discovery call is the product for now.';
      } else if (scores.sophistication >= 3 && scores.sovereignty <= 1) {
        recProduct = 'Discovery only, no pitch';
        recPosture = 'They know AI. They\'re not yet sold on sovereignty. Sell them on sovereignty, not on automation.';
      } else if (scores.budget === 0 && lowAuthority.some(k => roleText.includes(k))) {
        recProduct = 'No call. Send public resources.';
        recPosture = 'Researchers, not buyers. Help them, don\'t sell.';
      } else if (scores.urgency <= 1 && scores.sovereignty <= 1 && scores.budget <= 1) {
        recProduct = 'Nurture';
        recPosture = 'Curious browsers. Don\'t burn a call.';
      } else if (Object.values(scores).every(v => v <= 1)) {
        recProduct = 'No call. Polite acknowledgment.';
        recPosture = 'Form-filling tourists. Save the team\'s time.';
      } else {
        recProduct = 'Foundation + Agent';
        recPosture = 'Standard balanced business engagement path.';
      }

    } else if (selectedTrack === 'creator') {
      const q1  = radioVal('creator_q1');
      const q2  = radioVal('creator_q2');
      const q3  = radioVal('creator_q3');
      const q4  = radioVal('creator_q4');
      const q5  = radioVal('creator_q5');
      const q6  = radioVal('creator_q6');
      const q7  = radioVal('creator_q7');
      const q8  = radioVal('creator_q8');
      const q9  = radioVal('creator_q9');
      const q10 = radioVal('creator_q10');
      const q11 = radioVal('creator_q11');
      const q12 = radioVal('creator_q12');
      const q13 = radioVal('creator_q13');
      const q14 = radioVal('creator_q14');
      const q15 = radioVal('creator_q15');
      const q16Keys = checkboxValues('creator_q16');
      const q17 = radioVal('creator_q17');

      // Populate hidden answers payload
      document.getElementById('payload-q1').value  = creatorLabels.q1[q1]   || q1;
      document.getElementById('payload-q2').value  = creatorLabels.q2[q2]   || q2;
      document.getElementById('payload-q3').value  = creatorLabels.q3[q3]   || q3;
      document.getElementById('payload-q4').value  = creatorLabels.q4[q4]   || q4;
      document.getElementById('payload-q5').value  = creatorLabels.q5[q5]   || q5;
      document.getElementById('payload-q6').value  = creatorLabels.q6[q6]   || q6;
      document.getElementById('payload-q7').value  = creatorLabels.q7[q7]   || q7;
      document.getElementById('payload-q8').value  = creatorLabels.q8[q8]   || q8;
      document.getElementById('payload-q9').value  = creatorLabels.q9[q9]   || q9;
      document.getElementById('payload-q10').value = creatorLabels.q10[q10] || q10;
      document.getElementById('payload-q11').value = creatorLabels.q11[q11] || q11;
      document.getElementById('payload-q12').value = creatorLabels.q12[q12] || q12;
      document.getElementById('payload-q13').value = creatorLabels.q13[q13] || q13;
      document.getElementById('payload-q14').value = creatorLabels.q14[q14] || q14;
      document.getElementById('payload-q15').value = creatorLabels.q15[q15] || q15;
      document.getElementById('payload-q16').value = q16Keys.map(k => creatorLabels.q16[k] || k).join(', ');
      document.getElementById('payload-q17').value = creatorLabels.q17[q17] || q17;

      // ── CREATOR SCORING VECTORS ──

      // 1. Urgency (inputs: Q1, Q2, Q8)
      let uScore = 0;
      if (q1 === 'A') uScore += 2; else if (q1 === 'B') uScore += 1; else if (q1 === 'C') uScore += 1;
      if (q2 === 'A') uScore += 2; else if (q2 === 'B') uScore += 2; else if (q2 === 'C') uScore += 1;
      if (q8 === 'A' || q8 === 'B') uScore += 1;
      scores.urgency = Math.min(4, Math.max(0, uScore));

      // 2. Sophistication (inputs: Q5, Q11)
      let sScore = 0;
      if (q11 === 'D') sScore += 2; else if (q11 === 'C') sScore += 1; else if (q11 === 'B') sScore += 1;
      if (q5 === 'D' || q5 === 'C') sScore += 1;
      scores.sophistication = Math.min(4, Math.max(0, sScore));

      // 3. Sovereignty (inputs: Q13, Q14, Q15, Q16)
      let sovScore = 0;
      if (q13 === 'D') sovScore += 2; else if (q13 === 'C') sovScore += 1;
      if (q14 === 'D') sovScore += 2; else if (q14 === 'C') sovScore += 1; else if (q14 === 'B') sovScore += 1; else if (q14 === 'A') sovScore -= 1;
      if (q15 === 'C') sovScore += 2; else if (q15 === 'B') sovScore += 1; else if (q15 === 'A') sovScore -= 1;
      let q16Score = 0;
      if (q16Keys.includes('D')) q16Score = 2;
      else if (q16Keys.includes('C')) q16Score = 1;
      sovScore += q16Score;
      scores.sovereignty = Math.min(4, Math.max(0, sovScore));

      // 4. Automation (inputs: Q9, Q10, Q12)
      let aScore = 0;
      if (q12 === 'D' || q12 === 'C') aScore += 2; else if (q12 === 'B' || q12 === 'A') aScore += 1;
      if (q9 === 'A' || q9 === 'B' || q9 === 'C') aScore += 1;
      if (q10 === 'A' || q10 === 'B' || q10 === 'C') aScore += 1;
      scores.automation = Math.min(4, Math.max(0, aScore));

      // 5. Earning (inputs: Q4, Q6, Q7)
      let eScore = 0;
      if (q4 === 'D') eScore += 2; else if (q4 === 'C' || q4 === 'B') eScore += 1;
      if (q6 === 'D' || q6 === 'C' || q6 === 'B') eScore += 1;
      if (q7 === 'C') eScore += 1;
      scores.earning = Math.min(4, Math.max(0, eScore));

      // ── CREATOR RECOMMENDATION MAPPING ──

      if (scores.sovereignty >= 3 && scores.sophistication >= 3 && scores.earning >= 3) {
        recProduct = 'Stack + Chain';
        recPosture = 'Peer-to-peer pitch. They\'re already sovereign-fluent.';
      } else if (scores.sovereignty >= 3 && scores.sophistication <= 2 && scores.earning >= 2) {
        recProduct = 'Publisher + Sovereign Ready';
        recPosture = 'Guided onboarding. Lead with the platform-fear answer.';
      } else if (scores.sovereignty >= 3 && scores.sophistication <= 2 && scores.earning <= 1) {
        recProduct = 'Publisher';
        recPosture = 'Affordable entry. Establish the relationship.';
      } else if (scores.automation >= 3 && scores.sovereignty <= 2 && scores.earning >= 2) {
        recProduct = 'Publisher + Agent';
        recPosture = 'Lead with automation. Sovereignty as the "and by the way."';
      } else if (scores.urgency === 4 && scores.earning >= 2) {
        recProduct = 'Foundation / Publisher (stops the bleeding)';
        recPosture = 'They\'re scared. The product is whatever stops the platform bleeding fastest.';
      } else if (q6 === 'D' && scores.earning >= 3) {
        recProduct = 'Till + Stack + Publisher';
        recPosture = 'They already sell. Add sovereign payments and identity, then graduate.';
      } else if (q6 === 'C' && scores.sovereignty >= 3) {
        recProduct = 'Publisher + Stack';
        recPosture = 'The classic creator-to-sovereign migration. High conversion.';
      } else if (q4 === 'D' && scores.sophistication >= 3) {
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
    }

    // Serialize scores output
    let scoreStr = Object.keys(scores).map(v => `${v.toUpperCase()}: ${scores[v]}/4`).join(' — ');

    document.getElementById('payload-scores').value          = scoreStr;
    document.getElementById('payload-recommendation').value  = `${recProduct} [Posture: ${recPosture}]`;

    // Rename hidden payload inputs to display actual questions in FormSubmit emails
    const businessQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — How big is your company?",
      q4: "Q04 — What does your company do?",
      q5: "Q05 — Where does your company operate?",
      q6: "Q06 — How is your business organised today?",
      q7: "Q07 — Where does most of the friction live?",
      q8: "Q08 — What's holding the change back?",
      q9: "Q09 — Which task area contains the most repetitive work?",
      q10: "Q10 — Which daily task is the biggest treadmill for your team?",
      q11: "Q11 — What is your current experience with AI tools?",
      q12: "Q12 — What would you want AI to do for your business ideally?",
      q13: "Q13 — How do you want to run your AI?",
      q14: "Q14 — Where does your business data live?",
      q15: "Q15 — Do third parties have access to your data?",
      q16: "Q16 — Where would you like to be twelve months from now? (Select 1 or more)",
      q17: "Q17 — How would you like us to reach out?"
    };

    const creatorQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — What is your primary platform or medium?",
      q4: "Q04 — How large is your audience?",
      q5: "Q05 — How long have you been creating?",
      q6: "Q06 — Where does most of your income come from?",
      q7: "Q07 — How exposed is your income to platform policy changes?",
      q8: "Q08 — What is the most fragile part of your operation?",
      q9: "Q09 — Which part of your creative process is most time-consuming?",
      q10: "Q10 — Which daily/weekly task do you find most repetitive?",
      q11: "Q11 — What is your current experience with AI tools?",
      q12: "Q12 — Where would automation help you most?",
      q13: "Q13 — If your main platform shut you down tomorrow, what could you keep?",
      q14: "Q14 — How do you feel about your dependence on major platforms?",
      q15: "Q15 — How do you want to manage your audience data and AI?",
      q16: "Q16 — Where would you like to be twelve months from now? (Select 1 or more)",
      q17: "Q17 — How would you like us to reach out?"
    };

    const texts = selectedTrack === 'business' ? businessQuestionTexts : creatorQuestionTexts;
    for (let i = 1; i <= 17; i++) {
      const payloadInput = document.getElementById(`payload-q${i}`);
      if (payloadInput) {
        payloadInput.name = texts[`q${i}`] || `q${i}`;
      }
    }
  }

  /* ── FORM SUBMIT LOGIC ──────────────────────────────────────────── */

  form.addEventListener('submit', (e) => {
    // Compile routing results before submit
    calculateRouting();

    const recType    = document.getElementById('payload-recommendation').value;
    const clientName = document.getElementById('client-name')?.value    || '';
    const clientCo   = document.getElementById('client-company')?.value || '';
    const subjectEl  = form.querySelector('input[name="_subject"]');

    if (subjectEl && recType) {
      const co = clientCo ? ` — ${clientCo}` : '';
      subjectEl.value = `Assessment [${selectedTrack.toUpperCase()}: ${recType}]${co} — ${clientName}`;
    }

    // Dynamic local redirect for _next during testing
    const nextEl = form.querySelector('input[name="_next"]');
    if (nextEl) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        const currentPath = window.location.pathname;
        const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        nextEl.value = `${window.location.origin}${dirPath}/thank-you.html`;
      }
    }

    // Capture answers payload for Firestore
    const answers = {};
    for (let i = 1; i <= 17; i++) {
      answers[`q${i}`] = document.getElementById(`payload-q${i}`)?.value || '';
    }

    // Capture readable questions and answers for human inspection in database
    const businessQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — How big is your company?",
      q4: "Q04 — What does your company do?",
      q5: "Q05 — Where does your company operate?",
      q6: "Q06 — How is your business organised today?",
      q7: "Q07 — Where does most of the friction live?",
      q8: "Q08 — What's holding the change back?",
      q9: "Q09 — Which task area contains the most repetitive work?",
      q10: "Q10 — Which daily task is the biggest treadmill for your team?",
      q11: "Q11 — What is your current experience with AI tools?",
      q12: "Q12 — What would you want AI to do for your business ideally?",
      q13: "Q13 — How do you want to run your AI?",
      q14: "Q14 — Where does your business data live?",
      q15: "Q15 — Do third parties have access to your data?",
      q16: "Q16 — Where would you like to be twelve months from now? (Select 1 or more)",
      q17: "Q17 — How would you like us to reach out?"
    };

    const creatorQuestionTexts = {
      q1: "Q01 — What brought you here today?",
      q2: "Q02 — What changed recently?",
      q3: "Q03 — What is your primary platform or medium?",
      q4: "Q04 — How large is your audience?",
      q5: "Q05 — How long have you been creating?",
      q6: "Q06 — Where does most of your income come from?",
      q7: "Q07 — How exposed is your income to platform policy changes?",
      q8: "Q08 — What is the most fragile part of your operation?",
      q9: "Q09 — Which part of your creative process is most time-consuming?",
      q10: "Q10 — Which daily/weekly task do you find most repetitive?",
      q11: "Q11 — What is your current experience with AI tools?",
      q12: "Q12 — Where would automation help you most?",
      q13: "Q13 — If your main platform shut you down tomorrow, what could you keep?",
      q14: "Q14 — How do you feel about your dependence on major platforms?",
      q15: "Q15 — How do you want to manage your audience data and AI?",
      q16: "Q16 — Where would you like to be twelve months from now? (Select 1 or more)",
      q17: "Q17 — How would you like us to reach out?"
    };

    const texts = selectedTrack === 'business' ? businessQuestionTexts : creatorQuestionTexts;
    const questionAnswers = {};
    for (let i = 1; i <= 17; i++) {
      const qText = texts[`q${i}`];
      if (qText) {
        questionAnswers[qText] = answers[`q${i}`];
      }
    }

    // Prevent immediate native submission to allow background Firestore write
    e.preventDefault();

    let submitted = false;
    const submitForm = () => {
      if (submitted) return;
      submitted = true;

      // Disable radio and checkbox inputs so they aren't sent to FormSubmit.co
      form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.disabled = true;
      });

      form.submit();
    };

    if (db) {
      // Safety timeout: if Firestore doesn't respond in 4s, submit anyway
      const submitFallback = setTimeout(() => {
        console.warn("Firestore timeout — submitting form directly.");
        submitForm();
      }, 4000);

      addDoc(collection(db, "submissions"), {
        timestamp: new Date().toISOString(),
        track: selectedTrack,
        name: clientName,
        email: document.getElementById('client-email')?.value || '',
        role: document.getElementById('client-role')?.value || '',
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

  // Initialize the wizard UI to ensure progress bar is correctly placed on Step 1 on page load
  updateWizardUI();

});
