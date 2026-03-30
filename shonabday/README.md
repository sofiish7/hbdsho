# Happiest Birthday Sho - Vercel Deployment Guide

This project is ready to be deployed to Vercel via GitHub.

## Deployment Steps

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Push your code to the repository.

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com) and log in.
   - Click "Add New" -> "Project".
   - Import your GitHub repository.

3. **Configure Environment Variables**:
   In the Vercel project settings, add the following environment variables:
   - `VITE_SUPABASE_URL`: `https://crnqkftjrdywfpsohtwh.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_sM4IuY_xerR79YP8AdE7eQ_kqYQc5a9`
   - `GEMINI_API_KEY`: (Your Gemini API Key if used)

4. **Deploy**:
   - Vercel will automatically detect the Vite project and build it.
   - Once deployed, your site will be live!

## Local Development

1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Run `npm run dev`.

## Project Structure

- `src/`: React source code.
- `public/`: Static assets (add your images/files here).
- `vercel.json`: Configuration for Vercel routing.
