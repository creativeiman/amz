# 🚀 Non-Technical Setup Guide - Amazon Label Compliance Checker

**Don't worry! This guide is designed for non-technical people. I'll walk you through everything step by step.**

## 🎯 **What You Have Right Now**

✅ **Your website is already LIVE!** 
- **URL:** https://vercel-deploy-n5u8hmjlg-joyeneghalu-gmailcoms-projects.vercel.app
- **Status:** Working and accessible to everyone
- **Features:** Beautiful homepage, pricing, contact forms

## 📋 **What You Need to Do Next (Step by Step)**

### **Step 1: Set Up a Database (5 minutes)**

**Why you need this:** To store user accounts and data

**What to do:**
1. **Go to** [supabase.com](https://supabase.com)
2. **Click "Start your project"**
3. **Sign up with Google** (easiest way)
4. **Click "New Project"**
5. **Fill out the form:**
   - **Name:** `amazon-compliance-checker`
   - **Database Password:** Create a strong password (write it down!)
   - **Region:** Choose closest to you
6. **Click "Create new project"**
7. **Wait 2-3 minutes** for it to set up

### **Step 2: Get Your Database Connection String (2 minutes)**

1. **In your Supabase project, click "Settings"** (left sidebar)
2. **Click "Database"**
3. **Scroll down to "Connection string"**
4. **Copy the "URI"** (it looks like: `postgresql://postgres:...`)
5. **Save this somewhere safe** - you'll need it next

### **Step 3: Add Database to Your Website (3 minutes)**

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click on your project** (vercel-deploy)
3. **Click "Settings"** tab
4. **Click "Environment Variables"**
5. **Click "Add New"**
6. **Fill out:**
   - **Name:** `DATABASE_URL`
   - **Value:** (paste your Supabase connection string)
   - **Environment:** Check all boxes (Production, Preview, Development)
7. **Click "Save"**

### **Step 4: Set Up Google Login (5 minutes)**

**Why you need this:** So users can sign in with their Google account

1. **Go to** [console.cloud.google.com](https://console.cloud.google.com)
2. **Click "Select a project"** → **"New Project"**
3. **Name:** `Amazon Compliance Checker`
4. **Click "Create"**
5. **Go to "APIs & Services"** → **"Credentials"**
6. **Click "Create Credentials"** → **"OAuth 2.0 Client ID"**
7. **Application type:** Web application
8. **Name:** `Amazon Compliance Checker`
9. **Authorized redirect URIs:** Add this:
   ```
   https://vercel-deploy-n5u8hmjlg-joyeneghalu-gmailcoms-projects.vercel.app/api/auth/callback/google
   ```
10. **Click "Create"**
11. **Copy the Client ID and Client Secret**

### **Step 5: Add Google Login to Your Website (2 minutes)**

1. **Go back to Vercel** → **Settings** → **Environment Variables**
2. **Add these two new variables:**

   **Variable 1:**
   - **Name:** `GOOGLE_CLIENT_ID`
   - **Value:** (paste your Google Client ID)
   - **Environment:** All boxes checked

   **Variable 2:**
   - **Name:** `GOOGLE_CLIENT_SECRET`
   - **Value:** (paste your Google Client Secret)
   - **Environment:** All boxes checked

3. **Click "Save"**

### **Step 6: Add a Secret Key (1 minute)**

1. **In Vercel** → **Settings** → **Environment Variables**
2. **Add:**
   - **Name:** `NEXTAUTH_SECRET`
   - **Value:** `your-super-secret-key-here-make-it-long-and-random`
   - **Environment:** All boxes checked
3. **Click "Save"**

### **Step 7: Redeploy Your Website (1 minute)**

1. **In Vercel dashboard, click "Deployments"**
2. **Click the three dots** on the latest deployment
3. **Click "Redeploy"**
4. **Wait 2-3 minutes** for it to finish

## 🎉 **You're Done!**

**Your website now has:**
- ✅ **User registration and login**
- ✅ **Google sign-in**
- ✅ **Database to store user data**
- ✅ **All the beautiful design and features**

## 🧪 **Test Your Website**

1. **Go to your website:** https://vercel-deploy-n5u8hmjlg-joyeneghalu-gmailcoms-projects.vercel.app
2. **Click "Sign Up"**
3. **Try creating an account**
4. **Try signing in with Google**

## 🆘 **If You Get Stuck**

### **Common Issues:**

**"Database connection failed"**
- Check that you copied the Supabase connection string correctly
- Make sure you added it as `DATABASE_URL` in Vercel

**"Google login not working"**
- Check that you added the correct redirect URI
- Make sure both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are added

**"Website not updating"**
- Try redeploying in Vercel
- Wait a few minutes for changes to take effect

### **Need Help?**
- **Supabase Help:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel Help:** [vercel.com/docs](https://vercel.com/docs)
- **Google Cloud Help:** [cloud.google.com/docs](https://cloud.google.com/docs)

## 💰 **Costs (All Free!)**

- **Vercel:** Free hosting
- **Supabase:** Free database (500MB)
- **Google Cloud:** Free OAuth setup
- **Total cost:** $0/month

## 🚀 **What's Next?**

Once your basic setup is working:

1. **Add payment processing** (Stripe)
2. **Add file upload** for label images
3. **Add AI analysis** for compliance checking
4. **Add email notifications**

**But for now, you have a fully functional website that users can sign up for!**

---

**Remember: Take it one step at a time. If you get confused, just ask for help!** 😊
