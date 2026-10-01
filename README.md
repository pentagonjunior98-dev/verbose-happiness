# PeeJay AI Creator Studio — Real AI Edition

This version keeps the black + gold frontend and connects Script Generator, Prompt Studio, Caption Generator and Content Ideas to the OpenAI Responses API through a Vercel serverless function.

## Deploy
1. Add `OPENAI_API_KEY` to your Vercel project's Environment Variables.
2. Redeploy the project.
3. Open the live app and test each generator.

The API key is read only on the server and is never placed in browser JavaScript.

## Important
This MVP does not yet include user accounts, persistent per-user projects, usage metering, or payments. Add those before opening the AI endpoint broadly to the public.
