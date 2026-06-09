# NativeWorks Sensitive Assessment — CEO Strategic & Compliance Questionnaire

**Version** 1.0  
**Date** June 2026  
**Status** Draft Specification  
**Purpose** Follow-up questionnaire sent to qualified business leads via a secure, single-use encrypted link prior to the first briefing/discovery call. It gathers high-level operational context, timeline targets, compliance boundaries, and privacy parameters from the CEO or primary business stakeholder.

---

## Design Principles & Context
Because this questionnaire collects high-level business goals, regulatory obligations, and security access policies, it is served over an end-to-end encrypted single-use link. 

The questions are structured to minimize friction for executives while gathering the strategic parameters required to align our commercial and legal framework:
* **The timeline boundaries** (how quickly the business requires decoupling)
* **The data governance rules** (compliance frameworks and retention policies)
* **The corporate security protocols** (access levels for setup engineers)

---

## Questionnaire Specification

### Section 01 — Strategic Outcomes & Timelines
*Objective: Define the commercial objectives and the targeted schedule for stack deployment.*

#### Q1.1 — What are the primary business outcomes you want to achieve with private AI? (Select all that apply)
* [ ] **Operational Efficiency**: Reduce manual staff hours spent on repetitive back-office tasks.
* [ ] **Scale Autonomy**: Grow transaction volume or document processing without hiring proportionally.
* [ ] **Absolute Data Shielding**: Mask or isolate customer files entirely to prevent vendor model training or leaks.
* [ ] **Product Customization**: Train or fine-tune models on unique company intellectual property to create a proprietary competitive edge.
* [ ] **Compliance Alignment**: Satisfy strict regulatory audits (GDPR, HIPAA, SOC 2) that restrict SaaS API connections.

#### Q1.2 — What is the targeted timeline for complete data decoupling and sovereign stack activation? (Choose one)
* [ ] **Immediate** (Within 30 days — critical operations bottleneck)
* [ ] **Standard** (30 to 90 days)
* [ ] **Strategic** (90+ days — planning for upcoming fiscal budget or infrastructure refresh)

---

### Section 02 — Data Privacy & Governance Posture
*Objective: Map corporate data rules, access levels, and privacy parameters.*

#### Q2.1 — What is your company's posture regarding AI training and data privacy? (Choose one)
* [ ] **Convenience Priority**: We are comfortable sending business data to public API providers as long as they pledge not to train on our data.
* [ ] **Hybrid Constraint**: We require standard commercial APIs for complex tasks, but sensitive customer data must be kept local/masked.
* [ ] **Strict Autonomy**: Zero business or client data may leave our controlled network. All models must run on private, sovereign instances.

#### Q2.2 — What are your legal data retention requirements? (Choose one)
* [ ] **Ephemeral Processing**: All AI prompts and completions must be wiped from active memory immediately after execution.
* [ ] **Secure Local Logging**: We require a private, secure audit trail of all AI interactions stored locally on our own databases.
* [ ] **Long-term cold storage**: We require secure, encrypted backups of all transactions for compliance/legal reviews.

#### Q2.3 — Do third-party vendors or external collaborators currently have access to your primary data sources?
* [ ] **Yes** — We have external agencies, contractors, or software vendors with direct database or API access.
* [ ] **No** — Access is strictly confined to internal salaried employees.

---

### Section 03 — Regulatory Compliance & Onboarding
*Objective: Establish the legal boundaries and verify the engineer onboarding protocol.*

#### Q3.1 — Which regulatory frameworks or compliance standards govern your data management? (Select all that apply)
* [ ] **GDPR** (General Data Protection Regulation — Europe)
* [ ] **HIPAA** (Health Insurance Portability and Accountability Act — Healthcare US)
* [ ] **SOC 2 Type II** (Security Auditing — US)
* [ ] **ISO 27001** (Information Security Management)
* [ ] **Industry-specific guidelines** (e.g. legal privilege, financial banking secrets)
* [ ] **Internal corporate governance only**

#### Q3.2 — How does your corporate security policy permit granting installation engineers setup access? (Choose one)
* [ ] **Direct Remote Access** (Secure VPN, Tailscale, SSH keys, Bastion host)
* [ ] **Co-Working Session** (Screen sharing via Zoom/Teams under continuous supervision)
* [ ] **Zero-Access Deployment** (NativeWorks packages containerized builds/scripts, our internal IT team runs them)

---

## Strategic Sizing Matrix (Internal Reference)

Odin parses the results of this strategic assessment to output a **Business Sizing & Compliance Brief**:

| Selection Indicator | Compliance Complexity | Product Packaging | Commercial Focus |
|---|---|---|---|
| Q3.1 = *GDPR/HIPAA* | High | **Strict Sovereignty Mode** | Focus proposal on local legal liability isolation and zero cloud data leaks. |
| Q1.2 = *Immediate* | High | **Accelerated Staging** | Prioritize setup engineer onboarding; expedite VPS provisioning. |
| Q2.3 = *Yes (Third Parties)* | Medium | **Staging Boundary** | Specify strict role-based access controls (RBAC) at the ingestion boundary. |
| Q3.2 = *Zero-Access* | High | **Pre-packaged Containers** | Structure contract as a delivery of validated Docker/Kubernetes container images. |
