/**
 * Content script for the extension
 * Handles blocking Ctrl+S on web pages
 */

import type { SiteSettings } from "../types";

let isBlocking = true; // Default: block Ctrl+S

// Get current domain
function getCurrentDomain(): string {
  return globalThis.location.hostname;
}

// Load settings from storage
async function loadSettings() {
  const domain = getCurrentDomain();
  const result = await chrome.storage.sync.get(["sites"]);
  const sites: SiteSettings = result.sites || {};

  // Default to enabled (blocking) if not set
  isBlocking = sites[domain]?.enabled !== false;
  console.debug(
    `[Ctrl+S Shield] Protection ${isBlocking ? "ENABLED" : "DISABLED"} for ${domain}`
  );
}

// Block Ctrl+S keyboard shortcut
function handleKeyDown(event: KeyboardEvent) {
  // Check if it's Ctrl+S (or Cmd+S on Mac)
  if ((event.ctrlKey || event.metaKey) && event.key === "s" && isBlocking) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSettings") {
    isBlocking = message.enabled;
    console.debug(
      `[Ctrl+S Shield] Protection ${isBlocking ? "ENABLED" : "DISABLED"}`
    );
    sendResponse({ success: true });
  }
  return true;
});

document.addEventListener("keydown", handleKeyDown, true);
await loadSettings();
