document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  let currentStep = 1;
  const totalSteps = 5;

  // DOM references
  const stepCountText = document.getElementById('step-count');
  const stepLabelText = document.getElementById('step-label');
  const progressBar   = document.getElementById('progress-line');

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

  const stepNames = {
    1: 'Why Now',
    2: 'Your Company',
    3: 'How Work Moves',
    4: 'Your Data & AI',
    5: 'Looking Ahead'
  };

  /* ── OPTION CARD INTERACTION ──────────────────────────────────────── */

  document.querySelectorAll('.option-card').forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (!radio) return;

    if (radio.checked) card.classList.add('selected');

    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));

    card.addEventListener('click', (e) => {
      if (e.target !== radio) radio.checked = true;

      // Deselect siblings in the same group
      const groupName = radio.getAttribute('name');
      document.querySelectorAll(`.option-card input[name="${groupName}"]`).forEach(sib => {
        const sibCard = sib.closest('.option-card');
        if (sibCard) {
          sibCard.classList.remove('selected');
          sibCard.setAttribute('aria-checked', 'false');
        }
      });

      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      document.body.classList.add('cursor-hover');
      setTimeout(() => document.body.classList.remove('cursor-hover'), 200);

      // Live-validate (silent, no error shown yet)
      validateCurrentStep(false);
    });

    radio.addEventListener('focus', () => card.classList.add('focus-within'));
    radio.addEventListener('blur',  () => card.classList.remove('focus-within'));

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        radio.checked = true;
        card.click();
      }
    });
  });

  /* ── STEP VALIDATION ──────────────────────────────────────────────── */

  function validateCurrentStep(showAlert = true) {
    if (currentStep > totalSteps) return true;

    const stepEl = steps[currentStep];

    // Check all radio groups within the step
    const groupNames = new Set();
    stepEl.querySelectorAll('input[type="radio"]').forEach(r => {
      if (r.name) groupNames.add(r.name);
    });

    let allGroupsChecked = true;
    groupNames.forEach(name => {
      if (!stepEl.querySelector(`input[name="${name}"]:checked`)) {
        allGroupsChecked = false;
      }
    });

    // On Step 5 also check required text inputs
    let allTextFilled = true;
    if (currentStep === totalSteps) {
      stepEl.querySelectorAll('input[type="text"][required], input[type="email"][required]').forEach(input => {
        if (!input.value.trim()) allTextFilled = false;
      });
    }

    if (!allGroupsChecked || !allTextFilled) {
      if (showAlert) {
        // Error message
        let errorMsg = stepEl.querySelector('.wizard-error-msg');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.className = 'wizard-error-msg';
          errorMsg.style.cssText = 'color:var(--true-north);font-size:12px;margin-top:16px;text-align:center;letter-spacing:1px;text-transform:uppercase;';
          stepEl.querySelector('.wizard-step-header')?.appendChild(errorMsg);
        }
        errorMsg.textContent = !allGroupsChecked
          ? 'Please answer all questions to proceed.'
          : 'Please fill in your name and email to continue.';

        // Shake radio grids if that's the problem
        if (!allGroupsChecked) {
          stepEl.querySelectorAll('.options-grid').forEach(grid => {
            grid.style.animation = 'none';
            void grid.offsetWidth;
            grid.style.animation = 'shake 0.4s ease';
          });
        }

        // Highlight empty required text inputs
        if (!allTextFilled) {
          stepEl.querySelectorAll('input[type="text"][required], input[type="email"][required]').forEach(input => {
            if (!input.value.trim()) {
              input.style.borderColor = 'var(--true-north)';
              input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
            }
          });
        }
      }
      return false;
    }

    stepEl.querySelector('.wizard-error-msg')?.remove();
    return true;
  }

  /* ── WIZARD UI UPDATE ─────────────────────────────────────────────── */

  function updateWizardUI() {
    // Show / hide steps
    Object.keys(steps).forEach(num => {
      const el = steps[num];
      const active = parseInt(num) === currentStep;
      el.classList.toggle('active', active);
      if (active) {
        const title = el.querySelector('.wizard-step-title');
        if (title) { title.setAttribute('tabindex', '-1'); title.focus(); }
      }
    });

    // Progress header
    stepCountText.textContent = `0${currentStep} / 0${totalSteps}`;
    stepLabelText.textContent = stepNames[currentStep];
    progressBar.style.width  = `${(currentStep / totalSteps) * 100}%`;

    // Back button
    btnBack.classList.toggle('visually-hidden', currentStep === 1);

    // Next / Submit buttons
    if (currentStep < totalSteps) {
      btnNext.textContent = currentStep === totalSteps - 1 ? 'Final Step →' : 'Next Step →';
      btnNext.classList.remove('visually-hidden');
      btnSubmit.classList.add('visually-hidden');
    } else {
      // Step 5: populate hidden fields, reveal submit
      calculateRecommendation();
      btnNext.classList.add('visually-hidden');
      btnSubmit.classList.remove('visually-hidden');
    }

    // Scroll to top of form
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

  /* ── DIAGNOSTIC SCORING & PAYLOAD ────────────────────────────────── */

  function calculateRecommendation() {
    const val = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';

    const q1  = val('q1');  const q2  = val('q2');  const q3  = val('q3');
    const q4  = val('q4');  const q5  = val('q5');  const q6  = val('q6');
    const q7  = val('q7');  const q8  = val('q8');  const q9  = val('q9');
    const q10 = val('q10'); const q11 = val('q11'); const q12 = val('q12');
    const q13 = val('q13');

    // Full-text label maps
    const labels = {
      q1:  { A: "We're behind and we know it",                         B: "We've started experimenting and want a real plan",   C: "We're doing well and want to do better",                          D: "We're not sure — we want an outside read" },
      q2:  { A: "A competitor moved and we noticed",                   B: "Our team is stretched thin",                        C: "Leadership decided AI is a priority this year",                   D: "Nothing specific — the timing just feels right" },
      q3:  { A: "Under 50 people",                                     B: "50 to 250 people",                                  C: "250 to 1,000 people",                                             D: "Over 1,000 people" },
      q4:  { A: "Makes or moves physical things",                      B: "Sells professional services or expertise",          C: "Serves consumers directly",                                       D: "Builds technology or media" },
      q5:  { A: "One city or region",                                  B: "National",                                          C: "European or cross-border",                                        D: "Global" },
      q6:  { A: "Centralised — one team, one place, one playbook",     B: "Decentralised — multiple teams running their own way", C: "Outsourced — most operational work sits with partners",        D: "Mixed — some inside, some outside, depending on the task" },
      q7:  { A: "Front office — sales, marketing, client communication", B: "Back office — admin, finance, reporting, HR",     C: "Operations — production, logistics, service delivery",            D: "Across the board — repetition everywhere" },
      q8:  { A: "We don't know where to start",                        B: "We've tried things and they didn't stick",          C: "Leadership is open, the team isn't ready",                        D: "We're ready, we just need the right plan" },
      q9:  { A: "A public AI is fine — convenience matters more than privacy", B: "A public AI is acceptable for non-sensitive work", C: "A private setup for anything that touches our business",   D: "Fully in-house, on our infrastructure, with maximum privacy" },
      q10: { A: "Mostly in spreadsheets and email",                    B: "Across business tools that don't really talk to each other", C: "In a central system most of the company uses",           D: "In a unified data layer we own and control" },
      q11: { A: "Several, and we're not entirely sure who has what",   B: "A few, clearly scoped",                             C: "Rarely, and only under contract",                                 D: "None" },
      q12: { A: "Clearer on what AI can and can't do for us",          B: "Two or three concrete things working in production", C: "AI woven into how the company runs",                             D: "Fully sovereign — our AI, our data, our infrastructure" },
      q13: { A: "Email is fine",                                       B: "A short call to start",                             C: "A video meeting",                                                 D: "In person, when it makes sense" }
    };

    // Populate hidden payload fields with full-text answers
    document.getElementById('payload-q1').value  = labels.q1[q1]   || q1;
    document.getElementById('payload-q2').value  = labels.q2[q2]   || q2;
    document.getElementById('payload-q3').value  = labels.q3[q3]   || q3;
    document.getElementById('payload-q4').value  = labels.q4[q4]   || q4;
    document.getElementById('payload-q5').value  = labels.q5[q5]   || q5;
    document.getElementById('payload-q6').value  = labels.q6[q6]   || q6;
    document.getElementById('payload-q7').value  = labels.q7[q7]   || q7;
    document.getElementById('payload-q8').value  = labels.q8[q8]   || q8;
    document.getElementById('payload-q9').value  = labels.q9[q9]   || q9;
    document.getElementById('payload-q10').value = labels.q10[q10] || q10;
    document.getElementById('payload-q11').value = labels.q11[q11] || q11;
    document.getElementById('payload-q12').value = labels.q12[q12] || q12;
    document.getElementById('payload-q13').value = labels.q13[q13] || q13;

    // ── AI READINESS SCORE (Q1, Q2, Q8, Q12) — max 11 ──────────────
    let scoreReadiness = 0;
    if      (q1 === 'A') scoreReadiness += 1;
    else if (q1 === 'B') scoreReadiness += 2;
    else if (q1 === 'C') scoreReadiness += 3;
    else if (q1 === 'D') scoreReadiness += 1;

    if      (q2 === 'A') scoreReadiness += 2;
    else if (q2 === 'B') scoreReadiness += 1;
    else if (q2 === 'C') scoreReadiness += 3;
    // q2 === 'D' → +0

    if      (q8 === 'B') scoreReadiness += 1;
    else if (q8 === 'C') scoreReadiness += 2;
    else if (q8 === 'D') scoreReadiness += 3;
    // q8 === 'A' → +0

    if      (q12 === 'B') scoreReadiness += 1;
    else if (q12 === 'C') scoreReadiness += 2;
    else if (q12 === 'D') scoreReadiness += 2;
    // q12 === 'A' → +0

    // ── DATA SOVEREIGNTY SCORE (Q9, Q10, Q11) — max 12 ─────────────
    let scoreSovereignty = 0;
    if      (q9 === 'B') scoreSovereignty += 1;
    else if (q9 === 'C') scoreSovereignty += 3;
    else if (q9 === 'D') scoreSovereignty += 4;

    if      (q10 === 'B') scoreSovereignty += 1;
    else if (q10 === 'C') scoreSovereignty += 2;
    else if (q10 === 'D') scoreSovereignty += 4;

    if      (q11 === 'B') scoreSovereignty += 1;
    else if (q11 === 'C') scoreSovereignty += 3;
    else if (q11 === 'D') scoreSovereignty += 4;

    // ── PROFILE MATRIX ───────────────────────────────────────────────
    const highReadiness   = scoreReadiness   > 5;
    const highSovereignty = scoreSovereignty >= 6;

    let recType;
    if      (!highReadiness && !highSovereignty) recType = 'AI FOUNDATIONS';
    else if (!highReadiness &&  highSovereignty) recType = 'PRIVATE AI PIONEER';
    else if ( highReadiness && !highSovereignty) recType = 'AI SCALE-UP';
    else                                         recType = 'AUTONOMOUS ENTERPRISE';

    document.getElementById('payload-scores').value          = `Readiness: ${scoreReadiness}/11 — Sovereignty: ${scoreSovereignty}/12`;
    document.getElementById('payload-recommendation').value  = recType;
  }

  /* ── PRE-SUBMIT: enrich email subject ────────────────────────────── */

  form.addEventListener('submit', () => {
    // Re-run to capture final Q12/Q13 selections
    calculateRecommendation();

    const recType    = document.getElementById('payload-recommendation').value;
    const clientName = document.getElementById('client-name')?.value    || '';
    const clientCo   = document.getElementById('client-company')?.value || '';
    const subjectEl  = form.querySelector('input[name="_subject"]');

    if (subjectEl && recType) {
      const co = clientCo ? ` — ${clientCo}` : '';
      subjectEl.value = `AI Assessment [${recType}]${co} — ${clientName}`;
    }
  });

});
