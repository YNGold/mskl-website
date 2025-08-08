# MSKL.io Deployment Guide

## Production Database Setup (PlanetScale - FREE)

### Step 1: Create PlanetScale Database
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with your GitHub account
3. Create a new database called `mskl-website`
4. Go to "Connect" → "Connect with Prisma"
5. Copy the connection string

### Step 2: Update Environment Variables
Replace the DATABASE_URL in your `.env` file:
```
DATABASE_URL="mysql://username:password@hostname:port/database_name?sslaccept=strict"
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `YNGold/mskl-website`
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PlanetScale connection string
   - `NEXTAUTH_SECRET`: Your secret key
   - `NEXTAUTH_URL`: Your production URL

### Step 4: Set up Database Schema
After deployment, run these commands locally:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to production database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### Step 5: Configure Domain
1. In Vercel dashboard, go to Settings → Domains
2. Add `MSKL.io` and `www.MSKL.io`
3. Configure DNS in GoDaddy:
   - A record: `@` → `76.76.19.76`
   - CNAME record: `www` → `cname.vercel-dns.com`

## Local Development
- Uses SQLite database (`dev.db`)
- Run `npm run dev` to start development server
- Database changes: `npm run db:push`

## Production
- Uses PlanetScale MySQL database (FREE tier)
- Automatic deployments from GitHub
- Environment variables configured in Vercel dashboard

## PlanetScale Free Tier Benefits:
- **Completely FREE** - No credit card required
- **1 database**
- **1 billion row reads/month**
- **10 million row writes/month**
- **5GB storage**
- **Perfect for MSKL.io**
