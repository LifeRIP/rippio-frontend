import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 120000,
  viewportWidth: 1280,
  viewportHeight: 900,
  e2e: {
    setupNodeEvents(on) {
      // Keep the capture window larger than the desktop test viewport so
      // headless screenshots include the entire page width.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.isHeadless && browser.name === 'electron') {
          launchOptions.preferences.width = 1600;
          launchOptions.preferences.height = 1200;
        }
        if (browser.isHeadless && browser.name === 'chrome') {
          launchOptions.args.push('--window-size=1600,1200', '--force-device-scale-factor=1');
        }
        return launchOptions;
      });
    },
  },
});
