# ✈️ Travel Journey App

> An AI-powered travel planner that turns a few trip preferences into a complete, day-by-day itinerary — built with **vanilla JavaScript**, **Vite**, and **Bootstrap 5**.

Fill in a short form (destination, dates, travelers, budget, interests) and the app asks **Google Gemini** to generate a personalized plan: a daily timeline, weather forecast, budget breakdown, packing list, top places, and local quick-info. Plans can be saved locally and revisited anytime.

---

## ✨ Features

- 🤖 **AI-generated trip plans** via Google Gemini (with a built-in mock provider for offline development)
- 🗺️ **Day-by-day itinerary** with a timeline of timed activities
- 🌤️ **Weather forecast** for the trip dates
- 💸 **Estimated budget** breakdown (flights, hotel, food, transport, activities)
- ℹ️ **Quick info** panel (currency, language, time zone, voltage)
- 🧳 **Top places, packing list & travel warnings**
- 💾 **Save & manage trips** in the browser (localStorage) — view or delete them later
- ✅ **Client-side form validation**
- 🧭 **Client-side routing** (SPA) with a custom lightweight router
- 📱 **Responsive UI** powered by Bootstrap 5

---

## 🛠️ Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Language     | JavaScript (ES Modules)                      |
| Build tool   | [Vite](https://vitejs.dev/)                  |
| UI framework | [Bootstrap 5](https://getbootstrap.com/)     |
| AI provider  | [Google Gemini API](https://ai.google.dev/)  |
| Persistence  | Browser `localStorage`                       |

No front-end framework — the app is intentionally built with plain JS to keep it dependency-light and easy to follow.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+**
- A **Google Gemini API key** ([get one here](https://aistudio.google.com/app/apikey)) — optional if you only use the mock provider

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/DevAhmedHelmy/travel-journey-app.git
cd travel-journey-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then open .env and add your Gemini API key

# 4. Start the dev server
npm run dev
```

The app will be available at the URL printed in your terminal (default: `http://localhost:5173`).

---

## 🔑 Environment Variables

Create a `.env` file in the project root (see [`.env.example`](.env.example)):

| Variable               | Required | Default            | Description                          |
| ---------------------- | -------- | ------------------ | ------------------------------------ |
| `VITE_GEMINI_API_KEY`  | Yes\*    | —                  | Your Google Gemini API key           |
| `VITE_GEMINI_MODEL`    | No       | `gemini-2.0-flash` | Gemini model to use                  |

\* Only required when using the `gemini` provider. The app ships with a `mock` provider that returns sample data without any API key.

---

## 📜 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server (hot reload)   |
| `npm run build`   | Build for production into `dist/`        |
| `npm run preview` | Preview the production build locally     |

---

## 🧠 How It Works

```text
Search ──▶ Generate ──▶ Results
  │            │            │
  │            │            └─ Itinerary, weather, budget, quick info, packing list…
  │            └─ Calls the AI service, shows a loading pipeline
  └─ Collects & validates trip preferences
```

1. **Search** — the user enters trip details; input is validated client-side.
2. **Generate** — the trip is sent to the AI service (`gemini` or `mock`); a step-by-step loader is shown.
3. **Results** — the returned plan is rendered into tabs and a persistent budget/quick-info sidebar.
4. **Save** — plans are stored in `localStorage` and listed on the **My Trips** page.

---

## 📁 Project Structure

```text
src/
├── adapters/        # External integrations
│   └── ai/          #   Gemini + mock AI providers
├── components/      # Reusable UI building blocks
│   ├── form/        #   Inputs, selects, checkbox groups
│   ├── layout/      #   Shared header
│   ├── trip/        #   Itinerary, budget, packing list, summary
│   └── ui/          #   Card wrapper, loader
├── config/          # App configuration (API/providers)
├── router/          # Lightweight SPA router + route table
├── services/        # Business logic (AI orchestration)
├── storage/         # localStorage adapter
├── store/           # In-memory state + saved-trips store
├── styles/          # CSS
├── utils/           # Helpers (date, dom, formatters)
├── validators/      # Form validation
├── views/           # Page-level views (search, generate, results, saved, 404)
├── app.js           # App bootstrap
└── main.js          # Entry point
```

---

## 🗺️ Routes

| Path         | View          | Description                     |
| ------------ | ------------- | ------------------------------- |
| `/` `/search`| Search        | Trip preferences form           |
| `/generate`  | Generate      | AI generation / loading screen  |
| `/results`   | Results       | Generated trip plan             |
| `/saved`     | My Trips      | Saved trips (localStorage)      |
| `*`          | Not Found     | 404 fallback                    |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Open a pull request against `master`

---

## 👤 Author

**Ahmed Helmy** — [@DevAhmedHelmy](https://github.com/DevAhmedHelmy)

---

## 📄 License

This project is released under the [MIT License](LICENSE).
