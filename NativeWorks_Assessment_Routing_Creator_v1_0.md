# NativeWorks Assessment — Creator Response Analysis & Commercial Routing

**Version** 1.0
**Date** May 2026
**Maintained by** Claude on behalf of James
**Status** Knowledge document — commercial routing framework for creator questionnaire responses
**Companion to** `NativeWorks_Assessment_Questionnaire_Creator_v1_0.md`

---

## Purpose of this document

The creator questionnaire collects 17 answers across six pages. This document is the canonical reference for how those answers translate into:

1. **A signal vector** — five quantified dimensions that describe what kind of prospect we have
2. **A product recommendation** — which NativeWorks product or product combination to lead with
3. **A discovery call playbook** — how to open the conversation, what to ask, what to avoid

The framework is intentionally a *guide*, not a *script*. Odin uses it to prepare each lead for human or human-supervised follow-up. The NativeWorks team retains judgment on every individual case.

The framework is structurally parallel to the business routing framework. The vectors carry the same names. The values they measure are creator-shaped.

---

## The five signal vectors

Every creator response decomposes into five vectors. Each is scored 0–4 based on the answers given.

### Vector 1 — Urgency

How quickly the prospect needs movement. For creators, urgency is usually driven by platform fear or a recent platform event.

**Inputs** Step 01 *(both questions)*, Step 03 Q3 *(fragility)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 01 Q1 — *A platform did something that scared me* | +2 |
| Step 01 Q1 — *I'm growing and I can feel the dependency tightening* | +1 |
| Step 01 Q1 — *I want to take ownership before something happens* | +1 |
| Step 01 Q1 — *I'm curious — I've been hearing about this* | 0 |
| Step 01 Q2 — *Reach dropped without explanation* | +2 |
| Step 01 Q2 — *A platform changed its rules or its cut* | +2 |
| Step 01 Q2 — *Someone I follow lost their account* | +1 |
| Step 01 Q2 — *Nothing specific — the timing just feels right* | 0 |
| Step 03 Q3 — *My account itself — one strike and it's over* | +1 |
| Step 03 Q3 — *My reach — the algorithm decides whether I exist* | +1 |

**Range** 0–4 (clamped). 4 = move now, they're scared. 0 = curious tourist.

### Vector 2 — Sophistication

Current AI maturity. For creators, this maps to how technically equipped they are to use NativeWorks products without heavy hand-holding.

**Inputs** Step 02 Q3 *(tenure)*, Step 04 Q3 *(AI history)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 04 Q3 — *I'm building real workflows around AI already* | +2 |
| Step 04 Q3 — *Production tools — visuals, voice, transcripts* | +1 |
| Step 04 Q3 — *Writing and editing tools, occasionally* | +1 |
| Step 04 Q3 — *Nothing yet — I haven't found the right way in* | 0 |
| Step 02 Q3 — *Long enough that the platforms have changed under me* | +1 |
| Step 02 Q3 — *Three to seven years* | +1 |
| Step 02 Q3 — *One to three years* | 0 |
| Step 02 Q3 — *Under a year* | 0 |

**Range** 0–4 (clamped). 4 = ready for technical products like Chain or Agent. 0 = needs Publisher with full onboarding support.

### Vector 3 — Sovereignty appetite

How much the prospect *wants* what NativeWorks actually sells. The most important vector. Drives product-line selection.

**Inputs** Step 05 *(all three questions)*, Step 06 Q1

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 05 Q1 — *Everything — my platform is one channel among many I control* | +2 |
| Step 05 Q1 — *Most of it — I have backups and direct channels* | +1 |
| Step 05 Q1 — *My subscriber emails, if I've been collecting them* | 0 |
| Step 05 Q1 — *Almost nothing — my audience lives there* | 0 |
| Step 05 Q2 — *I want to own my presence end to end* | +2 |
| Step 05 Q2 — *I'm actively trying to reduce my exposure* | +1 |
| Step 05 Q2 — *I'd leave if there were somewhere to go* | +1 |
| Step 05 Q2 — *They're necessary, and I try not to think about it* | -1 |
| Step 05 Q3 — *Fully mine — my AI, my data, on infrastructure I control* | +1 |
| Step 05 Q3 — *Public AI is fine* | -1 |
| Step 06 Q1 — *Fully sovereign — my audience, my keys, my rules* | +2 |
| Step 06 Q1 — *Running my own publishing and payment infrastructure* | +1 |

**Range** -2 to 4 (clamped 0–4). 4 = ready for Stack or Sovereign. 0 = needs the conversation, not the product.

**Important asymmetry from the business form.** A creator who answers *"Almost nothing — my audience lives there"* on Step 05 Q1 scores 0, not negative. The honest answer is the *most* useful sovereignty signal we can get — it tells us the prospect understands their exposure even if they haven't yet acted on it. Negative scoring would punish honesty.

### Vector 4 — Automation appetite

What the creator wants AI to *do*. Drives which automation products to lead with.

**Inputs** Step 04 *(all four questions)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 04 Q4 — *Run the operational layer of my business for me* | +2 |
| Step 04 Q4 — *Let me reply to my audience properly without it eating my life* | +2 |
| Step 04 Q4 — *Help me stay consistent without burning out* | +1 |
| Step 04 Q4 — *Give me back time to make better work* | +1 |
| Step 04 Q1 — *Everything around the content (logistics) / Talking to my audience / Running the business* | +1 |
| Step 04 Q2 — *Repurposing / Replying / Reporting* | +1 |

**Range** 0–4 (clamped). 4 = ready for full automation stack. 0 = wants nothing automated yet.

**Why replying scores higher here than in the business form.** For creators, audience replies and DM management are the single highest-conversion automation entry point. A creator who answers *"let me reply to my audience properly"* is telling us their community-management workload is unsustainable — which is exactly the wedge where Publisher and Agent products land best.

### Vector 5 — Earning capacity

Inferred earning capacity, never asked directly. Drives product-tier selection.

**Inputs** Step 02 Q2 *(audience size)*, Step 03 Q1 *(income source)*, Step 03 Q2 *(platform exposure)*

**Scoring**

| Signal | Score contribution |
|---|---|
| Step 02 Q2 — *Over 500,000* | +2 |
| Step 02 Q2 — *50,000 to 500,000* | +1 |
| Step 02 Q2 — *5,000 to 50,000* | +1 |
| Step 02 Q2 — *Under 5,000* | 0 |
| Step 03 Q1 — *Products or services I sell directly* | +1 |
| Step 03 Q1 — *Direct support from my audience — subscriptions, memberships, tips* | +1 |
| Step 03 Q1 — *Brand deals and sponsorships* | +1 |
| Step 03 Q1 — *Platform ad revenue or platform payouts* | 0 |
| Step 03 Q2 — *My income comes from channels I control directly* | +1 |
| Step 03 Q2 — *Heavily — if one platform goes down, my income goes with it* | 0 |

**Range** 0–4 (clamped). 4 = full earning operation. 0 = building, not earning yet.

**Why audience size alone isn't enough.** A 100k-follower creator running on platform ad revenue alone may earn less than a 10k-follower creator selling direct products. The combination of audience size, income source, and platform exposure gives a much better read than any single signal.

---

## Reading the signal vector

A creator response produces a profile like this:

```
URGENCY:        4 / 4
SOPHISTICATION: 1 / 4
SOVEREIGNTY:    3 / 4
AUTOMATION:     3 / 4
EARNING:        2 / 4
```

This profile tells us:
- Something just happened on a platform and they're scared (urgency 4)
- They're not very technical (sophistication 1)
- They want what we sell (sovereignty 3)
- They want automation, especially community management (automation 3)
- Mid-tier earner, audience 5k–50k probably (earning 2)

This is a **Publisher + Sovereign Ready** prospect. High urgency, high sovereignty intent, low technical sophistication — they need a guided onboarding, not a technical product.

A different profile —

```
URGENCY:        0 / 4
SOPHISTICATION: 4 / 4
SOVEREIGNTY:    4 / 4
AUTOMATION:     2 / 4
EARNING:        4 / 4
```

— is a *very different* prospect. Mature operator, fully sovereign-aware, technically sophisticated, established earner, no fire under them. This is a **Chain + Stack** prospect, and the conversation is partnership, not pitch.

---

## Product recommendation matrix

| Profile pattern | Primary product | Secondary | Posture |
|---|---|---|---|
| Sovereignty ≥3, Sophistication ≥3, Earning ≥3 | **Stack + Chain** | Agent for community | Peer-to-peer pitch. They're already sovereign-fluent. |
| Sovereignty ≥3, Sophistication ≤2, Earning ≥2 | **Publisher + Sovereign Ready** | Stack as graduation path | Guided onboarding. Lead with the platform-fear answer. |
| Sovereignty ≥3, Sophistication ≤2, Earning ≤1 | **Publisher** | Sovereign Ready monthly | Affordable entry. Establish the relationship. |
| Automation ≥3, Sovereignty ≤2, Earning ≥2 | **Publisher + Agent** | Stack as graduation path | Lead with automation. Sovereignty as the *"and by the way."* |
| Urgency = 4, any sophistication, any sovereignty, Earning ≥2 | **Foundation / Publisher (whichever fits the medium)** | Bridge to migrate existing audience | They're scared. The product is whatever stops the bleeding fastest. |
| Step 03 Q1 = *Products or services I sell directly*, Earning ≥3 | **Till + Stack + Publisher** | Sovereign as graduation | They already sell. Add sovereign payments and identity, then graduate. |
| Step 03 Q1 = *Direct support from audience*, Sovereignty ≥3 | **Publisher + Stack** | Lightning payments via UAE entity | The classic creator-to-sovereign migration. High conversion. |
| Audience ≥500k, Sophistication ≥3 | **Empire (creator edition)** | Custom build | Top-tier creators with team and infrastructure needs |
| Urgency ≤1, Sovereignty ≤1, Earning ≤1 | **Nurture** | Newsletter, content, no call | Aspiring creators, curious browsers. Don't burn the team's time. |
| All vectors 0–1 | **No call. Polite acknowledgment.** | None | Tourists. |

### Notes on the creator product map

**The community-management wedge.** A creator who scores high on Automation Vector 4 specifically because of replies/DMs is the single highest-conversion creator profile. The pitch is: *"You're spending three hours a day on DMs. We can give that time back to you, on your own infrastructure, talking to your own audience, on your own terms."* That sentence converts.

**The Till opportunity.** Creators who already sell products or services directly are warm leads for sovereign payments. They have the most to gain commercially and the smallest psychological barrier to crossing the sovereignty line — they already think of themselves as running a business.

**Empire for creators.** The Master Document positions Empire as enterprise. There is a creator edition implied by the architecture — top-tier creators with teams of 10–50 (executive producers, video editors, business managers, audience strategists) who need enterprise-grade infrastructure but in creator language. This isn't yet a named product in the portfolio; it's a build-on-demand for the right prospect.

---

## Discovery call playbook

### Section 1 — Lead with what they told us

The first thing the team says references **Step 06 Q1** — *Where would you like to be twelve months from now?*

Example openings:

| Answer | Opening line |
|---|---|
| *Less anxious about the platforms I depend on* | "You told us you want to feel less anxious in twelve months. That's an honest answer and we take it seriously. Let's talk about what would actually make that true." |
| *Earning more directly from my audience* | "You told us you want to earn more directly from your audience in twelve months. Tell me about your audience first — who are they, and what's the relationship?" |
| *Running my own publishing and payment infrastructure* | "You told us you want to run your own infrastructure in twelve months. That's a real ambition. Let's talk about what gets you there." |
| *Fully sovereign — my audience, my keys, my rules* | "You told us you want full sovereignty. That tells us a lot about what kind of partner you're looking for. Let's start there." |

### Section 2 — Ask the bridge question

The bridge question is calibrated to **Vector 1 (Urgency)** and **Step 01 Q2** *(what changed)*.

| Trigger | Bridge question |
|---|---|
| *Reach dropped without explanation* | "Tell me about the reach drop. When did it start, what changed, and what have you tried?" |
| *A platform changed its rules or its cut* | "Which platform, and what did they change? Has it affected your income yet?" |
| *Someone I follow lost their account* | "Tell me about that. What happened to them, and what was your first thought when you saw it?" |
| *Nothing specific — the timing just feels right* | "What's been on your mind lately about your situation?" |

The platform-fear questions are the most emotionally loaded. The team's job is to listen, not to immediately offer solutions. The first five minutes of a call with a scared creator should be 90% listening.

### Section 3 — Confirm the fragility

Reference **Step 03 Q3** *(most fragile part)*.

The team confirms the creator's own diagnosis before offering theirs:

> "You told us [my reach / my account / my contact with my audience / my payment processor] is the most fragile part of your operation. Walk me through that. What does *fragile* actually look like in your day-to-day?"

This earns the right to recommend something.

### Section 4 — The sovereignty bridge

Reference **Step 05 Q1** — *If your main platform shut you down tomorrow, what could you keep?*

This is the page-5 hard question. The answer determines the entire tone of the next ten minutes.

| Answer | Bridge |
|---|---|
| *Almost nothing — my audience lives there* | "That's the honest answer most creators don't say out loud. The good news is — it's fixable. The bad news is — it doesn't fix itself. Let me show you what fixing it actually looks like." |
| *My subscriber emails, if I've been collecting them* | "Good — you're a step ahead. The question is what you can do with those emails *outside* of email itself. Have you ever thought about what a Substack alternative would look like if it were *yours*?" |
| *Most of it — I have backups and direct channels* | "You're in better shape than most. What we'd add is the infrastructure to make those direct channels *yours*, not just *your version of someone else's platform.*" |
| *Everything — my platform is one channel among many I control* | "Then we're talking about a different conversation. You're not looking for a starter kit; you're looking for a partner. Let's talk about what that looks like." |

### Section 5 — The automation bridge

Reference **Step 04 Q4** *(where would automation help you most)*.

| Answer | Bridge |
|---|---|
| *Give me back time to make better work* | "What would you make if you had the time? The answer to that question is the answer to whether automation is worth it for you." |
| *Help me stay consistent without burning out* | "Consistency is the hardest thing in this work. Let me tell you what we do about that specifically." |
| *Let me reply to my audience properly without it eating my life* | "This is the one we hear most from creators at your scale. We have a specific approach to this. Want me to walk you through it?" |
| *Run the operational layer of my business for me* | "Then you're describing exactly what we built. Let's talk about what that would look like for your operation specifically." |

### Section 6 — The recommendation

The team makes the recommendation in the language the creator used. If they said *"treadmill"*, the recommendation references the treadmill. If they said *"my voice or my audience"*, the recommendation references their voice and their audience.

Recommendation in one breath:

> "Based on what you've told me, I'd start with **Publisher** — that gives you your own publishing infrastructure with full audience ownership. Then we add **Sovereign Ready** so when you're ready to fully graduate to your own hardware, you're already prepared. And the community automation we talked about — that's an **Agent** layer that sits on top of Publisher. That's the path. We don't have to commit to all of it today — but that's the shape."

### Section 7 — The close

Three options, calibrated to **Vector 1 (Urgency)**:

| Urgency | Close |
|---|---|
| 3–4 | "What does it take to start in the next two weeks?" |
| 2 | "Let me put together a written plan for you by Friday. Then we book a follow-up." |
| 0–1 | "I'd love to stay in touch. Let me put you on our occasional updates. When something changes for you, you have my email." |

---

## Special cases for creators

### The scared creator

When **Vector 1 (Urgency)** = 4 AND **Step 01 Q1** = *"A platform did something that scared me"*, this is a creator in crisis. The conversation requires a specific posture.

Lead with empathy, not product:

> "I want to start by saying — what happened to you is real, and it's not your fault. The platforms designed it this way. Before I tell you what we do, I want to hear what happened to you specifically. Tell me everything."

The next 10–15 minutes are listening. Only after the creator feels heard does any product conversation begin. The conversion rate on scared creators handled well is the highest of any creator segment.

### The "almost nothing" creator

When **Step 05 Q1** = *"Almost nothing — my audience lives there"*, the creator has just admitted something most creators won't admit out loud. The team's job is to honour that honesty.

Do not respond with a sales pitch. Respond with:

> "That answer is more useful than you might realise. Most creators don't see it that clearly. The fact that you do means we can have a real conversation. Let's talk about what *yours* would mean for you — what audience, what content, what income."

### The "I'd leave if there were somewhere to go" creator

When **Step 05 Q2** = *"I'd leave if there were somewhere to go"*, the creator is telling us they're ready but waiting for an alternative. NativeWorks is that alternative.

Lead with:

> "We are the somewhere to go. Let me show you exactly what that means for someone in your situation."

This is the strongest possible opening when the form gives it to you.

### The high-sophistication, low-sovereignty creator

When **Vector 2 (Sophistication)** ≥ 3 AND **Vector 3 (Sovereignty)** ≤ 1, the creator is technically capable but doesn't yet see why NativeWorks is different from a hundred other AI tools.

This is a positioning problem. Lead with:

> "You're more technical than most of the people I talk to. So I'll skip the educational part and ask you a question directly: when you imagine your work five years from now, whose infrastructure is it running on? Whose terms of service govern your audience? Whose payment processor decides if you get paid? Those are the questions we exist to answer differently."

### The aspiring creator

When **Step 02 Q2** = *Under 5,000* AND **Vector 5 (Earning)** ≤ 1, the creator is building, not earning. They are not yet a paying customer.

Be generous. They will be a customer in a year or two. Lead with:

> "You're in the building phase. That's the right time to make smart choices about infrastructure, before the audience is large enough that switching is hard. Here's what I'd suggest you do *right now* even if you don't work with us — start collecting emails. That's the foundation. When you're ready for the next step, you have my contact."

A scared 50k creator and a generous-treated 2k creator both convert, on different timelines. The 2k creator who remembers being treated well at 2k is a customer for life.

---

## What this framework deliberately does not do

**It does not produce a price.** Pricing is set in the discovery call. The framework routes; the team prices.

**It does not gatekeep based on audience size.** A 2k creator with serious commitment is more valuable long-term than a 200k creator who's a tourist. Audience size is a budget signal, not a worthiness signal.

**It does not produce a single-product recommendation in most cases.** Most real creators get a *combination* — Publisher + Sovereign Ready, or Publisher + Agent, or Stack + Chain. The combinations are where the real commercial work happens.

**It does not score the creator for the creator.** The signal vector is internal. The creator never sees it. They see a calm, prepared NativeWorks team that already understands them.

---

## Operational integration

Each questionnaire submission produces three artefacts:

1. **The raw response** — stored in the catalogue
2. **The signal vector** — computed by Odin, attached to the response record
3. **The discovery call brief** — generated by Odin for the team

The discovery call brief contains:

- A one-line profile summary
- The five signal vectors with scores
- The recommended product path
- The five opening moves (lead, bridge, fragility, sovereignty, automation)
- One paragraph of context — the creator's own words from the optional free-text field, if any

Briefs are prepared within four hours of submission. Calls are scheduled within two working days, per the form's closing promise.

---

## Cross-form analysis (when applicable)

If a respondent has filled both the business and creator forms, the cross-signal is meaningful. A creator who *also* fills the business form is signalling that they're a creator with company-scale operations — likely a candidate for Empire (creator edition) or for a multi-product engagement.

Conversely, a business operator who fills the creator form usually signals personal brand-building. This is rarer and warrants individual judgment, not automated routing.

---

## Change log

**v1.0 — May 2026** — Initial release. Signal vector framework, product recommendation matrix, and discovery call playbook for the creator questionnaire (v1.0).
