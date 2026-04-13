# Assets Setup Guide

This guide will help you prepare all the required images for your GramFlow link-in-bio site.

## 📋 Required Files Checklist

```
assets/
├── profile.jpg      ✅ Profile picture (500x500px minimum)
├── og-image.jpg     ✅ Social media preview (1200x630px)
├── favicon.png      ✅ Browser icon (32x32px or 64x64px)
├── icon-192.png     ✅ PWA icon small (192x192px)
└── icon-512.png     ✅ PWA icon large (512x512px)
```

---

## 🖼️ Image Specifications

### 1. Profile Picture (`profile.jpg`)

**Specifications:**
- **Dimensions:** 500x500px minimum (square)
- **Recommended:** 800x800px or 1000x1000px
- **Format:** JPG or PNG
- **File Size:** Under 300KB
- **Usage:** Main circular profile image on the page

**Tips:**
- Use a clear, well-lit photo
- Center your face in the frame
- Avoid busy backgrounds
- Professional headshot works best
- Image will be cropped to circle

**Example Source:**
```
You can use: f:\users\ohoyos\OneDrive\Pictures\INSTAGRAM\PORTRAITS\01_zoe.novak.usa\higgsfield_s22\20250903_223652.jpg
```

---

### 2. Open Graph Image (`og-image.jpg`)

**Specifications:**
- **Dimensions:** 1200x630px (exact)
- **Format:** JPG (preferred) or PNG
- **File Size:** Under 1MB (ideally 300-500KB)
- **Usage:** Preview image when link is shared on social media

**Tips:**
- Include your name/brand
- Add a tagline or call-to-action
- Use eye-catching colors
- Test on different platforms (Facebook, Twitter, LinkedIn)
- Keep important content in the center (safe zone)

**Quick Create with Canva:**
1. Go to [canva.com](https://canva.com)
2. Search for "Open Graph" or use custom size: 1200x630px
3. Add your photo, name, and tagline
4. Export as JPG
5. Save as `og-image.jpg`

**Template Layout Example:**
```
┌─────────────────────────────────────┐
│                                     │
│  [Your Photo]   Zoe Novak          │
│                 Model & Creator     │
│                                     │
│  Connect with me →                 │
│  gramflow.link/zoe.novak.ga       │
│                                     │
└─────────────────────────────────────┘
```

---

### 3. Favicon (`favicon.png`)

**Specifications:**
- **Dimensions:** 32x32px or 64x64px (square)
- **Recommended:** 64x64px for retina displays
- **Format:** PNG with transparency
- **File Size:** Under 10KB
- **Usage:** Browser tab icon

**Tips:**
- Simple, recognizable icon
- Often a logo or initials
- Works well at tiny sizes
- Consider a monochrome version

**Quick Create:**
1. Use your profile photo cropped to square
2. Resize to 64x64px
3. Or create custom icon with initials

**Online Tools:**
- [Favicon.io](https://favicon.io) - Generate from text or image
- [RealFaviconGenerator](https://realfavicongenerator.net)

---

### 4. PWA Icons (`icon-192.png` & `icon-512.png`)

**Specifications:**

**icon-192.png:**
- **Dimensions:** 192x192px (exact, square)
- **Format:** PNG with transparency or solid background
- **File Size:** Under 50KB
- **Usage:** PWA home screen icon (small)

**icon-512.png:**
- **Dimensions:** 512x512px (exact, square)
- **Format:** PNG with transparency or solid background
- **File Size:** Under 100KB
- **Usage:** PWA home screen icon (large) and splash screen

**Tips:**
- Use your logo or profile photo
- Add padding (safe zone: 10% from edges)
- Works on light and dark backgrounds
- Test on actual device home screen

**Quick Create:**
1. Start with profile.jpg
2. Crop to square
3. Add 10% padding around edges
4. Resize to 192x192px and 512x512px
5. Export as PNG

---

## 🛠️ Image Optimization Tools

### Online Tools (Free)
1. **TinyPNG** - [tinypng.com](https://tinypng.com)
   - Compress JPG and PNG files
   - Up to 80% size reduction
   - Drag and drop interface

2. **Squoosh** - [squoosh.app](https://squoosh.app)
   - Google's image optimizer
   - Compare before/after
   - Advanced compression settings

3. **Canva** - [canva.com](https://canva.com)
   - Create og-image.jpg
   - Design PWA icons
   - Free templates

### Desktop Software
- **Photoshop** - Professional editing
- **GIMP** - Free alternative to Photoshop
- **Paint.NET** - Windows image editor
- **Preview (Mac)** - Built-in resizing

---

## 📐 Image Sizing Quick Reference

```bash
# Using ImageMagick (command line)

# Resize profile picture
magick convert profile-original.jpg -resize 800x800 -quality 85 profile.jpg

# Create og-image
magick convert og-original.jpg -resize 1200x630! -quality 85 og-image.jpg

# Create favicon
magick convert icon-original.png -resize 64x64 favicon.png

# Create PWA icons
magick convert icon-original.png -resize 192x192 icon-192.png
magick convert icon-original.png -resize 512x512 icon-512.png
```

---

## 🎯 Step-by-Step Setup

### Step 1: Create Assets Folder
```bash
# In your ZOE_NOVAK directory
mkdir assets
```

### Step 2: Prepare Profile Picture
1. Choose your best portrait photo
2. Crop to square (1:1 ratio)
3. Resize to 800x800px
4. Optimize to under 300KB
5. Save as `assets/profile.jpg`

### Step 3: Create Open Graph Image
1. Open Canva or Photoshop
2. Create new file: 1200x630px
3. Add your photo and text
4. Export as JPG (quality 85%)
5. Save as `assets/og-image.jpg`

### Step 4: Create Favicon
1. Use profile photo or create custom icon
2. Crop to square
3. Resize to 64x64px
4. Save as `assets/favicon.png`

### Step 5: Create PWA Icons
1. Use profile photo or logo
2. Add 10% padding on all sides
3. Resize to 192x192px
4. Save as `assets/icon-192.png`
5. Resize to 512x512px
6. Save as `assets/icon-512.png`

### Step 6: Verify All Files
```bash
# Check that all files exist
ls assets/

# You should see:
# profile.jpg
# og-image.jpg
# favicon.png
# icon-192.png
# icon-512.png
```

---

## ✅ Quality Checklist

Before deploying, verify:

- [ ] All 5 images are in `/assets` folder
- [ ] File names match exactly (case-sensitive)
- [ ] profile.jpg is at least 500x500px
- [ ] og-image.jpg is exactly 1200x630px
- [ ] favicon.png is 32x32px or 64x64px
- [ ] icon-192.png is exactly 192x192px
- [ ] icon-512.png is exactly 512x512px
- [ ] All images are optimized (small file sizes)
- [ ] Images are clear and high quality
- [ ] Profile photo is centered and well-lit
- [ ] OG image looks good on social media preview
- [ ] Icons work on light and dark backgrounds

---

## 🧪 Testing Your Images

### Test Profile Picture
1. Open `index.html` in browser
2. Verify image loads and looks good
3. Check on mobile device
4. Ensure circular crop looks correct

### Test Open Graph Image
1. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your site URL
3. Check preview image
4. Test on Twitter with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Test Favicon
1. Open site in browser
2. Check browser tab icon
3. Test in Chrome, Firefox, Safari
4. Verify on mobile browsers

### Test PWA Icons
1. Deploy site to Netlify
2. Open on mobile device
3. Try "Add to Home Screen"
4. Check if icon appears correctly

---

## 🎨 Pro Tips

1. **Batch Processing**
   - Process all images at once
   - Use consistent quality settings
   - Save originals in separate folder

2. **Naming Convention**
   - Use lowercase
   - No spaces (use hyphens)
   - Be consistent across projects

3. **Backup Originals**
   - Keep high-res originals
   - Never edit originals directly
   - Use copies for web optimization

4. **Version Control**
   - Update og-image when you rebrand
   - Keep profile.jpg current
   - Update annually or as needed

---

## 📱 Example Asset Workflow

**Source Material:**
```
Original Photo: 3000x4000px portrait.jpg (5MB)
```

**Processing Steps:**
```
1. profile.jpg
   - Crop to square: 3000x3000px
   - Resize: 800x800px
   - Quality: 85%
   - Result: 200KB

2. og-image.jpg
   - Create in Canva: 1200x630px
   - Add photo + text
   - Export: 85% quality
   - Result: 350KB

3. favicon.png
   - Crop to square: 1000x1000px
   - Resize: 64x64px
   - Export: PNG
   - Result: 5KB

4. icon-192.png
   - Use profile crop
   - Add padding: 880x880px with 10% border
   - Resize: 192x192px
   - Result: 15KB

5. icon-512.png
   - Same as above
   - Resize: 512x512px
   - Result: 50KB
```

**Total Assets Size:** ~620KB (well optimized!)

---

## 🚨 Common Issues & Solutions

**Issue:** Profile image appears blurry
- **Solution:** Use higher resolution source (at least 800x800px)

**Issue:** OG image doesn't show on Facebook
- **Solution:** Ensure it's exactly 1200x630px and under 1MB

**Issue:** Favicon not appearing
- **Solution:** Clear browser cache, verify file is 32x32 or 64x64px

**Issue:** PWA icon looks stretched
- **Solution:** Ensure icon is perfect square (192x192 or 512x512)

**Issue:** File sizes too large
- **Solution:** Use TinyPNG or Squoosh to compress

---

**Ready to deploy?** Once all assets are in place, proceed to `README.md` for deployment instructions!
