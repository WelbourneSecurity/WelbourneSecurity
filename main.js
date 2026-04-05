import { portfolio } from "./content.js";
import { personaLocations, personaNames } from "./persona-data.js";

const state = {
  activeWriteupPath: "",
  githubConfig: null,
  writeupsByPath: new Map()
};

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
  const link = document.createElement("a");
  link.className = "certification-link";
  link.href = verificationUrl;
  link.target = "_blank";
  link.rel = "noreferrer";

  const image = document.createElement("img");
  image.className = "certification-image";
  image.src = imagePath;
  image.alt = title;
  image.loading = "lazy";

  link.append(image);
  return link;
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

const updateActiveWriteupItem = () => {
  document.querySelectorAll(".writeup-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.writeupPath === state.activeWriteupPath);
  });
};

const renderWriteup = (writeup) => {
  const viewer = document.getElementById("writeup-viewer");
  if (!viewer) return;

  state.activeWriteupPath = writeup.path;
  updateActiveWriteupItem();

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
    <div class="writeup-viewer-body markdown-body">${renderMarkdown(writeup.body, {
      path: writeup.path,
      githubConfig: state.githubConfig
    })}</div>
  `;
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

const loadFolderWriteups = async (folder, container, config) => {
  setGroupState(container, "Checking repository folder...");

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
      setGroupState(container, "Nothing here yet!");
      return [];
    }

    const writeups = (await Promise.all(markdownFiles.map((file) => buildWriteupRecord(file, folder, config)))).sort(sortWriteups);

    container.innerHTML = "";

    writeups.forEach((writeup) => {
      state.writeupsByPath.set(writeup.path, writeup);
      container.append(createWriteupItem(writeup));
    });

    return writeups;
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("404")
        ? "Nothing here yet!"
        : error instanceof Error
          ? error.message
          : "Nothing here yet!";

    setGroupState(container, message, "error");
    return [];
  }
};

const loadRepositoryWriteups = async () => {
  const groupsRoot = document.getElementById("writeup-groups");
  const viewer = document.getElementById("writeup-viewer");

  if (!groupsRoot || !viewer) return;

  groupsRoot.innerHTML = "";
  state.writeupsByPath.clear();
  state.githubConfig = getRepoConfig();

  const groupMap = new Map();
  portfolio.writeupFolders.forEach((folder) => {
    const group = createWriteupGroup(folder);
    groupsRoot.append(group);
    groupMap.set(folder.key, group.querySelector(".writeup-list-group"));
  });

  if (!state.githubConfig) {
    groupMap.forEach((container) => {
      setGroupState(container, "Writeups are unavailable right now.");
    });
    return;
  }

  const writeupCollections = await Promise.all(
    portfolio.writeupFolders.map((folder) => loadFolderWriteups(folder, groupMap.get(folder.key), state.githubConfig))
  );

  const allWriteups = writeupCollections.flat().sort(sortWriteups);
  updateMetric("Writeups Ready", String(allWriteups.length).padStart(2, "0"));
  if (allWriteups.length) {
    renderWriteup(allWriteups[0]);
  } else {
    viewer.innerHTML = `
      <div class="writeup-viewer-empty">
        <div>
          <h3>No writeups available yet.</h3>
        </div>
      </div>
    `;
  }
};

setText("brand-name", portfolio.profile.name);
setText("brand-role", portfolio.profile.role);
setText("hero-eyebrow", portfolio.profile.eyebrow);
setText("hero-title", portfolio.profile.headline);
setText("hero-summary", portfolio.profile.summary);
setText("signal-focus", portfolio.profile.focus);
setText("signal-tagline", portfolio.profile.signalTagline);
setText("contact-heading", portfolio.profile.contactHeading);
setText("contact-summary", portfolio.profile.contactSummary);

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

const signalTags = document.getElementById("signal-tags");
portfolio.signalTags.forEach((tag) => {
  const pill = document.createElement("span");
  pill.className = "tag-pill";
  pill.textContent = tag;
  signalTags?.append(pill);
});

const platformList = document.getElementById("platform-list");
portfolio.platformLinks.forEach((platform) =>
  platformList?.append(createPlatform({ title: platform.title, profileUrl: platform.href }))
);

const certificationGrid = document.getElementById("certification-grid");
portfolio.certifications.forEach((certification) => {
  certificationGrid?.append(createCertification(certification));
});

const passwordLength = document.getElementById("password-length");
const passwordUppercase = document.getElementById("password-uppercase");
const passwordLowercase = document.getElementById("password-lowercase");
const passwordNumbers = document.getElementById("password-numbers");
const passwordSymbols = document.getElementById("password-symbols");
const passwordOutput = document.getElementById("password-output");
const generatePasswordButton = document.getElementById("generate-password");
const copyPasswordButton = document.getElementById("copy-password");

const generatePassword = () => {
  if (!(passwordOutput instanceof HTMLElement)) return;

  const groups = [];
  if (passwordUppercase instanceof HTMLInputElement && passwordUppercase.checked) groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (passwordLowercase instanceof HTMLInputElement && passwordLowercase.checked) groups.push("abcdefghijklmnopqrstuvwxyz");
  if (passwordNumbers instanceof HTMLInputElement && passwordNumbers.checked) groups.push("0123456789");
  if (passwordSymbols instanceof HTMLInputElement && passwordSymbols.checked) groups.push("!@#$%^&*()-_=+[]{};:,.?/|~");

  if (!groups.length) {
    passwordOutput.textContent = "Select at least one character set.";
    return;
  }

  const length = passwordLength instanceof HTMLInputElement ? clamp(Number(passwordLength.value) || 20, 8, 64) : 20;
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  const required = groups.map((group, index) => group[values[index] % group.length]);
  const pool = groups.join("");
  const remaining = Array.from({ length: Math.max(0, length - required.length) }, (_, index) => {
    const value = values[index + required.length];
    return pool[value % pool.length];
  });

  const combined = [...required, ...remaining];
  for (let index = combined.length - 1; index > 0; index -= 1) {
    const swapValue = values[index % values.length] % (index + 1);
    [combined[index], combined[swapValue]] = [combined[swapValue], combined[index]];
  }

  passwordOutput.textContent = combined.join("");
};

generatePasswordButton?.addEventListener("click", generatePassword);

copyPasswordButton?.addEventListener("click", async () => {
  if (!(passwordOutput instanceof HTMLElement)) return;
  const value = passwordOutput.textContent?.trim();
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    copyPasswordButton.textContent = "Copied";
    window.setTimeout(() => {
      copyPasswordButton.textContent = "Copy";
    }, 1200);
  } catch {
    copyPasswordButton.textContent = "Copy Failed";
    window.setTimeout(() => {
      copyPasswordButton.textContent = "Copy";
    }, 1200);
  }
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
    subnetResults.innerHTML = '<p class="tool-error">Enter a valid IPv4 CIDR such as 192.168.1.10/24.</p>';
    return;
  }

  const address = ipv4ToInt(match[1]);
  const cidr = Number(match[2]);
  if (address === null) {
    subnetResults.innerHTML = '<p class="tool-error">The IPv4 address is not valid.</p>';
    return;
  }

  const mask = cidrToMask(cidr);
  const network = (address & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const usableHosts = cidr >= 31 ? 0 : Math.max(0, 2 ** (32 - cidr) - 2);
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;

  subnetResults.innerHTML = `
    <div class="tool-result-row"><span>Subnet Mask</span><strong>${intToIpv4(mask)}</strong></div>
    <div class="tool-result-row"><span>Network</span><strong>${intToIpv4(network)}</strong></div>
    <div class="tool-result-row"><span>Broadcast</span><strong>${intToIpv4(broadcast)}</strong></div>
    <div class="tool-result-row"><span>Host Range</span><strong>${intToIpv4(firstHost)} - ${intToIpv4(lastHost)}</strong></div>
    <div class="tool-result-row"><span>Usable Hosts</span><strong>${usableHosts}</strong></div>
  `;
};

calculateSubnetButton?.addEventListener("click", renderSubnetResults);
subnetInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    renderSubnetResults();
  }
});

if (passwordLength instanceof HTMLInputElement && passwordOutput instanceof HTMLElement) {
  passwordLength.addEventListener("input", generatePassword);
  generatePassword();
}

const aliasResults = document.getElementById("alias-results");
const generateAliasButton = document.getElementById("generate-alias");

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const formatDob = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const generateAliasPersona = () => {
  if (!(aliasResults instanceof HTMLElement)) return;

  const age = randomNumber(21, 39);
  const handleBase = randomItem(personaNames.handles);
  const location = randomItem(personaLocations);
  const role = randomItem(personaNames.roles);
  const firstName = randomItem(personaNames.firstNames);
  const lastName = randomItem(personaNames.lastNames);
  const number = randomNumber(11, 98);
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  const birthMonth = randomNumber(0, 11);
  const maxDay = new Date(birthYear, birthMonth + 1, 0).getDate();
  const birthDay = randomNumber(1, maxDay);
  const dateOfBirth = new Date(birthYear, birthMonth, birthDay);

  const handle = `${handleBase}${number}`;
  const displayName = `${firstName} ${lastName}`;
  const emailAlias = `${firstName}.${lastName}${number}@proton.me`.toLowerCase();

  aliasResults.innerHTML = `
    <div class="tool-result-row"><span>Handle</span><strong>@${handle}</strong></div>
    <div class="tool-result-row"><span>Display Name</span><strong>${displayName}</strong></div>
    <div class="tool-result-row"><span>Age</span><strong>${age}</strong></div>
    <div class="tool-result-row"><span>Date of Birth</span><strong>${formatDob(dateOfBirth)}</strong></div>
    <div class="tool-result-row"><span>Location</span><strong>${location}</strong></div>
    <div class="tool-result-row"><span>Role</span><strong>${role}</strong></div>
    <div class="tool-result-row"><span>Email Alias</span><strong>${emailAlias}</strong></div>
  `;
};

generateAliasButton?.addEventListener("click", generateAliasPersona);
generateAliasPersona();

document.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target.closest(".writeup-item") : null;
  if (!target) return;

  const writeup = state.writeupsByPath.get(target.dataset.writeupPath || "");
  if (writeup) {
    renderWriteup(writeup);
  }
});

loadRepositoryWriteups();

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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((target) => observer.observe(target));
}
