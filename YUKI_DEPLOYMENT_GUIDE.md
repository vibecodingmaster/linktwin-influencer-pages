# Yuki Kimura Vercel Deployment Guide

## Profile 2 of 50 - Complete Setup Instructions

---

## Part 1: Vercel Deployment (15 minutes)

### Step 1: Create New Vercel Project

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Your GitHub Repository**
   - Select: **"vibecodingmaster/linktwin-influencer-pages"**
   - Click **"Import"**

3. **Configure Project Settings**

   **Project Name:**
   ```
   yuki-kimura-japan
   ```

   **Root Directory:**
   ```
   02_yuki.kimura.japan
   ```
   ⚠️ **IMPORTANT**: Click "Edit" next to Root Directory and select `02_yuki.kimura.japan`

   **Build Settings:**
   - Framework Preset: **Other**
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty)*
   - Install Command: *(leave empty)*

4. **Click "Deploy"**
   - Vercel will deploy your site
   - Wait for "Congratulations!" message
   - You'll get a URL like: `yuki-kimura-japan.vercel.app`

---

## Part 2: Spaceship.com Domain Setup

You'll need to decide on your domain structure. Choose ONE option:

### Option A: Subdomain (Recommended for 50 profiles)
**Example**: `yukikimura.gramflow.link` or `yuki.gramflow.link`

### Option B: Custom Domain
**Example**: `yukikimura.com` (requires buying new domain)

---

### For Option A: Subdomain Setup (RECOMMENDED)

#### Step 1: Spaceship.com DNS Settings

1. **Login to Spaceship**
   - Go to: https://www.spaceship.com/
   - Click **"Sign In"**

2. **Access DNS Management**
   - Click on your domain: **gramflow.link**
   - Go to **"DNS"** tab
   - Click **"Manage DNS Records"**

3. **Add New DNS Record**

   Click **"Add Record"** and enter:

   **Record Type:** `CNAME`

   **Name:** `yukikimura` (or `yuki`, or `02.yuki.kimura.japan`)

   **Value:** `cname.vercel-dns.com`

   **TTL:** `3600` (or leave as "Auto")

   Click **"Save"** or **"Add Record"**

4. **Example DNS Records Setup**
   ```
   Type    Name        Value                    TTL
   ──────────────────────────────────────────────────
   CNAME   yukikimura  cname.vercel-dns.com     3600
   ```

5. **IMPORTANT**: If using the full handle as subdomain:
   ```
   Name: 02.yuki.kimura.japan
   ```
   This would create: `02.yuki.kimura.japan.gramflow.link`

---

#### Step 2: Vercel Domain Configuration

1. **Go to Your Vercel Project**
   - Visit: https://vercel.com/dashboard
   - Click on: **yuki-kimura-japan** project

2. **Add Custom Domain**
   - Click **"Settings"** tab
   - Click **"Domains"** in left sidebar
   - Click **"Add Domain"**

3. **Enter Your Subdomain**
   ```
   yukikimura.gramflow.link
   ```
   (or whatever you chose in Spaceship DNS)

4. **Click "Add"**
   - Vercel will verify DNS
   - If configured correctly: **"Valid Configuration ✓"**
   - If not ready: Wait 5-10 minutes for DNS propagation

5. **Set as Primary Domain (Optional)**
   - Click the **3 dots** next to your custom domain
   - Click **"Set as Primary"**
   - This redirects `*.vercel.app` to your custom domain

---

## Part 3: Verification & Testing

### Step 1: DNS Propagation Check

Wait **5-15 minutes** after adding DNS records, then test:

**Command Line Test:**
```bash
nslookup yukikimura.gramflow.link
```

**Expected Result:**
```
Name:    yukikimura.gramflow.link
Address: 76.76.21.21 (Vercel's IP)
```

**Online Tool:**
- Visit: https://dnschecker.org/
- Enter: `yukikimura.gramflow.link`
- Check if CNAME is propagated globally

### Step 2: Test Your Page

1. **Open in Browser:**
   ```
   https://yukikimura.gramflow.link
   ```

2. **Verify Features:**
   - ✅ Profile image loads (Yuki Kimura)
   - ✅ Name shows: "Yuki Kimura"
   - ✅ Handle shows: "@02_yuki.kimura.japan"
   - ✅ No certificate errors (HTTPS lock icon)
   - ✅ Click "Private conversations" button
   - ✅ Age verification modal appears
   - ✅ Clicking "Yes, I'm 18+" redirects to: `https://go.gramflow.link/yukikimura`

### Step 3: Instagram Deeplink Test

**Test from Instagram:**

1. **Post Link in Instagram Story/Bio:**
   ```
   yukikimura.gramflow.link
   ```

2. **Click from Instagram App (iOS):**
   - Should see deeplink modal
   - Instructions to open in Safari

3. **Click from Instagram App (Android):**
   - Should prompt to open in Chrome
   - Opens in external browser

---

## Quick Reference: All Settings

### Vercel Project Settings
```
Project Name:      yuki-kimura-japan
Root Directory:    02_yuki.kimura.japan
Framework:         Other
Custom Domain:     yukikimura.gramflow.link
```

### Spaceship DNS Record
```
Type:    CNAME
Name:    yukikimura
Value:   cname.vercel-dns.com
TTL:     3600
```

### URLs
```
Vercel URL:        https://yuki-kimura-japan.vercel.app
Custom Domain:     https://yukikimura.gramflow.link
Private Link:      https://go.gramflow.link/yukikimura
```

---

## Troubleshooting

### Issue: "Invalid Configuration" in Vercel

**Cause:** DNS not propagated yet

**Solution:**
1. Wait 10-15 minutes
2. Check DNS with: `nslookup yukikimura.gramflow.link`
3. Click "Refresh" in Vercel Domains settings

### Issue: Certificate Error on Custom Domain

**Cause:** Vercel hasn't issued SSL cert yet

**Solution:**
1. Wait 5 minutes after DNS verification
2. Vercel auto-issues SSL via Let's Encrypt
3. Check "Domains" tab for SSL status

### Issue: 404 Not Found

**Cause:** Root directory not set correctly

**Solution:**
1. Go to Project Settings → General
2. Scroll to "Root Directory"
3. Click "Edit"
4. Enter: `02_yuki.kimura.japan`
5. Click "Save"
6. Vercel will auto-redeploy

### Issue: Deeplink Modal Not Showing

**Cause:** JavaScript not loading

**Solution:**
1. Check browser console (F12)
2. Verify script.js loads correctly
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Scaling to 50 Profiles

Since this is **profile 2 of 50**, here's the recommended structure:

### DNS Naming Convention

**Option 1 - Short subdomain:**
```
yukikimura.gramflow.link
zoe.gramflow.link
profile3.gramflow.link
profile4.gramflow.link
...etc
```

**Option 2 - Full handle subdomain:**
```
02.yuki.kimura.japan.gramflow.link
zoe.novak.ga.gramflow.link
```

**Option 3 - Path-based (current Zoe setup):**
```
link.gramflow.link/02_yuki.kimura.japan
link.gramflow.link/zoe.novak.ga
```

### Recommended Approach for 50 Profiles

**Use Path-Based Routing (like Zoe):**

**Pros:**
- Only ONE Vercel project needed
- Only ONE DNS record needed
- Easier to manage 50 profiles
- Lower cost (free Vercel tier)

**Setup:**
1. Keep existing project: `linktwin-influencer-pages`
2. Don't set Root Directory
3. Deploy ALL 50 profiles in one project
4. Access via: `link.gramflow.link/02_yuki.kimura.japan`

**DNS (already done for Zoe):**
```
Type:    CNAME
Name:    link
Value:   cname.vercel-dns.com
```

**URLs:**
```
https://link.gramflow.link/zoe.novak.ga
https://link.gramflow.link/02_yuki.kimura.japan
https://link.gramflow.link/profile3
https://link.gramflow.link/profile4
...etc (all 50)
```

---

## Next Steps

1. ✅ Code committed and pushed
2. ⏳ Deploy to Vercel (follow Part 1)
3. ⏳ Configure Spaceship DNS (follow Part 2)
4. ⏳ Test deployment (follow Part 3)

---

## Need Help?

**Vercel Documentation:**
- Custom Domains: https://vercel.com/docs/projects/domains
- DNS Configuration: https://vercel.com/docs/projects/domains/add-a-domain

**Spaceship Support:**
- DNS Help: https://www.spaceship.com/help/dns

---

**Estimated Total Time:** 15-20 minutes
**DNS Propagation:** 5-15 minutes
**SSL Certificate:** 5 minutes (automatic)
