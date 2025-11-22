interface SiteSettings {
  [domain: string]: {
    enabled: boolean;
  };
}

// Get current tab info
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Get domain from URL
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return "unknown";
  }
}

// Load settings from storage
async function loadSettings(): Promise<{ sites: SiteSettings }> {
  const result = await chrome.storage.sync.get(["sites"]);

  return {
    sites: result.sites || {},
  };
}

// Save settings to storage
async function saveSettings(sites: SiteSettings) {
  await chrome.storage.sync.set({ sites });
}

// Update UI based on current state
async function updateUI() {
  const tab = await getCurrentTab();
  if (!tab.url) return;

  const domain = getDomain(tab.url);
  const { sites } = await loadSettings();

  // Update domain display
  const domainEl = document.getElementById("currentDomain");
  if (domainEl) domainEl.textContent = domain;

  // Get site-specific settings
  const siteSettings = sites[domain] || { enabled: true };
  const isBlocking = siteSettings.enabled;

  // Update toggle
  const toggle = document.getElementById("mainToggle") as HTMLInputElement;
  if (toggle) toggle.checked = isBlocking;

  // Update status indicator
  const statusIndicator = document.getElementById("statusIndicator");
  const statusText = document.getElementById("statusText");
  if (statusIndicator) {
    statusIndicator.className = isBlocking
      ? "status-indicator"
      : "status-indicator inactive";
  }
  if (statusText) {
    statusText.textContent = isBlocking ? "Protected" : "Unprotected";
  }

  // Update description
  const description = document.getElementById("toggleDescription");
  if (description) {
    description.innerHTML = isBlocking
      ? 'Ctrl+S is currently <strong style="color: #dc3545;">BLOCKED</strong> on this site'
      : 'Ctrl+S is currently <strong style="color: #28a745;">ALLOWED</strong> on this site';
  }
}

// Toggle protection for current site
async function toggleProtection() {
  const tab = await getCurrentTab();
  if (!tab.url) return;

  const domain = getDomain(tab.url);
  const { sites } = await loadSettings();

  // Toggle site setting
  if (!sites[domain]) {
    sites[domain] = { enabled: true };
  }
  sites[domain].enabled = !sites[domain].enabled;

  await saveSettings(sites);

  // Notify content script (may fail on special pages like chrome://, extension pages, etc.)
  if (tab.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: "updateSettings",
        enabled: sites[domain].enabled,
      });
    } catch (error) {
      // Content script not available - this is expected on some pages
      console.log("Content script not available on this page:", error);
    }
  }

  updateUI();
}

// Initialize popup
document.addEventListener("DOMContentLoaded", () => {
  updateUI();

  // Toggle switch
  const toggle = document.getElementById("mainToggle");
  toggle?.addEventListener("click", toggleProtection);

  // TODO: To open options page
  // chrome.runtime.openOptionsPage();

  // Help link
  const helpLink = document.getElementById("helpLink");
  helpLink?.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({
      url: "https://github.com/ntvu19/disable-ctrl-s#readme",
    });
  });

  // Feedback link
  const feedbackLink = document.getElementById("feedbackLink");
  feedbackLink?.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({
      url: "https://github.com/ntvu19/disable-ctrl-s/issues",
    });
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveBlocked") {
    updateUI();
  }
});
