# ÉLARA — Women's Fashion Market Research Survey

A modern, mobile-responsive market research web application designed for a Sri Lankan women's clothing startup to test demand and customer preferences before purchasing their debut inventory batch.

---

## 🌟 Key Features

### 1. Public Survey Website (`/`)
- **No registration or login needed:** Potential customers open the link and complete the research survey directly.
- **Hero & Story:** Editorial fashion aesthetic with warm ivory/sand tones, burgundy accents, and typography (`Cormorant Garamond` serif & `Jost` sans-serif).
- **6-Step Interactive Wizard:**
  1. **Select Designs:** Filterable gallery (All, Casual Tops, Blouses, Dresses) with heart favorites and multi-selection.
  2. **Colours & Details:** Visual color swatches (Black, White, Beige, Burgundy, Sage Green, Dusty Pink, Navy Blue, Other) plus optional sleeve, neckline, and length preferences.
  3. **Style & Fabric:** Visual swatches for cotton, linen, satin, ribbed knit, etc., and priority factors (comfort, breathability, durability, quality).
  4. **Fit & Price:** Perceived value price range in Sri Lankan Rupees (LKR) and purchase intention score. Fit and size are marked optional.
  5. **Collection Wishlist & Optional Virtual Try-On:** What to release next + privacy-safe on-device photo preview placeholder (photo never uploaded or stored).
  6. **Contact Details & Consent:** Full name, Sri Lankan mobile number validation, and explicit opt-in for launch updates.
- **Instant Confirmation:** Thank-you screen confirming feedback recording with duplicate prevention (idempotent `submission_id`).

### 2. Admin Panel (`/admin-pannel`)
- Manually typed route protected by hardcoded credentials:
  - **Username:** `admin`
  - **Password:** `Elara@2026`
  *(Can be customized via `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`)*
- **3 Comprehensive Views:**
  1. **Insights & Analytics:**
     - KPI cards (Total participants, top design, top category, top color, price sweetspot, top size).
     - Recharts visualizations: Purchase intention score, category breakdown, design popularity leaderboard, colorway preferences, price acceptance curve, fashion styles, fabrics, and size distribution.
     - Business research guidance note (reminding the team that interest does not guarantee exact sales).
  2. **Survey Responses:**
     - Filter by purchase intention and price range.
     - Search by participant name, mobile number, or design name.
     - Modal viewer for in-depth response details (selected items, custom colors, style preferences, free-text feedback).
     - **CSV Export:** One-click download of all participant responses (`.csv`).
  3. **Clothing Design Management:**
     - Add new designs or edit existing ones.
     - Upload design images directly from your device (saved to local `data/uploads`) or provide an image URL.
     - Set category, price min/max, sort order, and active/hidden status.

### 3. Secret Path Access (Optional)
- Direct read-only access to analytics without login at `/insights-dev` (in development) or configured via `DASHBOARD_PATH` env variable.

---

## 🚀 Getting Started

### Prerequisites
- Node.js **>= 18.18.0** (Node 22 is recommended).
  *If using nvm on Windows:*
  ```powershell
  nvm use 22.14.0
  ```

### Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - **Public Survey:** [http://localhost:3000](http://localhost:3000)
   - **Admin Panel:** [http://localhost:3000/admin-pannel](http://localhost:3000/admin-pannel)
     - Username: `admin`
     - Password: `Elara@2026`

---

## 📁 Project Structure

```
├── data/                         # Local JSON data store (git-ignored)
│   ├── designs.json              # Active and inactive clothing designs
│   ├── responses.json            # Completed customer surveys
│   └── uploads/                  # Uploaded garment photos
├── public/images/
│   ├── hero.jpg                  # Editorial campaign hero image
│   └── designs/                  # 12 high-resolution sample product photos
├── src/
│   ├── app/
│   │   ├── page.tsx              # Public survey page
│   │   ├── admin-pannel/         # Admin panel route
│   │   ├── [dashboard]/          # Secret unguessable analytics path
│   │   └── api/
│   │       ├── admin/export/     # Responses CSV export endpoint
│   │       ├── try-on/           # Virtual try-on API stub
│   │       └── uploads/[file]/   # Uploaded images handler
│   ├── components/
│   │   ├── survey/               # Survey wizard, cards, swatches, try-on
│   │   ├── admin/                # Analytics charts, responses table, designs CRUD
│   │   └── ui/                   # Base UI & Tailwind components
│   ├── config/
│   │   ├── site.ts               # Brand name & metadata
│   │   └── admin.ts              # Admin credentials & session secrets
│   └── lib/
│       ├── data/                 # JSON file store with atomic file locks
│       ├── survey/               # Options, Zod schema, server actions
│       ├── admin/                # Admin auth & design CRUD actions
│       ├── analytics.ts          # Aggregate KPI & chart metrics
│       └── csv.ts                # CSV generator
```

---

## 🛡️ Privacy & Data Handling
- Participant personal information is stored locally in `data/responses.json` and excluded from git via `.gitignore`.
- On-device virtual try-on operates completely inside the user's browser using memory URLs and is never uploaded.
