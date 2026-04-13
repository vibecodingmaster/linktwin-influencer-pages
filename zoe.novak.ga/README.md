# GramFlow Link-in-Bio Site

A professional, self-hosted link-in-bio website with age verification, deep linking technology, and social media optimization.

## Features

✅ **Deep Link Technology** - Forces Instagram/Facebook in-app browsers to open in the system browser
✅ **Age Verification Modal** - 18+ confirmation for restricted content
✅ **Social Media Optimized** - Open Graph and Twitter Card tags
✅ **Progressive Web App (PWA)** - Installable on mobile devices
✅ **Analytics Ready** - Google Analytics & Facebook Pixel integration
✅ **Fast & Lightweight** - Optimized for performance
✅ **Responsive Design** - Perfect on all devices
✅ **SEO Optimized** - robots.txt, sitemap.xml included

---

## 📁 File Structure

```
ZOE_NOVAK/
├── index.html          # Main page
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── sw.js              # Service Worker (PWA)
├── privacy.html       # Privacy Policy
├── terms.html         # Terms of Service
├── manifest.json      # PWA manifest
├── robots.txt         # SEO robots file
├── sitemap.xml        # SEO sitemap
├── netlify.toml       # Netlify configuration
├── _redirects         # Netlify redirects
└── assets/            # Images and media
    ├── profile.jpg         # Profile picture
    ├── og-image.jpg        # Social media preview (1200x630px)
    ├── favicon.png         # Browser favicon (32x32px)
    ├── icon-192.png        # PWA icon (192x192px)
    └── icon-512.png        # PWA icon (512x512px)
```

---

## 🖼️ Required Assets

Create an `/assets` folder and add these images:

### 1. Profile Picture (`profile.jpg`)
- **Size:** 500x500px minimum
- **Format:** JPG or PNG
- **Use:** Main profile image

### 2. Open Graph Image (`og-image.jpg`)
- **Size:** 1200x630px
- **Format:** JPG
- **Use:** Social media preview when link is shared

### 3. Favicon (`favicon.png`)
- **Size:** 32x32px or 64x64px
- **Format:** PNG
- **Use:** Browser tab icon

### 4. PWA Icons
- **icon-192.png** (192x192px)
- **icon-512.png** (512x512px)
- **Format:** PNG
- **Use:** Progressive Web App icons

**Quick Asset Creation:**
```bash
# Create assets folder
mkdir assets

# Add your images to the assets folder
# You can use the provided portrait image as profile.jpg
```

---

## 🚀 Deployment Guide

### Method 1: Netlify (Recommended - Free)

#### Step 1: Prepare Your Files
1. Ensure all files are in the `ZOE_NOVAK` folder
2. Add required images to the `assets/` folder
3. Update links in `index.html` with actual social media URLs

#### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop the entire `ZOE_NOVAK` folder
4. Wait for deployment (~ 30 seconds)
5. Netlify will give you a URL like `random-name-12345.netlify.app`

#### Step 3: Configure Custom Domain

**Option A: Use Netlify DNS (Easier)**
1. In Netlify, go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter: `gramflow.link`
4. Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)
5. Go to Spaceship.com → Your domain → Change nameservers
6. Replace with Netlify's nameservers
7. Wait 24-48 hours for DNS propagation

**Option B: Use Spaceship DNS (More Control)**
1. In Netlify: **Domain settings → Set up Netlify DNS**
2. Get the deployment URL (e.g., `your-site.netlify.app`)
3. Log in to [Spaceship.com](https://spaceship.com)
4. Navigate to **Domains → gramflow.link → Manage DNS**
5. Add these records:

| Type  | Host | Value | TTL |
|-------|------|-------|-----|
| A     | @    | 75.2.60.5 | 3600 |
| CNAME | www  | your-site.netlify.app | 3600 |
| CNAME | zoe.novak.ga | your-site.netlify.app | 3600 |

> **Note:** Replace `75.2.60.5` with Netlify's current IP (found in Netlify docs)

6. Enable SSL in Netlify (automatic, may take 24 hours)

---

## 🌐 Spaceship.com Domain Setup (Detailed)

### Option 1: Point to Netlify (Recommended)

1. **Log in to Spaceship.com**
   - Go to spaceship.com and sign in
   - Navigate to **My Account → Domains**

2. **Select Your Domain**
   - Click on `gramflow.link`
   - Go to **DNS & Nameservers**

3. **Configure DNS Records**
   - Click **"Manage DNS Records"**
   - Add the following records:

**Primary Domain:**
```
Type: A
Host: @
Value: 75.2.60.5
TTL: Automatic (or 3600)
```

**WWW Subdomain:**
```
Type: CNAME
Host: www
Value: your-netlify-site.netlify.app
TTL: Automatic (or 3600)
```

**Profile Subdomain:**
```
Type: CNAME
Host: zoe.novak.ga
Value: your-netlify-site.netlify.app
TTL: Automatic (or 3600)
```

4. **SSL Certificate**
   - Netlify automatically provisions SSL
   - It may take 24-48 hours for full activation

5. **Test Your Site**
   - Visit `http://gramflow.link/zoe.novak.ga`
   - Visit `https://gramflow.link/zoe.novak.ga` (with SSL)

---

## 🔧 Customization Guide

### Update Profile Information
Edit `index.html`:

```html
<!-- Profile Section -->
<img src="assets/profile.jpg" alt="Your Name">
<h1 class="profile-name">Your Name</h1>
<p class="profile-handle">@your.handle</p>
<p class="profile-bio">Your bio here</p>
```

### Update Links
Edit `index.html`:

```html
<!-- Change Instagram URL -->
<a href="https://instagram.com/your_username">

<!-- Change Private Conversations URL -->
<!-- Update in script.js, line ~10 -->
window.location.href = 'https://your-destination-url.com';
```

### Change Colors
Edit `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### Add More Links
Copy this block in `index.html`:

```html
<a href="YOUR_URL" target="_blank" class="link-button">
    <span class="link-icon">🔗</span>
    <span class="link-text">Link Title</span>
    <span class="link-arrow">→</span>
</a>
```

---

## 📊 Analytics Setup

### Google Analytics 4
1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (e.g., `G-XXXXXXXXXX`)
3. Add to `index.html` before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Facebook Pixel
1. Create a pixel at [facebook.com/business](https://business.facebook.com)
2. Get your Pixel ID
3. Update in `index.html` (line ~170):

```javascript
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
```

---

## 🧪 Testing

### Test Deep Links
1. Share the link on Instagram Story/Bio
2. Click the link on mobile
3. Should prompt to open in external browser (Android) or show modal (iOS)

### Test Age Verification
1. Click "Private Conversations Here"
2. Verify modal appears
3. Test both "Yes" and "No" buttons
4. "Yes" should redirect to: `https://go.gramflow.link/zoenovakga`

### Test Social Sharing
1. Share link on Facebook/Twitter
2. Verify preview shows correct image and title
3. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

---

## 🔐 Security Features

- ✅ HTTPS enforcement via Netlify
- ✅ Content Security headers
- ✅ XSS protection
- ✅ Referrer policy
- ✅ Frame protection (X-Frame-Options)

---

## 📱 Mobile Optimization

The site is fully responsive and includes:
- Touch-optimized buttons (48px minimum)
- Fast load times (< 1 second)
- PWA installable on home screen
- Works offline (via Service Worker)

---

## 🐛 Troubleshooting

### Deep Links Not Working
- **Android:** Check if user's device supports intent:// URLs
- **iOS:** Modal should appear with instructions
- Test in Instagram app specifically

### Age Modal Not Appearing
- Check JavaScript console for errors
- Ensure `script.js` is loaded
- Verify modal HTML is present in `index.html`

### Custom Domain Not Working
- Wait 24-48 hours for DNS propagation
- Use [DNS Checker](https://dnschecker.org) to verify
- Clear browser cache
- Check Netlify DNS settings

### Images Not Loading
- Verify images are in `/assets` folder
- Check file names match exactly (case-sensitive)
- Ensure images are optimized (< 500KB each)

---

## 📈 Performance Tips

1. **Optimize Images**
   - Use WebP format for better compression
   - Max size: 500KB per image
   - Tools: TinyPNG, Squoosh

2. **Enable Caching**
   - Already configured in `netlify.toml`
   - Browser caching: 1 year for assets

3. **Monitor Performance**
   - Use Google PageSpeed Insights
   - Target: 90+ score on mobile

---

## 🎨 Design Customization Ideas

- Change gradient colors in CSS
- Add custom animations
- Include video background
- Add music player
- Integrate newsletter signup
- Add testimonials section

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review Netlify documentation
- Test in multiple browsers
- Clear cache and cookies

---

## 📄 License

This template is free to use for personal and commercial projects.

---

## 🔄 Updates

**Version 1.0.0** (April 2026)
- Initial release
- Deep link support
- Age verification
- PWA functionality
- Social media optimization

---

**Built with ❤️ for GramFlow**
