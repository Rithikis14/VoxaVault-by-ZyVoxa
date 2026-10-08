# VoxaVault ⚡

> **One account. Every pattern. Progress that follows you.**  
> *Engineered by ZyVoxa.*

VoxaVault is a high-performance Data Structures & Algorithms (DSA) pattern tracking notebook designed to help developers master technical interview patterns with structured tracking, persistent real-time progress syncing, and a refined developer user experience.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React (Vite) + TypeScript
- **Routing & Head Management:** `@tanstack/react-router`
- **Styling & UI:** Tailwind CSS, Framer Motion, Lucide Icons, `sonner` (Toast Notifications)
- **Backend & Database:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Native Auth (Google OAuth 2.0)
- **State & Theme:** React Context API + Custom Dark Mode Observer

---

## ✨ Key Features

- 🔐 **Passwordless Google Authentication:** Native Supabase OAuth flow with persistent session handling across devices.
- 🎯 **Pattern-Based Mastery:** Track DSA topics by underlying patterns (Sliding Window, Two Pointers, Dynamic Programming, Graphs, etc.).
- ⚡ **Real-time Persistence:** Automatic atomic updates synced straight to Supabase PostgreSQL using strict Row-Level Security policies.
- 🌓 **Dynamic Theme Adaptation:** Built-in dark/light mode UI with custom CSS design tokens.
- 🔒 **Zero-Trust Security Architecture:** Authenticated-only database mutations validated server-side via Supabase JWTs (`auth.uid()`).

---

## 📁 Project Structure

```text
voxavault/
├── src/
│   ├── components/      # UI components & branding assets
│   ├── integrations/    # Supabase client & generated database types
│   ├── lib/             # Auth context, session listeners, and helpers
│   ├── routes/          # TanStack Router page components (login, dashboard, etc.)
│   └── styles/          # Global styles, Tailwind directives & custom CSS variables
├── public/              # Favicons, logo assets, and static media
├── supabase/            # Supabase config & migration scripts
├── tailwind.config.js   # Tailwind theme configurations
└── vite.config.ts       # Vite bundling setup

```

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (`v18.0.0` or higher)
* [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/voxavault.git](https://github.com/your-username/voxavault.git)
cd voxavault

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=[https://your-supabase-project-ref.supabase.co](https://your-supabase-project-ref.supabase.co)
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

```

### 4. Database Setup (Supabase SQL)

Ensure your Supabase database has the `progress` table configured with Row-Level Security enabled:

```sql
CREATE TABLE public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pattern_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, pattern_id)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
ON public.progress
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

```

### 5. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📦 Production Deployment

### Build for Production

To create an optimized production build:

```bash
npm run build

```

Preview the production build locally:

```bash
npm run preview

```

### Hosting

This application is ready to deploy on **Vercel**, **Netlify**, or **Render**:

1. Connect your GitHub repository to your hosting provider.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the production environment variables.

---

## 🛡️ Security Note

* **Environment Keys:** Never commit `.env` or `.env.local` files containing secrets to your Git repository.
* **Service Role:** Never expose the `SUPABASE_SERVICE_ROLE_KEY` on the client side.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

Developed with ❤️ by **ZyVoxa**.

```

<FollowUp label="Want me to generate a clean MIT LICENSE file to accompany this README?" query="Generate an MIT LICENSE file for VoxaVault by ZyVoxa."/>

```