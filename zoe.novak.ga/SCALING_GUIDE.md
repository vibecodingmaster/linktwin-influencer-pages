# Scaling Guide: Building 100+ Sites for Influencers

This guide shows you how to efficiently create and manage hundreds of link-in-bio sites using the GramFlow template.

---

## 🎯 Overview

**Current Setup:** Single site for one influencer
**Goal:** Deploy 100+ sites efficiently
**Solution:** Template-based automation system

---

## 🏗️ Architecture for Scale

### Option 1: Individual Netlify Sites (Simple)
- **Pros:** Easy to manage, separate analytics per site, independent deployments
- **Cons:** Need to manage 100+ Netlify projects
- **Best For:** 10-50 sites

### Option 2: Single Multi-Tenant App (Advanced)
- **Pros:** One codebase, centralized management, database-driven
- **Cons:** Requires backend, more complex setup
- **Best For:** 50+ sites with frequent updates

### Option 3: Hybrid Approach (Recommended)
- **Pros:** Template automation + individual deployments
- **Cons:** Initial setup time
- **Best For:** 100+ sites with occasional updates

---

## 📋 Recommended Approach: Automated Template System

### Step 1: Create Template Structure

```
GRAMFLOW_TEMPLATE/
├── template/                    # Base template files
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── sw.js
│   ├── netlify.toml
│   ├── _redirects
│   └── ... (all template files)
├── config/                      # Influencer configurations
│   ├── zoe.novak.json
│   ├── jane.doe.json
│   └── john.smith.json
├── generator.js                 # Site generator script
├── deploy.js                   # Bulk deployment script
└── README.md
```

---

## 🔧 Step 2: Create Configuration System

### Individual Influencer Config File

**Example: `config/zoe.novak.json`**
```json
{
  "influencer": {
    "name": "Zoe Novak",
    "handle": "@zoe.novak.ga",
    "bio": "✨ Model & Content Creator<br>💫 Living life on my terms",
    "subdomain": "zoe.novak.ga",
    "profileImage": "zoe_novak_profile.jpg",
    "ageRestricted": true
  },
  "links": [
    {
      "type": "instagram",
      "url": "https://instagram.com/zoe.novak.ga",
      "title": "Follow on Instagram",
      "icon": "📷"
    },
    {
      "type": "tiktok",
      "url": "https://tiktok.com/@zoe.novak.ga",
      "title": "Watch on TikTok",
      "icon": "🎵"
    },
    {
      "type": "private",
      "url": "https://go.gramflow.link/zoenovakga",
      "title": "Private Conversations Here",
      "icon": "💌",
      "ageGate": true
    }
  ],
  "branding": {
    "primaryGradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "secondaryGradient": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  "analytics": {
    "googleAnalytics": "G-XXXXXXXXXX",
    "facebookPixel": "123456789"
  },
  "domain": {
    "primary": "gramflow.link",
    "subdomain": "zoe.novak.ga"
  }
}
```

---

## 💻 Step 3: Site Generator Script

**Create: `generator.js`**

```javascript
const fs = require('fs');
const path = require('path');

class SiteGenerator {
  constructor(configPath) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    this.outputDir = path.join(__dirname, 'generated', this.config.influencer.subdomain);
  }

  generate() {
    console.log(`Generating site for ${this.config.influencer.name}...`);

    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Generate files
    this.generateHTML();
    this.generateCSS();
    this.generateJS();
    this.copyStaticFiles();

    console.log(`✅ Site generated: ${this.outputDir}`);
  }

  generateHTML() {
    let html = fs.readFileSync('template/index.html', 'utf8');

    // Replace profile information
    html = html.replace(/\{\{name\}\}/g, this.config.influencer.name);
    html = html.replace(/\{\{handle\}\}/g, this.config.influencer.handle);
    html = html.replace(/\{\{bio\}\}/g, this.config.influencer.bio);

    // Replace domain
    html = html.replace(/\{\{domain\}\}/g, `${this.config.domain.primary}/${this.config.domain.subdomain}`);

    // Generate links HTML
    const linksHTML = this.config.links.map(link => this.generateLinkHTML(link)).join('\n');
    html = html.replace(/\{\{links\}\}/g, linksHTML);

    // Replace analytics IDs
    html = html.replace(/\{\{ga_id\}\}/g, this.config.analytics.googleAnalytics || '');
    html = html.replace(/\{\{fb_pixel\}\}/g, this.config.analytics.facebookPixel || '');

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
  }

  generateLinkHTML(link) {
    if (link.ageGate) {
      return `
        <a href="#" onclick="showAgeVerification('${link.url}'); return false;" class="link-button private-link">
          <span class="link-icon">${link.icon}</span>
          <span class="link-text">${link.title}</span>
          <span class="link-badge">18+</span>
          <span class="link-arrow">→</span>
        </a>`;
    }

    return `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-button social-link ${link.type}">
        <span class="link-icon">${link.icon}</span>
        <span class="link-text">${link.title}</span>
        <span class="link-arrow">→</span>
      </a>`;
  }

  generateCSS() {
    let css = fs.readFileSync('template/styles.css', 'utf8');

    // Replace color gradients
    css = css.replace(/--primary-gradient: [^;]+;/,
      `--primary-gradient: ${this.config.branding.primaryGradient};`);
    css = css.replace(/--secondary-gradient: [^;]+;/,
      `--secondary-gradient: ${this.config.branding.secondaryGradient};`);

    fs.writeFileSync(path.join(this.outputDir, 'styles.css'), css);
  }

  generateJS() {
    // Copy script.js (or customize as needed)
    fs.copyFileSync('template/script.js', path.join(this.outputDir, 'script.js'));
  }

  copyStaticFiles() {
    const staticFiles = ['sw.js', 'netlify.toml', '_redirects', 'robots.txt', 'sitemap.xml', 'manifest.json', 'privacy.html', 'terms.html'];

    staticFiles.forEach(file => {
      fs.copyFileSync(
        path.join('template', file),
        path.join(this.outputDir, file)
      );
    });
  }
}

// Usage
if (require.main === module) {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('Usage: node generator.js <config-file.json>');
    process.exit(1);
  }

  const generator = new SiteGenerator(configPath);
  generator.generate();
}

module.exports = SiteGenerator;
```

---

## 🚀 Step 4: Bulk Deployment Script

**Create: `deploy.js`**

```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const SiteGenerator = require('./generator');

class BulkDeployer {
  constructor() {
    this.netlifyToken = process.env.NETLIFY_TOKEN;
    this.configDir = path.join(__dirname, 'config');
  }

  async deployAll() {
    const configs = fs.readdirSync(this.configDir)
      .filter(file => file.endsWith('.json'));

    console.log(`Found ${configs.length} influencer configs`);

    for (const configFile of configs) {
      await this.deployOne(path.join(this.configDir, configFile));
    }

    console.log('✅ All sites deployed!');
  }

  async deployOne(configPath) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(`\n🚀 Deploying ${config.influencer.name}...`);

    // Generate site
    const generator = new SiteGenerator(configPath);
    generator.generate();

    // Deploy to Netlify
    const siteDir = path.join(__dirname, 'generated', config.influencer.subdomain);
    const siteName = config.influencer.subdomain.replace(/\./g, '-');

    try {
      execSync(`netlify deploy --prod --dir=${siteDir} --site=${siteName}`, {
        env: { ...process.env, NETLIFY_AUTH_TOKEN: this.netlifyToken },
        stdio: 'inherit'
      });

      console.log(`✅ Deployed: ${config.influencer.name}`);
    } catch (error) {
      console.error(`❌ Failed to deploy ${config.influencer.name}:`, error.message);
    }
  }
}

// Usage
if (require.main === module) {
  const deployer = new BulkDeployer();
  deployer.deployAll();
}

module.exports = BulkDeployer;
```

---

## 📊 Step 5: Centralized Management Dashboard

For managing 100+ sites, create a simple dashboard:

**Create: `dashboard.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GramFlow Dashboard</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #0a0a0a; color: #fff; }
    .container { max-width: 1200px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
    th { background: #1a1a1a; }
    .status-live { color: #48c774; }
    .status-pending { color: #ffdd57; }
    .btn { padding: 8px 16px; background: #667eea; border: none; color: white; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <h1>GramFlow Dashboard</h1>
    <p>Managing 100+ influencer sites</p>

    <table id="sitesTable">
      <thead>
        <tr>
          <th>Influencer</th>
          <th>Subdomain</th>
          <th>Status</th>
          <th>Last Deploy</th>
          <th>Analytics</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Populated by JavaScript -->
      </tbody>
    </table>
  </div>

  <script>
    // Load site configs and display
    async function loadSites() {
      const configs = [
        // This would come from your config files
        { name: 'Zoe Novak', subdomain: 'zoe.novak.ga', status: 'live', lastDeploy: '2026-04-13' },
        // ... 100+ more
      ];

      const tbody = document.querySelector('#sitesTable tbody');
      configs.forEach(site => {
        const row = `
          <tr>
            <td>${site.name}</td>
            <td><a href="http://gramflow.link/${site.subdomain}" target="_blank">${site.subdomain}</a></td>
            <td class="status-${site.status}">${site.status}</td>
            <td>${site.lastDeploy}</td>
            <td><button class="btn" onclick="viewAnalytics('${site.subdomain}')">View</button></td>
            <td>
              <button class="btn" onclick="redeploy('${site.subdomain}')">Redeploy</button>
              <button class="btn" onclick="edit('${site.subdomain}')">Edit</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }

    loadSites();
  </script>
</body>
</html>
```

---

## 🔄 Workflow for 100+ Sites

### Initial Setup (One Time)
```bash
# 1. Set up template structure
mkdir GRAMFLOW_TEMPLATE
cd GRAMFLOW_TEMPLATE

# 2. Copy base template
cp -r ../ZOE_NOVAK template/

# 3. Convert to template with placeholders
# Replace hardcoded values with {{placeholders}}

# 4. Install dependencies
npm init -y
npm install netlify-cli

# 5. Set Netlify token
export NETLIFY_TOKEN="your_token_here"
```

### Adding New Influencer (Per Site)
```bash
# 1. Create config file
cat > config/jane.doe.json << EOF
{
  "influencer": {
    "name": "Jane Doe",
    "handle": "@jane.doe",
    ...
  },
  ...
}
EOF

# 2. Generate site
node generator.js config/jane.doe.json

# 3. Deploy
cd generated/jane.doe
netlify deploy --prod

# 4. Configure domain in Netlify
netlify domains:add jane.doe.gramflow.link
```

### Bulk Operations
```bash
# Generate all sites
node generator.js --all

# Deploy all sites
node deploy.js

# Update all sites (e.g., fix a bug)
# 1. Update template/
# 2. Run: node generator.js --all
# 3. Run: node deploy.js
```

---

## 💰 Cost Estimation for 100 Sites

### Netlify Hosting
- **Free Tier:** 100 sites × $0 = $0/month (with limits)
- **Pro Tier:** $19/month per site = $1,900/month
- **Recommendation:** Use free tier initially, upgrade high-traffic sites

### Domain Costs
- **Root domain:** gramflow.link = $12/year
- **Subdomains:** Free (unlimited)
- **Total:** $12/year for all 100 sites

### Alternatives
- **Cloudflare Pages:** Free for unlimited sites
- **Vercel:** Similar to Netlify, free tier available
- **GitHub Pages:** Free, but limited features

---

## 🎨 Customization at Scale

### Global Updates (All Sites)
1. Update `template/` files
2. Run `node generator.js --all`
3. Run `node deploy.js`

### Individual Customization
- Edit specific `config/*.json` file
- Run `node generator.js config/specific-influencer.json`
- Deploy that site only

### Brand-Specific Themes
```json
{
  "theme": "purple",  // Pre-defined theme
  "customCSS": "path/to/custom.css"  // Or custom CSS
}
```

---

## 📈 Analytics & Monitoring

### Centralized Analytics
```javascript
// Use single Google Analytics property with custom dimensions
gtag('config', 'GA_MEASUREMENT_ID', {
  'custom_map': {'dimension1': 'influencer_name'}
});

gtag('event', 'page_view', {
  'influencer_name': 'Zoe Novak'
});
```

### Monitoring Dashboard
- Create central dashboard pulling data from all GA properties
- Use Google Analytics API
- Display metrics: visitors, clicks, conversions per influencer

---

## 🔒 Security at Scale

### API Keys Management
```bash
# Use environment variables
export GA_ID_PREFIX="G-"
export FB_PIXEL_PREFIX="123456"

# Generate unique IDs per influencer
# Store in database or config files
```

### Content Security
- Implement CSP headers
- Age verification logging
- Rate limiting on API endpoints

---

## 🛠️ Recommended Tech Stack for 100+ Sites

### Option 1: Static Generation (Current)
- **Generator:** Node.js script
- **Hosting:** Netlify / Cloudflare Pages
- **Management:** JSON configs + scripts
- **Best For:** Simple sites, low maintenance

### Option 2: Dynamic Multi-Tenant
- **Frontend:** Next.js / React
- **Backend:** Supabase / Firebase
- **Database:** PostgreSQL
- **Best For:** Complex features, frequent updates

### Option 3: Hybrid (Recommended)
- **Generation:** Node.js + templates
- **Hosting:** Netlify (static)
- **CMS:** Headless CMS (Contentful, Sanity)
- **Analytics:** Centralized dashboard
- **Best For:** Scale + simplicity

---

## 📋 Checklist for Scaling

- [ ] Set up template structure with placeholders
- [ ] Create generator script (generator.js)
- [ ] Create deployment script (deploy.js)
- [ ] Set up Netlify CLI with auth token
- [ ] Create config files for each influencer
- [ ] Test generation for 3-5 influencers
- [ ] Deploy test sites
- [ ] Configure DNS for subdomains
- [ ] Set up centralized analytics
- [ ] Create management dashboard
- [ ] Document onboarding process for new influencers
- [ ] Set up monitoring and alerts
- [ ] Create backup system for configs

---

## 🚀 Quick Start: First 10 Sites

```bash
# 1. Clone template
git clone <your-repo> gramflow-scale
cd gramflow-scale

# 2. Create configs for 10 influencers
for i in {1..10}; do
  cp config/template.json config/influencer${i}.json
  # Edit each config manually or with script
done

# 3. Generate all
node generator.js --all

# 4. Deploy all
node deploy.js

# 5. Verify
curl http://gramflow.link/influencer1
curl http://gramflow.link/influencer2
# ... etc
```

---

## 📞 Support & Maintenance

### Daily Tasks
- Monitor uptime (use UptimeRobot)
- Check analytics for anomalies
- Respond to deployment failures

### Weekly Tasks
- Review traffic reports
- Update content as needed
- Backup configs

### Monthly Tasks
- Security updates
- Performance optimization
- Cost analysis

---

## 🎯 Success Metrics

Track these for each site:
- Page views
- Link clicks
- Age verification conversions
- Deeplink success rate
- Load time
- Uptime percentage

**Goal:** 99.9% uptime, < 2s load time, 100% deeplink success

---

Ready to scale to 100+ sites! 🚀
