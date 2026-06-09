# NativeWorks Assessment — Creator Response Analysis & Commercial Routing

**Version** 1.1  
**Date** June 2026  
**Status** Knowledge document — commercial routing framework for creator questionnaire responses (v1.1)  
**Companion to** `assessment.html` (Creator Audit)

---

## Purpose of this document

The creator questionnaire has been simplified from 17 questions to a highly focused 10-step form (9 content questions + 1 contact preference question). This document is the canonical reference for how those answers translate into:

1. **A signal vector** — five quantified dimensions that describe what kind of prospect we have.
2. **A product recommendation** — which NativeWorks product or product combination to lead with.
3. **A discovery call playbook** — how to open the conversation, what to ask, what to avoid.

The framework is intentionally a *guide*, not a *script*. Odin uses it to prepare each lead for human or human-supervised follow-up. The NativeWorks team retains judgment on every individual case.

---

## The five signal vectors

Every creator response decomposes into five vectors. Each is scored 0–4 based on the answers given.

### Vector 1 — Urgency

How quickly the prospect needs movement. For creators, urgency is usually driven by platform fear or a recent platform event.

**Inputs** Step 01 (both Q1 & Q2), Step 03 Q5 (fragility)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q1 (What brought you here today?)** | |
| A — *A platform did something that scared me* | +2 |
| B — *I'm growing and feel dependency tightening* | +1 |
| C — *I want to take ownership before something happens* | +1 |
| D — *I'm curious — explore sovereign setups* | 0 |
| **Q2 (What changed recently?)** | |
| A — *Reach dropped suddenly without explanation* | +2 |
| B — *A platform changed rules, cuts, or policies* | +2 |
| C — *Someone I follow lost their account and business* | +1 |
| D — *Nothing specific — timing feels right* | 0 |
| **Q5 (What is the most fragile part of your operation?)** | |
| A — *My account itself — one strike and over* | +1 |
| B — *My reach — algorithm decides if I exist* | +1 |
| C or D — *Other* | 0 |

**Range** 0–4 (clamped). 4 = move now, they're scared. 0 = curious tourist.

---

### Vector 2 — Sophistication

Current AI and technical maturity. For creators, this maps to how technically equipped they are to use NativeWorks products without heavy hand-holding.

**Inputs** Step 04 Q8 (hosting and AI management posture)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q8 (How do you want to manage audience data and AI?)** | |
| C — *Fully mine — data & AI on hardware I control* | +3 |
| B — *Dedicated hosting (VPS)* | +2 |
| A — *Public AI is fine* | 0 |

**Range** 0–4 (clamped). 4 = ready for technical products like Chain or Agent. 0 = needs Publisher with full onboarding support.

---

### Vector 3 — Sovereignty appetite

How much the prospect *wants* what NativeWorks actually sells. The most important vector. Drives product-line selection.

**Inputs** Step 04 Q7, Step 04 Q8, Step 05 Q9

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q7 (If your main platform shut you down tomorrow, what could you keep?)** | |
| D — *Everything — platform is one channel among many* | +2 |
| C — *Most of it — backups and direct channels* | +1 |
| B or A — *Subscriber emails only or Almost nothing* | 0 |
| **Q8 (How do you want to manage audience data and AI?)** | |
| C — *Fully mine — data & AI on hardware I control* | +2 |
| B — *Dedicated hosting (VPS)* | +1 |
| A — *Public AI is fine* | -1 |
| **Q9 (Where would you like to be twelve months from now?)** | |
| D — *Fully sovereign — audience, keys, rules* | +2 |
| C — *Running own publishing and payment infrastructure* | +1 |
| B or A — *Earning more directly / Less anxious* | 0 |

**Range** 0–4 (clamped 0–4). 4 = ready for Stack or Sovereign. 0 = needs the conversation, not the product.

---

### Vector 4 — Automation appetite

What the creator wants AI to *do*. Drives which automation products to lead with.

**Inputs** Step 03 Q6 (where would automation help you most)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q6 (Where would automation help you most?) [Select multiple]** | |
| C — *Reply to DMs and comments automatically* | +2 |
| D — *Run operational layer of business* | +2 |
| A — *Give me back time to make better work* | +1 |
| B — *Help me stay consistent without burning out* | +1 |

**Range** 0–4 (clamped). 4 = ready for full automation stack. 0 = wants nothing automated yet.

---

### Vector 5 — Earning capacity

Inferred earning capacity. Drives product-tier selection.

**Inputs** Step 02 Q3 (audience size), Step 02 Q4 (income source)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q3 (How large is your audience?)** | |
| D — *Over 500,000* | +3 |
| C — *50,000 to 500,000* | +2 |
| B — *5,000 to 50,000* | +1 |
| A — *Under 5,000* | 0 |
| **Q4 (Where does most of your income come from?)** | |
| D — *Products / services sold directly* | +1 |
| C — *Direct audience support (memberships/subs)* | +1 |
| B or A — *Brand deals or Platform ad revenue* | 0 |

**Range** 0–4 (clamped). 4 = full earning operation. 0 = building, not earning yet.

---

## Reading the signal vector

A creator response produces an internal profile like this:
```
URGENCY:        4 / 4
SOPHISTICATION: 0 / 4
SOVEREIGNTY:    3 / 4
AUTOMATION:     3 / 4
EARNING:        2 / 4
```

This profile tells us:
- Something just happened on a platform and they're scared (urgency 4).
- They're not very technical (sophistication 0).
- They want what we sell (sovereignty 3).
- They want automation, especially community/DM management (automation 3).
- Mid-tier earner, audience 5k–50k probably (earning 2).

This is a **Publisher + Sovereign Ready** prospect. High urgency, high sovereignty intent, low technical sophistication — they need a guided onboarding, not a complex technical setup.

---

## Product recommendation matrix

| Profile pattern | Primary product | Secondary | Posture |
|---|---|---|---|
| Sovereignty ≥3, Sophistication ≥2, Earning ≥3 | **Stack + Chain** | Agent for community | Peer-to-peer pitch. They're already sovereign-fluent. |
| Sovereignty ≥3, Sophistication ≤1, Earning ≥2 | **Publisher + Sovereign Ready** | Stack as graduation path | Guided onboarding. Lead with the platform-fear answer. |
| Sovereignty ≥3, Earning ≤1 | **Publisher** | Sovereign Ready monthly | Affordable entry. Establish the relationship. |
| Automation ≥3, Earning ≥2 | **Publisher + Agent** | Stack as graduation path | Lead with automation. Sovereignty as the *"and by the way."* |
| Urgency = 4, Earning ≥2 | **Publisher (stops the bleeding)** | Bridge to migrate existing audience | They're scared. The product is whatever stops the bleeding fastest. |
| Q4 = *Products/services sold directly*, Earning ≥3 | **Till + Stack + Publisher** | Sovereign as graduation | They already sell. Add sovereign payments and identity, then graduate. |
| Q4 = *Direct audience support*, Sovereignty ≥3 | **Publisher + Stack** | Lightning payments via European node | The classic creator-to-sovereign migration. High conversion. |
| Audience ≥500k, Sophistication ≥2 | **Empire (creator edition)** | Custom build | Top-tier creators with team and infrastructure needs. |
| Urgency ≤1, Sovereignty ≤1, Earning ≤1 | **Nurture** | Newsletter, content, no call | Aspiring creators, curious browsers. Don't burn the team's time. |
| All vectors 0–1 | **No call. Polite acknowledgment.** | None | Tourists. |

---

## Discovery call playbook

### Section 1 — Lead with what they told us
The first thing the team says references **Q9** — *Where would you like to be twelve months from now?*

| Q9 Selected Option | Opening line |
|---|---|
| *Less anxious about platform dependence* | "You told us you want to feel less anxious about platforms in twelve months. That's an honest answer and we take it seriously. Let's talk about what would actually make that true." |
| *Earning more directly* | "You told us you want to earn more directly from your audience in twelve months. Tell me about your audience first — who are they, and what's the relationship?" |
| *Running own publishing and payment infrastructure* | "You told us you want to run your own infrastructure in twelve months. That's a real ambition. Let's talk about what gets you there." |
| *Fully sovereign — audience, keys, rules* | "You told us you want full sovereignty. That tells us a lot about what kind of partner you're looking for. Let's start there." |

### Section 2 — Ask the bridge question
The bridge question is calibrated to **Vector 1 (Urgency)** and **Q2** *(what changed)*.

| Trigger | Bridge question |
|---|---|
| *Reach dropped suddenly* | "Tell me about the reach drop. When did it start, what changed, and what have you tried?" |
| *A platform changed rules, cuts, or policies* | "Which platform, and what did they change? Has it affected your income yet?" |
| *Someone I follow lost their account* | "Tell me about that. What happened to them, and what was your first thought when you saw it?" |
| *Nothing specific* | "What's been on your mind lately about your situation?" |

---

## Change log

* **v1.0 — May 2026** — Initial release. Signal vector framework and discovery playbook for the 17-question unified form.
* **v1.1 — June 2026** — Updated for the simplified 9-question Creator questionnaire (`assessment.html`) and restructured scoring vectors.
