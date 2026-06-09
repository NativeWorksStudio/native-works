# NativeWorks Sensitive Assessment — CTO Technical Sizing & Infrastructure Questionnaire

**Version** 1.0  
**Date** June 2026  
**Status** Draft Specification  
**Purpose** Technical follow-up questionnaire sent to qualified technical leads via a secure, single-use encrypted link prior to the first briefing/discovery call. It gathers detailed database sizing, active model footprints, target virtual private servers, compute hardware specs, and container environments from the CTO or VP of Engineering to size and quote custom deployments.

---

## Design Principles & Context
Because this questionnaire collects detailed technical specifications (OS versions, database configurations, hardware counts, and deployment access details), it is served over an end-to-end encrypted single-use link. 

The questions are structured to gather exact technical parameters required by our solutions architects to size and quote:
* **The compute footprint** (dedicated CPU cores, GPU VRAM requirements)
* **The ingestion pipeline** (database connectors, volume capacity)
* **The deployment packaging** (Docker Compose vs Kubernetes configuration)

---

## Questionnaire Specification

### Section 01 — Core Systems & Data Footprint Sizing
*Objective: Sizing the databases and data pipelines that our local preprocessing stack will interface with.*

#### Q1.1 — Where is your primary operational data stored, and what is its estimated footprint size? (Select all that apply)
* [ ] **Cloud CRM / SaaS** (Salesforce, HubSpot, Notion, Airtable)
* [ ] **Managed Relational Databases** (AWS RDS, PostgreSQL, MySQL, SQL Server)
  * *Estimated Database Size:* [ ] < 10 GB | [ ] 10 - 100 GB | [ ] 100 GB - 1 TB | [ ] > 1 TB
* [ ] **Legacy On-Premises Systems** (Local file servers, network-attached storage, local database servers)
  * *Estimated File Count:* [ ] < 10,000 files | [ ] 10,000 - 100,000 files | [ ] > 100,000 files
* [ ] **Distributed Spreadsheets** (Excel, Google Sheets across multiple teams)
* [ ] **Proprietary ERP / Internal Custom Software**

#### Q1.2 — Which operational software tools are critical to your daily team treadmill? (Select all that apply)
* [ ] **Communication & Messaging** (Slack, Microsoft Teams, Discord)
* [ ] **Project / Task Management** (Jira, Asana, Monday.com, Trello)
* [ ] **Customer Support & Ticketing** (Zendesk, Intercom, Freshdesk)
* [ ] **Document Storage & Collaboration** (Google Drive, SharePoint, Dropbox)
* [ ] **Email & Calendar Suites** (Google Workspace, Microsoft 365)

---

### Section 02 — Model Execution Footprint & Sizing
*Objective: Identify the token/processing volume requirements and active model deployments.*

#### Q2.1 — Which Large Language Models (LLMs) or AI APIs do you currently run in production or testing? (Select all that apply)
* [ ] **Public Commercial APIs** (OpenAI GPT-4, Anthropic Claude, Google Gemini)
* [ ] **Hosted Cloud Providers** (AWS Bedrock, Azure OpenAI Service, Google Vertex AI)
* [ ] **Open-Weights / Self-Hosted Models** (Llama 3, Mistral, Qwen, Phi-3)
* [ ] **No active models** (We only use off-the-shelf AI features built into our SaaS tools)

#### Q2.2 — What is the estimated daily token or document volume processed by your teams? (Choose one)
* [ ] **Low Volume** (< 100,000 tokens / day or < 50 documents / day)
* [ ] **Medium Volume** (100,000 - 5,000,000 tokens / day or 50 - 1,000 documents / day)
* [ ] **High Volume** (> 5,000,000 tokens / day or > 1,000 documents / day)

#### Q2.3 — Are you planning to fine-tune or train custom models on your company's proprietary data?
* [ ] **Yes** — We require a dedicated GPU training node to fine-tune weights on local data (minimum 48GB VRAM footprint).
* [ ] **No** — We only require Retrieval-Augmented Generation (RAG) and prompt engineering with pre-trained open weights.
* [ ] **Undecided** — We need guidance on the trade-offs.

---

### Section 03 — Infrastructure, Compute & Hardware Planning
*Objective: Map out the target VPS providers, operating systems, and bare-metal specs.*

#### Q3.1 — What is your preferred hosting architecture for the NativeWorks Private Stack? (Choose one)
* [ ] **Sovereign Virtual Private Server (VPS)** — Private cloud instances hosted by secure European providers (e.g., Hetzner, Scaleway, OVHcloud).
* [ ] **Corporate Private Cloud** — Our own enterprise cloud accounts (AWS VPC, Google Cloud VPC, Azure Private Link).
* [ ] **Bare-Metal On-Premises** — Physical hardware located in our offices or co-located data centers.
* [ ] **Edge Hardware / Native Office Nodes** — Desktop/rack hardware running directly in our physical offices (e.g. Mac Studio nodes, NVIDIA RTX workstations).

#### Q3.2 — Do you have existing hardware resources that can be allocated to local AI inference? (Select all that apply)
* [ ] **NVIDIA GPU Servers** (A100, H100, RTX 4090s, RTX A6000s)
  * *Specify card quantity:* ____________
* [ ] **Apple Silicon Hardware** (M2/M3 Max or M2/M3 Ultra with high unified memory footprints)
  * *Specify memory footprint (e.g. 128GB, 192GB):* ____________
* [ ] **Standard CPU Virtual Servers** (No dedicated GPUs)
* [ ] **None** — We need NativeWorks to specify and procure/provision the entire hardware stack for us.

#### Q3.3 — What operating systems and container environments does your team currently run? (Select all that apply)
* [ ] **Linux (Ubuntu / Debian / RHEL)**
* [ ] **macOS (Apple Silicon)**
* [ ] **Windows Server**
* [ ] **Docker / Docker Compose**
* [ ] **Kubernetes / K8s**

---

### Section 04 — Deployment Connection & Remote Access
*Objective: Confirm the technical connection protocol for installation engineers.*

#### Q4.1 — How do you prefer to grant setup engineers deployment access? (Choose one)
* [ ] **Direct Remote SSH** (Secure VPN, Tailscale, SSH keys, Bastion host)
* [ ] **Co-Working Session** (Screen sharing via Zoom/Teams under continuous supervision)
* [ ] **Zero-Access Deployment** (NativeWorks packages containerized builds/scripts, our internal IT team runs them)

---

## Technical Sizing Matrix (Internal Reference)

Odin parses the results of this technical assessment to output a **Compute & Architecture Sizing Brief**:

| Selection Indicator | Sizing Complexity | Compute Profile | Architecture Recommendation |
|---|---|---|---|
| Q2.3 = *Yes (Fine-tuning)* | High | **Training Node Sizing** | Allocate dedicated VRAM footprint (minimum 1x NVIDIA RTX A6000 or RTX 6000 Ada). |
| Q1.1 = *Database > 1 TB* | High | **High Ingestion Throughput** | Stage layout-aware parser models on high-core CPU nodes with NVMe drives. |
| Q3.2 = *NVIDIA GPUs* | Low | **Pre-allocated GPU Staging** | Run models natively using Triton or vLLM container configs on pre-existing CUDA nodes. |
| Q3.3 = *Kubernetes* | Medium | **K8s Deployment** | Build deployment briefs using Helm charts rather than Docker Compose. |
