# NativeWorks Assessment — Business CTO Technical Routing Specification

**Version** 1.0  
**Date** June 2026  
**Status** Knowledge document — technical routing framework for Business CTO questionnaire responses  
**Companion to** `business-cto-assessment.html` (CTO Technical Assessment)

---

## Purpose of this document

The Business CTO questionnaire is a 4-step wizard form collecting legacy database schemas, active model deployments, preferred hosting target environments, GPU/CPU hardware availability, and compliance constraints. This document is the canonical reference for how those answers translate into:

1. **A signal vector** — four quantified dimensions that describe the technical profile of the enterprise prospect.
2. **A product recommendation** — which NativeWorks container package or VPS architecture to deploy.
3. **A discovery call playbook** — technical entry points, deployment discussions, and integration setup.

The framework is a *guide* for Odin to prepare discovery call briefs for solutions architects.

---

## The four signal vectors

Every CTO response decomposes into four vectors. Each is scored 0–4 based on the answers given.

### Vector 1 — Sophistication

Current technical and AI deployment maturity. Tells us if they run custom weights or off-the-shelf APIs.

**Inputs** Step 02 Q3 (active models), Step 02 Q4 (AI privacy posture)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q3 (Which LLMs or AI APIs do you currently run?)** | |
| C — *Open-weights / Self-hosted models (Llama 3, Mistral, Qwen)* | +2 |
| B — *Hosted Enterprise Instances (Azure OpenAI, Vertex AI, Bedrock)* | +1 |
| A or D — *Public APIs / No active models* | 0 |
| **Q4 (What is your posture regarding AI training and data privacy?)** | |
| C — *Strict Autonomy: Zero data leaves network. Private model instance* | +2 |
| B — *Hybrid Constraint: Mask sensitive data locally* | +1 |
| A — *Convenience Priority: Public API acceptable* | 0 |

**Range** 0–4 (clamped). 4 = highly sophisticated AI engineering team. 0 = ground floor.

---

### Vector 2 — Infrastructure Readiness

The availability of local compute resources or preferred host targets.

**Inputs** Step 03 Q5 (preferred hosting), Step 03 Q6 (hardware resources)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q5 (What is your preferred hosting architecture?)** | |
| C — *Bare-Metal On-Premises: Dedicated co-located server racks* | +2 |
| D — *Edge Hardware nodes: Running in physical offices (Mac Studio/RTX)* | +2 |
| B — *Corporate Private Cloud: Our AWS VPC / GCP / Azure Private Link* | +1 |
| A — *Sovereign VPS: Secure European cloud instances (Hetzner, OVH)* | 0 |
| **Q6 (Do you have existing hardware resources that can run local inference?)** | |
| A — *Dedicated NVIDIA GPUs (RTX 4090, A100, H100, RTX A6000)* | +2 |
| B — *Apple Silicon workstations (M2/M3 Max/Ultra nodes)* | +2 |
| C — *Standard CPU instances (No local GPU)* | +1 |
| D — *None — We need Native Works to specify and procure* | 0 |

**Range** 0–4 (clamped). 4 = ready for co-located bare-metal or office edge cluster. 0 = needs a full hardware procurement package.

---

### Vector 3 — Sovereignty appetite

How strongly the CTO insists on zero-external data routing and independent container execution.

**Inputs** Step 02 Q4 (privacy posture), Step 03 Q5 (preferred hosting)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q4 (AI privacy posture)** | |
| C — *Strict Autonomy: Private model instance* | +2 |
| B — *Hybrid Constraint* | +1 |
| A — *Convenience Priority* | -1 |
| **Q5 (Preferred hosting architecture)** | |
| C — *Bare-Metal On-Premises* | +2 |
| D — *Edge Hardware nodes* | +2 |
| B — *Corporate Private Cloud* | +1 |
| A — *Sovereign VPS* | 0 |

**Range** 0–4 (clamped). 4 = absolute stack isolation. 0 = cloud APIs are acceptable.

---

### Vector 4 — Compliance Gravity

The regulatory auditing pressure governing the company's data.

**Inputs** Step 04 Q7 (compliance frameworks)

**Scoring**

| Input Question & Value | Score Contribution |
|---|---|
| **Q7 (Which compliance frameworks govern your data?) [Select multiple]** | |
| C — *SOC 2 Type II / ISO 27001 Security standards* | +2 |
| A — *GDPR (European Data Privacy)* | +1 |
| B — *HIPAA (Healthcare data privacy compliance)* | +1 |
| D — *Internal operational corporate security only* | 0 |

**Range** 0–4 (clamped). 4 = extreme regulatory boundary. Strict log sanitization required.

---

## Product recommendation matrix

| Profile pattern | Primary product | Secondary | Posture |
|---|---|---|---|
| Sovereignty ≥3, Infrastructure ≥3 | **Sovereign Private Cloud / Bare-Metal Node** | Edge inference node setup | Full private co-location or enterprise VPC deployment brief. |
| Sovereignty ≥3, Infrastructure ≤2 | **Sovereign VPS** | Dedicated European virtual instances | Standard secure virtual servers (OVH/Hetzner) hosting private LLMs. |
| Sophistication ≥3, Compliance ≥2 | **Docker/Kubernetes Enterprise Package** | Zero-Access installation scripts | Deploy via isolated container builds. Customer's internal dev team runs script. |
| Default / Other | **Sovereign VPS** | Private pipeline staging | Standard private pipeline staging with managed local endpoints. |

---

## Discovery call playbook

### Section 1 — Data Storage & Tool Integrations
Reference **Q1** *(primary operational data)* and **Q2** *(critical operational tools)*.
- Start the dialogue by addressing their database type: *"We see your primary operational data is stored on [PostgreSQL/SaaS CRM]. Let's discuss our local connectors for structured ingestion..."*

### Section 2 — Model Posture & Inference Sizing
Reference **Q3** *(active models)* and **Q4** *(data privacy posture)*.
- Address their current model usage: *"You are currently running [Llama 3/Mistral/GPT-4]. Let's discuss local context size limitations, latency profiles, and your RAG staging requirements."*

### Section 3 — Infrastructure and Onboarding Access
Reference **Q5** *(hosting)*, **Q6** *(hardware)*, and **Q8** *(engineer access preference)*.
- Address onboarding access: *"You indicated a preference for [Zero-Access deployment / Direct Remote SSH / screen sharing]. Let's establish our security protocol for container staging."*

---

## Change log

* **v1.0 — June 2026** — Initial release. Restructured specifically for the Business CTO Technical Assessment track.
