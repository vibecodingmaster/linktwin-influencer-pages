# Chrome Deeplink Detection Fix

## Problem
The deeplink detection modal was working on Firefox but not on Chrome when viewing Instagram links in the Instagram in-app browser.

## Root Cause
The previous implementation:
1. **iOS only**: Only showed the modal for iOS devices (`/iPad|iPhone|iPod/.test(ua)`)
2. **Incorrect Android approach**: Used an invalid `<meta name="intent">` tag that doesn't actually force external browser opening
3. **No Chrome detection**: Didn't handle the case when Instagram uses Chrome as its in-app browser on Android

## Solution Implemented

### 1. Updated JavaScript Detection (`script.js`)
**Before:**
```javascript
// For iOS, show modal with instructions
if (/iPad|iPhone|iPod/.test(ua)) {
    const deeplinkModal = document.getElementById('deeplinkModal');
    if (deeplinkModal) {
        setTimeout(() => {
            deeplinkModal.style.display = 'flex';
        }, 500);
    }
}
// For Android, the intent URL in the head will handle it automatically
```

**After:**
```javascript
// Detect platform
const isIOS = /iPad|iPhone|iPod/.test(ua);
const isAndroid = /Android/.test(ua);

// Show modal for both iOS and Android
const deeplinkModal = document.getElementById('deeplinkModal');
if (deeplinkModal) {
    // Update modal content based on platform
    const instructions = deeplinkModal.querySelector('.platform-instructions');
    if (instructions) {
        if (isAndroid) {
            instructions.innerHTML = `
                <p style="font-size: 14px; margin: 0;"><strong>How to open in Chrome:</strong></p>
                <ol style="text-align: left; margin: 12px 0 0 0; padding-left: 20px; font-size: 14px;">
                    <li>Tap the three dots (⋮) at the top right</li>
                    <li>Select "Open in Chrome" or "Open in external browser"</li>
                </ol>
            `;
        } else if (isIOS) {
            instructions.innerHTML = `
                <p style="font-size: 14px; margin: 0;"><strong>How to open in Safari:</strong></p>
                <ol style="text-align: left; margin: 12px 0 0 0; padding-left: 20px; font-size: 14px;">
                    <li>Tap the three dots (...) at the bottom right</li>
                    <li>Select "Open in Safari" or "Open in Browser"</li>
                </ol>
            `;
        }
    }

    setTimeout(() => {
        deeplinkModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 500);
}
```

### 2. Updated HTML Modal (`index.html`)
**Before:**
```html
<meta name="intent" content="intent://yukikimura#Intent;scheme=https;package=com.android.chrome;end">

<div id="deeplinkModal" class="modal">
    <div class="modal-content">
        <!-- Hard-coded iOS instructions -->
    </div>
</div>
```

**After:**
```html
<!-- Removed invalid intent meta tag -->

<div id="deeplinkModal" class="modal">
    <div class="modal-content">
        <button onclick="closeDeeplinkModal()" style="...">×</button>
        <h2>Open in Browser</h2>
        <p>You're viewing this in Instagram's browser. For the best experience, please open this page in your default browser.</p>
        <div class="platform-instructions" style="...">
            <!-- Instructions will be dynamically inserted based on platform -->
        </div>
        <button onclick="closeDeeplinkModal()" style="...">Got it</button>
    </div>
</div>
```

## Files Updated

### Profile Folders
- ✅ `yuki.kimura.japan/script.js`
- ✅ `yuki.kimura.japan/index.html`
- ✅ `zoe.novak.ga/script.js`
- ✅ `zoe.novak.ga/index.html`

### Documentation
- ✅ `MEMORY.md` - Updated architecture documentation
- ✅ `README.md` - Removed all Netlify references, replaced with Vercel
- ✅ `DEPLOYMENT_STATUS.md` - Updated security enhancements description

## Platform-Specific Instructions

### iOS (Safari)
When Instagram in-app browser is detected on iOS:
1. Modal appears with iOS-specific instructions
2. Instructions: "Tap the three dots (...) at the bottom right"
3. Then: "Select 'Open in Safari' or 'Open in Browser'"

### Android (Chrome)
When Instagram in-app browser is detected on Android:
1. Modal appears with Android-specific instructions
2. Instructions: "Tap the three dots (⋮) at the top right"
3. Then: "Select 'Open in Chrome' or 'Open in external browser'"

## Testing Checklist

### ✅ Completed Tests
- [x] Firefox detection works
- [x] Code deployed to both profiles (yuki.kimura.japan, zoe.novak.ga)
- [x] Documentation updated

### ⏳ Pending Tests
- [ ] Test on Chrome mobile (Android)
- [ ] Test in Instagram app (iOS)
- [ ] Test in Instagram app (Android)
- [ ] Verify modal shows correct platform-specific instructions
- [ ] Test Facebook in-app browser (iOS & Android)

## Technical Notes

### User Agent Detection
The script detects:
- Instagram: `ua.indexOf('Instagram') > -1`
- Facebook: `ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1`
- iOS: `/iPad|iPhone|iPod/.test(ua)`
- Android: `/Android/.test(ua)`

### Modal Behavior
1. Detects Instagram/Facebook in-app browser
2. Determines platform (iOS or Android)
3. Dynamically injects platform-specific instructions
4. Shows modal after 500ms delay
5. Prevents body scroll while modal is open
6. Tracks analytics event: `in_app_browser_detected`

## Deployment

### Vercel Auto-Deploy
All changes are pushed to GitHub and automatically deployed to Vercel:
- Live URL: `https://link.gramflow.link/yuki.kimura.japan`
- Live URL: `https://link.gramflow.link/zoe.novak.ga`

### Next Steps
1. Test the fix on actual devices (Chrome on Android)
2. Verify modal appears in Instagram app
3. Confirm correct platform-specific instructions are shown
4. Monitor analytics for `in_app_browser_detected` events

---

**Status:** ✅ Code deployed and ready for testing
**Date:** 2026-04-13
**Platform:** Vercel
