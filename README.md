# HEB Auto Coupon Clipper

## Description
The HEB Auto Coupon Clipper is a Tampermonkey script designed to automate the process of clicking the "View More" button and clipping coupons on the HEB digital coupon page. It includes a status overlay to keep track of the script's progress.

## Features
- Automatically clicks "View More" to load all available coupons.
- Clips all available coupons in a controlled and staggered manner.
- Displays a status overlay on the page to indicate current activity and progress.
- Checks for script updates.

## Installation for Tampermonkey Users
1. Install the Tampermonkey extension in your web browser.
2. Click on this [link to the script](https://github.com/david-roh/HEB-Auto-Coupon-Clipper/raw/main/HEB-Auto-Coupon-Clipper.user.js) (adjust the URL to your GitHub repository).
3. Tampermonkey should recognize the script and open the installation window. Click "Install."

## Running the Script from the Browser Console
If you prefer not to use Tampermonkey, you can run the script directly in your browser's console:

1. Navigate to [HEB's coupon page](https://www.heb.com/digital-coupon/coupon-selection/all-coupons).
2. Open your browser's developer tools (usually F12, or right-click > "Inspect").
3. Navigate to the "Console" tab.
4. Copy and paste the following script into the console and press Enter:

```javascript
(function run() {
  const clickViewMore = () => {
    // Select the "View more" button by its text content
    const viewMoreButton = Array.from(document.querySelectorAll('button'))
      .find(el => el.textContent.trim() === 'View more');

    if (viewMoreButton && !viewMoreButton.disabled) {
      viewMoreButton.click();
      console.log('Clicked View More');
      setTimeout(clickViewMore, 3000); // Wait for the content to load and then check again
    } else {
      console.log('No more "View More" button or it is disabled.');
      clipCoupons();
    }
  };

  const clipCoupons = () => {
    // Placeholder: Insert the correct selector for coupon elements
    const coupons = Array.from(document.querySelectorAll('button[id^="coupon-button-"]'))
      .filter(e => e.textContent.trim() === 'Clip');

    if (coupons.length === 0) {
      console.log('No coupons found or all coupons are already clipped.');
      return;
    }

    console.log(`Total coupons found: ${coupons.length}`);
    
    coupons.forEach((e, i) => {
      setTimeout(() => {
        e.click(); // Simulate a click on the coupon
        console.log(`Clipped coupon ${i + 1}/${coupons.length}`);
      }, i * 1700); // Delay each click
    });
  };

  clickViewMore();
})();
```
Please note: Running scripts in the console can be a security risk if the script comes from an untrusted source. Ensure you trust the script before executing it in your browser.

## Configuration
The script has a configuration section at the top, which allows you to enable or disable certain features. Please adjust these settings as needed:

- `autoClickViewMore`: Set to `true` to enable automatic clicking of the "View More" button.
- `autoClipCoupons`: Set to `true` to enable automatic clipping of coupons.
- `checkForUpdates`: Set to `true` to enable automatic update checks.
- Other timing configurations (has not been optimized)


