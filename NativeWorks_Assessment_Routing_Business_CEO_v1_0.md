# NativeWorks Assessment — Business CEO Strategic Routing Specification

**Version** 1.0  
**Date** June 2026  
**Status** Knowledge document — commercial routing framework for Business CEO questionnaire responses  
**Companion to** `business-ceo-assessment.html` (CEO Strategic Audit)

---

## Purpose of this document

The Business CEO questionnaire is a 4-step wizard form collecting high-level operational context, company scale, friction points, and 12-month goals. This document is the canonical reference for how those answers translate into:

1. **A signal vector** — four quantified dimensions that describe what kind of business prospect we have.
2. **A product recommendation** — which NativeWorks product or product combination to lead with.
3. **A discovery call playbook** — how to open the conversation, what to ask, what to avoid.

The framework is a *guide* for Odin to prepare discovery call briefs for the sales team.

---

## The four signal vectors

Every CEO response decomposes into four vectors. Each is scored 0–4 based on the answers given.

### Vector 1 — Urgency

How quickly the prospect needs movement. Drives response priority and discovery call posture.

**Inputs** Step 01 Q1, Step 01 Q2, Step 04 Q7 (12-month vision)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q1 (What brought you here today?)** | |
| A — *We're behind on AI adoption and we know it* | +2 |
| B or C — *Experimenting / Scaling automation* | +1 |
| D — *Not sure / curiosity* | 0 |
| **Q2 (What changed recently?)** | |
| A — *A competitor launched an AI feature and we noticed* | +2 |
| C — *Leadership decided data security & AI is our top priority* | +2 |
| B — *Our operational team is stretched thin* | +1 |
| D — *Nothing specific — timing feels right* | 0 |
| **Q7 (Where would you like to be in 12 months?) [Select multiple]** | |
| D — *Fully sovereign — private models, data, and hardware* | +1 |

**Range** 0–4 (clamped). 4 = move now. 0 = low priority.

---

### Vector 2 — Automation Appetite

What the business wants AI to *do*. Drives the selection of automation layers (e.g. Agent vs Foundation).

**Inputs** Step 03 Q5 (friction), Step 03 Q6 (desired AI actions)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q5 (Where does most operational friction live?)** | |
| D — *Across the board — repetitive work is everywhere* | +1 |
| C — *Operations — production, logistics, client onboarding* | +1 |
| A or B — *Front office / Back office* | 0 |
| **Q6 (What would you want AI to do for your business?) [Select multiple]** | |
| D — *Run the operational layer of our business for us* | +2 |
| A, B, or C — *Give time back / Scale operations / Improve compliance* | +1 |

**Range** 0–4 (clamped). 4 = ready to deploy broad automation. 0 = low appetite/unclear outcomes.

---

### Vector 3 — Sovereignty Appetite

How much the prospect values private stacks and data compliance. Drives product-line selection.

**Inputs** Step 04 Q7 (12-month vision)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q7 (Where would you like to be in 12 months?) [Select multiple]** | |
| D — *Fully sovereign — private models, data, and hardware* | +3 |
| C — *AI agents woven into how the company runs daily* | +2 |
| B — *Two or three concrete things working in production* | +1 |
| A — *Clearer on what AI can and cannot do for us* | 0 |

**Range** 0–4 (clamped). 4 = ready for Sovereign or Empire. 0 = needs education.

---

### Vector 4 — Budget Capacity

Capacity to pay, inferred from scale and roles. Drives product-tier selection.

**Inputs** Step 02 Q3 (size), Step 02 Q4 (domain), client-role field text

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q3 (How big is your company?)** | |
| D — *Over 1,000 people* | +2 |
| C or B — *250-1000 people / 50-250 people* | +1 |
| A — *Under 50 people* | 0 |
| **Q4 (What does your company do?)** | |
| B — *Sells professional services or expertise* | +1 |
| D — *Builds technology, software, or media platforms* | +1 |
| A or C — *Physical goods / B2C e-commerce* | 0 |
| **Client Role (Name matching keywords)** | |
| High Authority (*CEO, COO, Founder, Owner, President, Director, Partner*) | +1 |
| Low Authority (*Analyst, Coordinator, Intern, Student*) | -1 |

**Range** 0–4 (clamped). 4 = enterprise budget available. 0 = small budget or low authority.

---

## Product recommendation matrix

| Profile pattern | Primary product | Secondary | Posture |
|---|---|---|---|
| Sovereignty ≥3, Budget ≥3, Company size = Over 1000 | **Empire** | Stack for sub-teams | Enterprise sales cycle; custom architecture briefing. |
| Sovereignty ≥3, Budget ≥3 | **Stack + Sovereign** | Foundation for external site | Lead with private stack sovereignty, GDPR compliance, and compute ROI. |
| Sovereignty ≥3, Budget 1–2 | **Stack** | Sovereign Ready (monthly) | Sovereignty without enterprise pricing. |
| Automation ≥3, Sovereignty ≤2, Budget ≥2 | **Foundation + Agent** | Stack as graduation path | Lead with automation ROI. Sovereignty as the primary differentiator. |
| Automation ≥3, Sovereignty ≤2, Budget ≤1 | **Foundation** | Agent later | Establish trust. Demonstrate immediate manual task reduction. |
| All vectors 0–1 | **Nurture / Newsletter** | None | Curated updates; do not block calendar. |

---

## Discovery call playbook

### Section 1 — Lead with what they told us
Reference **Q7** — *Where would you like to be twelve months from now?*

| Q7 Option | Opening line |
|---|---|
| *Clearer on what AI can and cannot do* | "You told us you want clarity on what AI can and can't do in twelve months. Let's get you that clarity in this conversation." |
| *Two or three concrete things working* | "You told us you want two or three concrete things working in twelve months. Let's target which three processes would save the most overhead." |
| *AI agents woven into daily run* | "You told us you want AI agents woven into your daily operations in twelve months. That's a real operational transformation. Let's talk about what that looks like." |
| *Fully sovereign — private stack* | "You told us you want full sovereignty. That tells us a lot about what kind of partner you're looking for. Let's start with your security and compliance parameters." |

### Section 2 — Ask the bridge question
Calibrated to **Vector 1 (Urgency)** and **Q2** *(what changed)*.

| Trigger | Bridge question |
|---|---|
| *A competitor launched an AI feature* | "Tell me about the competitor. What did they launch, and how is it impacting your market position?" |
| *Our operational team is stretched thin* | "Where is the strain showing up first? Whose calendar tells the story?" |
| *Leadership decided security & AI is top priority* | "What does leadership want to be true twelve months from now that isn't true today?" |
| *Nothing specific — timing feels right* | "What's been on your mind lately about how the business runs?" |

### Section 3 — Confirm the friction
Reference **Q5** *( friction location )* and **Q6** *( desired automation )*.
> "You said most of the friction lives in the [front/back office] and you want to [scale operations/save time]. Walk me through a typical week — where does the operational time actually go?"

---

## Change log

* **v1.0 — June 2026** — Initial release. Separated from the unified assessment document to focus specifically on the Business CEO Strategic Audit track.
