// ==UserScript==
// @name         HEB Auto Coupon Clipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks 'View more' and clips coupons on HEB's coupon page
// @author       David Roh
// @match        https://www.heb.com/digital-coupon/coupon-selection/all-coupons
// @updateURL    https://github.com/david-roh/HEB-Auto-Coupon-Clipper/raw/main/HEB-Auto-Coupon-Clipper.user.js
// @downloadURL  https://github.com/david-roh/HEB-Auto-Coupon-Clipper/raw/main/HEB-Auto-Coupon-Clipper.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// ==/UserScript==

(function() {
  const config = {
    autoClickViewMore: true,
    autoClipCoupons: true,
    checkForUpdates: true,
    updateCheckInterval: 86400000, // 24 hours in milliseconds
    clipDelay: 1100, // Delay in milliseconds between each clip
  };

  function createStatusOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'coupon-clipper-status-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.right = '10px';
    overlay.style.backgroundColor = 'white';
    overlay.style.border = '1px solid black';
    overlay.style.padding = '10px';
    overlay.style.zIndex = '1000';
    overlay.innerText = 'Initializing...';
    document.body.appendChild(overlay);
  }

  function updateStatus(message) {
    const overlay = document.getElementById('coupon-clipper-status-overlay');
    if (overlay) {
      overlay.innerText = message;
    }
  }

  function checkForUpdate() {
    if (!config.checkForUpdates) return;

    GM_xmlhttpRequest({
      method: "GET",
      url: config.scriptUpdateUrl,
      onload: function(response) {
        const remoteScript = response.responseText;
        const remoteVersionMatch = remoteScript.match(/@version\s+([^\n]+)/);
        const remoteVersion = remoteVersionMatch ? remoteVersionMatch[1].trim() : null;
        const localVersion = GM_info.script.version;

        if (remoteVersion && localVersion !== remoteVersion) {
          if (window.confirm('A new version of HEB Auto Coupon Clipper is available. Update now?')) {
            window.open(config.scriptUpdateUrl, '_blank');
          }
        }
      }
    });
  }

  function clickViewMore() {
    if (!config.autoClickViewMore) return;

    const viewMoreButton = Array.from(document.querySelectorAll('button'))
      .find(el => el.textContent.trim() === 'View more');

    if (viewMoreButton && !viewMoreButton.disabled) {
      viewMoreButton.click();
      updateStatus('Clicked View More');
      setTimeout(clickViewMore, 4000); // Wait for the content to load and then check again
    } else {
      updateStatus('No more "View More" button or it is disabled.');
      if (config.autoClipCoupons) {
        clipCoupons();
      }
    }
  }

  function clipCoupons() {
    const coupons = Array.from(document.querySelectorAll('button[id^="coupon-button-"]'))
      .filter(e => e.textContent.trim() === 'Clip');

    if (coupons.length === 0) {
      updateStatus('No coupons found or all coupons are already clipped.');
      return;
    }

    updateStatus(`Total coupons found: ${coupons.length}`);
    clipCouponsInBatches(coupons, 0);
  }

  function clipCouponsInBatches(coupons, index) {
    if (index >= coupons.length) {
      updateStatus('Complete!');
      return;
    }

    coupons[index].click();
    updateStatus(`Clipping coupon ${index + 1}/${coupons.length}`);

    setTimeout(() => {
      clipCouponsInBatches(coupons, index + 1);
    }, config.clipDelay);
  }

  createStatusOverlay();
  clickViewMore();
})();
