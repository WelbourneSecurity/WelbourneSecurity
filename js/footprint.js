const setFootprintValue = (key, value) => {
  document.querySelectorAll(`[data-footprint-key="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
};

const setFootprintStatus = (status, summary) => {
  document.querySelectorAll("[data-footprint-status]").forEach((node) => {
    node.textContent = status;
  });
  document.querySelectorAll("[data-footprint-summary]").forEach((node) => {
    node.textContent = summary;
  });
};

const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const matchers = [
    { label: "Edge", pattern: /Edg\/([\d.]+)/ },
    { label: "Opera", pattern: /OPR\/([\d.]+)/ },
    { label: "Chrome", pattern: /Chrome\/([\d.]+)/ },
    { label: "Firefox", pattern: /Firefox\/([\d.]+)/ },
    { label: "Safari", pattern: /Version\/([\d.]+).*Safari/ }
  ];

  for (const matcher of matchers) {
    const match = userAgent.match(matcher.pattern);
    if (match) return `${matcher.label} ${match[1].split(".")[0]}`;
  }

  if (navigator.userAgentData?.brands?.length) {
    return navigator.userAgentData.brands
      .map(({ brand, version }) => `${brand} ${String(version).split(".")[0]}`)
      .join(", ");
  }

  return "Unavailable";
};

const detectOperatingSystem = () => {
  const userAgent = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/CrOS/i.test(userAgent)) return "ChromeOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return navigator.userAgentData?.platform || navigator.platform || "Unavailable";
};

const getLanguageInfo = () => {
  const languages = Array.isArray(navigator.languages) ? navigator.languages.filter(Boolean) : [];
  if (languages.length > 1) return languages.slice(0, 2).join(", ");
  return navigator.language || languages[0] || "Unavailable";
};

const getTimeZoneInfo = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Unavailable";
  } catch {
    return "Unavailable";
  }
};

const updateFootprintSnapshot = () => {
  setFootprintValue("browser", detectBrowser());
  setFootprintValue("os", detectOperatingSystem());
  setFootprintValue("language", getLanguageInfo());
  setFootprintValue("timezone", getTimeZoneInfo());
};

const resolvePublicIp = async () => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2200);

  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) throw new Error("Public IP lookup failed.");

    const payload = await response.json();
    return typeof payload.ip === "string" && payload.ip.trim() ? payload.ip.trim() : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const initialiseFootprintSnapshot = () => {
  setFootprintStatus(
    "Inspecting browser exposure...",
    "Checking the quick browser details exposed immediately on page load."
  );
  updateFootprintSnapshot();
  setFootprintValue("public-ip", "Not checked");

  setFootprintStatus(
    "Browser details are visible on load.",
    "Browser, OS, language, and time zone are readable immediately. Public IP is only checked if you request it."
  );
};

const bindPublicIpLookup = () => {
  const action = document.querySelector("[data-footprint-ip-action]");
  if (!(action instanceof HTMLButtonElement)) return;

  action.addEventListener("click", async () => {
    action.disabled = true;
    action.textContent = "Checking...";
    setFootprintValue("public-ip", "Checking...");
    setFootprintStatus(
      "Checking public IP...",
      "This request asks api.ipify.org for the public IP address visible to external services."
    );

    const publicIp = await resolvePublicIp();
    if (publicIp) {
      setFootprintValue("public-ip", publicIp);
      setFootprintStatus(
        "Public IP lookup complete.",
        "Browser, OS, language, time zone, and the requested public IP value are visible from the client."
      );
      action.textContent = "Refresh IP";
      action.disabled = false;
      return;
    }

    setFootprintValue("public-ip", "Lookup unavailable");
    setFootprintStatus(
      "Public IP lookup unavailable.",
      "Browser, OS, language, and time zone are readable locally. Public IP depends on the optional client-side lookup."
    );
    action.textContent = "Try again";
    action.disabled = false;
  });
};

export function initFootprint() {
  initialiseFootprintSnapshot();
  bindPublicIpLookup();

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      // Debounce: only update UA-derived values after resize settles (IP is not re-fetched)
      resizeTimer = window.setTimeout(updateFootprintSnapshot, 300);
    },
    { passive: true }
  );
}
