# ✨ FreeBuild — AI-Powered Website Builder

> 🔗 **Live Demo:** [https://two-websitebuilder-1-oxrp.onrender.com/](https://two-websitebuilder-1-oxrp.onrender.com/)

FreeBuild is a full-stack, AI-powered web application that allows users to instantly generate fully custom, responsive, and functional web pages using natural language prompts. Built on a modern tech stack (React + Node/Express + MongoDB + Stripe), FreeBuild simplifies website creation by automatically producing raw HTML, CSS, and JS code through LLMs and offering a live, interactive editor to refine the results.

---

## 🚀 Key Features

*   🤖 **AI Website Generator**: Uses the power of OpenRouter to dynamically generate responsive web pages from user prompts.
*   🛠️ **Live Monaco Code Editor**: An interactive, browser-based code editor (powered by Monaco Editor) for tweaking code on the fly.
*   💳 **Stripe Subscription & Credits**: Integrated billing system with support for Free, Pro, and Enterprise subscription tiers.
*   🔒 **Secure Authentication**: Built-in authentication powered by Firebase Auth, with support for Google Sign-In.
*   📁 **Monorepo Structure**: Fully structured client-server architecture with single-command workspace running using `concurrently`.

---

## 🛠️ Tech Stack

### Frontend (Client)
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
*   **Authentication**: [Firebase Client SDK](https://firebase.google.com/docs/web/setup)

### Backend (Server)
*   **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
*   **Payments & Webhooks**: [Stripe SDK](https://stripe.com/docs/api)
*   **AI Endpoint**: [OpenRouter API](https://openrouter.ai/docs) (supporting free fallback models like `openrouter/free`)

---

## 📁 Directory Structure

```text
FreeBuild/
├── client/                 # React frontend application
│   ├── public/             # Static public assets
│   ├── src/                # Frontend source code
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page views (Dashboard, Editor, Pricing, etc.)
│   │   ├── redux/          # Redux slices and store setup
│   │   ├── hooks/          # Custom hooks (e.g. Auth, user management)
│   │   └── App.jsx         # App router and central configuration
│   ├── .env.example        # Client environment template
│   └── package.json        # Frontend configuration and dependencies
│
├── server/                 # Express backend application
│   ├── config/             # DB, Stripe, OpenRouter and plan configs
│   ├── controllers/        # Route controllers (Auth, Billing, Website generation)
│   ├── models/             # Mongoose database models (User, Website)
│   ├── middlewares/        # Express middleware (Auth verification)
│   ├── routes/             # API routes definition
│   ├── .env.example        # Server environment template
│   └── package.json        # Backend configuration and dependencies
│
├── .gitignore              # Workspace-wide Git exclusion rules
├── package.json            # Root configuration for monorepo operations
└── README.md               # Main workspace documentation (this file)
```

---

## ⚙️ Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) installed on your machine.

---

### Step 1: Clone and Install Dependencies

1. Initialize Git in the project folder (if not already done):
   ```bash
   git init
   ```
2. Install dependencies for the root, frontend, and backend with a single command:
   ```bash
   npm run install:all
   ```

---

### Step 2: Configure Environment Variables

#### 📱 Client Setup (`client/.env`)
Create a `.env` file in the `client` directory based on the template:
```bash
cp client/.env.example client/.env
```
Fill in the following variables:
*   `VITE_FIREBASE_API_KEY`: Your Firebase Web SDK API key.
*   `VITE_SERVER_URL`: The local URL of your server (defaults to `http://localhost:5000`).

#### 🖥️ Server Setup (`server/.env`)
Create a `.env` file in the `server` directory based on the template:
```bash
cp server/.env.example server/.env
```
Fill in the following variables:
*   `PORT`: Port for the backend server (defaults to `5000`).
*   `CLIENT_URL`: The URL of your local React application (defaults to `http://localhost:5173`).
*   `MONGODB_URL`: Your MongoDB connection string.
*   `JWT_SECRET`: A secure key used for signing cookies/tokens.
*   `OPENROUTER_API_KEY`: Your OpenRouter API key.
*   `STRIPE_SECRET_KEY`: Your Stripe secret API key.
*   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret (obtained via Stripe CLI or Stripe dashboard).

---

### Step 3: Run the Application

Start both the backend server and frontend development server concurrently with a single command from the root directory:

```bash
npm run dev
```

*   **Frontend Access**: Open `http://localhost:5173` in your browser.
*   **Backend API**: Running at `http://localhost:5000`.

---

## 💳 Billing & Plans Setup

FreeBuild features three subscription tiers defined in [server/config/plan.js](file:///Users/saizade/Downloads/FreeBuild-main/server/config/plan.js):
- **Free**: 100 credits
- **Pro**: 500 credits ($4.99)
- **Enterprise**: 1000 credits ($14.99)

### Local Webhook Testing
To process Stripe webhooks locally:
1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Login to your Stripe account:
   ```bash
   stripe login
   ```
3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe/webhook
   ```
4. Copy the webhook signing secret returned in the terminal and add it as `STRIPE_WEBHOOK_SECRET` in your `server/.env` file.

---

## 🤖 AI Customization

The generation requests use **OpenRouter** to process prompts. 
To ensure zero costs during development and testing, the codebase uses the **`openrouter/free`** model router. You can customize this fallback model in [server/config/openRouter.js](file:///Users/saizade/Downloads/FreeBuild-main/server/config/openRouter.js).

---

## 🚀 Deployment

1. **Frontend**: Build the React application using:
   ```bash
   npm run build --prefix client
   ```
   The build folder `client/dist` can be deployed on services like Vercel, Netlify, or Render static sites. Make sure to point the `VITE_SERVER_URL` environment variable to your deployed API server.
2. **Backend**: Host the Node server on a cloud provider like Render, Heroku, or AWS. Configure the backend environment variables (including `CLIENT_URL` pointing to your deployed frontend domain).
