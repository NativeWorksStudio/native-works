document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('assessment-form');
  if (!form) return;

  let currentStep = 1;
  const totalSteps = 4; // Step 5 is results

  // DOM Elements
  const stepCountText = document.getElementById('step-count');
  const stepLabelText = document.getElementById('step-label');
  const progressBar = document.getElementById('progress-line');
  
  const steps = {
    1: document.getElementById('step-1'),
    2: document.getElementById('step-2'),
    3: document.getElementById('step-3'),
    4: document.getElementById('step-4'),
    5: document.getElementById('step-results')
  };

  const btnNext = document.getElementById('btn-next');
  const btnBack = document.getElementById('btn-back');
  const btnSubmit = document.getElementById('btn-submit');

  const optionCards = document.querySelectorAll('.option-card');

  // Step names for progress header
  const stepNames = {
    1: 'AI Familiarity',
    2: 'Workflow',
    3: 'Digital Presence',
    4: 'Sovereignty',
    5: 'Sovereign Match'
  };

  /* ── OPTION CARDS INTERACTION & STATE ────────────────────────────────────── */
  
  // Set initial selected classes on page load (if any are pre-checked)
  optionCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    
    // Add selected class if checked
    if (radio && radio.checked) {
      card.classList.add('selected');
    }

    // Connect hover and click events
    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    
    card.addEventListener('click', (e) => {
      // If we clicked the radio itself, let it bubble. Otherwise toggle it programmatically.
      if (e.target !== radio) {
        radio.checked = true;
      }
      
      // Update visual selection states
      const groupName = radio.getAttribute('name');
      const siblings = document.querySelectorAll(`.option-card input[name="${groupName}"]`);
      
      siblings.forEach(siblingInput => {
        const siblingCard = siblingInput.closest('.option-card');
        if (siblingCard) {
          siblingCard.classList.remove('selected');
          siblingCard.setAttribute('aria-checked', 'false');
        }
      });
      
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');

      // Add a premium cursor hover feedback triggers
      document.body.classList.add('cursor-hover');
      setTimeout(() => document.body.classList.remove('cursor-hover'), 200);
      
      validateCurrentStep(false);
    });

    // Keyboard support - since native radios are visually hidden
    radio.addEventListener('focus', () => {
      card.classList.add('focus-within');
    });

    radio.addEventListener('blur', () => {
      card.classList.remove('focus-within');
    });

    // Support trigger by pressing Enter key on the card label
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
        card.click();
      }
    });
  });

  /* ── STEP VALIDATION ─────────────────────────────────────────────────────── */
  
  function validateCurrentStep(showAlert = true) {
    if (currentStep > totalSteps) return true;
    
    const stepContainer = steps[currentStep];
    const radios = stepContainer.querySelectorAll('input[type="radio"]');
    
    // Find all distinct group names in this step
    const groupNames = new Set();
    radios.forEach(radio => {
      const name = radio.getAttribute('name');
      if (name) groupNames.add(name);
    });
    
    // Verify that every single radio group has a checked button
    let allGroupsChecked = true;
    const uncheckedGroups = [];
    
    groupNames.forEach(name => {
      const checkedRadio = stepContainer.querySelector(`input[name="${name}"]:checked`);
      if (!checkedRadio) {
        allGroupsChecked = false;
        uncheckedGroups.push(name);
      }
    });
    
    if (!allGroupsChecked) {
      if (showAlert) {
        // Create an elegant inline validation message
        let errorMsg = stepContainer.querySelector('.wizard-error-msg');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.className = 'wizard-error-msg';
          errorMsg.style.color = 'var(--true-north)';
          errorMsg.style.fontSize = '12px';
          errorMsg.style.marginTop = '16px';
          errorMsg.style.textAlign = 'center';
          errorMsg.style.letterSpacing = '1px';
          errorMsg.style.textTransform = 'uppercase';
          errorMsg.textContent = 'Please answer all questions to proceed.';
          
          const header = stepContainer.querySelector('.wizard-step-header');
          if (header) {
            header.appendChild(errorMsg);
          }
        }
        
        // Shake animation on the option grids for premium feedback
        const grids = stepContainer.querySelectorAll('.options-grid');
        grids.forEach(grid => {
          grid.style.animation = 'none';
          void grid.offsetWidth; // Force reflow
          grid.style.animation = 'shake 0.4s ease';
        });
      }
      return false;
    }
    
    // Clear validation error if any
    const errorMsg = stepContainer.querySelector('.wizard-error-msg');
    if (errorMsg) {
      errorMsg.remove();
    }
    
    return true;
  }

  /* ── NAVIGATION LOGIC ────────────────────────────────────────────────────── */

  function updateWizardUI() {
    // Hide all steps, activate the current one
    Object.keys(steps).forEach(stepNum => {
      const el = steps[stepNum];
      if (parseInt(stepNum) === currentStep) {
        el.classList.add('active');
        // Focus the title for screen-readers
        const title = el.querySelector('.wizard-step-title');
        if (title) {
          title.setAttribute('tabindex', '-1');
          title.focus();
        }
      } else {
        el.classList.remove('active');
      }
    });

    // Update progress header details
    if (currentStep <= totalSteps) {
      stepCountText.textContent = `0${currentStep} / 0${totalSteps}`;
      stepLabelText.textContent = stepNames[currentStep];
      const percentage = (currentStep / totalSteps) * 100;
      progressBar.style.width = `${percentage}%`;
      
      // Update next button label
      if (currentStep === totalSteps) {
        btnNext.textContent = 'Analyze Sovereignty →';
      } else {
        btnNext.textContent = 'Next Step →';
      }
      
      btnBack.classList.toggle('visually-hidden', currentStep === 1);
      btnNext.classList.remove('visually-hidden');
      btnSubmit.classList.add('visually-hidden');
    } else {
      // Results step reached
      stepCountText.textContent = `04 / 04`;
      stepLabelText.textContent = 'Sovereign Match';
      progressBar.style.width = '100%';
      
      btnBack.classList.add('visually-hidden');
      btnNext.classList.add('visually-hidden');
      btnSubmit.classList.remove('visually-hidden');
      
      // Calculate diagnostics
      calculateRecommendation();
    }

    // Scroll smoothly to top of form section
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  /* ── DIAGNOSTIC CALCULATION ALGORITHM ────────────────────────────────────── */

  function calculateRecommendation() {
    // Retrieve selected values
    const q1 = form.querySelector('input[name="q1"]:checked')?.value || '';
    const q2 = form.querySelector('input[name="q2"]:checked')?.value || '';
    const q3 = form.querySelector('input[name="q3"]:checked')?.value || '';
    const q4 = form.querySelector('input[name="q4"]:checked')?.value || '';
    const q5 = form.querySelector('input[name="q5"]:checked')?.value || '';
    const q6 = form.querySelector('input[name="q6"]:checked')?.value || '';

    // Label maps — full text for each question option
    const labels = {
      q1: {
        A: "I don't use AI yet",
        B: "I try things occasionally but nothing sticks",
        C: "I use one or two tools regularly for specific tasks",
        D: "AI is part of how I work every day"
      },
      q2: {
        A: "Nowhere, I haven't found a real use yet",
        B: "Writing or editing content",
        C: "Visuals or creative production",
        D: "Automating repetitive tasks"
      },
      q3: {
        A: "Creating content consistently",
        B: "Managing clients or audience communication",
        C: "Running the technical side of my business",
        D: "Juggling too many tools at once"
      },
      q4: {
        A: "I would publish more without burning out",
        B: "I would spend less time on admin",
        C: "I would grow my audience without depending on algorithms",
        D: "My business would run even when I am not online"
      },
      q5: {
        A: "Mainly on social media",
        B: "On a platform like Shopify, Substack or Squarespace",
        C: "I have a website but still rely on platforms for reach or revenue",
        D: "My own site on my own infrastructure"
      },
      q6: {
        A: "Everything, I would have to start over",
        B: "A lot, reach and revenue would take a serious hit",
        C: "Some, I would recover but it would hurt",
        D: "Nothing, I own my infrastructure independently"
      }
    };

    // Hidden input updates — full text labels for a readable email
    document.getElementById('payload-q1').value = labels.q1[q1] || q1;
    document.getElementById('payload-q2').value = labels.q2[q2] || q2;
    document.getElementById('payload-q3').value = labels.q3[q3] || q3;
    document.getElementById('payload-q4').value = labels.q4[q4] || q4;
    document.getElementById('payload-q5').value = labels.q5[q5] || q5;
    document.getElementById('payload-q6').value = labels.q6[q6] || q6;

    // Weight variables
    let scoreAI = 0;
    let scoreVuln = 0;

    // AI Familiarity Indices
    // Q1: How do you use AI tools today?
    if (q1 === 'A') scoreAI += 0;
    else if (q1 === 'B') scoreAI += 1;
    else if (q1 === 'C') scoreAI += 3;
    else if (q1 === 'D') scoreAI += 5;

    // Q2: Where does AI actually help you right now?
    if (q2 === 'A') scoreAI += 0;
    else if (q2 === 'B') scoreAI += 2;
    else if (q2 === 'C') scoreAI += 3;
    else if (q2 === 'D') scoreAI += 5;

    // Platform Vulnerability Indices
    // Q4: If AI worked perfectly for you tomorrow, what would change first?
    if (q4 === 'C') scoreVuln += 2;

    // Q5: Where does your business live right now?
    if (q5 === 'A') scoreVuln += 5;
    else if (q5 === 'B') scoreVuln += 4;
    else if (q5 === 'C') scoreVuln += 2;
    else if (q5 === 'D') scoreVuln += 0;

    // Q6: If one of those platforms changed its rules tomorrow, what would you lose?
    if (q6 === 'A') scoreVuln += 5;
    else if (q6 === 'B') scoreVuln += 4;
    else if (q6 === 'C') scoreVuln += 2;
    else if (q6 === 'D') scoreVuln += 0;

    // Determine matrix profile
    const isHighAI = scoreAI > 4;
    const isHighVuln = scoreVuln >= 5;

    let recType = '';
    let recBadgeClass = '';
    let recBadgeText = '';
    let recTitleText = '';
    let recDescText = '';

    if (isHighVuln && !isHighAI) {
      recType = 'starter';
      recBadgeClass = 'badge-foundation';
      recBadgeText = 'Sovereign AI Starter';
      recTitleText = 'Sovereign AI Starter Profile';
      recDescText = 'You currently operate on high platform dependency with minimal AI integration. This leaves your reach and revenue vulnerable to sudden algorithmic shifts or policy changes, while manual workflows consume your valuable time. We have received your assessment and our strategist will reach out within 24 hours to schedule a custom digital audit. On our call, we will design a step-by-step roadmap to transition your audience onto owned channels with simple, intuitive tools that require no technical complexity.';
    } else if (isHighVuln && isHighAI) {
      recType = 'powerhouse';
      recBadgeClass = 'badge-stack';
      recBadgeText = 'Sovereign AI Powerhouse';
      recTitleText = 'Sovereign AI Powerhouse Profile';
      recDescText = 'You are an active AI user, but your business still resides on rented land — social media, proprietary e-commerce hosts, or SaaS distribution platforms. While you leverage automation, you are heavily exposed to platform fees and sudden distribution filters. We have received your assessment. Our strategist will contact you to map out a programmatic migration and outline how to build self-hosted engines that bypass platform rent-seeking entirely.';
    } else if (!isHighVuln && !isHighAI) {
      recType = 'optimizer';
      recBadgeClass = 'badge-foundation';
      recBadgeText = 'Sovereign AI Optimizer';
      recTitleText = 'Sovereign AI Optimizer Profile';
      recDescText = 'You have successfully built an independent infrastructure — your own website, self-managed tools, or independent hosting — which is highly secure and resilient. However, you are not yet leveraging the time-saving power of automated intelligence, meaning too many hours go to manual administrative tasks. Our architect will reach out shortly to discuss integrating lightweight AI agents into your existing sovereign system without compromising your privacy or control.';
    } else {
      recType = 'autonomous';
      recBadgeClass = 'badge-stack';
      recBadgeText = 'Autonomous Sovereign';
      recTitleText = 'Autonomous Sovereign Profile';
      recDescText = 'You represent the vanguard of the digital economy: you own your infrastructure independently and are highly fluent in AI. You are primed for absolute operational freedom. Our lead architect will contact you to schedule an advanced technical design session focused on deploying self-custodied containerized AI agents, offline local model runners, and automated multi-channel publication loops directly on your own hardware.';
    }

    // UI Elements to modify
    const recBadge = document.getElementById('rec-badge');
    const recTitle = document.getElementById('rec-title');
    const recDesc = document.getElementById('rec-desc');

    // Build hidden data payloads for submission
    document.getElementById('payload-scores').value = `AI score: ${scoreAI}/10, Vulnerability score: ${scoreVuln}/12`;
    document.getElementById('payload-recommendation').value = recType.toUpperCase();

    // Set UI elements dynamically
    if (recBadge) {
      recBadge.textContent = recBadgeText;
      recBadge.className = `recommendation-badge ${recBadgeClass}`;
    }
    if (recTitle) {
      recTitle.textContent = recTitleText;
    }
    if (recDesc) {
      recDesc.textContent = recDescText;
    }
  }


  // Pre-submit validation to compile full body values
  form.addEventListener('submit', (e) => {
    // Subject customization based on result
    const recType = document.getElementById('payload-recommendation').value;
    const clientName = document.getElementById('client-name').value;
    const emailSubjectInput = form.querySelector('input[name="_subject"]');
    
    if (emailSubjectInput) {
      emailSubjectInput.value = `Sovereignty Assessment [${recType}] — ${clientName}`;
    }
    
    // Let the form submit naturally to FormSubmit.co
  });
});

