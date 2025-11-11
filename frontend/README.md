# 📊 KOL Data Analytics Platform - Frontend (React + D3.js)

This directory contains the single-page application (SPA) built with **React** and **TypeScript**. It utilizes **Tailwind CSS** for styling and **D3.js** for interactive data visualization, using a custom color theme.

## ✨ Features
* **Responsive Layout** with a custom Tailwind theme.
* **Global State Management** using the React Context API and Custom Hooks (`useKolData`).
* **Interactive Visualization** via a responsive D3.js horizontal bar chart with a custom React-based tooltip.
* **API Integration** with the FastAPI backend to fetch real-time analytics and data.

## 🚀 Setup and Run

### Prerequisites
* Node.js (LTS recommended)
* npm or yarn

### Installation
1.  **Navigate to the frontend directory:**
    ```bash
    cd kol-platform/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install  # or yarn install
    ```

### Run the Application
1.  **Ensure the FastAPI backend is running** on `http://127.0.0.1:8000`.
2.  **Start the React development server:**
    ```bash
    npm run dev  # or yarn dev
    ```
The frontend application will typically open at `http://localhost:3000` (or similar).

---