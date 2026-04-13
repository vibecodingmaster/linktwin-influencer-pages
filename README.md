# LinkTwin Influencer Pages

Multi-influencer link-in-bio platform hosted on Netlify.

## Domain Structure

**Primary Domain:** `link.gramflow.link`

Each influencer gets a unique path:
- `https://link.gramflow.link/zoe.novak.ga` → Zoe Novak (1/50)
- `https://link.gramflow.link/influencer2.name` → Coming soon
- ... (48 more to come)

## Repository Structure

```
root/
├── zoe.novak.ga/          # Influencer 1 - Zoe Novak
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── profile.jpg.jpg
├── influencer2.name/      # Influencer 2 (to be added)
├── influencer3.name/      # Influencer 3 (to be added)
├── netlify.toml           # Netlify configuration & routing
├── _redirects             # Backup redirects file
└── index.html             # Root redirect page
```

## Deployment

1. **Platform:** Netlify
2. **Repository:** GitHub - `linktwin-influencer-pages`
3. **Build Command:** None (static files)
4. **Publish Directory:** `.` (root)

## DNS Configuration

Point your domain `link.gramflow.link` to Netlify:

### Option 1: CNAME (Subdomain)
```
Type: CNAME
Name: link
Value: [your-site].netlify.app
```

### Option 2: A Records (Apex Domain)
```
Type: A
Name: link
Value: 75.2.60.5

(Add 3 more A records with Netlify's IPs)
```

### Option 3: Netlify DNS (Recommended)
Use Netlify's nameservers for full control.

## Adding New Influencers

1. Create new folder: `influencer.name/`
2. Copy template files from `zoe.novak.ga/`
3. Update content and images
4. Add redirect rules to `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/influencer.name"
     to = "/influencer.name/index.html"
     status = 200
   ```
5. Commit and push to GitHub
6. Netlify auto-deploys

## Progress

- [x] 1/50 - Zoe Novak (zoe.novak.ga)
- [ ] 2/50 - TBD
- [ ] 3/50 - TBD
- ... 47 more to go

## Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript
- Netlify (Hosting + CDN)
- GitHub (Version Control)
- Age verification system
- PWA ready
- Analytics ready (GA4, Facebook Pixel)

---

**Powered by GramFlow**
