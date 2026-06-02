# NativeWorks Assessment — Business Response Analysis & Commercial Routing

**Version** 1.0
**Date** May 2026
**Maintained by** Claude on behalf of James
**Status** Knowledge document — commercial routing framework for business questionnaire responses
**Companion to** `NativeWorks_Assessment_Questionnaire_Business_v2_0.md`

---

## Purpose of this document

The business questionnaire collects 17 answers across six pages. This document is the canonical reference for how those answers translate into:

1. **A signal vector** — five quantified dimensions that describe what kind of prospect we have
2. **A product recommendation** — which NativeWorks product or product combination to lead with
3. **A discovery call playbook** — how to open the conversation, what to ask, what to avoid

The framework is intentionally a *guide*, not a *script*. Odin uses it to prepare each lead for human or human-supervised follow-up. The NativeWorks team retains judgment on every individual case.

---

## The five signal vectors

Every business response decomposes into five vectors. Each is scored 0–4 based on the answers given. Together they describe the prospect.

### Vector 1 — Urgency

How quickly the prospect needs movement. Drives response priority and discovery call tone.

**Inputs** Step 01 *(both questions)*, Step 03 question 3

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 01 Q1 — *We're behind and we know it* | +2 |
| Step 01 Q1 — *We've started experimenting and want a real plan* | +1 |
| Step 01 Q1 — *We're doing well and want to do better* | +1 |
| Step 01 Q1 — *We're not sure — we want an outside read* | 0 |
| Step 01 Q2 — *A competitor moved and we noticed* | +2 |
| Step 01 Q2 — *Our team is stretched thin* | +1 |
| Step 01 Q2 — *Leadership decided AI is a priority this year* | +2 |
| Step 01 Q2 — *Nothing specific — the timing just feels right* | 0 |
| Step 03 Q3 — *We're ready, we just need the right plan* | +1 |
| Step 03 Q3 — *Leadership is open, the team isn't ready* | 0 |
| Step 03 Q3 — *We've tried things and they didn't stick* | 0 |
| Step 03 Q3 — *We don't know where to start* | -1 |

**Range** 0–4 (clamped). 4 = move now. 0 = nurture.

### Vector 2 — Sophistication

Current AI maturity. Drives how technical the discovery call goes and which product tier to lead with.

**Inputs** Step 04 Q3, Step 05 *(all three questions)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 04 Q3 — *AI is already woven into how we work* | +2 |
| Step 04 Q3 — *We've run pilots on specific use cases* | +1 |
| Step 04 Q3 — *Individuals on the team use AI tools on their own* | +1 |
| Step 04 Q3 — *Nothing yet* | 0 |
| Step 05 Q2 — *Unified data layer we own and control* | +1 |
| Step 05 Q2 — *Central system most of the company uses* | +1 |
| Step 05 Q2 — *Across business tools that don't really talk* | 0 |
| Step 05 Q2 — *Mostly spreadsheets and email* | 0 |
| Step 05 Q3 — *No third parties* | +1 |
| Step 05 Q3 — *Several, not entirely sure who has what* | -1 |

**Range** 0–4 (clamped). 4 = mature operation. 0 = ground floor.

### Vector 3 — Sovereignty appetite

How much the prospect *wants* what NativeWorks actually sells. The most important vector. Drives product-line selection.

**Inputs** Step 05 Q1, Step 06 Q1

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 05 Q1 — *Fully in-house, on our infrastructure, with maximum privacy* | +2 |
| Step 05 Q1 — *Private setup for anything that touches our business* | +1 |
| Step 05 Q1 — *Public AI is acceptable for non-sensitive work* | 0 |
| Step 05 Q1 — *Public AI is fine — convenience matters more than privacy* | -1 |
| Step 06 Q1 — *Fully sovereign — our AI, our data, our infrastructure* | +2 |
| Step 06 Q1 — *AI woven into how the company runs* | +1 |
| Step 06 Q1 — *Two or three concrete things working in production* | +1 |
| Step 06 Q1 — *Clearer on what AI can and can't do for us* | 0 |

**Range** -1 to 4 (clamped 0–4). 4 = ready for Sovereign or Empire. 0 = needs education before they're a NativeWorks client.

### Vector 4 — Automation appetite

What the prospect wants AI to *do*. Drives which automation products to lead with.

**Inputs** Step 03 Q2, Step 04 *(all four questions except Q3)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 04 Q4 — *Run the operational layer of our business for us* | +2 |
| Step 04 Q4 — *Improve consistency across the company* | +1 |
| Step 04 Q4 — *Help us scale without hiring proportionally* | +1 |
| Step 04 Q4 — *Give the team back time for higher-value work* | +1 |
| Step 03 Q2 — *Across the board — repetition everywhere* | +1 |
| Step 04 Q1 — *Communication / Reporting / Repetitive tasks* (any) | +1 |
| Step 04 Q2 — *Drafting / Triage / Data entry* (any) | +1 |

**Range** 0–4 (clamped). 4 = ready to deploy automation broadly. 0 = unclear what they want from automation.

### Vector 5 — Budget capacity

Capacity to pay, inferred without ever asking. Drives product-tier selection within a product line.

**Inputs** Step 02 *(all three questions)*, Step 06 Q3 *(role)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 02 Q1 — *Over 1,000 people* | +2 |
| Step 02 Q1 — *250 to 1,000 people* | +1 |
| Step 02 Q1 — *50 to 250 people* | +1 |
| Step 02 Q1 — *Under 50 people* | 0 |
| Step 02 Q3 — *Global / European or cross-border* | +1 |
| Step 02 Q2 — *Professional services / Technology* | +1 |
| Role text contains *CEO, CTO, COO, Founder, Owner, Partner, Director* | +1 |
| Role text contains *Manager, Lead, Head of* | 0 |
| Role text contains *Analyst, Coordinator, Intern, Student* | -1 |

**Range** -1 to 4 (clamped 0–4). 4 = enterprise budget available. 0 = small budget or unclear authority.

---

## Reading the signal vector

A response produces a profile that looks like this:

```
URGENCY:        3 / 4
SOPHISTICATION: 2 / 4
SOVEREIGNTY:    4 / 4
AUTOMATION:     3 / 4
BUDGET:         3 / 4
```

That profile is more informative than any single answer. It tells us:
- This prospect needs to move soon (urgency 3)
- They've already started experimenting (sophistication 2)
- They genuinely want what NativeWorks sells (sovereignty 4 — the depth signal is real)
- They want automation across multiple areas (automation 3)
- They can pay (budget 3)

This is a **lead-with-Stack-and-Foundation-plus-Sovereign** prospect. Move fast.

A different profile —

```
URGENCY:        1 / 4
SOPHISTICATION: 0 / 4
SOVEREIGNTY:    1 / 4
AUTOMATION:     2 / 4
BUDGET:         1 / 4
```

— tells us: curious browser, no urgency, low maturity, doesn't yet want sovereignty, mild automation interest, small budget. This is a **nurture-with-Foundation-only** prospect. Send a written follow-up, no call yet.

---

## Product recommendation matrix

The signal vector maps to a primary product recommendation. The table below is the canonical decision logic.

| Profile pattern | Primary product | Secondary | Posture |
|---|---|---|---|
| Sovereignty ≥3, Budget ≥3 | **Stack + Sovereign** | Foundation if external presence is weak | Lead with sovereignty pitch directly. They're already there. |
| Sovereignty ≥3, Budget 1–2 | **Stack** | Sovereign Ready (monthly) | Sovereignty without enterprise pricing |
| Sovereignty ≥3, Budget ≥3, Sophistication ≥3, scale = enterprise | **Empire** | Stack for individual operators within the org | Long sales cycle, enterprise-grade pitch |
| Automation ≥3, Sovereignty ≤2, Budget ≥2 | **Foundation + Agent** | Stack as graduation path | Lead with automation ROI. Sovereignty as the why-NativeWorks-not-someone-else. |
| Automation ≥3, Sovereignty ≤2, Budget 0–1 | **Foundation** | Agent later | Get them in. Show value. Earn the sovereignty conversation. |
| Urgency ≥3, all others ≤2 | **Foundation (free trial of an automation idea)** | Discovery call only | Fast prospect, unclear product fit. Discovery call is the product for now. |
| Urgency 0–1, Sovereignty ≤1, Budget ≤1 | **Nurture** | Newsletter, content, no call | Curious browsers. Don't burn a call. |
| Sophistication ≥3, Sovereignty ≤1 | **Discovery only, no pitch** | Education first | They know AI. They're not yet sold on sovereignty. Sell them on sovereignty, not on automation. |
| Budget = 0, Role = student/analyst | **No call. Send public resources.** | None | Researchers, not buyers. Help them, don't sell. |
| All vectors 0–1 | **No call. Polite acknowledgment.** | None | Form-filling tourists. Save the team's time. |

**Note on the Foundation + Agent combination.** This is the most common business profile and the highest-volume commercial path. Foundation gets them a sovereign digital presence (low cost, high margin, automation-friendly delivery). Agent gives them the *"run the operational layer of our business for us"* answer to Step 04 Q4. Together they justify the engagement and create the upsell path.

---

## Discovery call playbook

For every prospect that earns a call, Odin prepares a one-page brief for the NativeWorks team. The brief follows this structure.

### Section 1 — Lead with what they told us

The first thing the team says references the answer to **Step 06 Q1** — *Where would you like to be twelve months from now?*

Example openings:

| Answer | Opening line |
|---|---|
| *Clearer on what AI can and can't do for us* | "You told us you want clarity in twelve months. Let's get you there in this conversation." |
| *Two or three concrete things working in production* | "You told us you want two or three concrete things working in twelve months. Tell me which three would matter most." |
| *AI woven into how the company runs* | "You told us you want AI woven into how the company runs in twelve months. That's a real ambition. Let's talk about what that looks like." |
| *Fully sovereign — our AI, our data, our infrastructure* | "You told us you want full sovereignty in twelve months. That tells us a lot about what kind of partner you're looking for. Let's start there." |

This single move — *we read what you wrote* — distinguishes NativeWorks from every other vendor the prospect has spoken to.

### Section 2 — Ask the bridge question

The bridge question is calibrated to **Vector 1 (Urgency)** and **Step 01 Q2** *(what changed)*.

| Trigger | Bridge question |
|---|---|
| *A competitor moved* | "Tell me about the competitor. What did they do, and how did your team find out?" |
| *Our team is stretched thin* | "Where is the strain showing up first? Whose calendar tells the story?" |
| *Leadership decided AI is a priority* | "What does leadership want to be true twelve months from now that isn't true today?" |
| *Nothing specific — the timing just feels right* | "What's been on your mind lately about the way your business runs?" |

### Section 3 — Confirm the friction

Reference **Step 03 Q2** *(where does most of the friction live)* and **Step 04 Q2** *(treadmill)*.

The team confirms the prospect's own diagnosis before offering theirs. Two sentences, no more:

> "You said most of the friction lives in the back office, and that drafting feels most like a treadmill. Before I tell you what we'd do about that, walk me through a typical week — where does the back-office time actually go?"

This earns the right to recommend something.

### Section 4 — The sovereignty bridge

Reference **Step 05 Q1** *(how do you want to run your AI)*. This is where the Trojan Horse opens.

| Answer | Bridge |
|---|---|
| *Fully in-house, on our infrastructure, with maximum privacy* | The prospect is already sold. Skip the pitch. Move to *"let me show you what that looks like."* |
| *Private setup for anything that touches our business* | Mid-funnel. Confirm the why. *"What pushed you toward private rather than public? Is there a specific situation behind it?"* |
| *Public AI is acceptable for non-sensitive work* | Education needed. Ask gently: *"What would you consider sensitive in your business? Most companies underestimate that surface area until they map it."* |
| *Public AI is fine — convenience matters more than privacy* | The hardest case. Don't argue. Ask: *"What would have to change for that to no longer be true?"* The answer tells you whether they're a future client or not. |

### Section 5 — The recommendation

The team makes the recommendation in the language the prospect used. If they said *"treadmill"*, the recommendation references the treadmill. If they said *"team stretched thin"*, the recommendation references the team.

Recommendation should fit on one breath:

> "Based on what you've told me, I'd start with **Foundation** — that gives you a sovereign digital presence as the foundation, with the automation pieces sitting on top. Then we layer **Agent** for the back-office triage you described. And when you're ready, **Sovereign** moves the whole thing onto your own infrastructure. That's the path. We don't have to commit to all of it today — but that's what the path looks like."

### Section 6 — The close

Three options, calibrated to **Vector 1 (Urgency)**:

| Urgency | Close |
|---|---|
| 3–4 | "What does it take to start in the next two weeks?" |
| 2 | "Let's send you a written assessment by Friday. Then we book a follow-up." |
| 0–1 | "Let me put you on our occasional update list. When something changes for you, you have my email." |

---

## Special cases

### The shadow-IT signal

When **Step 04 Q3** answers *"Individuals on the team use AI tools on their own"*, this is a high-value signal. The company is ready for proper AI deployment but lacks coordination. The opportunity is to consolidate.

Lead with: *"You said individuals are using AI on their own. That's the most common starting point for the companies we work with. The question we'd want to help you answer is — what would it look like to take that energy and channel it, instead of leaving it scattered?"*

### The "tried things and they didn't stick" signal

When **Step 03 Q3** answers *"We've tried things and they didn't stick"*, do not pitch. Listen first.

Lead with: *"Before I tell you what we'd do, I want to understand what you tried and why it didn't stick. Failed pilots tell us more than successful ones. Walk me through one."*

This is the most respectful opening for a prospect who has been burned before, and the highest-trust path forward.

### The enterprise signal

When **Vector 5 (Budget)** = 4 AND **Step 02 Q1** = *Over 1,000 people*, this is an Empire conversation, not a Foundation conversation. The call is longer, the sales cycle is months not days, and the decision-maker on the form is rarely the final decision-maker.

Lead with: *"Companies at your scale don't make AI decisions in one conversation. What I'd suggest is — let me understand who else needs to be in the room, and let's design the right sequence of conversations from there."*

### The mismatch signal

When **Sophistication ≥3** AND **Sovereignty ≤1**, the prospect is technically capable but doesn't yet see why NativeWorks is different from any other AI vendor. This is a *positioning* problem, not a *product* problem.

Lead with: *"I want to ask you a different kind of question first. When you imagine your AI stack in three years, whose infrastructure is it running on? Who owns the data it learns from? Those are the questions we exist to answer differently."*

---

## What this framework deliberately does not do

**It does not produce a price.** Pricing is set in the discovery call, calibrated to budget vector and scope. The framework routes; the team prices.

**It does not produce a single-product recommendation in 80% of cases.** Most real prospects get a *combination* — Foundation as entry, Agent for automation, Sovereign as the graduation. The matrix above reflects that reality.

**It does not score the prospect for the prospect.** The signal vector is internal. The prospect never sees it. They see a calm, prepared NativeWorks team that already understands them.

**It does not replace human judgment.** Odin prepares the brief. The team makes the call.

---

## Operational integration

Each questionnaire submission produces three artefacts:

1. **The raw response** — stored in the catalogue, no personal data beyond what the form collected
2. **The signal vector** — computed by Odin, attached to the response record
3. **The discovery call brief** — generated by Odin in the language of the playbook above, ready for the team

The discovery call brief is the only one the team reads. It contains:

- A one-line profile summary
- The five signal vectors with scores
- The recommended product path
- The four opening moves (lead, bridge, friction, sovereignty)
- One paragraph of context — the prospect's own words from the optional free-text field, if any

Briefs are prepared within four hours of submission. Calls are scheduled within two working days, per the form's closing promise.

---

## Change log

**v1.0 — May 2026** — Initial release. Signal vector framework, product recommendation matrix, and discovery call playbook for the business questionnaire (v2.0).
