# Dogs Trust Home Check — Live App Project

This is the real Next.js/Supabase version of the Dogs Trust home-check app.

## Current design decisions
- Dogs Trust branding
- Secure Supabase login
- Liza can be an admin
- Volunteers see their own checks; admins can view all checks
- No Concerns section
- Trust Your Gut retained
- No signatures
- Home checks saved in Supabase
- Photos use a Supabase Storage bucket
- Reports can be printed/saved as PDF from the browser

## Supabase
The existing tables/policies are assumed to already exist.
Run `setup-storage.sql` once in Supabase SQL Editor to create the photo bucket/policies.

## Local run
1. Copy `.env.local.example` to `.env.local`.
2. Set:
   NEXT_PUBLIC_SUPABASE_URL=https://osihxfijaxlqhectmaoy.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

Do not put a Supabase service-role/secret key in this app. The browser uses the publishable key with Row Level Security.

## Deployment
This project is designed for Vercel or another Next.js host. Add the same two environment variables to the host before deploying.
