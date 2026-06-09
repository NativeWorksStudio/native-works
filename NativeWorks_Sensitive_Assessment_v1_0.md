# NativeWorks Sensitive Assessment — Discovery & Technical Sizing Questionnaire

**Version** 1.0  
**Date** June 2026  
**Status** Draft Specification  
**Purpose** Follow-up questionnaire sent to qualified leads via secure email link prior to the first briefing/discovery call. It gathers detailed architectural, infrastructure, and data governance parameters to scope custom Sovereign or Empire deployments.

---

## Design Principles & Context
Because this questionnaire asks for highly sensitive corporate details (software configurations, AI vendors, data policies, and hardware planning), it is served over an end-to-end encrypted single-use link. 

The questions are structured to minimize friction while gathering exact data points required by our solutions architects to size and quote:
* **The compute footprint** (e.g. edge GPUs vs. private cloud VPS)
* **The data bridge requirements** (e.g. which legacy databases need custom sovereign connectors)
* **The security boundaries** (e.g. what compliance frameworks we must adhere to)

---

## Questionnaire Specification

### Section 01 — Core Systems & Software Stack
*Objective: Map the existing data sources that our Sovereign Stack will need to interface with.*

#### Q1.1 — Where is your primary customer/operational data stored? (Select all that apply)
* [ ] **Cloud CRM / SaaS** (Salesforce, HubSpot, Notion, Airtable)
* [ ] **Managed Relational Databases** (AWS RDS, PostgreSQL, MySQL, SQL Server)
* [ ] **Legacy On-Premises Systems** (Local file servers, network-attached storage, local database servers)
* [ ] **Distributed Spreadsheets** (Excel, Google Sheets across multiple teams)
* [ ] **Proprietary ERP / Internal Custom Software**

#### Q1.2 — Which operational software tools are critical to your daily team treadmill? (Select all that apply)
* [ ] **Communication & Messaging** (Slack, Microsoft Teams, Discord)
* [ ] **Project / Task Management** (Jira, Asana, Monday.com, Trello)
* [ ] **Customer Support & Ticketing** (Zendesk, Intercom, Freshdesk)
* [ ] **Document Storage & Collaboration** (Google Drive, SharePoint, Dropbox)
* [ ] **Email & Calendar Suites** (Google Workspace, Microsoft 365)

---

### Section 02 — Artificial Intelligence & Model Posture
*Objective: Identify their reliance on public API providers and their readiness for private local model deployment.*

#### Q2.1 — Which Large Language Models (LLMs) or AI APIs do you currently run in production or testing? (Select all that apply)
* [ ] **Public Commercial APIs** (OpenAI GPT-4, Anthropic Claude, Google Gemini)
* [ ] **Hosted Cloud Providers** (AWS Bedrock, Azure OpenAI Service, Google Vertex AI)
* [ ] **Open-Weights / Self-Hosted Models** (Llama 3, Mistral, Qwen, Phi-3)
* [ ] **No active models** (We only use off-the-shelf AI features built into our SaaS tools)

#### Q2.2 — What is your posture regarding AI training and data privacy? (Choose one)
* [ ] **Convenience Priority**: We are comfortable sending business data to public API providers as long as they pledge not to train on our data.
* [ ] **Hybrid Constraint**: We require standard commercial APIs for complex tasks, but sensitive client data must be kept local/masked.
* [ ] **Strict Autonomy**: Zero business or client data may leave our controlled network. All models must run on private, sovereign instances.

#### Q2.3 — Are you planning to fine-tune or train custom models on your company's proprietary data?
* [ ] **Yes** — We have a large corpus of proprietary knowledge (PDFs, code, tickets) we want to train/fine-tune models on.
* [ ] **No** — We want to use Retrieval-Augmented Generation (RAG) and prompt engineering with pre-trained models.
* [ ] **Undecided** — We need guidance on the trade-offs.

---

### Section 03 — Infrastructure, Compute & Hardware Planning
*Objective: Size the compute nodes and target hardware configuration for the private Sovereign deployment.*

#### Q3.1 — What is your preferred hosting architecture for the NativeWorks Sovereign Stack? (Choose one)
* [ ] **Sovereign Virtual Private Server (VPS)** — Private cloud instances hosted by secure European providers (e.g., Hetzner, Scaleway, OVHcloud).
* [ ] **Corporate Private Cloud** — Our own enterprise cloud accounts (AWS VPC, Google Cloud VPC, Azure Private Link).
* [ ] **Bare-Metal On-Premises** — Physical hardware located in our offices or co-located data centers.
* [ ] **Edge Hardware / Native Office Nodes** — Desktop/rack hardware running directly in our physical offices (e.g. Mac Studio nodes, NVIDIA RTX workstations).

#### Q3.2 — Do you have existing hardware resources that can be allocated to local AI inference? (Select all that apply)
* [ ] **NVIDIA GPU Servers** (A100, H100, RTX 4090s, RTX A6000s)
* [ ] **Apple Silicon Hardware** (M2/M3 Max or M2/M3 Ultra with high unified memory footprints)
* [ ] **Standard CPU Virtual Servers** (No dedicated GPUs)
* [ ] **None** — We need NativeWorks to specify and procure/provision the entire hardware stack for us.

---

### Section 04 — Data Governance, Security & Compliance
*Objective: Establish the legal and regulatory compliance boundaries for model operations.*

#### Q4.1 — Which regulatory frameworks or compliance standards govern your data management? (Select all that apply)
* [ ] **GDPR** (General Data Protection Regulation — Europe)
* [ ] **HIPAA** (Health Insurance Portability and Accountability Act — Healthcare US)
* [ ] **SOC 2 Type II** (Security Auditing — US)
* [ ] **ISO 27001** (Information Security Management)
* [ ] **Industry-specific guidelines** (e.g. legal privilege, financial banking secrets)
* [ ] **Internal corporate governance only**

#### Q4.2 — What are your data retention requirements? (Choose one)
* [ ] **Ephemeral Processing**: All AI prompts and completions must be wiped from memory immediately after execution.
* [ ] **Secure Local Logging**: We need a private audit trail of all AI interactions stored locally on our own databases.
* [ ] **Long-term cold storage**: We require secure, encrypted backups of all transactions for compliance/legal reviews.

#### Q4.3 — Do third-party vendors or external collaborators currently have access to your primary data sources?
* [ ] **Yes** — We have external agencies, contractors, or software vendors with direct database or API access.
* [ ] **No** — Access is strictly confined to internal salaried employees.

---

### Section 05 — Onboarding Access & Integration Timelines
*Objective: Uncover operational bottlenecks and define security protocols for our integration engineers.*

#### Q5.1 — How do you plan to grant NativeWorks installation engineers access to your infrastructure for stack setup? (Choose one)
* [ ] **Direct Remote Access** (Secure VPN, Tailscale, SSH keys, Bastion host)
* [ ] **Co-Working Session** (Screen sharing via Zoom/Teams under continuous supervision)
* [ ] **Zero-Access Deployment** (NativeWorks packages containerized builds/scripts, our internal IT team runs them)

#### Q5.2 — What is the targeted timeline for complete data decoupling and sovereign stack activation?
* [ ] **Immediate** (Within 30 days — critical operations bottleneck)
* [ ] **Standard** (30 to 90 days)
* [ ] **Strategic** (90+ days — planning for upcoming fiscal budget or infrastructure refresh)

---

## Sizing Matrix & Product Calibration (Internal Reference)

Odin parses the results of this second assessment to output a **Sizing & Security Profile**:

| Selection Indicator | Risk/Complexity | Target Architecture | Sizing Rule |
|---|---|---|---|
| Q3.1 = *On-Premises* / *Edge Hardware* | High | **Bare-Metal Linux or macOS Node** | Require Apple Studio Ultra or RTX A6000 hardware audit. |
| Q2.3 = *Yes (Fine-tuning)* | Medium | **Dedicated training node** | Allocate dedicated VRAM footprint (minimum 48GB VRAM). |
| Q4.1 = *GDPR/HIPAA* | High | **Sovereign Stack (Strict mode)** | Disable all outbound telemetry/third-party routing. Run local validator nodes. |
| Q5.1 = *Zero-Access* | High | **Docker Compose / Kubernetes Package** | Shift delivery to pre-packaged sovereign container images. |
