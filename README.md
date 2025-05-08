# Token Dashboard

A minimal React admin dashboard for the Design Token Manager API, built with Vite and React.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Setup](#setup)

  * [Clone & Install](#clone--install)
  * [Run the Dashboard](#run-the-dashboard)
* [Environment Configuration](#environment-configuration)
* [Usage](#usage)
* [Scripts](#scripts)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Login** via JWT to secure API calls
* **List** design tokens
* **Create** new tokens
* **Delete** existing tokens
* **Persistent** session using `localStorage`

---

## Tech Stack

* **Vite** for fast bundling
* **React** (with Hooks) for UI
* **Fetch API** for HTTP requests
* **whatwg-fetch** polyfill for compatibility

---

## Prerequisites

* Node.js v18+ and npm
* Running Design Token Manager API at `http://localhost:4000`

---

## Setup

### Clone & Install

```bash
git clone https://github.com/<your-org>/token-dashboard.git
cd token-dashboard
npm install
```

### Run the Dashboard

```bash
npm run dev
```

The app will open in your browser at `http://localhost:5173`.

---

## Environment Configuration

By default, the dashboard points to the API at `http://localhost:4000`. To change the API URL, edit `src/main.jsx` or define a Vite environment variable in a `.env` file:

```dotenv
VITE_API_URL=https://api.yourdomain.com
```

Then update fetch calls in your components to use `import.meta.env.VITE_API_URL`.

---

## Usage

1. Open the dashboard in your browser.
2. Log in with your admin credentials (e.g., `admin` / `Admin#123`).
3. Browse existing tokens, add new ones, or delete as needed.
4. Click **Logout** to end your session.

---

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Build production assets  |
| `npm run preview` | Preview production build |

---

## Contributing

1. Fork this repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

[MIT](LICENSE)
