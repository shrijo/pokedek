# Pokedek Starter

This repo contains two folders:

| Path | Description | Deployment target |
|------|-------------|-------------------|
| `frontend/` | React client (Vite) with Supabase & Socket.IO‑client | **Vercel** |
| `server/`   | Node + Express + Socket.IO server | **Render** |

---

## 1 · Create the GitHub repo

```bash
git init
git add .
git commit -m "Initial Pokedek starter"
gh repo create your‑username/pokedek --public --source=. --remote=origin
git push -u origin main
```

> Make sure you have the GitHub CLI installed (`brew install gh`) and are logged in.

---

## 2 · Set up Supabase

1. Sign in at <https://supabase.com> → **New project**.
2. Note the **Project URL** and **Anon public key** (Settings → API).
3. SQL editor → run:

```sql
create table experiences (
  id uuid default uuid_generate_v4() primary key,
  name text,
  description text
);

insert into experiences (name, description) values
  ('Sample experience', 'Feel free to edit me!');
```

4. In **Project settings → Database** click “_Enable Realtime_”.

---

## 3 · Configure `.env` files locally

```bash
cp frontend/.env.example frontend/.env
# edit VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY
# set VITE_SERVER_URL to your Render service URL (we’ll create it next)
```

---

## 4 · Deploy the Socket server on **Render**

1. Go to <https://dashboard.render.com> → **New → Web Service**.
2. Pick your repo, set root directory to `server/`.
3. Environment:
   - _Runtime_: **Node**
   - _Build command_: `npm install`
   - _Start command_: `npm start`
4. Click **Create Web Service**.  
   After first deploy finishes, note the service URL (e.g. `https://pokedek-socket.onrender.com`).

---

## 5 · Deploy the React app on **Vercel**

1. Go to <https://vercel.com/new> → import the GitHub repo.
2. **Root directory**: `frontend/`
3. **Build command**: `npm run build` (detected automatically)
4. **Output dir**: `dist`
5. **Environment variables** → add the three from `frontend/.env`.
6. Click **Deploy**.  
   The generated URL is your production frontend.

---

## 6 · Local development

```bash
# terminal 1 – socket server
cd server
npm install
node index.js   # default :4000

# terminal 2 – React app
cd frontend
npm install
npm run dev     # Vite dev server on :5173
```

---

You’re ready! Open the React app → click an experience → scan the QR code to start controlling the square with your phone.

Enjoy 🎉
