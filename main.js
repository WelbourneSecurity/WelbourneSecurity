import { portfolio } from "./content.js";
import { personaNames } from "./persona-data.js";

const state = {
  activeWriteupPath: "",
  githubConfig: null,
  writeupsByPath: new Map(),
  allWriteups: [],
  filteredWriteups: [],
  writeupSources: [],
  writeupFilters: {
    query: "",
    folder: "all",
    tag: "all"
  }
};

const SITE_URL = "https://welbournesecurity.com/";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const updateMetric = (label, value) => {
  const metric = document.querySelector(`[data-metric-label="${label}"] dd`);
  if (metric) {
    metric.textContent = value;
  }
};

const setText = (id, value) => {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttribute = (value = "") => escapeHtml(value);

const titleizeFileName = (fileName) =>
  fileName
    .replace(/\.md$/i, "")
    .replace(/^(htb|thm|ctf)-/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const detectWriteupLabel = (fileName, fallbackLabel) => {
  if (/^htb-/i.test(fileName)) return "Hack The Box";
  if (/^thm-/i.test(fileName)) return "TryHackMe";
  if (/^ctf-/i.test(fileName)) return "CTF";
  return fallbackLabel;
};

const getWriteupTone = (label) => {
  if (label === "TryHackMe") return "thm";
  if (label === "Hack The Box") return "htb";
  if (label === "CTF") return "ctf";
  return "default";
};

const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }

  return [];
};

const formatDate = (value) => {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

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
    if (match) {
      return `${matcher.label} ${match[1].split(".")[0]}`;
    }
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

  if (languages.length > 1) {
    return languages.slice(0, 2).join(", ");
  }

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
    const response = await fetch("https://api64.ipify.org?format=json", {
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("Public IP lookup failed.");
    }

    const payload = await response.json();
    return typeof payload.ip === "string" && payload.ip.trim() ? payload.ip.trim() : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const initialiseFootprintSnapshot = async () => {
  setFootprintStatus(
    "Inspecting browser exposure...",
    "Checking the quick browser details exposed immediately on page load."
  );
  updateFootprintSnapshot();

  const publicIp = await resolvePublicIp();
  if (publicIp) {
    setFootprintValue("public-ip", publicIp);
    setFootprintStatus(
      "Quick browser details are visible on load.",
      "Browser, OS, language, time zone, and public IP are easy to inspect immediately from the client."
    );
    return;
  }

  setFootprintValue("public-ip", "Lookup unavailable");
  setFootprintStatus(
    "Browser details are visible on load.",
    "Browser, OS, language, and time zone are readable immediately. Public IP depends on a separate client-side lookup."
  );
};

const createAction = ({ label, href }, variant) => {
  const link = document.createElement("a");
  link.className = `action ${variant}`;
  link.href = href;
  link.textContent = label;
  if (/^(https?:|mailto:)/i.test(href)) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  return link;
};

const createEmbed = ({ embedUrl, embedTitle, title, description }) => {
  if (embedUrl) {
    const frame = document.createElement("iframe");
    frame.className = "embed-frame";
    frame.src = embedUrl;
    frame.title = embedTitle || title;
    frame.loading = "lazy";
    return frame;
  }

  const placeholder = document.createElement("div");
  placeholder.className = "embed-placeholder";
  placeholder.innerHTML = `
    <div>
      <strong>${title} embed slot</strong>
      <p>${description}</p>
    </div>
  `;
  return placeholder;
};

const createCertificationImage = ({ title, imagePath, verificationUrl }) => {
  const frame = verificationUrl ? document.createElement("a") : document.createElement("div");
  frame.className = "certification-link";

  if (verificationUrl && frame instanceof HTMLAnchorElement) {
    frame.href = verificationUrl;
    frame.target = "_blank";
    frame.rel = "noreferrer";
  }

  const image = document.createElement("img");
  image.className = "certification-image";
  image.src = imagePath;
  image.alt = title;
  image.loading = "lazy";

  frame.append(image);
  return frame;
};

const createPlatform = ({ title, profileUrl }) => {
  const link = document.createElement("a");
  link.className = "presence-link";
  link.href = profileUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = title;
  return link;
};

const createCertification = ({ title, description, issuer, verificationUrl, imagePath }) => {
  const item = document.createElement("article");
  item.className = "certification-item";
  item.append(imagePath ? createCertificationImage({ title, imagePath, verificationUrl }) : createEmbed({ title, description }));

  if (imagePath) {
    const caption = document.createElement("p");
    caption.className = "certification-caption";
    caption.textContent = title;
    item.append(caption);
  }

  return item;
};

const parseFrontMatter = (markdown) => {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { metadata: {}, body: markdown };
  }

  const metadata = {};

  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();

    if (!key) return;

    metadata[key] = key.toLowerCase() === "tags" ? normalizeTags(rawValue) : rawValue.replace(/^['"]|['"]$/g, "");
  });

  return {
    metadata,
    body: markdown.slice(match[0].length)
  };
};

const extractTitleFromBody = (body, fallbackName) => {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : titleizeFileName(fallbackName);
};

const extractSummaryFromBody = (body) => {
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  const blocks = withoutCode
    .split(/\r?\n\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (
      block.startsWith("#") ||
      block.startsWith(">") ||
      block.startsWith("- ") ||
      block.startsWith("* ") ||
      /^\d+\.\s/.test(block)
    ) {
      continue;
    }

    return block.replace(/\r?\n/g, " ");
  }

  return "Markdown writeup ready to be expanded with a short summary.";
};

const normalizeRepoPath = (sourcePath, targetPath) => {
  if (/^(https?:|mailto:|data:|#)/i.test(targetPath)) {
    return targetPath;
  }

  if (targetPath.startsWith("/")) {
    return targetPath.slice(1);
  }

  const segments = sourcePath.split("/");
  segments.pop();

  targetPath.split("/").forEach((segment) => {
    if (!segment || segment === ".") return;
    if (segment === "..") {
      segments.pop();
      return;
    }
    segments.push(segment);
  });

  return segments.join("/");
};

const encodeRepoPath = (path) => path.split("/").map(encodeURIComponent).join("/");

const getRepoConfig = () => {
  const { owner, repo, branch, autoDetectGithubPages } = portfolio.github;

  if (owner && repo) {
    return { owner, repo, branch };
  }

  if (autoDetectGithubPages && window.location.hostname.endsWith(".github.io")) {
    const detectedOwner = window.location.hostname.split(".")[0];
    return {
      owner: detectedOwner,
      repo: `${detectedOwner}.github.io`,
      branch
    };
  }

  return null;
};

const getContentsApiUrl = (config, path) =>
  `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodeRepoPath(path)}?ref=${encodeURIComponent(config.branch)}`;

const getRawUrl = (config, path) =>
  `https://raw.githubusercontent.com/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/${encodeURIComponent(config.branch)}/${path}`;

const syncRuntimeMetadata = () => {
  const socialImageUrl = new URL("./src/social-preview.svg", SITE_URL).href;

  document.title = "Welbourne Security | Cyber Intelligence Portfolio, Writeups, and Browser Tools";

  document.querySelector('link[rel="canonical"]')?.setAttribute("href", SITE_URL);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", SITE_URL);
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", socialImageUrl);
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", socialImageUrl);
  document.querySelectorAll("[data-site-link]").forEach((link) => link.setAttribute("href", SITE_URL));
};

const resolveMarkdownLink = (href, context) => {
  const repoPath = normalizeRepoPath(context.path, href);

  if (/^(https?:|mailto:|data:|#)/i.test(repoPath)) {
    return repoPath;
  }

  return getRawUrl(context.githubConfig, repoPath);
};

const renderInlineMarkdown = (text, context) => {
  const tokens = [];
  const pushToken = (html) => {
    const token = `@@TOKEN${tokens.length}@@`;
    tokens.push(html);
    return token;
  };

  let output = text;

  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
    pushToken(
      `<img src="${escapeAttribute(resolveMarkdownLink(src, context))}" alt="${escapeAttribute(alt)}" loading="lazy" />`
    )
  );

  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const resolvedHref = resolveMarkdownLink(href, context);
    const external = /^https?:/i.test(resolvedHref);

    return pushToken(
      `<a href="${escapeAttribute(resolvedHref)}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${escapeHtml(label)}</a>`
    );
  });

  output = output.replace(/`([^`]+)`/g, (_, code) => pushToken(`<code>${escapeHtml(code)}</code>`));
  output = escapeHtml(output);
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return output.replace(/@@TOKEN(\d+)@@/g, (_, index) => tokens[Number(index)] || "");
};

const isMarkdownBlockStart = (line) =>
  /^#{1,6}\s/.test(line) ||
  /^>\s?/.test(line) ||
  /^[-*]\s+/.test(line) ||
  /^\d+\.\s+/.test(line) ||
  /^```/.test(line) ||
  /^---+$/.test(line.trim()) ||
  /^\*\*\*+$/.test(line.trim());

const renderMarkdown = (markdown, context) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let index = 0;
  let html = "";

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const language = trimmed.replace(/^```/, "").trim();
      const block = [];
      index += 1;

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        block.push(lines[index]);
        index += 1;
      }

      index += 1;
      html += `<pre><code${language ? ` class="language-${escapeAttribute(language)}"` : ""}>${escapeHtml(block.join("\n"))}</code></pre>`;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length, 4);
      html += `<h${level}>${renderInlineMarkdown(heading[2], context)}</h${level}>`;
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      html += "<hr />";
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const block = [];

      while (index < lines.length && /^>\s?/.test(lines[index])) {
        block.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }

      html += `<blockquote>${block
        .filter((item) => item.trim())
        .map((item) => `<p>${renderInlineMarkdown(item, context)}</p>`)
        .join("")}</blockquote>`;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];

      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, ""));
        index += 1;
      }

      html += `<ul>${items.map((item) => `<li>${renderInlineMarkdown(item, context)}</li>`).join("")}</ul>`;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];

      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      html += `<ol>${items.map((item) => `<li>${renderInlineMarkdown(item, context)}</li>`).join("")}</ol>`;
      continue;
    }

    const paragraph = [];

    while (index < lines.length && lines[index].trim() && !isMarkdownBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    html += `<p>${renderInlineMarkdown(paragraph.join(" "), context)}</p>`;
  }

  return html || "<p>No markdown content found.</p>";
};

const createWriteupGroup = ({ label, description, key }) => {
  const group = document.createElement("section");
  group.className = "writeup-group";
  group.dataset.folderKey = key;
  group.innerHTML = `
    <div class="writeup-group-header">
      <p class="entry-label">${label}</p>
      ${description ? `<p>${description}</p>` : ""}
    </div>
    <div class="writeup-list-group"></div>
  `;
  return group;
};

const setGroupState = (container, message, type = "status") => {
  container.innerHTML = `<p class="${type === "error" ? "writeup-error" : "writeup-status"}">${message}</p>`;
};

const createWriteupItem = (writeup) => {
  const button = document.createElement("button");
  button.className = "writeup-item";
  button.type = "button";
  button.dataset.writeupPath = writeup.path;
  button.dataset.writeupTone = getWriteupTone(writeup.folderLabel);
  const fileName = writeup.path.split("/").pop() || writeup.title;
  button.innerHTML = `
    <span class="writeup-item-icon" aria-hidden="true">
      <svg viewBox="0 0 64 80" focusable="false">
        <path d="M12 4h26l14 14v54a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" />
        <path d="M38 4v14h14" />
      </svg>
    </span>
    <strong class="writeup-item-title">${fileName}</strong>
    <span class="writeup-item-label">${writeup.folderLabel}${writeup.displayDate ? ` / ${writeup.displayDate}` : ""}</span>
  `;
  return button;
};

const slugifyText = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const renderEmptyWriteupViewer = (title, message = "") => {
  const viewer = document.getElementById("writeup-viewer");
  if (!viewer) return;

  viewer.innerHTML = `
    <div class="writeup-viewer-empty">
      <div>
        <h3>${escapeHtml(title)}</h3>
        ${message ? `<p>${escapeHtml(message)}</p>` : ""}
      </div>
    </div>
  `;
};

const updateWriteupFilterCount = () => {
  const count = document.getElementById("writeup-filter-count");
  if (!(count instanceof HTMLElement)) return;

  const total = state.allWriteups.length;
  const visible = state.filteredWriteups.length;
  count.textContent = total ? `Showing ${visible} of ${total} writeups` : "No writeups loaded";
};

const updateWriteupFilterButtons = () => {
  document.querySelectorAll("[data-folder-filter]").forEach((button) => {
    const isActive = button.getAttribute("data-folder-filter") === state.writeupFilters.folder;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  document.querySelectorAll("[data-tag-filter]").forEach((button) => {
    const isActive = button.getAttribute("data-tag-filter") === state.writeupFilters.tag;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const renderWriteupTagFilters = () => {
  const container = document.getElementById("writeup-tag-filters");
  if (!(container instanceof HTMLElement)) return;

  const tags = Array.from(new Set(state.allWriteups.flatMap((writeup) => writeup.tags))).sort((left, right) =>
    left.localeCompare(right)
  );

  if (!tags.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <button class="writeup-tag-button${state.writeupFilters.tag === "all" ? " is-active" : ""}" type="button" data-tag-filter="all" aria-pressed="${
      state.writeupFilters.tag === "all" ? "true" : "false"
    }">All Tags</button>
    ${tags
      .map(
        (tag) => `
          <button class="writeup-tag-button${state.writeupFilters.tag === tag ? " is-active" : ""}" type="button" data-tag-filter="${escapeAttribute(
            tag
          )}" aria-pressed="${state.writeupFilters.tag === tag ? "true" : "false"}">${escapeHtml(tag)}</button>
        `
      )
      .join("")}
  `;
};

const writeupMatchesFilters = (writeup) => {
  if (state.writeupFilters.folder !== "all" && writeup.folderKey !== state.writeupFilters.folder) {
    return false;
  }

  if (state.writeupFilters.tag !== "all" && !writeup.tags.includes(state.writeupFilters.tag)) {
    return false;
  }

  const query = state.writeupFilters.query.trim().toLowerCase();
  if (!query) return true;

  const haystack = [writeup.title, writeup.summary, writeup.path, writeup.folderLabel, ...writeup.tags].join(" ").toLowerCase();
  return haystack.includes(query);
};

const renderWriteupGroups = () => {
  const groupsRoot = document.getElementById("writeup-groups");
  if (!(groupsRoot instanceof HTMLElement)) return;

  groupsRoot.innerHTML = "";

  const visibleSources = state.writeupSources.filter(
    (source) => state.writeupFilters.folder === "all" || source.folder.key === state.writeupFilters.folder
  );

  visibleSources.forEach((source) => {
    const group = createWriteupGroup(source.folder);
    const container = group.querySelector(".writeup-list-group");
    groupsRoot.append(group);

    if (!(container instanceof HTMLElement)) return;

    if (source.error) {
      setGroupState(container, source.error, "error");
      return;
    }

    if (!source.writeups.length) {
      setGroupState(container, "Nothing here yet!");
      return;
    }

    const filtered = source.writeups.filter(writeupMatchesFilters);
    if (!filtered.length) {
      setGroupState(container, "No matches for current filters.");
      return;
    }

    container.innerHTML = "";
    filtered.forEach((writeup) => container.append(createWriteupItem(writeup)));
  });
};

const applyWriteupFilters = () => {
  state.filteredWriteups = state.allWriteups.filter(writeupMatchesFilters);
  renderWriteupTagFilters();
  updateWriteupFilterButtons();
  renderWriteupGroups();
  updateWriteupFilterCount();

  if (!state.allWriteups.length) {
    state.activeWriteupPath = "";
    renderEmptyWriteupViewer("No writeups available yet.", "Push markdown files to the connected writeups repository and reload the page.");
    return;
  }

  if (!state.filteredWriteups.length) {
    state.activeWriteupPath = "";
    renderEmptyWriteupViewer("No writeups match the current filters.", "Adjust the search or reset the filters to browse everything again.");
    return;
  }

  if (!state.filteredWriteups.some((writeup) => writeup.path === state.activeWriteupPath)) {
    renderWriteup(state.filteredWriteups[0]);
    return;
  }

  updateActiveWriteupItem();
};

const updateActiveWriteupItem = () => {
  document.querySelectorAll(".writeup-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.writeupPath === state.activeWriteupPath);
  });
};

const enhanceWriteupViewer = (viewer) => {
  const body = viewer.querySelector(".writeup-viewer-body");
  const tocPanel = viewer.querySelector(".writeup-toc-panel");
  const toc = viewer.querySelector("#writeup-toc");

  if (body instanceof HTMLElement && tocPanel instanceof HTMLElement && toc instanceof HTMLElement) {
    const headingNodes = Array.from(body.querySelectorAll("h1, h2, h3, h4"));
    const headingCounts = new Map();
    const headings = headingNodes.map((heading) => {
      const baseId = slugifyText(heading.textContent || "section");
      const count = headingCounts.get(baseId) || 0;
      headingCounts.set(baseId, count + 1);
      const id = count ? `${baseId}-${count + 1}` : baseId;
      heading.id = id;
      return {
        id,
        level: Number(heading.tagName.slice(1)),
        text: heading.textContent || "Section"
      };
    });

    if (headings.length >= 2) {
      tocPanel.hidden = false;
      toc.innerHTML = headings
        .map(
          (heading) =>
            `<a class="writeup-toc-link level-${heading.level}" href="#${escapeAttribute(heading.id)}">${escapeHtml(heading.text)}</a>`
        )
        .join("");
    } else {
      tocPanel.hidden = true;
      toc.innerHTML = "";
    }

    body.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement?.classList.contains("writeup-code-block")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "writeup-code-block";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.append(pre);

      const button = document.createElement("button");
      button.className = "writeup-code-copy";
      button.type = "button";
      button.textContent = "Copy Code";
      button.addEventListener("click", async () => {
        const value = pre.querySelector("code")?.textContent || pre.textContent || "";
        await copyTextToClipboard(value.trim(), button, "Copy Code");
      });
      wrapper.append(button);
    });
  }

  viewer.querySelectorAll(".writeup-nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const path = button.getAttribute("data-writeup-path") || "";
      const writeup = state.writeupsByPath.get(path);
      if (writeup) {
        renderWriteup(writeup);
      }
    });
  });
};

const renderWriteup = (writeup) => {
  const viewer = document.getElementById("writeup-viewer");
  if (!viewer) return;

  state.activeWriteupPath = writeup.path;
  updateActiveWriteupItem();
  const activeIndex = state.filteredWriteups.findIndex((entry) => entry.path === writeup.path);
  const previousWriteup = activeIndex > 0 ? state.filteredWriteups[activeIndex - 1] : null;
  const nextWriteup =
    activeIndex >= 0 && activeIndex < state.filteredWriteups.length - 1 ? state.filteredWriteups[activeIndex + 1] : null;

  viewer.innerHTML = `
    <div class="writeup-viewer-header">
      <span class="writeup-viewer-meta">${writeup.folderLabel}${writeup.displayDate ? ` / ${writeup.displayDate}` : ""}</span>
      <h3>${writeup.title}</h3>
      <p class="writeup-item-summary">${writeup.summary}</p>
      ${
        writeup.tags.length
          ? `<div class="writeup-viewer-tags">${writeup.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`
          : ""
      }
      <div class="writeup-viewer-links">
        <a class="writeup-viewer-link" href="${writeup.sourceUrl}" target="_blank" rel="noreferrer">View on GitHub</a>
        <a class="writeup-viewer-link" href="${writeup.rawUrl}" target="_blank" rel="noreferrer">Open raw markdown</a>
      </div>
    </div>
    <section class="writeup-toc-panel" hidden>
      <p class="tool-label">On This Page</p>
      <nav class="writeup-toc" id="writeup-toc" aria-label="Writeup table of contents"></nav>
    </section>
    <div class="writeup-viewer-body markdown-body">${renderMarkdown(writeup.body, {
      path: writeup.path,
      githubConfig: state.githubConfig
    })}</div>
    <div class="writeup-viewer-footer">
      <div class="writeup-viewer-pagination">
        <button class="action secondary writeup-nav-button" type="button" data-writeup-path="${previousWriteup ? escapeAttribute(previousWriteup.path) : ""}" ${
          previousWriteup ? "" : "disabled"
        }>
          ${previousWriteup ? `Previous: ${escapeHtml(previousWriteup.title)}` : "Start of list"}
        </button>
        <button class="action secondary writeup-nav-button" type="button" data-writeup-path="${nextWriteup ? escapeAttribute(nextWriteup.path) : ""}" ${
          nextWriteup ? "" : "disabled"
        }>
          ${nextWriteup ? `Next: ${escapeHtml(nextWriteup.title)}` : "End of list"}
        </button>
      </div>
    </div>
  `;

  enhanceWriteupViewer(viewer);
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}.`);
  }
  return response.json();
};

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch markdown file (${response.status}).`);
  }
  return response.text();
};

const sortWriteups = (left, right) => {
  if (left.sortDate && right.sortDate && left.sortDate !== right.sortDate) {
    return right.sortDate.localeCompare(left.sortDate);
  }

  if (left.sortDate && !right.sortDate) return -1;
  if (!left.sortDate && right.sortDate) return 1;

  return left.title.localeCompare(right.title);
};

const buildWriteupRecord = async (file, folder, config) => {
  const rawUrl = file.download_url || getRawUrl(config, file.path);
  const markdown = await fetchText(rawUrl);
  const { metadata, body } = parseFrontMatter(markdown);
  const title = metadata.title || extractTitleFromBody(body, file.name);
  const summary = metadata.summary || extractSummaryFromBody(body);
  const tags = normalizeTags(metadata.tags);
  const displayDate = formatDate(metadata.date);
  const sortDate = metadata.date && !Number.isNaN(new Date(metadata.date).getTime()) ? new Date(metadata.date).toISOString() : "";

  return {
    body,
    folderKey: folder.key,
    folderLabel: detectWriteupLabel(file.name, folder.label),
    path: file.path,
    rawUrl,
    sourceUrl: file.html_url,
    summary,
    sortDate,
    tags,
    title,
    displayDate
  };
};

const loadFolderWriteups = async (folder, config) => {
  try {
    const contents = await fetchJson(getContentsApiUrl(config, folder.path));
    const markdownFiles = Array.isArray(contents)
      ? contents.filter(
          (entry) =>
            entry.type === "file" &&
            /\.md$/i.test(entry.name) &&
            !entry.name.startsWith(".") &&
            !entry.name.startsWith("_")
        )
      : [];

    if (!markdownFiles.length) {
      return { folder, writeups: [], error: "" };
    }

    const writeups = (await Promise.all(markdownFiles.map((file) => buildWriteupRecord(file, folder, config)))).sort(sortWriteups);
    return { folder, writeups, error: "" };
  } catch (error) {
    return {
      folder,
      writeups: [],
      error:
        error instanceof Error && error.message.includes("404")
          ? "Nothing here yet!"
          : error instanceof Error
            ? error.message
            : "Nothing here yet!"
    };
  }
};

const loadRepositoryWriteups = async () => {
  const groupsRoot = document.getElementById("writeup-groups");

  if (!(groupsRoot instanceof HTMLElement)) return;

  groupsRoot.innerHTML = "";
  state.writeupsByPath.clear();
  state.allWriteups = [];
  state.filteredWriteups = [];
  state.writeupSources = [];
  state.githubConfig = getRepoConfig();

  if (!state.githubConfig) {
    renderEmptyWriteupViewer("Writeups are unavailable right now.");
    return;
  }

  state.writeupSources = await Promise.all(portfolio.writeupFolders.map((folder) => loadFolderWriteups(folder, state.githubConfig)));
  state.allWriteups = state.writeupSources.flatMap((source) => source.writeups).sort(sortWriteups);
  state.allWriteups.forEach((writeup) => {
    state.writeupsByPath.set(writeup.path, writeup);
  });

  updateMetric("Writeups Ready", String(state.allWriteups.length).padStart(2, "0"));
  applyWriteupFilters();
};

setText("brand-name", portfolio.profile.name);
setText("brand-role", portfolio.profile.role);
setText("hero-eyebrow", portfolio.profile.eyebrow);
setText("hero-title", portfolio.profile.headline);
setText("hero-summary", portfolio.profile.summary);
setText("contact-heading", portfolio.profile.contactHeading);
setText("contact-summary", portfolio.profile.contactSummary);
syncRuntimeMetadata();

const heroActions = document.getElementById("hero-actions");
heroActions?.append(
  createAction(portfolio.profile.primaryAction, "primary"),
  createAction(portfolio.profile.secondaryAction, "secondary")
);

const contactActions = document.getElementById("contact-actions");
portfolio.profile.contactActions.forEach((action, index) => {
  contactActions?.append(createAction(action, index === 0 ? "primary" : "secondary"));
});

const heroMetrics = document.getElementById("hero-metrics");
portfolio.heroMetrics.forEach(({ label, value }) => {
  const item = document.createElement("div");
  item.dataset.metricLabel = label;
  item.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
  heroMetrics?.append(item);
});
void initialiseFootprintSnapshot();

window.addEventListener("resize", updateFootprintSnapshot, { passive: true });

const platformList = document.getElementById("platform-list");
portfolio.platformLinks.forEach((platform) =>
  platformList?.append(createPlatform({ title: platform.title, profileUrl: platform.href }))
);

const certificationGrid = document.getElementById("certification-grid");
portfolio.certifications.forEach((certification) => {
  certificationGrid?.append(createCertification(certification));
});

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const renderToolRows = (rows = []) =>
  rows
    .map(
      ({ label, value, matched = false }) => `
        <div class="tool-result-row${matched ? " is-match" : ""}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(String(value))}</strong>
        </div>
      `
    )
    .join("");

const renderToolError = (message) => `<p class="tool-error">${escapeHtml(message)}</p>`;

const setToolRows = (container, rows) => {
  if (container instanceof HTMLElement) {
    container.innerHTML = renderToolRows(rows);
  }
};

const setToolError = (container, message) => {
  if (container instanceof HTMLElement) {
    container.innerHTML = renderToolError(message);
  }
};

const clearToolContainer = (container) => {
  if (container instanceof HTMLElement) {
    container.innerHTML = "";
  }
};

const setButtonFeedback = (button, label, fallback = null, delay = 1200) => {
  if (!(button instanceof HTMLElement)) return;

  const nextLabel = fallback || button.textContent || "";
  button.textContent = label;
  window.setTimeout(() => {
    button.textContent = nextLabel;
  }, delay);
};

const copyTextToClipboard = async (value, button, defaultLabel = null) => {
  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);
    setButtonFeedback(button, "Copied", defaultLabel);
    return true;
  } catch {
    setButtonFeedback(button, "Copy Failed", defaultLabel);
    return false;
  }
};

const formatNumber = (value) => Number(value).toLocaleString("en-GB");

const formatDateTime = (value) =>
  value.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium"
  });

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return "Unknown";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const truncateText = (value, length = 64) =>
  value.length > length ? `${value.slice(0, Math.max(0, length - 1))}\u2026` : value;

const sanitizeAliasPart = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const titleCase = (value) =>
  value.replace(/\b\w/g, (character) => character.toUpperCase());

const bytesToHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const bytesToBase64 = (bytes) => {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const base64ToBytes = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const digestHex = async (algorithm, buffer) => {
  const digest = await crypto.subtle.digest(algorithm, buffer);
  return bytesToHex(new Uint8Array(digest));
};

const md5ShiftSchedule = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
  14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  6, 10, 15, 21
];

const md5Constants = Array.from({ length: 64 }, (_, index) =>
  Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0
);

const add32 = (left, right) => (left + right) >>> 0;
const rotateLeft = (value, bits) => ((value << bits) | (value >>> (32 - bits))) >>> 0;

const md5Hex = (input) => {
  const source = input instanceof Uint8Array ? input : new Uint8Array(input);
  const bitLength = source.length * 8;
  const paddedLength = (((source.length + 9 + 63) >> 6) << 6) >>> 0;
  const buffer = new Uint8Array(paddedLength);

  buffer.set(source);
  buffer[source.length] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000) >>> 0, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    const words = Array.from({ length: 16 }, (_, index) => view.getUint32(offset + index * 4, true));
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f;
      let wordIndex;

      if (index < 16) {
        f = (b & c) | (~b & d);
        wordIndex = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        wordIndex = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        wordIndex = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        wordIndex = (7 * index) % 16;
      }

      const nextD = d;
      d = c;
      c = b;

      const mix = add32(add32(add32(a, f >>> 0), md5Constants[index]), words[wordIndex] >>> 0);
      b = add32(b, rotateLeft(mix, md5ShiftSchedule[index]));
      a = nextD;
    }

    a0 = add32(a0, a);
    b0 = add32(b0, b);
    c0 = add32(c0, c);
    d0 = add32(d0, d);
  }

  return [a0, b0, c0, d0]
    .map((word) => [word & 255, (word >>> 8) & 255, (word >>> 16) & 255, (word >>> 24) & 255])
    .flat()
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const computeHashSet = async (buffer) => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  return {
    MD5: md5Hex(bytes),
    "SHA-1": await digestHex("SHA-1", bytes),
    "SHA-256": await digestHex("SHA-256", bytes),
    "SHA-512": await digestHex("SHA-512", bytes)
  };
};

const passwordLength = document.getElementById("password-length");
const passwordLengthValue = document.getElementById("password-length-value");
const passwordUppercase = document.getElementById("password-uppercase");
const passwordLowercase = document.getElementById("password-lowercase");
const passwordNumbers = document.getElementById("password-numbers");
const passwordSymbols = document.getElementById("password-symbols");
const passwordOutput = document.getElementById("password-output");
const passwordStrengthResults = document.getElementById("password-strength-results");
const generatePasswordButton = document.getElementById("generate-password");
const copyPasswordButton = document.getElementById("copy-password");

const getPasswordGroups = () => {
  const groups = [];
  if (passwordUppercase instanceof HTMLInputElement && passwordUppercase.checked) groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (passwordLowercase instanceof HTMLInputElement && passwordLowercase.checked) groups.push("abcdefghijklmnopqrstuvwxyz");
  if (passwordNumbers instanceof HTMLInputElement && passwordNumbers.checked) groups.push("0123456789");
  if (passwordSymbols instanceof HTMLInputElement && passwordSymbols.checked) groups.push("!@#$%^&*()-_=+[]{};:,.?/|~");
  return groups;
};

const scorePassword = (value) => {
  let pool = 0;
  if (/[A-Z]/.test(value)) pool += 26;
  if (/[a-z]/.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^A-Za-z0-9]/.test(value)) pool += 33;
  if (/[^\u0000-\u007f]/.test(value)) pool += 128;

  const entropy = pool ? value.length * Math.log2(pool) : 0;
  let assessment = "Weak";

  if (entropy >= 90) assessment = "Excellent";
  else if (entropy >= 70) assessment = "Strong";
  else if (entropy >= 50) assessment = "Moderate";
  else if (entropy >= 35) assessment = "Fair";

  return { entropy, pool, assessment };
};

const renderPasswordStrength = () => {
  if (!(passwordOutput instanceof HTMLTextAreaElement) || !(passwordStrengthResults instanceof HTMLElement)) return;

  const value = passwordOutput.value.trim();
  if (!value) {
    clearToolContainer(passwordStrengthResults);
    return;
  }

  const { entropy, pool, assessment } = scorePassword(value);
  setToolRows(passwordStrengthResults, [
    { label: "Length", value: String(value.length) },
    { label: "Character Pool", value: pool ? String(pool) : "Unknown" },
    { label: "Entropy", value: `${entropy.toFixed(1)} bits` },
    { label: "Assessment", value: assessment }
  ]);
};

const updatePasswordLengthLabel = () => {
  if (passwordLength instanceof HTMLInputElement && passwordLengthValue instanceof HTMLElement) {
    passwordLengthValue.textContent = passwordLength.value;
  }
};

const generatePassword = () => {
  if (!(passwordOutput instanceof HTMLTextAreaElement)) return;

  const groups = getPasswordGroups();
  if (!groups.length) {
    passwordOutput.value = "";
    setToolError(passwordStrengthResults, "Select at least one character set.");
    return;
  }

  const length = passwordLength instanceof HTMLInputElement ? clamp(Number(passwordLength.value) || 20, 8, 64) : 20;
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  const required = groups.map((group, index) => group[values[index] % group.length]);
  const pool = groups.join("");
  const remaining = Array.from({ length: Math.max(0, length - required.length) }, (_, index) => {
    const randomValue = values[index + required.length];
    return pool[randomValue % pool.length];
  });

  const combined = [...required, ...remaining];
  for (let index = combined.length - 1; index > 0; index -= 1) {
    const swapIndex = values[index % values.length] % (index + 1);
    [combined[index], combined[swapIndex]] = [combined[swapIndex], combined[index]];
  }

  passwordOutput.value = combined.join("");
  renderPasswordStrength();
};

generatePasswordButton?.addEventListener("click", generatePassword);

copyPasswordButton?.addEventListener("click", async () => {
  if (!(passwordOutput instanceof HTMLTextAreaElement)) return;
  await copyTextToClipboard(passwordOutput.value.trim(), copyPasswordButton, "Copy");
});

const subnetInput = document.getElementById("subnet-input");
const subnetResults = document.getElementById("subnet-results");
const calculateSubnetButton = document.getElementById("calculate-subnet");

const ipv4ToInt = (ipv4) => {
  const octets = ipv4.split(".").map((part) => Number(part));
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return null;
  }

  return (((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + octets[3]) >>> 0;
};

const intToIpv4 = (value) =>
  [24, 16, 8, 0].map((shift) => String((value >>> shift) & 255)).join(".");

const cidrToMask = (cidr) => (cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0));

const renderSubnetResults = () => {
  if (!(subnetInput instanceof HTMLInputElement) || !(subnetResults instanceof HTMLElement)) return;

  const raw = subnetInput.value.trim();
  const match = raw.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d|[12]\d|3[0-2])$/);
  if (!match) {
    setToolError(subnetResults, "Enter a valid IPv4 CIDR such as 192.168.1.10/24.");
    return;
  }

  const address = ipv4ToInt(match[1]);
  const cidr = Number(match[2]);
  if (address === null) {
    setToolError(subnetResults, "The IPv4 address is not valid.");
    return;
  }

  const mask = cidrToMask(cidr);
  const wildcard = (~mask >>> 0) >>> 0;
  const network = (address & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalAddresses = 2 ** (32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : Math.max(0, totalAddresses - 2);
  const firstHost = cidr >= 31 ? "N/A" : intToIpv4((network + 1) >>> 0);
  const lastHost = cidr >= 31 ? "N/A" : intToIpv4((broadcast - 1) >>> 0);

  setToolRows(subnetResults, [
    { label: "Subnet Mask", value: intToIpv4(mask) },
    { label: "Wildcard Mask", value: intToIpv4(wildcard) },
    { label: "Network", value: intToIpv4(network) },
    { label: "Broadcast", value: intToIpv4(broadcast) },
    { label: "Usable Range", value: `${firstHost} - ${lastHost}` },
    { label: "Usable Hosts", value: formatNumber(usableHosts) },
    { label: "Total Addresses", value: formatNumber(totalAddresses) }
  ]);
};

calculateSubnetButton?.addEventListener("click", renderSubnetResults);
subnetInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    renderSubnetResults();
  }
});

if (passwordLength instanceof HTMLInputElement) {
  updatePasswordLengthLabel();
  passwordLength.addEventListener("input", () => {
    updatePasswordLengthLabel();
    generatePassword();
  });
}

[passwordUppercase, passwordLowercase, passwordNumbers, passwordSymbols].forEach((input) => {
  input?.addEventListener("change", generatePassword);
});

passwordOutput?.addEventListener("input", renderPasswordStrength);
generatePassword();

const aliasFirstName = document.getElementById("alias-first-name");
const aliasLastName = document.getElementById("alias-last-name");
const aliasKeyword = document.getElementById("alias-keyword");
const aliasResults = document.getElementById("alias-results");
const generateAliasButton = document.getElementById("generate-alias");
const generateRandomAliasButton = document.getElementById("generate-random-alias");

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomAliasKeyword = () =>
  sanitizeAliasPart(randomItem(["intel", "ghost", "labs", "cipher", "vector", "signal", "osint", "ops"]));

const fillRandomAliasSeed = () => {
  if (aliasFirstName instanceof HTMLInputElement) aliasFirstName.value = randomItem(personaNames.firstNames);
  if (aliasLastName instanceof HTMLInputElement) aliasLastName.value = randomItem(personaNames.lastNames);
  if (aliasKeyword instanceof HTMLInputElement) aliasKeyword.value = randomAliasKeyword();
};

const generateAliasPersona = () => {
  if (!(aliasResults instanceof HTMLElement)) return;

  if (
    aliasFirstName instanceof HTMLInputElement &&
    aliasLastName instanceof HTMLInputElement &&
    aliasKeyword instanceof HTMLInputElement &&
    !aliasFirstName.value.trim() &&
    !aliasLastName.value.trim() &&
    !aliasKeyword.value.trim()
  ) {
    fillRandomAliasSeed();
  }

  const first = aliasFirstName instanceof HTMLInputElement ? sanitizeAliasPart(aliasFirstName.value) : "";
  const last = aliasLastName instanceof HTMLInputElement ? sanitizeAliasPart(aliasLastName.value) : "";
  const keyword = aliasKeyword instanceof HTMLInputElement ? sanitizeAliasPart(aliasKeyword.value) : "";

  if (!first && !last && !keyword) {
    setToolError(aliasResults, "Add at least one seed value to generate permutations.");
    return;
  }

  const seedKeyword = keyword || randomAliasKeyword();
  const seedFirst = first || randomItem(personaNames.firstNames).toLowerCase();
  const seedLast = last || randomItem(personaNames.lastNames).toLowerCase();
  const suffix = String(randomNumber(11, 98));
  const displayName = `${titleCase(seedFirst)} ${titleCase(seedLast)}`.trim();
  const handleVariants = Array.from(
    new Set([
      `${seedFirst}${seedLast}`,
      `${seedFirst}.${seedLast}`,
      `${seedFirst}_${seedLast}`,
      `${seedKeyword}${seedFirst}${suffix}`,
      `${seedFirst}${seedLast.charAt(0)}${suffix}`,
      `${seedFirst.charAt(0)}${seedLast}${suffix}`,
      `${seedKeyword}_${seedLast}`,
      `${seedKeyword}${suffix}`
    ].filter(Boolean))
  );
  const emailVariants = Array.from(
    new Set([
      `${seedFirst}.${seedLast}${suffix}@proton.me`,
      `${seedFirst}${suffix}.${seedKeyword}@pm.me`,
      `${seedKeyword}.${seedLast}${suffix}@protonmail.com`
    ].filter(Boolean))
  );

  setToolRows(aliasResults, [
    { label: "Display Name", value: displayName || titleCase(seedKeyword) },
    { label: "Handle 01", value: `@${handleVariants[0]}` },
    { label: "Handle 02", value: `@${handleVariants[1]}` },
    { label: "Handle 03", value: `@${handleVariants[2]}` },
    { label: "Email 01", value: emailVariants[0] },
    { label: "Email 02", value: emailVariants[1] },
    { label: "Email 03", value: emailVariants[2] },
    { label: "Slug", value: `${seedKeyword}-${seedFirst}-${seedLast}`.replace(/-+/g, "-").replace(/^-|-$/g, "") }
  ]);
};

generateAliasButton?.addEventListener("click", generateAliasPersona);
generateRandomAliasButton?.addEventListener("click", () => {
  fillRandomAliasSeed();
  generateAliasPersona();
});
generateAliasPersona();

const hashInput = document.getElementById("hash-input");
const hashCompare = document.getElementById("hash-compare");
const hashResults = document.getElementById("hash-results");
const hashTextButton = document.getElementById("hash-text");

const normalizeDigest = (value) => value.trim().replace(/\s+/g, "").toLowerCase();

const renderHashResults = async () => {
  if (!(hashInput instanceof HTMLTextAreaElement) || !(hashResults instanceof HTMLElement)) return;

  const source = hashInput.value;
  if (!source.trim()) {
    setToolError(hashResults, "Add text to hash before running verification.");
    return;
  }

  const originalLabel = hashTextButton?.textContent || "Hash Text";
  if (hashTextButton instanceof HTMLElement) {
    hashTextButton.textContent = "Hashing...";
  }

  try {
    const digests = await computeHashSet(textEncoder.encode(source));
    const comparison = hashCompare instanceof HTMLInputElement ? normalizeDigest(hashCompare.value) : "";
    const matchingAlgorithms = Object.entries(digests)
      .filter(([, digest]) => comparison && digest.toLowerCase() === comparison)
      .map(([algorithm]) => algorithm);

    const rows = [
      ...(comparison
        ? [
            {
              label: "Compare Status",
              value: matchingAlgorithms.length ? `Matched ${matchingAlgorithms.join(", ")}` : "No matching digest"
            }
          ]
        : []),
      ...Object.entries(digests).map(([algorithm, digest]) => ({
        label: algorithm,
        value: digest,
        matched: matchingAlgorithms.includes(algorithm)
      }))
    ];

    setToolRows(hashResults, rows);
  } catch (error) {
    setToolError(hashResults, error instanceof Error ? error.message : "Unable to hash the provided text.");
  } finally {
    if (hashTextButton instanceof HTMLElement) {
      hashTextButton.textContent = originalLabel;
    }
  }
};

hashTextButton?.addEventListener("click", () => {
  void renderHashResults();
});

const codecMode = document.getElementById("codec-mode");
const codecInput = document.getElementById("codec-input");
const codecOutput = document.getElementById("codec-output");
const codecEncodeButton = document.getElementById("codec-encode");
const codecDecodeButton = document.getElementById("codec-decode");
const codecSwapButton = document.getElementById("codec-swap");
const codecCopyButton = document.getElementById("codec-copy");

const getCodecMode = () =>
  codecMode instanceof HTMLElement
    ? codecMode.querySelector(".tool-mode-option.is-active")?.getAttribute("data-codec-mode") || "base64"
    : "base64";

const setCodecMode = (mode) => {
  if (!(codecMode instanceof HTMLElement)) return;

  codecMode.querySelectorAll(".tool-mode-option").forEach((button) => {
    const isActive = button.getAttribute("data-codec-mode") === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
};

const encodeCodecValue = (mode, input) => {
  if (mode === "base64") return bytesToBase64(textEncoder.encode(input));
  if (mode === "url") return encodeURIComponent(input);
  if (mode === "hex") return bytesToHex(textEncoder.encode(input));
  if (mode === "html") {
    const element = document.createElement("textarea");
    element.textContent = input;
    return element.innerHTML;
  }
  return input;
};

const decodeCodecValue = (mode, input) => {
  if (mode === "base64") return textDecoder.decode(base64ToBytes(input));
  if (mode === "url") return decodeURIComponent(input);
  if (mode === "hex") {
    const normalized = input.replace(/\s+/g, "");
    if (!normalized || normalized.length % 2 !== 0 || /[^0-9a-f]/i.test(normalized)) {
      throw new Error("Hex input must contain an even number of hexadecimal characters.");
    }

    const bytes = Uint8Array.from(
      normalized.match(/.{2}/g) || [],
      (segment) => Number.parseInt(segment, 16)
    );
    return textDecoder.decode(bytes);
  }
  if (mode === "html") {
    const element = document.createElement("textarea");
    element.innerHTML = input;
    return element.value;
  }
  return input;
};

const runCodec = (direction) => {
  if (
    !(codecMode instanceof HTMLElement) ||
    !(codecInput instanceof HTMLTextAreaElement) ||
    !(codecOutput instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  try {
    const mode = getCodecMode();
    codecOutput.value =
      direction === "encode"
        ? encodeCodecValue(mode, codecInput.value)
        : decodeCodecValue(mode, codecInput.value);
  } catch (error) {
    codecOutput.value = `Error: ${error instanceof Error ? error.message : "Codec conversion failed."}`;
  }
};

codecMode?.addEventListener("click", (event) => {
  const button = event.target instanceof Element ? event.target.closest(".tool-mode-option") : null;
  if (!(button instanceof HTMLElement)) return;
  setCodecMode(button.getAttribute("data-codec-mode") || "base64");
});

codecEncodeButton?.addEventListener("click", () => runCodec("encode"));
codecDecodeButton?.addEventListener("click", () => runCodec("decode"));
codecSwapButton?.addEventListener("click", () => {
  if (!(codecInput instanceof HTMLTextAreaElement) || !(codecOutput instanceof HTMLTextAreaElement)) return;
  const nextInput = codecOutput.value;
  codecOutput.value = codecInput.value;
  codecInput.value = nextInput;
});
codecCopyButton?.addEventListener("click", async () => {
  if (!(codecOutput instanceof HTMLTextAreaElement)) return;
  await copyTextToClipboard(codecOutput.value, codecCopyButton, "Copy Output");
});

const jwtInput = document.getElementById("jwt-input");
const jwtResults = document.getElementById("jwt-results");
const jwtHeaderOutput = document.getElementById("jwt-header-output");
const jwtPayloadOutput = document.getElementById("jwt-payload-output");
const decodeJwtButton = document.getElementById("decode-jwt");

const formatUnixTimestamp = (value) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return "N/A";
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? "N/A" : `${formatDateTime(date)} / ${date.toUTCString()}`;
};

const decodeJwtSegment = (segment) => JSON.parse(textDecoder.decode(base64ToBytes(segment)));

const decodeJwt = () => {
  if (
    !(jwtInput instanceof HTMLTextAreaElement) ||
    !(jwtResults instanceof HTMLElement) ||
    !(jwtHeaderOutput instanceof HTMLElement) ||
    !(jwtPayloadOutput instanceof HTMLElement)
  ) {
    return;
  }

  const token = jwtInput.value.trim();
  if (!token) {
    setToolError(jwtResults, "Paste a JWT to decode it locally.");
    jwtHeaderOutput.textContent = "";
    jwtPayloadOutput.textContent = "";
    return;
  }

  try {
    const segments = token.split(".");
    if (segments.length < 2) {
      throw new Error("JWTs require at least a header and payload segment.");
    }

    const header = decodeJwtSegment(segments[0]);
    const payload = decodeJwtSegment(segments[1]);
    const now = Date.now() / 1000;
    let status = "No expiry claim";

    if (typeof payload.nbf === "number" && now < payload.nbf) {
      status = "Not yet valid";
    } else if (typeof payload.exp === "number") {
      status = now > payload.exp ? "Expired" : "Active";
    }

    setToolRows(jwtResults, [
      { label: "Status", value: status },
      { label: "Algorithm", value: header.alg || "Unknown" },
      { label: "Type", value: header.typ || "JWT" },
      { label: "Signature", value: segments[2] ? "Present" : "Missing" },
      { label: "Issued", value: formatUnixTimestamp(payload.iat) },
      { label: "Expires", value: formatUnixTimestamp(payload.exp) },
      { label: "Not Before", value: formatUnixTimestamp(payload.nbf) },
      { label: "Subject", value: payload.sub || "N/A" },
      { label: "Issuer", value: payload.iss || "N/A" }
    ]);

    jwtHeaderOutput.textContent = JSON.stringify(header, null, 2);
    jwtPayloadOutput.textContent = JSON.stringify(payload, null, 2);
  } catch (error) {
    setToolError(jwtResults, error instanceof Error ? error.message : "Unable to decode the supplied JWT.");
    jwtHeaderOutput.textContent = "";
    jwtPayloadOutput.textContent = "";
  }
};

decodeJwtButton?.addEventListener("click", decodeJwt);

const fileInspectorInput = document.getElementById("file-inspector-input");
const fileInspectorResults = document.getElementById("file-inspector-results");
const inspectFileButton = document.getElementById("inspect-file");

const inspectFile = async () => {
  if (
    !(fileInspectorInput instanceof HTMLInputElement) ||
    !(fileInspectorResults instanceof HTMLElement) ||
    !(fileInspectorInput.files?.length)
  ) {
    setToolError(fileInspectorResults, "Choose a local file to inspect it.");
    return;
  }

  const [file] = fileInspectorInput.files;
  const originalLabel = inspectFileButton?.textContent || "Inspect File";
  if (inspectFileButton instanceof HTMLElement) {
    inspectFileButton.textContent = "Inspecting...";
  }

  try {
    const buffer = await file.arrayBuffer();
    const hashes = await computeHashSet(buffer);

    setToolRows(fileInspectorResults, [
      { label: "Filename", value: file.name },
      { label: "Type", value: file.type || "Unknown" },
      { label: "Size", value: `${formatBytes(file.size)} (${formatNumber(file.size)} bytes)` },
      { label: "Last Modified", value: formatDateTime(new Date(file.lastModified)) },
      ...Object.entries(hashes).map(([algorithm, digest]) => ({ label: algorithm, value: digest }))
    ]);
  } catch (error) {
    setToolError(fileInspectorResults, error instanceof Error ? error.message : "Unable to inspect the selected file.");
  } finally {
    if (inspectFileButton instanceof HTMLElement) {
      inspectFileButton.textContent = originalLabel;
    }
  }
};

inspectFileButton?.addEventListener("click", () => {
  void inspectFile();
});

const totpSecret = document.getElementById("totp-secret");
const totpPeriod = document.getElementById("totp-period");
const totpOutput = document.getElementById("totp-output");
const totpResults = document.getElementById("totp-results");
const generateTotpButton = document.getElementById("generate-totp");
const copyTotpButton = document.getElementById("copy-totp");

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const totpState = {
  bytes: null,
  timerId: 0
};

const base32Decode = (value) => {
  const normalized = value.toUpperCase().replace(/=+$/g, "").replace(/[\s-]+/g, "");
  if (!normalized) throw new Error("Enter a Base32 secret first.");

  let bits = 0;
  let accumulator = 0;
  const output = [];

  for (const character of normalized) {
    const index = base32Alphabet.indexOf(character);
    if (index === -1) {
      throw new Error("The secret must use valid Base32 characters.");
    }

    accumulator = (accumulator << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((accumulator >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
};

const generateTotpCode = async (secretBytes, counter, digits = 6) => {
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const counterBytes = new Uint8Array(8);
  let workingCounter = counter;

  for (let index = 7; index >= 0; index -= 1) {
    counterBytes[index] = workingCounter & 0xff;
    workingCounter = Math.floor(workingCounter / 256);
  }

  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** digits).padStart(digits, "0");
};

const stopTotpTicker = () => {
  if (totpState.timerId) {
    window.clearInterval(totpState.timerId);
    totpState.timerId = 0;
  }
};

const refreshTotp = async () => {
  if (!(totpOutput instanceof HTMLElement) || !(totpResults instanceof HTMLElement) || !totpState.bytes) return;

  const periodValue =
    totpPeriod instanceof HTMLInputElement ? clamp(Number(totpPeriod.value) || 30, 15, 120) : 30;
  const unixTime = Math.floor(Date.now() / 1000);
  const counter = Math.floor(unixTime / periodValue);
  const refreshIn = periodValue - (unixTime % periodValue);

  try {
    const code = await generateTotpCode(totpState.bytes, counter);
    totpOutput.textContent = code;
    setToolRows(totpResults, [
      { label: "Period", value: `${periodValue} seconds` },
      { label: "Refresh In", value: `${refreshIn}s` },
      { label: "Counter", value: String(counter) }
    ]);
  } catch (error) {
    stopTotpTicker();
    totpOutput.textContent = "------";
    setToolError(totpResults, error instanceof Error ? error.message : "Unable to generate the TOTP code.");
  }
};

const startTotp = async () => {
  if (!(totpSecret instanceof HTMLInputElement) || !(totpOutput instanceof HTMLElement)) return;

  try {
    totpState.bytes = base32Decode(totpSecret.value);
    stopTotpTicker();
    await refreshTotp();
    totpState.timerId = window.setInterval(() => {
      void refreshTotp();
    }, 1000);
  } catch (error) {
    stopTotpTicker();
    totpState.bytes = null;
    totpOutput.textContent = "------";
    setToolError(totpResults, error instanceof Error ? error.message : "Unable to generate the TOTP code.");
  }
};

generateTotpButton?.addEventListener("click", () => {
  void startTotp();
});

copyTotpButton?.addEventListener("click", async () => {
  if (!(totpOutput instanceof HTMLElement)) return;
  const value = totpOutput.textContent?.trim();
  if (!value || value.includes("-")) return;
  await copyTextToClipboard(value, copyTotpButton, "Copy Code");
});

totpPeriod?.addEventListener("change", () => {
  if (totpState.bytes) {
    void startTotp();
  }
});

const timestampInput = document.getElementById("timestamp-input");
const timestampResults = document.getElementById("timestamp-results");
const convertTimestampButton = document.getElementById("convert-timestamp");

const parseTimestampValue = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^-?\d+$/.test(trimmed)) {
    const digits = trimmed.replace(/^-/, "").length;
    const numeric = Number(trimmed);
    if (!Number.isFinite(numeric)) return null;

    return {
      kind: digits > 10 ? "Epoch Milliseconds" : "Epoch Seconds",
      date: new Date(digits > 10 ? numeric : numeric * 1000)
    };
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  return { kind: "Date String", date: parsed };
};

const convertTimestamp = () => {
  if (!(timestampInput instanceof HTMLInputElement) || !(timestampResults instanceof HTMLElement)) return;

  const parsed = parseTimestampValue(timestampInput.value);
  if (!parsed || Number.isNaN(parsed.date.getTime())) {
    setToolError(timestampResults, "Enter a Unix epoch or a valid date string to convert it.");
    return;
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
  setToolRows(timestampResults, [
    { label: "Detected", value: parsed.kind },
    { label: "Unix Seconds", value: String(Math.floor(parsed.date.getTime() / 1000)) },
    { label: "Unix Milliseconds", value: String(parsed.date.getTime()) },
    { label: "ISO 8601", value: parsed.date.toISOString() },
    { label: "UTC", value: parsed.date.toUTCString() },
    { label: "Local", value: formatDateTime(parsed.date) },
    { label: "Timezone", value: timezone }
  ]);
};

convertTimestampButton?.addEventListener("click", convertTimestamp);
timestampInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    convertTimestamp();
  }
});

const regexPattern = document.getElementById("regex-pattern");
const regexInput = document.getElementById("regex-input");
const regexResults = document.getElementById("regex-results");
const regexPreview = document.getElementById("regex-preview");
const runRegexButton = document.getElementById("run-regex");

const getRegexFlags = () =>
  [
    ["g", document.getElementById("regex-flag-g")],
    ["i", document.getElementById("regex-flag-i")],
    ["m", document.getElementById("regex-flag-m")],
    ["s", document.getElementById("regex-flag-s")],
    ["u", document.getElementById("regex-flag-u")]
  ]
    .filter(([, input]) => input instanceof HTMLInputElement && input.checked)
    .map(([flag]) => flag)
    .join("");

const collectRegexMatches = (regex, value) => {
  const matches = [];

  if (regex.global) {
    let match;
    while ((match = regex.exec(value)) && matches.length < 100) {
      matches.push(match);
      if (match[0] === "") {
        regex.lastIndex += 1;
      }
    }
    return matches;
  }

  const single = regex.exec(value);
  return single ? [single] : [];
};

const highlightRegexMatches = (value, pattern, flags) => {
  const highlightFlags = flags.includes("g") ? flags : `${flags}g`;
  const regex = new RegExp(pattern, highlightFlags);
  const fragments = [];
  let cursor = 0;
  let match;
  let safetyCounter = 0;

  while ((match = regex.exec(value)) && safetyCounter < 200) {
    if (match[0] === "") {
      regex.lastIndex += 1;
      safetyCounter += 1;
      continue;
    }

    fragments.push(escapeHtml(value.slice(cursor, match.index)));
    fragments.push(`<mark>${escapeHtml(match[0])}</mark>`);
    cursor = match.index + match[0].length;
    safetyCounter += 1;
  }

  fragments.push(escapeHtml(value.slice(cursor)));
  return fragments.join("");
};

const runRegexTest = () => {
  if (
    !(regexPattern instanceof HTMLInputElement) ||
    !(regexInput instanceof HTMLTextAreaElement) ||
    !(regexResults instanceof HTMLElement) ||
    !(regexPreview instanceof HTMLElement)
  ) {
    return;
  }

  const pattern = regexPattern.value;
  const text = regexInput.value;
  const flags = getRegexFlags();

  if (!pattern) {
    setToolError(regexResults, "Enter a regex pattern before running the tester.");
    regexPreview.textContent = "";
    return;
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches = collectRegexMatches(regex, text);
    const rows = [
      { label: "Flags", value: flags || "(none)" },
      { label: "Match Count", value: String(matches.length) }
    ];

    matches.slice(0, 6).forEach((match, index) => {
      const captures = match
        .slice(1)
        .filter((group) => group !== undefined)
        .map((group) => truncateText(String(group), 24));
      rows.push({
        label: `Match ${index + 1} @ ${match.index}`,
        value: captures.length
          ? `${truncateText(match[0], 24)} | ${captures.join(", ")}`
          : truncateText(match[0], 36)
      });
    });

    if (matches.length > 6) {
      rows.push({ label: "Additional Matches", value: String(matches.length - 6) });
    }

    setToolRows(regexResults, rows);
    regexPreview.innerHTML = text ? highlightRegexMatches(text, pattern, flags) : "No input text supplied.";
  } catch (error) {
    setToolError(regexResults, error instanceof Error ? error.message : "Unable to execute the regex.");
    regexPreview.textContent = "";
  }
};

runRegexButton?.addEventListener("click", runRegexTest);

const writeupSearch = document.getElementById("writeup-search");
const writeupFilterClear = document.getElementById("writeup-filter-clear");
const compactMobileQuery = window.matchMedia("(max-width: 960px)");
const siteHeader = document.querySelector(".site-header");
const primaryNavLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const mobileNavTargetIds = ["tools", "presence", "contact"];
const mobileNavTargets = new Set(mobileNavTargetIds);

const setActiveNavLink = (sectionId = "") => {
  primaryNavLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = mobileNavTargets.has(sectionId) && href === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const syncActiveMobileNav = () => {
  if (!compactMobileQuery.matches) return;

  const activationLine = window.innerHeight * 0.42;
  const activeSection = mobileNavTargetIds.find((sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    const rect = section.getBoundingClientRect();
    return rect.top <= activationLine && rect.bottom > activationLine;
  });

  setActiveNavLink(activeSection || "");
};

const syncHeaderOffset = () => {
  if (siteHeader instanceof HTMLElement) {
    document.documentElement.style.setProperty("--header-offset", `${siteHeader.offsetHeight}px`);
  }
};

const syncViewportMode = () => {
  document.body.classList.toggle("mobile-lite", compactMobileQuery.matches);
  syncHeaderOffset();
  if (!compactMobileQuery.matches) {
    setActiveNavLink("");
  } else {
    syncActiveMobileNav();
  }
};

const ensureDesktopWriteupsLoaded = () => {
  if (!compactMobileQuery.matches && !state.writeupSources.length) {
    void loadRepositoryWriteups();
  }
};

writeupSearch?.addEventListener("input", (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  state.writeupFilters.query = event.target.value;
  applyWriteupFilters();
});

writeupFilterClear?.addEventListener("click", () => {
  state.writeupFilters = {
    query: "",
    folder: "all",
    tag: "all"
  };

  if (writeupSearch instanceof HTMLInputElement) {
    writeupSearch.value = "";
  }

  applyWriteupFilters();
});

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest(".writeup-item") : null;
  if (!target) return;

  const writeup = state.writeupsByPath.get(target.dataset.writeupPath || "");
  if (writeup) {
    renderWriteup(writeup);
  }
});

document.addEventListener("click", (event) => {
  const folderFilter = event.target instanceof Element ? event.target.closest("[data-folder-filter]") : null;
  if (folderFilter instanceof HTMLElement) {
    state.writeupFilters.folder = folderFilter.getAttribute("data-folder-filter") || "all";
    applyWriteupFilters();
    return;
  }

  const tagFilter = event.target instanceof Element ? event.target.closest("[data-tag-filter]") : null;
  if (tagFilter instanceof HTMLElement) {
    state.writeupFilters.tag = tagFilter.getAttribute("data-tag-filter") || "all";
    applyWriteupFilters();
  }
});

syncViewportMode();
ensureDesktopWriteupsLoaded();

const handleViewportChange = () => {
  const wasCompact = document.body.classList.contains("mobile-lite");
  syncViewportMode();
  if (wasCompact && !compactMobileQuery.matches) {
    ensureDesktopWriteupsLoaded();
  }
};

if (typeof compactMobileQuery.addEventListener === "function") {
  compactMobileQuery.addEventListener("change", handleViewportChange);
} else if (typeof compactMobileQuery.addListener === "function") {
  compactMobileQuery.addListener(handleViewportChange);
}

window.addEventListener("resize", syncHeaderOffset, { passive: true });

primaryNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const sectionId = (link.getAttribute("href") || "").replace("#", "");
    if (compactMobileQuery.matches) {
      setActiveNavLink(sectionId);
      window.setTimeout(syncActiveMobileNav, 720);
    }
  });
});

let mobileNavRaf = 0;
window.addEventListener(
  "scroll",
  () => {
    if (!compactMobileQuery.matches || mobileNavRaf) return;
    mobileNavRaf = window.requestAnimationFrame(() => {
      mobileNavRaf = 0;
      syncActiveMobileNav();
    });
  },
  { passive: true }
);

if ("IntersectionObserver" in window) {
  const mobileNavObserver = new IntersectionObserver(
    () => syncActiveMobileNav(),
    { rootMargin: "-38% 0px -52% 0px", threshold: [0.12, 0.28, 0.5] }
  );

  mobileNavTargetIds.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) mobileNavObserver.observe(section);
  });
}

const themeToggle = document.getElementById("theme-toggle");
const setTheme = (theme) => {
  document.body.classList.toggle("light-mode", theme === "light");
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  const label = themeToggle?.querySelector(".theme-toggle-label");
  if (label) {
    label.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
  }
};

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  setTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
});

const revealTargets = document.querySelectorAll("[data-reveal]");
if (revealTargets.length && "IntersectionObserver" in window) {
  document.body.classList.add("motion-ready");
  const revealAll = () => {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((target) => {
    if (target.getBoundingClientRect().top <= window.innerHeight * 0.92) {
      target.classList.add("is-visible");
    }
    observer.observe(target);
  });

  window.setTimeout(revealAll, 1500);
}
