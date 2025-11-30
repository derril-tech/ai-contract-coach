# ⚖️ ContractCoach
**AI-Powered Contract Review with OpenAI SDK**


🌐 **See the Live Application**: [https://ai-contract-coach.vercel.app/](https://ai-contract-coach.vercel.app/)

> **Turn dense contracts into clear guidance. Import agreements from Google Drive, extract key clauses, flag risky terms, and get plain English explanations—so you can negotiate with confidence.** ⚡

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1-green.svg)](https://openai.com/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-blueviolet.svg)](https://railway.app/)

---

## ✨ Features

### 🎯 **Core Contract Analysis**
- 📄 **Smart Clause Extraction** - Automatically identifies Payment, IP, Confidentiality, Termination, Liability clauses
- 🔴 **Risk Assessment** - Color-coded risk levels (Low/Medium/High) for each clause
- 📝 **Plain English Summaries** - Legal jargon translated into everyday language
- 💡 **Suggested Edits** - AI-powered contract improvements you can copy-paste
- ☁️ **Google Drive Integration** - Import contracts directly from your Drive
- 🎙️ **Voice Questions** - Ask questions about your contract using voice input

### 🤖 **AI-Powered Negotiation**
- 🎯 **Smart Negotiation Tips** - Battle-tested strategies for each clause
- 📊 **Confidence Scores** - Know how likely your changes will be accepted
- ✍️ **Ready-to-Use Language** - Copy-paste alternative contract wording
- 🛡️ **Protective Strategies** - Soften, Protect, Counter, or Remove risky terms

### 🎨 **Beautiful UI/UX**
- ✨ **Modern 2025 Design** - Glassmorphism, gradients, smooth animations
- 🌙 **Dark/Light Mode** - Full theme support with video backgrounds
- 📱 **Mobile-First** - Tab-based navigation, swipe gestures, FAB
- ♿ **Accessible** - WCAG compliant with keyboard navigation
- 🔄 **Real-Time Streaming** - Watch clauses appear as AI analyzes

### 📊 **Dashboard & History**
- 📈 **Portfolio Risk Snapshot** - Donut chart of all analyzed clauses
- 📝 **Contract History** - Track all past analyses with search
- 🔍 **Quick Stats** - High/Medium/Low risk clause counts
- 📋 **Suggested Actions** - AI-recommended next steps

### 🚀 **Advanced Features**
- 📦 **Batch Analysis** - Process multiple contracts at once
- ⚖️ **Contract Comparison** - Side-by-side diff of two contracts
- 📄 **PDF Export** - Branded professional reports
- 📧 **Email Summaries** - Share analysis with stakeholders
- ⚙️ **Custom Risk Thresholds** - Adjust sensitivity to your needs
- 🔗 **One-Click Sharing** - Share via Twitter, LinkedIn, Email

---

## 🏗️ Tech Stack

### **Backend** 🐍
- **FastAPI** - Modern async Python web framework
- **OpenAI GPT-4.1** - Structured outputs for contract analysis
- **Python 3.11+** - Latest features and performance
- **psycopg2** - Direct PostgreSQL connections

### **Frontend** ⚛️
- **Next.js 15** - React 19 with App Router
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Modern icon set

### **Database & Cache** 💾
- **Supabase** - PostgreSQL with custom schema
- **Upstash Redis** - Job queue, caching, rate limiting

### **External APIs** 🔌
- **Google Drive API** - File import from Drive
- **Google OAuth 2.0** - Secure authentication
- **Web Speech API** - Voice input support

### **Deployment** 🚀
- **Railway** - Backend API deployment
- **Vercel** - Frontend deployment
- **Monorepo** - Single repo for API + Web

---

## 📸 Screenshots

### 🏠 Homepage
*Beautiful landing page with video background and clear value proposition*

### 🎮 Playground
*Interactive contract review workspace with real-time streaming analysis*

### 📊 Dashboard
*Portfolio risk overview with contract history and AI insights*

---

## 📖 User Guide

### 🎮 Using the Playground

1. **Load a Contract**
   - 📝 **Paste Text** - Click "Input" and paste contract text
   - ⚡ **Try Demo** - Click "Demo" to load a sample MSA
   - ☁️ **Google Drive** - Import from your Drive (requires OAuth)

2. **Run Analysis**
   - Click **"Analyze"** to start AI review
   - Watch clauses stream in real-time
   - See risk assessment update live

3. **Review Clauses**
   - Click any clause to see details
   - **Plain English** - What it means in simple terms
   - **Risk & Flags** - Why it matters to you
   - **Suggested Edit** - Better language you can use
   - **Negotiate** - AI strategies for each clause

4. **Get Negotiation Tips**
   - Select a clause and view the "Negotiate" tab
   - Get 3-4 battle-tested strategies
   - Copy ready-to-use alternative wording
   - See confidence scores for each approach

5. **Ask Questions**
   - Use the chat panel to ask about specifics
   - "What happens if I'm late on payment?"
   - "Can they terminate without notice?"
   - Use 🎤 voice input for hands-free questions

### 📊 Using the Dashboard

1. **View Portfolio Risk**
   - Donut chart shows risk distribution
   - Quick counts of High/Medium/Low clauses
   - Trends across all your contracts

2. **Review History**
   - See all past contract analyses
   - Search by contract name
   - Click to view full results

3. **Take Action**
   - AI-suggested next steps
   - "Revisit liability caps in 3 agreements"
   - "Standardize termination language"

---

## 📱 Mobile Experience

ContractCoach is fully optimized for mobile with:

- 📑 **Tab Navigation** - Contract, Clauses, Details, Chat tabs
- 👆 **Swipe Gestures** - Swipe left/right between tabs  
- 🔘 **Floating Action Button** - Quick access to key actions
- ⬇️ **Pull to Refresh** - Update dashboard with a swipe
- 🎯 **Touch-Optimized** - Large tap targets, readable text

---

## 🎨 Customization

### Theme Options
- ☀️ **Light Mode** - Clean, bright interface
- 🌙 **Dark Mode** - Easy on the eyes (default)
- 🖥️ **System** - Follows OS preference

### Risk Thresholds
- ⚙️ **Adjustable Sensitivity** - Set your own risk criteria
- 📊 **Clause Type Weights** - Prioritize what matters to you
- 🔔 **High Risk Warnings** - Get alerts for concerning clauses

### Analysis Options
- 📏 **Clause Count** - 5-10 clauses per contract
- 🎯 **Focus Areas** - Payment, IP, Termination, Liability
- ❓ **Custom Questions** - Ask specific things about your contract

---

## 🔒 Security

- 🔐 **No Contract Storage** - We don't permanently store your contract text
- 🔑 **Secure API Keys** - All credentials stored as environment variables
- 🚦 **Rate Limiting** - Protection against abuse
- 🔒 **CORS Configured** - Only allowed origins can access API
- 🛡️ **Input Validation** - All inputs sanitized and validated

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (via Supabase)
- Redis (via Upstash)
- OpenAI API Key

### Environment Variables
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE=eyJ...
DATABASE_URL=postgresql://...

# Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Local Development

```bash
# Clone the repo
git clone https://github.com/derril-tech/ai-contract-coach.git
cd ai-contract-coach

# Backend
cd api
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd web
npm install
npm run dev
```

---

## 👨‍💻 Creator

**Created by Derril Filemon**

- 🐙 [GitHub](https://github.com/derril-tech)
- 💼 [LinkedIn](https://www.linkedin.com/in/derril-filemon-a31715319)

---

## 🙏 Acknowledgments

- **OpenAI** - For GPT-4.1 API and structured outputs
- **Supabase** - For PostgreSQL database
- **Upstash** - For Redis caching and rate limiting
- **Railway** - For backend deployment
- **Vercel** - For frontend deployment
- **shadcn/ui** - For beautiful components
- **Framer Motion** - For smooth animations

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/derril-tech/ai-contract-coach/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/derril-tech/ai-contract-coach/discussions)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ and ☕ by [Derril Filemon](https://github.com/derril-tech)

*"Because everyone deserves to understand what they're signing."*

</div>
