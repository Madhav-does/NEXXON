# NEXXON — Full-Stack Marketplace & Customer Support Platform

A modern, responsive full-stack Marketplace and Customer Support web application built with **Next.js (App Router, React 19, TypeScript, Tailwind CSS)** integrated with the **Nexconn Chat SDK for Web** (`@nexconn/chat`, `@nexconn/chatui`, and `@nexconn/engine`).

---

## ✨ Features

- **🛍️ Marketplace Browse Page**:
  - Filter by category (*Electronics, Audio, Furniture, Displays, Photography, Workspace*) and live search.
  - Rich product listings with prices, ratings, verified seller tags, and "Chat with Seller" action.
- **💬 1:1 Buyer-Seller Messaging View**:
  - Slide-out conversation drawer that preserves item inquiry context (pinned product card with photo & price).
  - Supports instant text messaging, image attachments with client preview, and full conversation history.
  - Dual view modes: **Custom Responsive UI** and official **Nexconn ChatUI Web Component** (`<nc-chat-ui-app-provider>`).
- **🎧 Customer Support Hub**:
  - **Floating Help & Support Widget**: Available on all pages for buyers and sellers to ask questions or trigger quick FAQ topics.
  - **Dedicated Support Agent Dashboard (`/support-dashboard`)**: Multi-column dispatch center for Support Agents with live ticket queue, customer 360 overview, canned reply templates, and real-time response interface.
- **👥 Mock User Role Switcher**:
  - Switch anytime between **Alex Rivera** (Buyer), **Sara Studio** (Seller 1), **TechCraft Workspace** (Seller 2), and **Emma** (Support Agent).
  - Automatically reconnects the Nexconn Chat engine with that user's identity and token.
- **🔒 Strict Security & Server-Side Token Generation**:
  - `NEXCONN_APP_SECRET` is strictly held on the server and never exposed to client browsers or bundles.
  - Backend route `/api/nexconn/token` computes SHA-1 HMAC signatures (`SHA1(AppSecret + Nonce + Timestamp)`) to request authenticated user tokens from Nexconn's server API.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI Library**: React 19, Tailwind CSS v4, Lucide Icons
- **Chat SDKs**:
  - `@nexconn/chat` (v26.5.1) — Real-time Web Messaging Engine, DirectChannel, Event Handlers
  - `@nexconn/chatui` (v26.5.0) — Official Web Components UI
  - `@nexconn/engine` (v26.5.1) — WebSocket transport and connection lifecycle
  - `lit` (v3.3.2) — Custom element rendering engine

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Madhav-does/NEXXON.git
cd NEXXON
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Public App Key from Nexconn Console
NEXT_PUBLIC_NEXCONN_APP_KEY=your_app_key_here

# Private App Secret (STRICTLY SERVER-SIDE ONLY)
NEXCONN_APP_SECRET=your_app_secret_here

# Optional: Nexconn API Base URL (default: Singapore)
NEXCONN_API_BASE_URL=api.sg-light-api.com
NEXT_PUBLIC_NEXCONN_DATA_CENTER=SG
```

*(You can get your App Key and App Secret from the [Nexconn Console](https://console.nexconn.ai/agile/apps/km). The app also runs with a built-in interactive demo mode if credentials are not yet configured).*

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/nexconn/
│   │   │   ├── token/route.ts           # Secure server-side token minting & SHA-1 signing
│   │   │   ├── config-status/route.ts   # Safe credentials status check
│   │   │   └── save-credentials/route.ts# Local assistant config updater
│   │   ├── messages/page.tsx            # Full-page dedicated Messaging Center
│   │   ├── support-dashboard/page.tsx   # Dedicated Support Agent dispatch dashboard
│   │   ├── layout.tsx                   # Global Root Layout
│   │   └── page.tsx                     # Marketplace Browse Page
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatDrawer.tsx           # 1:1 Buyer-Seller messaging drawer
│   │   │   ├── SupportWidget.tsx        # Floating Customer Support widget
│   │   │   └── NexconnChatUIProvider.tsx# Official Nexconn ChatUI web component wrapper
│   │   ├── Navbar.tsx                   # Main navigation & role switcher
│   │   ├── CredentialsModal.tsx         # In-app setup assistant modal
│   │   └── ClientProviders.tsx          # ChatProvider wrapper
│   ├── context/
│   │   └── ChatContext.tsx              # Nexconn Chat engine lifecycle & state management
│   └── data/
│       └── mockData.ts                  # Mock users (Buyer, Sellers, Agent) & products
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📄 License

MIT
