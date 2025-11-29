# ConfirmIT - Trust Infrastructure for African Commerce

<div align="center">

![ConfirmIT Logo](./src/assets/confirmit-logo.png)

**AI-Powered Trust Verification Platform Built on Google Cloud**

🏆 **Codematic Build with Google Cloud Hackathon 2025**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://confirmit.lovable.app)
[![API Docs](https://img.shields.io/badge/api-docs-blue)](https://confirmit-api.onrender.com/docs)

</div>

---

## 🎯 The Problem

**₦5 billion** lost to fraud annually in Nigeria. Three critical gaps:

- 🚫 **Fake receipts** - Photoshopped in minutes, impossible to verify
- 💸 **Account fraud** - No way to check if an account is safe before sending money
- 🏢 **Business impersonation** - Legitimate businesses can't prove authenticity

**ConfirmIT solves this with Google Cloud AI and blockchain anchoring.**

---

## 💡 Our Solution

### Three Core Services:

#### 🔍 **1. QuickScan - AI Receipt Verification**
Upload receipt → Get trust score in **8 seconds**

**Powered by:**
- **Gemini 2.0 Flash** for OCR and data extraction
- **Gemini Pro** for reasoning and verdict synthesis
- **Cloud Vision API** for image forensics
- **Cloud Run** for serverless processing

**Blockchain Anchoring:** Results hashed to Hedera Consensus Service for immutable proof

#### 🏦 **2. AccountCheck - Pre-Payment Risk Assessment**
Check bank accounts before sending money - **free for everyone**

**Powered by:**
- **Cloud Firestore** for fraud database queries
- **Cloud Functions** for pattern analysis
- Community-sourced fraud reports (Truecaller model)

#### 🏢 **3. Business Verification + Trust ID NFTs**
Verified credentials on blockchain - **unfakeable proof of legitimacy**

**Powered by:**
- **Cloud Storage** for encrypted document storage
- **Hedera Token Service** for Trust ID NFT minting
- **Secret Manager** for secure credential handling

---

## 🛠️ Google Cloud Integration

### Core Services Used:

**AI & Machine Learning:**
- ✅ **Vertex AI - Gemini 2.0 Flash** (vision + OCR)
- ✅ **Vertex AI - Gemini Pro** (reasoning + synthesis)
- ✅ **Cloud Vision API** (image forensics)

**Compute & Infrastructure:**
- ✅ **Cloud Run** (NestJS API + FastAPI AI service)
- ✅ **Cloud Functions** (event-driven processing)

**Data & Storage:**
- ✅ **Cloud Storage** (encrypted receipt storage)
- ✅ **Cloud Firestore** (fraud database + metadata)
- ✅ **Cloud SQL** (user data - optional)

**Security & Operations:**
- ✅ **Secret Manager** (API keys + credentials)
- ✅ **Cloud IAM** (service account permissions)
- ✅ **Cloud Logging** (monitoring + debugging)
- ✅ **Cloud Monitoring** (performance tracking)

**Cost per verification:** ₦15 (~$0.02) | **Processing time:** < 8 seconds

---

## ✨ Key Features

### For Users:
- Verify receipts in seconds with AI forensics
- Check account safety before payment
- View blockchain-anchored proof
- Report fraud with evidence

### For Businesses:
- Get Trust ID NFT credential
- API access for integrations
- Real-time webhooks
- Analytics dashboard

### Technical Highlights:
- Multi-agent AI architecture (5 specialized agents)
- Serverless auto-scaling (Cloud Run)
- 95% cost reduction vs traditional verification
- Privacy-first (account hashing with SHA-256)

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│         FRONTEND (React + Vite)          │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│     NestJS API Gateway (Cloud Run)       │
│  ┌────────────────────────────────────┐  │
│  │  Auth  │  Redis  │  WebSocket      │  │
│  └────────────────────────────────────┘  │
└──────┬──────────────┬────────────────────┘
       │              │
┌──────▼──────┐  ┌───▼─────────────────────┐
│  FastAPI    │  │   Google Cloud Services │
│ AI Service  │  │                          │
│ (Cloud Run) │  │  • Gemini 2.0 Flash     │
│             │  │  • Gemini Pro           │
│ 5 AI Agents:│  │  • Cloud Storage        │
│ • Vision    │  │  • Firestore            │
│ • Forensic  │  │  • Secret Manager       │
│ • Metadata  │  │  • Cloud Logging        │
│ • Reputation│  │                          │
│ • Reasoning │  └──────────────────────────┘
└─────────────┘
       │
┌──────▼────────────────┐
│  Hedera Hashgraph     │
│  • HCS (receipts)     │
│  • HTS (Trust ID NFTs)│
└───────────────────────┘
```

---

## 🚀 Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Zustand  
**Backend:** NestJS (Node.js), FastAPI (Python 3.11)  
**AI:** Gemini 2.0 Flash, Gemini Pro, OpenCV, scikit-image  
**Google Cloud:** Cloud Run, Firestore, Cloud Storage, Secret Manager, Vertex AI  
**Blockchain:** Hedera Hashgraph (HCS + HTS)  
**Infrastructure:** Docker, Cloud Build (CI/CD)

---

## 📊 Impact & Business Model

### Market:
- **Year 1:** Nigeria - 100K verifications/month → ₦170M revenue ($220K)
- **Year 3:** Pan-African - 10M verifications/month → $5M+ revenue

### Revenue Streams:
- **Premium Individual:** ₦2,500/month (unlimited scans)
- **Business Tier:** ₦15,000/month (API access)
- **Enterprise:** Custom pricing (₦100K+/month)

### Unit Economics:
- **Cost per verification:** ₦15 (Google Cloud: ₦2.88 + operations)
- **Traditional verification:** ₦500-2,000
- **Savings:** 97% cost reduction

### Google Cloud Cost Efficiency:
- 100K verifications/month: $186
- 1M verifications/month: $1,882
- 10M verifications/month: $18,705
- **Gross margin:** 89.8% → 95.5% at scale

---

## 🔧 Setup Instructions

### Prerequisites:
- Node.js 20+, Python 3.11+
- Google Cloud Project with Vertex AI enabled
- Hedera Testnet Account
- Firebase Project

### Quick Start:

```bash
# 1. Clone repo
git clone https://github.com/yourusername/confirmit.git
cd confirmit

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Add Google Cloud credentials, Gemini API keys
npm run start:dev  # Runs on :8080

# 3. AI Service setup
cd ../ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add Vertex AI credentials
uvicorn app.main:app --reload  # Runs on :8000

# 4. Frontend setup
cd ../frontend
npm install
npm run dev  # Runs on :5173
```

---

## 📈 Why ConfirmIT Matters

**1. Real Problem, Real Solution**  
₦5B fraud crisis affecting 200M+ Nigerians - we solve it with Google Cloud AI

**2. Technical Excellence**  
Multi-agent AI system, serverless architecture, 8-second processing time

**3. Google Cloud Mastery**  
Deep integration: Gemini 2.0 Flash, Cloud Run, Firestore, Secret Manager, IAM

**4. Working Product**  
Not a prototype - fully operational platform processing real verifications

**5. Commercial Viability**  
Clear revenue model, 89.8% margins, scalable to 10M+ verifications/month

**6. African Impact**  
Built by Africans for Africa - solving problems we've experienced personally


---

## 👥 Team

Self-taught engineers who've watched fraud devastate Nigerian commerce firsthand. We lost money to fake receipts. We've seen friends scammed. This is personal.

**What we bring:** 5+ years fintech experience, fraud detection expertise, Google Cloud + Hedera integration skills, and unstoppable motivation to protect our communities.

---

## 📄 License

MIT License

---


<div align="center">

**Built with Google Cloud for Africa**

**Codematic Build with Google Cloud Hackathon 2025**


</div>