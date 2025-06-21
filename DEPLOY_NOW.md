# 🚀 Deploy Your Dayton Business Directory NOW!

Your application is ready for deployment! Follow these steps to get it live:

## Method 1: Quick Deploy with Vercel (Recommended)

### Step 1: Login to Vercel
```bash
vercel login
```
This will open your browser for authentication.

### Step 2: Deploy
```bash
vercel
```
Follow the prompts:
- Project name: `dayton-business-directory`
- Directory: `./` (default)
- Override settings: `No`

## Method 2: GitHub + Vercel (Best for ongoing development)

### Step 1: Push to GitHub
```bash
# If you don't have a GitHub repo yet:
# 1. Create a new repository on GitHub
# 2. Add the remote:
git remote add origin https://github.com/yourusername/dayton-business-directory.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

## ⚠️ IMPORTANT: Set Environment Variables

After deployment, you MUST add these environment variables in Vercel:

### Required Variables:
```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-32-character-secret-here
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### Optional Variables:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BRIGHTDATA_API_KEY=your-brightdata-key
BRIGHTDATA_ZONE=your-brightdata-zone
```

## 🗄️ Database Options (Choose One)

### Option A: Supabase (Free, Recommended)
1. Sign up at https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Use this as your DATABASE_URL

### Option B: PlanetScale (Free)
1. Sign up at https://planetscale.com
2. Create new database
3. Get connection string from dashboard
4. Use this as your DATABASE_URL

### Option C: Neon (Free)
1. Sign up at https://neon.tech
2. Create new project
3. Copy connection string
4. Use this as your DATABASE_URL

## 🔑 Generate Secrets

### NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```
Or use: https://generate-secret.vercel.app/32

## 📝 After Deployment

### 1. Set Environment Variables
- Go to Vercel dashboard
- Click your project
- Go to Settings → Environment Variables
- Add all required variables above

### 2. Redeploy
- Go to Deployments tab
- Click "Redeploy" on latest deployment
- Or push a new commit to trigger auto-deploy

### 3. Run Database Migration
```bash
# In your local terminal:
vercel env pull .env.local
npm run db:push
```

### 4. Test Your App
- Visit your Vercel URL
- Test business listing creation
- Test lead form submission
- Verify real-time features work

## 🎉 You're Live!

Your Dayton Business Directory is now live with:
- ✅ Real-time lead routing
- ✅ Business dashboards
- ✅ BrightData integration
- ✅ Mobile-first design
- ✅ Analytics tracking

## 🐛 Troubleshooting

If something doesn't work:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure database is accessible
4. Check the deploy.md file for detailed troubleshooting

## 🔄 Continuous Deployment

Every push to your main branch will automatically deploy to Vercel!

---

**Ready to deploy?** Run `vercel login` then `vercel` in your terminal!