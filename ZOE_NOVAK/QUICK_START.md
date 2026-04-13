# Quick Start Guide - Get Your Site Live in 30 Minutes

This is the fastest path from zero to deployed site. Follow these steps exactly.

---

## ⚡ 30-Minute Deployment

### ✅ Step 1: Prepare Assets (10 minutes)

1. **Create assets folder:**
   ```bash
   cd ZOE_NOVAK
   mkdir assets
   ```

2. **Add required images:**
   - Copy your portrait to `assets/profile.jpg`
   - You can use: `f:\users\ohoyos\OneDrive\Pictures\INSTAGRAM\PORTRAITS\01_zoe.novak.usa\higgsfield_s22\20250903_223652.jpg`

3. **Create quick placeholders for other images:**
   ```bash
   # Use profile.jpg for all icons (resize later)
   cp assets/profile.jpg assets/og-image.jpg
   cp assets/profile.jpg assets/favicon.png
   cp assets/profile.jpg assets/icon-192.png
   cp assets/profile.jpg assets/icon-512.png
   ```

   > **Note:** These placeholders will work. Optimize them later with proper sizes from `ASSETS_SETUP.md`

---

### ✅ Step 2: Customize Content (5 minutes)

1. **Open `index.html` in any text editor**

2. **Find and replace these values:**
   ```html
   <!-- Line ~52: Update name -->
   <h1 class="profile-name">Zoe Novak</h1>
   <!-- Change to: Your Name -->

   <!-- Line ~53: Update handle -->
   <p class="profile-handle">@zoe.novak.ga</p>
   <!-- Change to: @your.handle -->

   <!-- Line ~54: Update bio -->
   <p class="profile-bio">✨ Model & Content Creator<br>💫 Living life on my terms</p>
   <!-- Change to: Your bio text -->
   ```

3. **Update social media links:**
   ```html
   <!-- Line ~60: Instagram -->
   <a href="https://instagram.com/zoe.novak.ga">
   <!-- Change to: https://instagram.com/YOUR_USERNAME -->

   <!-- Line ~66: TikTok -->
   <a href="https://tiktok.com/@zoe.novak.ga">
   <!-- Change to: https://tiktok.com/@YOUR_USERNAME -->
   ```

4. **Update private link (if using age gate):**

   Open `script.js`, find line ~10:
   ```javascript
   window.location.href = 'https://go.gramflow.link/zoenovakga';
   // Change to: Your destination URL
   ```

5. **Save both files**

---

### ✅ Step 3: Deploy to Netlify (10 minutes)

1. **Go to [netlify.com](https://netlify.com)**
   - Sign up or log in (use GitHub/Google for faster signup)

2. **Deploy your site:**
   - Click **"Add new site"** button
   - Select **"Deploy manually"**
   - **Drag and drop** the entire `ZOE_NOVAK` folder
   - Wait 30 seconds for upload

3. **Your site is live!**
   - Netlify gives you a URL like: `random-name-12345.netlify.app`
   - Click it to see your live site!

---

### ✅ Step 4: Set Up Custom Domain (5 minutes)

1. **In Netlify dashboard:**
   - Go to **Site settings → Domain management**
   - Click **"Add custom domain"**
   - Enter: `gramflow.link`

2. **Choose DNS setup method:**

   **Option A: Netlify DNS (Easiest)**
   - Click **"Set up Netlify DNS"**
   - Copy the 4 nameservers Netlify provides

   **Option B: Your own DNS**
   - Add CNAME record in Spaceship.com
   - See `SPACESHIP_DOMAIN_SETUP.md` for details

3. **Configure in Spaceship.com:**
   - Log in to spaceship.com
   - Go to **Domains → gramflow.link → DNS & Nameservers**
   - Paste Netlify's nameservers
   - Save

4. **Wait for DNS propagation:**
   - Usually 1-6 hours (up to 48 hours)
   - SSL certificate provisions automatically

---

## 🎉 You're Done!

Your site will be live at:
```
http://gramflow.link/zoe.novak.ga
```

---

## 🔥 What's Next?

### Optimize Your Site (Optional)

1. **Better Images:**
   - Follow `ASSETS_SETUP.md` to create properly sized images
   - Optimize for faster loading

2. **Analytics:**
   - Add Google Analytics ID in `index.html`
   - Add Facebook Pixel ID

3. **Customize Design:**
   - Edit colors in `styles.css`
   - Change gradients and themes

4. **Add More Links:**
   - Copy link blocks in `index.html`
   - Add YouTube, Twitter, etc.

---

## 🧪 Quick Testing

After deployment, test these:

### ✅ Basic Functionality
```
1. Visit your site URL
2. Click each link → should open correctly
3. Test on mobile device
4. Share link on Instagram → check preview
```

### ✅ Age Verification (if enabled)
```
1. Click "Private Conversations Here"
2. Modal should appear
3. Click "Yes" → redirects to your URL
4. Click "No" → modal closes
```

### ✅ Deep Linking
```
1. Share link in Instagram Story
2. Click link from Instagram app
3. Should prompt to open in browser (Android)
4. Should show modal with instructions (iOS)
```

---

## 🚨 Common Issues & Quick Fixes

### Issue: Images not showing
```bash
# Make sure images are in /assets/ folder
# Check file names match exactly (case-sensitive)
ls assets/
```

### Issue: Links not working
```html
<!-- Make sure URLs start with https:// -->
<a href="https://instagram.com/username">
<!-- Not just: instagram.com/username -->
```

### Issue: Domain not working yet
```
# Wait 24-48 hours for DNS propagation
# Check status: https://dnschecker.org
# Meanwhile, use Netlify URL: random-name.netlify.app
```

### Issue: Age modal not appearing
```javascript
// Check script.js is loaded
// Open browser console (F12) for errors
// Verify showAgeVerification() function exists
```

---

## 📱 Mobile Testing URLs

Share these to test on mobile:

**Instagram Story:**
```
1. Go to Instagram
2. Create new Story
3. Add link sticker
4. Paste: http://gramflow.link/zoe.novak.ga
5. Post story
6. Click link → test deeplink
```

**Instagram Bio:**
```
1. Go to Instagram Profile → Edit Profile
2. Paste: http://gramflow.link/zoe.novak.ga
3. Save
4. Click link from profile
```

**WhatsApp:**
```
Send to yourself: http://gramflow.link/zoe.novak.ga
Click → check if opens correctly
```

---

## 🎨 Quick Customizations

### Change Colors

Edit `styles.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
  /* Purple theme → Red/Teal theme */
}
```

### Add Custom Link

Copy-paste this in `index.html`:
```html
<a href="YOUR_URL" target="_blank" class="link-button">
  <span class="link-icon">🌟</span>
  <span class="link-text">Your Link Title</span>
  <span class="link-arrow">→</span>
</a>
```

### Change Profile Picture

Just replace `assets/profile.jpg` with your new photo (same name).

---

## 📊 Track Your Success

### View Analytics

**Netlify Analytics (Basic):**
```
Site settings → Analytics
See: Page views, bandwidth, top pages
```

**Google Analytics (Advanced):**
```
1. Get GA4 ID from analytics.google.com
2. Add to index.html (line ~150)
3. Track: visitors, demographics, behavior
```

### Monitor Uptime

**Free Tools:**
- UptimeRobot: [uptimerobot.com](https://uptimerobot.com)
- Pingdom: [pingdom.com](https://pingdom.com)

Set up alerts for downtime.

---

## 💸 Costs

**Your setup is basically FREE:**

| Service | Cost |
|---------|------|
| Netlify Hosting | $0/month (100GB bandwidth) |
| SSL Certificate | $0 (automatic) |
| Domain (gramflow.link) | ~$12/year |
| Unlimited subdomains | $0 |

**Total:** $1/month 🎉

---

## 🔄 Update Process

**To make changes:**

1. Edit your local files
2. Go to Netlify dashboard
3. Drag-and-drop updated files
4. Automatically deploys (30 seconds)

**Or use Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 🚀 Scaling to 100+ Sites

Once you're comfortable with this setup:

1. Read `SCALING_GUIDE.md` for automation
2. Create template system for bulk deployment
3. Use config files for each influencer
4. Deploy multiple sites simultaneously

**With automation:**
- Single influencer: 5 minutes
- 10 influencers: 30 minutes
- 100 influencers: 2 hours

---

## 📞 Get Help

**Documentation:**
- Full README: `README.md`
- Asset guide: `ASSETS_SETUP.md`
- Domain setup: `SPACESHIP_DOMAIN_SETUP.md`
- Deployment checklist: `DEPLOYMENT_CHECKLIST.md`
- Scaling guide: `SCALING_GUIDE.md`

**Support:**
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
- Spaceship Support: [support.spaceship.com](https://support.spaceship.com)

**Troubleshooting:**
- Check browser console (F12)
- Clear cache (Ctrl+Shift+R)
- Test in incognito mode
- Verify DNS with dnschecker.org

---

## ✅ Success Checklist

- [ ] Assets folder created with images
- [ ] Content customized (name, handle, bio, links)
- [ ] Deployed to Netlify successfully
- [ ] Custom domain configured
- [ ] Site accessible at gramflow.link
- [ ] Tested all links work
- [ ] Tested on mobile device
- [ ] Age verification working (if enabled)
- [ ] Deep linking tested on Instagram
- [ ] Shared on social media

---

## 🎯 Next Steps

**Immediate:**
1. ✅ Get first site live
2. ✅ Test thoroughly
3. ✅ Share with client

**This Week:**
1. Optimize images (proper sizes)
2. Set up analytics
3. Monitor performance

**This Month:**
1. Deploy 5-10 more sites
2. Set up automation
3. Create content calendar

---

**You're ready to launch! 🚀**

**Time to first live site: 30 minutes**
**Time to 100 live sites: With automation, just a few hours!**

Go build something amazing! 💪
