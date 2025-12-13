<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1IPC6ZhcCFt52RwgQCJPq7DB33_87_Gh1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file and set the `VITE_GEMINI_API_KEY` to your Gemini API key (Vite requires the VITE_ prefix for client-side envs):

```
VITE_GEMINI_API_KEY=your_api_key_here
```
3. Run the app:
   `npm run dev` (not `npm start`, which isn't configured in this project)

If you want the frontend to use the local backend API (Armyshop-BE), set the environment variable `VITE_API_URL` before starting Vite:

```powershell
setx VITE_API_URL "http://localhost:5000"
npm run dev
```

You can then log in to the admin pages with the seeded admin user (username: `admin`, password: `admin`) and manage products/orders/customers via the backend API.
