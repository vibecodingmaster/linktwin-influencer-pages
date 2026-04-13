# Spaceship.com Domain Setup Guide

Complete step-by-step instructions for setting up `gramflow.link` domain on Spaceship.com for your GramFlow link-in-bio sites.

---

## 🎯 Overview

You'll configure **gramflow.link** to work with:
- Main site: `gramflow.link` (landing page)
- Profile subdomains: `zoe.novak.ga.gramflow.link`, `jane.doe.gramflow.link`, etc.
- Redirect subdomain: `go.gramflow.link` (for age-restricted content)

---

## 📋 Prerequisites

- [ ] Domain registered at Spaceship.com (`gramflow.link`)
- [ ] Netlify account created
- [ ] Site deployed to Netlify (has URL like `random-name.netlify.app`)

---

## 🌐 Option 1: Use Netlify DNS (Recommended - Easiest)

This method lets Netlify handle all DNS automatically.

### Step 1: Log in to Spaceship.com

1. Go to [spaceship.com](https://spaceship.com)
2. Sign in to your account
3. Navigate to **Dashboard → Domains**
4. Click on **gramflow.link**

### Step 2: Get Netlify Nameservers

1. Log in to [Netlify](https://app.netlify.com)
2. Go to your deployed site
3. Click **Domain settings** (or **Set up a custom domain**)
4. Click **Add custom domain**
5. Enter `gramflow.link`
6. Netlify will prompt: "Do you want to set up Netlify DNS?"
7. Click **"Yes, set up Netlify DNS"**
8. Netlify will provide 4 nameservers, example:

```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

**Copy these nameservers!**

### Step 3: Update Nameservers in Spaceship

1. In Spaceship.com, go to **gramflow.link → DNS & Nameservers**
2. Click **"Nameservers"** tab
3. Select **"Use custom nameservers"**
4. Enter Netlify's nameservers:

```
Nameserver 1: dns1.p01.nsone.net
Nameserver 2: dns2.p01.nsone.net
Nameserver 3: dns3.p01.nsone.net
Nameserver 4: dns4.p01.nsone.net
```

5. Click **"Save Changes"**

### Step 4: Configure Subdomains in Netlify

1. Back in Netlify, go to **Domain management**
2. Add subdomain for each profile:

```
zoe.novak.ga.gramflow.link → your-site.netlify.app
jane.doe.gramflow.link → your-site.netlify.app
go.gramflow.link → your-site.netlify.app
```

3. Netlify handles DNS automatically
4. SSL certificates auto-provision (24-48 hours)

### Step 5: Verify Setup

```bash
# Check DNS propagation (may take 24-48 hours)
nslookup gramflow.link
nslookup zoe.novak.ga.gramflow.link

# Or use online tool
# https://dnschecker.org
```

### Step 6: Test Your Site

Once DNS propagates:
```
http://gramflow.link/zoe.novak.ga ✅
https://gramflow.link/zoe.novak.ga ✅ (SSL)
```

---

## 🌐 Option 2: Use Spaceship DNS (More Control)

This method keeps DNS management in Spaceship.

### Step 1: Get Netlify IP Address

1. Log in to Netlify
2. Go to your site settings
3. Find **Netlify's load balancer IP**: `75.2.60.5` (or check [Netlify docs](https://docs.netlify.com/domains-https/custom-domains/))

### Step 2: Configure DNS Records in Spaceship

1. Log in to [Spaceship.com](https://spaceship.com)
2. Go to **Domains → gramflow.link**
3. Click **DNS & Nameservers → Manage DNS**
4. Add the following records:

#### A Record (Root Domain)
```
Type: A
Host: @ (or leave blank)
Value: 75.2.60.5
TTL: 3600
```

#### CNAME Record (WWW)
```
Type: CNAME
Host: www
Value: your-netlify-site.netlify.app
TTL: 3600
```

#### CNAME Records (Profile Subdomains)

**For each influencer profile, add:**

**Example: Zoe Novak**
```
Type: CNAME
Host: zoe.novak.ga
Value: your-netlify-site.netlify.app
TTL: 3600
```

**Example: Jane Doe**
```
Type: CNAME
Host: jane.doe
Value: your-netlify-site.netlify.app
TTL: 3600
```

**Redirect Subdomain**
```
Type: CNAME
Host: go
Value: your-netlify-site.netlify.app
TTL: 3600
```

#### Wildcard Subdomain (For Scalability)

**To support unlimited subdomains:**
```
Type: CNAME
Host: *
Value: your-netlify-site.netlify.app
TTL: 3600
```

⚠️ **Note:** Some DNS providers don't support wildcard CNAMEs. Test first.

### Step 3: Configure Custom Domain in Netlify

1. In Netlify, go to **Domain settings**
2. Click **Add custom domain**
3. Add each domain/subdomain manually:
   - `gramflow.link`
   - `www.gramflow.link`
   - `zoe.novak.ga.gramflow.link`
   - `go.gramflow.link`

4. Or add via Netlify CLI:

```bash
netlify domains:add gramflow.link
netlify domains:add zoe.novak.ga.gramflow.link
netlify domains:add go.gramflow.link
```

### Step 4: Enable SSL

1. Netlify auto-provisions SSL certificates
2. Go to **Domain settings → HTTPS**
3. Verify SSL certificate status: **"Certificate provisioned"**
4. Enable **"Force HTTPS"** (recommended)

### Step 5: Verify Setup

```bash
# Check DNS
dig gramflow.link
dig zoe.novak.ga.gramflow.link

# Check HTTPS
curl -I https://gramflow.link/zoe.novak.ga
```

---

## 📊 DNS Record Summary

### Complete DNS Configuration

| Record Type | Host | Value | Purpose |
|-------------|------|-------|---------|
| A | @ | 75.2.60.5 | Root domain to Netlify |
| CNAME | www | your-site.netlify.app | WWW subdomain |
| CNAME | zoe.novak.ga | your-site.netlify.app | Zoe's profile |
| CNAME | jane.doe | your-site.netlify.app | Jane's profile |
| CNAME | go | your-site.netlify.app | Redirect/Age gate |
| CNAME | * | your-site.netlify.app | Wildcard (all subdomains) |

**TTL:** 3600 seconds (1 hour) for all records

---

## 🔄 Propagation Timeline

- **Immediate:** Netlify recognizes domain
- **1-6 hours:** DNS begins propagating globally
- **24 hours:** Most users can access site
- **48 hours:** Full global propagation
- **SSL:** Auto-provisions within 24 hours after DNS propagates

**Check propagation:**
- [DNSChecker.org](https://dnschecker.org)
- [WhatsmyDNS.net](https://whatsmydns.net)

---

## 🚨 Troubleshooting

### Issue: "Domain already registered to another team"

**Cause:** Domain previously added to different Netlify account

**Solution:**
```bash
# Remove domain from old account
netlify domains:remove gramflow.link

# Add to new account
netlify domains:add gramflow.link
```

### Issue: SSL Certificate Not Provisioning

**Causes:**
- DNS not fully propagated
- CAA records blocking Let's Encrypt
- Domain verification pending

**Solutions:**
1. Wait 48 hours for full propagation
2. Check CAA records in Spaceship DNS:
   ```
   Type: CAA
   Host: @
   Value: 0 issue "letsencrypt.org"
   ```
3. Manually retry in Netlify: **HTTPS → Renew certificate**

### Issue: Subdomain Not Working

**Causes:**
- CNAME not created
- Wrong CNAME value
- DNS cache

**Solutions:**
1. Verify CNAME in Spaceship DNS
2. Confirm exact Netlify URL (e.g., `site-name.netlify.app`)
3. Clear DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac
   sudo dscacheutil -flushcache

   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Issue: Age-Restricted Link Not Redirecting

**Cause:** `go.gramflow.link` not configured

**Solution:**
1. Add CNAME: `go → your-site.netlify.app`
2. Add to Netlify domains
3. Update age verification URL in `script.js`:
   ```javascript
   window.location.href = 'https://go.gramflow.link/zoenovakga';
   ```

---

## 📱 Testing Checklist

After setup, test all these URLs:

### Root Domain
- [ ] http://gramflow.link (redirects to HTTPS)
- [ ] https://gramflow.link (works)
- [ ] https://www.gramflow.link (works)

### Profile Subdomains
- [ ] https://gramflow.link/zoe.novak.ga (works)
- [ ] https://zoe.novak.ga.gramflow.link (works)

### Age-Restricted Redirect
- [ ] https://go.gramflow.link/zoenovakga (works)

### Mobile Testing
- [ ] Open link in Instagram app → deeplink triggers
- [ ] Open link in Facebook app → deeplink triggers
- [ ] Safari (iOS) → loads correctly
- [ ] Chrome (Android) → loads correctly

### Social Media Previews
- [ ] Share on Facebook → correct preview
- [ ] Share on Twitter → correct preview
- [ ] Share on LinkedIn → correct preview

---

## 🔧 Advanced Configuration

### Email Forwarding (Optional)

Set up email forwarding for `contact@gramflow.link`:

1. In Spaceship.com, go to **Email Forwarding**
2. Add forwarding rule:
   ```
   contact@gramflow.link → your-email@gmail.com
   ```

### Redirect Rules (Optional)

Add redirects in Spaceship if needed:

```
Type: URL Redirect
Source: old-subdomain.gramflow.link
Destination: new-subdomain.gramflow.link
Type: 301 (Permanent)
```

### DNSSEC (Optional - Advanced Security)

Enable DNSSEC in Spaceship:

1. Go to **DNS & Nameservers → DNSSEC**
2. Click **"Enable DNSSEC"**
3. Copy DS records
4. If using Netlify DNS, provide DS records to Netlify

---

## 💰 Cost Breakdown

### Spaceship.com
- **Domain Registration:** $12-15/year (gramflow.link)
- **DNS Management:** Free
- **Email Forwarding:** Free (limited)

### Netlify
- **Hosting:** Free (100GB bandwidth)
- **SSL Certificates:** Free (Let's Encrypt)
- **Custom Domains:** Free (unlimited)
- **DNS:** Free

**Total Annual Cost:** ~$12/year for 100+ sites!

---

## 📅 Maintenance Schedule

### Monthly
- Check domain renewal date
- Verify SSL certificates
- Review DNS records

### Quarterly
- Update DNS if Netlify IP changes
- Check for security advisories
- Test all subdomains

### Annually
- Renew domain registration
- Review and optimize DNS TTL
- Update contact information

---

## 🎯 Quick Setup Summary

**Fastest Path (30 minutes):**

1. **Spaceship.com:**
   - Change nameservers to Netlify's

2. **Netlify:**
   - Add custom domain: `gramflow.link`
   - Enable Netlify DNS
   - Add subdomains as needed

3. **Wait:**
   - 24-48 hours for DNS + SSL

4. **Test:**
   - Visit your site!

---

## 📞 Support Resources

- **Spaceship Support:** [support.spaceship.com](https://support.spaceship.com)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **DNS Tools:** [dnschecker.org](https://dnschecker.org)
- **SSL Test:** [ssllabs.com](https://www.ssllabs.com/ssltest/)

---

**Ready to launch!** Your influencers' sites will be live at `gramflow.link/[their-handle]` 🚀
