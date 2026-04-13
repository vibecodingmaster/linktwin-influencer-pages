// Age Verification System
function showAgeVerification() {
    const modal = document.getElementById('ageModal');
    modal.style.display = 'flex';

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Analytics - track age gate shown
    trackEvent('age_verification_shown', {
        link: 'private_conversations'
    });
}

function verifyAge(isAdult) {
    const modal = document.getElementById('ageModal');

    if (isAdult) {
        // User confirmed they are 18+
        trackEvent('age_verification_confirmed', {
            result: 'accepted'
        });

        // Redirect to private conversations
        window.location.href = 'https://go.gramflow.link/yukikimura';
    } else {
        // User is under 18
        trackEvent('age_verification_confirmed', {
            result: 'rejected'
        });

        // Close modal and show message
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Show notification
        showNotification('You must be 18 or older to access this content.', 'error');
    }
}

// Deeplink Modal for iOS
function closeDeeplinkModal() {
    const modal = document.getElementById('deeplinkModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? 'linear-gradient(135deg, #f14668, #e73b5c)' : 'linear-gradient(135deg, #667eea, #764ba2)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        font-weight: 500;
        animation: slideDown 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Analytics Event Tracking
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, eventData);
    }

    // Console log for debugging
    console.log('Event:', eventName, eventData);
}

// Track Link Clicks
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.link-button');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.querySelector('.link-text').textContent;
            const linkHref = this.getAttribute('href');

            // Don't track the age verification link (it's handled separately)
            if (linkHref && linkHref !== '#') {
                trackEvent('link_clicked', {
                    link_text: linkText,
                    link_url: linkHref
                });
            }
        });
    });

    // Track page view
    trackEvent('page_view', {
        page: 'home',
        referrer: document.referrer
    });
});

// Instagram/Facebook In-App Browser Detection & Deeplink
(function() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInstagram = ua.indexOf('Instagram') > -1;
    const isFacebook = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
    const isInAppBrowser = isInstagram || isFacebook;

    if (isInAppBrowser) {
        // Track in-app browser detection
        trackEvent('in_app_browser_detected', {
            browser: isInstagram ? 'instagram' : 'facebook',
            user_agent: ua
        });

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
    }
})();

// Service Worker for PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {
                console.log('ServiceWorker registration successful');
            },
            function(err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prevent context menu on images (optional - for content protection)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Copy protection (optional)
document.addEventListener('copy', function(e) {
    trackEvent('content_copy_attempted');
});

// Track time on page
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
        seconds: timeSpent
    });
});

// Add click animation effect
document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: fixed;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
    `;

    const size = 50;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - size / 2) + 'px';
    ripple.style.top = (e.clientY - size / 2) + 'px';

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
