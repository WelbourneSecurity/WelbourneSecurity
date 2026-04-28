import { escapeHtml, escapeAttribute, updateMetric } from "./utils.js";

const state = {
  activeWriteupPath: "",
  githubConfig: null,
  portfolio: null,
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

// --- Utility helpers ---

const titleizeFileName = (fileName) =>
  fileName
    .replace(/\.md$/i, "")
    .replace(/^(htb|thm|ctf)-/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

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
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
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
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const slugifyText = (value) =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

// Parses sanitised Markdown HTML into a DocumentFragment — avoids innerHTML on a live node
const htmlToFragment = (html) => document.createRange().createContextualFragment(html);

// --- Writeup cache helpers ---

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const readWriteupCache = (key) => {
  try {
    const raw = localStorage.getItem(`ws-writeup-${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.timestamp !== "number" || Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
};

const writeWriteupCache = (key, data) => {
  try {
    localStorage.setItem(`ws-writeup-${key}`, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // localStorage may be full — silently skip caching
  }
};

// --- GitHub API helpers ---

const encodeRepoPath = (path) => path.split("/").map(encodeURIComponent).join("/");

const getRepoConfig = (portfolio) => {
  const { owner, repo, branch, autoDetectGithubPages } = portfolio.github;
  if (owner && repo) return { owner, repo, branch };
  if (autoDetectGithubPages && window.location.hostname.endsWith(".github.io")) {
    const detectedOwner = window.location.hostname.split(".")[0];
    return { owner: detectedOwner, repo: `${detectedOwner}.github.io`, branch };
  }
  return null;
};

const getContentsApiUrl = (config, path) =>
  `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodeRepoPath(path)}?ref=${encodeURIComponent(config.branch)}`;

const getRawUrl = (config, path) =>
  `https://raw.githubusercontent.com/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/${encodeURIComponent(config.branch)}/${path}`;

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}.`);
  return response.json();
};

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch markdown file (${response.status}).`);
  return response.text();
};

// --- Markdown rendering ---

const normalizeRepoPath = (sourcePath, targetPath) => {
  if (/^(https?:|mailto:|data:|#)/i.test(targetPath)) return targetPath;
  if (targetPath.startsWith("/")) return targetPath.slice(1);
  const segments = sourcePath.split("/");
  segments.pop();
  targetPath.split("/").forEach((segment) => {
    if (!segment || segment === ".") return;
    if (segment === "..") { segments.pop(); return; }
    segments.push(segment);
  });
  return segments.join("/");
};

const resolveMarkdownLink = (href, context) => {
  const repoPath = normalizeRepoPath(context.path, href);
  if (/^(https?:|mailto:|data:|#)/i.test(repoPath)) return repoPath;
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
    pushToken(`<img src="${escapeAttribute(resolveMarkdownLink(src, context))}" alt="${escapeAttribute(alt)}" loading="lazy" />`)
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

    if (!trimmed) { index += 1; continue; }

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

// --- Front-matter parsing ---

const parseFrontMatter = (markdown) => {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { metadata: {}, body: markdown };

  const metadata = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (!key) return;
    metadata[key] = key.toLowerCase() === "tags" ? normalizeTags(rawValue) : rawValue.replace(/^['"]|['"]$/g, "");
  });

  return { metadata, body: markdown.slice(match[0].length) };
};

const extractTitleFromBody = (body, fallbackName) => {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : titleizeFileName(fallbackName);
};

const extractSummaryFromBody = (body) => {
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  const blocks = withoutCode.split(/\r?\n\r?\n+/).map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    if (
      block.startsWith("#") ||
      block.startsWith(">") ||
      block.startsWith("- ") ||
      block.startsWith("* ") ||
      /^\d+\.\s/.test(block)
    ) continue;
    return block.replace(/\r?\n/g, " ");
  }

  return "Markdown writeup ready to be expanded with a short summary.";
};

// --- DOM helpers ---

const createWriteupGroup = ({ label, description, key }) => {
  const group = document.createElement("section");
  group.className = "writeup-group";
  group.dataset.folderKey = key;

  const header = document.createElement("div");
  header.className = "writeup-group-header";
  const labelEl = document.createElement("p");
  labelEl.className = "entry-label";
  labelEl.textContent = label;
  header.append(labelEl);
  if (description) {
    const descEl = document.createElement("p");
    descEl.textContent = description;
    header.append(descEl);
  }

  const listGroup = document.createElement("div");
  listGroup.className = "writeup-list-group";

  group.append(header, listGroup);
  return group;
};

const setGroupState = (container, message, type = "status", onRetry = null) => {
  const wrapper = document.createElement("div");
  wrapper.className = "writeup-state-block";
  const p = document.createElement("p");
  p.className = type === "error" ? "writeup-error" : "writeup-status";
  p.textContent = message;
  wrapper.append(p);
  if (type === "error" && typeof onRetry === "function") {
    const retryBtn = document.createElement("button");
    retryBtn.className = "action secondary writeup-retry-button";
    retryBtn.type = "button";
    retryBtn.textContent = "Retry";
    retryBtn.addEventListener("click", onRetry);
    wrapper.append(retryBtn);
  }
  container.replaceChildren(wrapper);
};

const WRITEUP_ITEM_ICON_SVG = `<svg viewBox="0 0 64 80" focusable="false"><path d="M12 4h26l14 14v54a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Z" /><path d="M38 4v14h14" /></svg>`;

const createWriteupItem = (writeup) => {
  const button = document.createElement("button");
  button.className = "writeup-item";
  button.type = "button";
  button.dataset.writeupPath = writeup.path;
  button.dataset.writeupTone = getWriteupTone(writeup.folderLabel);

  const fileName = writeup.path.split("/").pop() || writeup.title;

  const iconWrapper = document.createElement("span");
  iconWrapper.className = "writeup-item-icon";
  iconWrapper.setAttribute("aria-hidden", "true");
  // Static trusted SVG — use createContextualFragment to avoid innerHTML on live nodes
  iconWrapper.append(htmlToFragment(WRITEUP_ITEM_ICON_SVG));

  const title = document.createElement("strong");
  title.className = "writeup-item-title";
  title.textContent = fileName;

  const meta = document.createElement("span");
  meta.className = "writeup-item-label";
  meta.textContent = writeup.folderLabel + (writeup.displayDate ? ` / ${writeup.displayDate}` : "");

  button.append(iconWrapper, title, meta);

  if (writeup.readingTimeMin) {
    const readTime = document.createElement("span");
    readTime.className = "writeup-item-readtime";
    readTime.textContent = `${writeup.readingTimeMin} min read`;
    button.append(readTime);
  }
  return button;
};

const renderEmptyWriteupViewer = (title, message = "", options = {}) => {
  const viewer = document.getElementById("writeup-viewer");
  if (!viewer) return;

  viewer.classList.toggle("is-collapsed", Boolean(options.collapsed));

  const wrapper = document.createElement("div");
  wrapper.className = "writeup-viewer-empty";
  const inner = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = title;
  inner.append(h3);
  if (message) {
    const p = document.createElement("p");
    p.textContent = message;
    inner.append(p);
  }
  wrapper.append(inner);
  viewer.replaceChildren(wrapper);
};

const renderWriteupSkeleton = () => {
  const groupsRoot = document.getElementById("writeup-groups");
  if (!(groupsRoot instanceof HTMLElement)) return;

  groupsRoot.replaceChildren();
  for (let i = 0; i < 4; i++) {
    const row = document.createElement("div");
    row.className = "writeup-skeleton-row";
    groupsRoot.append(row);
  }
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

  const tags = Array.from(new Set(state.allWriteups.flatMap((w) => w.tags))).sort((a, b) => a.localeCompare(b));
  if (!tags.length) { container.replaceChildren(); return; }

  const allBtn = document.createElement("button");
  allBtn.className = `writeup-tag-button${state.writeupFilters.tag === "all" ? " is-active" : ""}`;
  allBtn.type = "button";
  allBtn.dataset.tagFilter = "all";
  allBtn.setAttribute("aria-pressed", state.writeupFilters.tag === "all" ? "true" : "false");
  allBtn.textContent = "All Tags";

  const tagBtns = tags.map((tag) => {
    const btn = document.createElement("button");
    btn.className = `writeup-tag-button${state.writeupFilters.tag === tag ? " is-active" : ""}`;
    btn.type = "button";
    btn.dataset.tagFilter = tag;
    btn.setAttribute("aria-pressed", state.writeupFilters.tag === tag ? "true" : "false");
    btn.textContent = tag;
    return btn;
  });

  container.replaceChildren(allBtn, ...tagBtns);
};

const writeupMatchesFilters = (writeup) => {
  if (state.writeupFilters.folder !== "all" && writeup.folderKey !== state.writeupFilters.folder) return false;
  if (state.writeupFilters.tag !== "all" && !writeup.tags.includes(state.writeupFilters.tag)) return false;
  const query = state.writeupFilters.query.trim().toLowerCase();
  if (!query) return true;
  const haystack = [writeup.title, writeup.summary, writeup.path, writeup.folderLabel, ...writeup.tags].join(" ").toLowerCase();
  return haystack.includes(query);
};

const updateActiveWriteupItem = () => {
  document.querySelectorAll(".writeup-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.writeupPath === state.activeWriteupPath);
  });
};

const renderWriteupGroups = () => {
  const groupsRoot = document.getElementById("writeup-groups");
  if (!(groupsRoot instanceof HTMLElement)) return;

  groupsRoot.replaceChildren();

  const visibleSources = state.writeupSources.filter(
    (source) => state.writeupFilters.folder === "all" || source.folder.key === state.writeupFilters.folder
  );

  visibleSources.forEach((source) => {
    const group = createWriteupGroup(source.folder);
    const container = group.querySelector(".writeup-list-group");
    groupsRoot.append(group);

    if (!(container instanceof HTMLElement)) return;

    if (source.error) {
      const retryHandler = source.error.includes("Nothing here yet") ? null : () => {
        if (state.githubConfig) {
          const cacheKey = `${state.githubConfig.owner}/${state.githubConfig.repo}/${source.folder.path}`;
          try { localStorage.removeItem(`ws-writeup-${cacheKey}`); } catch { /* ignore */ }
        }
        if (state.portfolio) void loadRepositoryWriteups(state.portfolio);
      };
      setGroupState(container, source.error, "error", retryHandler);
      return;
    }
    if (!source.writeups.length) { setGroupState(container, "Nothing here yet!"); return; }

    const filtered = source.writeups.filter(writeupMatchesFilters);
    if (!filtered.length) { setGroupState(container, "No matches for current filters."); return; }

    container.replaceChildren();
    filtered.forEach((writeup) => container.append(createWriteupItem(writeup)));
  });
};

const copyTextToClipboard = async (value, button, defaultLabel = null) => {
  if (!value) return false;
  const nextLabel = defaultLabel || button.textContent || "";
  try {
    await navigator.clipboard.writeText(value);
    button.textContent = "Copied";
    window.setTimeout(() => { button.textContent = nextLabel; }, 1200);
    return true;
  } catch {
    button.textContent = "Copy Failed";
    window.setTimeout(() => { button.textContent = nextLabel; }, 1200);
    return false;
  }
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
      return { id, level: Number(heading.tagName.slice(1)), text: heading.textContent || "Section" };
    });

    if (headings.length >= 2) {
      tocPanel.hidden = false;
      const links = headings.map((h) => {
        const a = document.createElement("a");
        a.className = `writeup-toc-link level-${h.level}`;
        a.href = `#${h.id}`;
        a.textContent = h.text;
        return a;
      });
      toc.replaceChildren(...links);
    } else {
      tocPanel.hidden = true;
      toc.replaceChildren();
    }

    body.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement?.classList.contains("writeup-code-block")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "writeup-code-block";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.append(pre);

      const btn = document.createElement("button");
      btn.className = "writeup-code-copy";
      btn.type = "button";
      btn.textContent = "Copy Code";
      btn.addEventListener("click", async () => {
        const value = pre.querySelector("code")?.textContent || pre.textContent || "";
        await copyTextToClipboard(value.trim(), btn, "Copy Code");
      });
      wrapper.append(btn);
    });
  }

  viewer.querySelectorAll(".writeup-nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      const path = button.getAttribute("data-writeup-path") || "";
      const writeup = state.writeupsByPath.get(path);
      if (writeup) renderWriteup(writeup);
    });
  });
};

const renderWriteup = (writeup) => {
  const viewer = document.getElementById("writeup-viewer");
  if (!viewer) return;

  viewer.classList.remove("is-collapsed");
  state.activeWriteupPath = writeup.path;
  updateActiveWriteupItem();

  const activeIndex = state.filteredWriteups.findIndex((e) => e.path === writeup.path);
  const previousWriteup = activeIndex > 0 ? state.filteredWriteups[activeIndex - 1] : null;
  const nextWriteup =
    activeIndex >= 0 && activeIndex < state.filteredWriteups.length - 1
      ? state.filteredWriteups[activeIndex + 1]
      : null;

  const header = document.createElement("div");
  header.className = "writeup-viewer-header";

  const meta = document.createElement("span");
  meta.className = "writeup-viewer-meta";
  const metaParts = [writeup.folderLabel];
  if (writeup.displayDate) metaParts.push(writeup.displayDate);
  if (writeup.readingTimeMin) metaParts.push(`${writeup.readingTimeMin} min read`);
  meta.textContent = metaParts.join(" / ");

  const h3 = document.createElement("h3");
  h3.textContent = writeup.title;
  h3.tabIndex = -1;

  const summary = document.createElement("p");
  summary.className = "writeup-item-summary";
  summary.textContent = writeup.summary;

  header.append(meta, h3, summary);

  if (writeup.tags.length) {
    const tagsDiv = document.createElement("div");
    tagsDiv.className = "writeup-viewer-tags";
    writeup.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsDiv.append(span);
    });
    header.append(tagsDiv);
  }

  const linksDiv = document.createElement("div");
  linksDiv.className = "writeup-viewer-links";
  const ghLink = document.createElement("a");
  ghLink.className = "writeup-viewer-link";
  ghLink.href = writeup.sourceUrl;
  ghLink.target = "_blank";
  ghLink.rel = "noreferrer";
  ghLink.textContent = "View on GitHub";
  const rawLink = document.createElement("a");
  rawLink.className = "writeup-viewer-link";
  rawLink.href = writeup.rawUrl;
  rawLink.target = "_blank";
  rawLink.rel = "noreferrer";
  rawLink.textContent = "Open raw markdown";
  linksDiv.append(ghLink, rawLink);
  header.append(linksDiv);

  const tocPanel = document.createElement("section");
  tocPanel.className = "writeup-toc-panel";
  tocPanel.hidden = true;
  const tocLabel = document.createElement("p");
  tocLabel.className = "tool-label";
  tocLabel.textContent = "On This Page";
  const tocNav = document.createElement("nav");
  tocNav.className = "writeup-toc";
  tocNav.id = "writeup-toc";
  tocNav.setAttribute("aria-label", "Writeup table of contents");
  tocPanel.append(tocLabel, tocNav);

  const body = document.createElement("div");
  body.className = "writeup-viewer-body markdown-body";
  // Rendered markdown is assembled from controlled templates + escapeHtml()-sanitised user text
  body.append(htmlToFragment(renderMarkdown(writeup.body, { path: writeup.path, githubConfig: state.githubConfig })));

  const makePrevNextBtn = (target, label) => {
    const btn = document.createElement("button");
    btn.className = "action secondary writeup-nav-button";
    btn.type = "button";
    if (target) btn.setAttribute("data-writeup-path", target.path);
    else btn.disabled = true;
    btn.textContent = label;
    return btn;
  };

  const pagination = document.createElement("div");
  pagination.className = "writeup-viewer-pagination";
  pagination.append(
    makePrevNextBtn(previousWriteup, previousWriteup ? `Previous: ${previousWriteup.title}` : "Start of list"),
    makePrevNextBtn(nextWriteup, nextWriteup ? `Next: ${nextWriteup.title}` : "End of list")
  );

  const footer = document.createElement("div");
  footer.className = "writeup-viewer-footer";
  footer.append(pagination);

  viewer.replaceChildren(header, tocPanel, body, footer);
  enhanceWriteupViewer(viewer);
  // Move keyboard focus to the writeup heading so screen-reader users hear the new content
  window.requestAnimationFrame(() => { h3.focus({ preventScroll: true }); });
};

const applyWriteupFilters = () => {
  state.filteredWriteups = state.allWriteups.filter(writeupMatchesFilters);
  renderWriteupTagFilters();
  updateWriteupFilterButtons();
  renderWriteupGroups();
  updateWriteupFilterCount();

  if (!state.allWriteups.length) {
    state.activeWriteupPath = "";
    renderEmptyWriteupViewer(
      "No writeups available yet.",
      "Push markdown files to the connected writeups repository and reload the page."
    );
    return;
  }

  if (!state.filteredWriteups.length) {
    state.activeWriteupPath = "";
    renderEmptyWriteupViewer(
      "No writeups match the current filters.",
      "Adjust the search or reset the filters to browse everything again."
    );
    return;
  }

  if (!state.filteredWriteups.some((w) => w.path === state.activeWriteupPath)) {
    state.activeWriteupPath = "";
    updateActiveWriteupItem();
    renderEmptyWriteupViewer(
      "Select a writeup to open it.",
      "The reader stays collapsed until you choose a writeup from the list.",
      { collapsed: true }
    );
    return;
  }

  updateActiveWriteupItem();
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
  const sortDate =
    metadata.date && !Number.isNaN(new Date(metadata.date).getTime())
      ? new Date(metadata.date).toISOString()
      : "";

  const wordCount = body.trim().split(/\s+/).length;
  const readingTimeMin = Math.max(1, Math.round(wordCount / 200));

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
    displayDate,
    readingTimeMin
  };
};

const loadFolderWriteups = async (folder, config) => {
  const cacheKey = `${config.owner}/${config.repo}/${folder.path}`;
  const cached = readWriteupCache(cacheKey);
  if (cached) return { folder, writeups: cached, error: "" };

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

    if (!markdownFiles.length) return { folder, writeups: [], error: "" };

    const writeups = (
      await Promise.all(markdownFiles.map((file) => buildWriteupRecord(file, folder, config)))
    ).sort(sortWriteups);
    writeWriteupCache(cacheKey, writeups);
    return { folder, writeups, error: "" };
  } catch (error) {
    const isNotFound = error instanceof Error && error.message.includes("404");
    const isNetworkError = error instanceof TypeError;
    return {
      folder,
      writeups: [],
      error: isNotFound
        ? "Nothing here yet!"
        : isNetworkError
          ? "Network error — check your connection and retry."
          : error instanceof Error
            ? error.message
            : "Nothing here yet!"
    };
  }
};

export const loadRepositoryWriteups = async (portfolio) => {
  const groupsRoot = document.getElementById("writeup-groups");
  if (!(groupsRoot instanceof HTMLElement)) return;

  renderWriteupSkeleton();
  state.portfolio = portfolio;
  state.writeupsByPath.clear();
  state.allWriteups = [];
  state.filteredWriteups = [];
  state.writeupSources = [];
  state.githubConfig = getRepoConfig(portfolio);

  if (!state.githubConfig) {
    renderEmptyWriteupViewer("Writeups are unavailable right now.");
    return;
  }

  state.writeupSources = await Promise.all(
    portfolio.writeupFolders.map((folder) => loadFolderWriteups(folder, state.githubConfig))
  );
  state.allWriteups = state.writeupSources.flatMap((source) => source.writeups).sort(sortWriteups);
  state.allWriteups.forEach((writeup) => state.writeupsByPath.set(writeup.path, writeup));

  updateMetric("Writeups Ready", String(state.allWriteups.length).padStart(2, "0"));
  applyWriteupFilters();
};

export function initWriteups(portfolio, options = {}) {
  const compactMobileQuery = window.matchMedia("(max-width: 960px)");
  const writeupSearch = document.getElementById("writeup-search");
  const writeupFilterClear = document.getElementById("writeup-filter-clear");

  const ensureWriteupsLoaded = () => {
    if ((options.loadOnMobile || !compactMobileQuery.matches) && !state.writeupSources.length) {
      void loadRepositoryWriteups(portfolio);
    }
  };

  ensureWriteupsLoaded();

  writeupSearch?.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    state.writeupFilters.query = event.target.value;
    applyWriteupFilters();
  });

  writeupFilterClear?.addEventListener("click", () => {
    state.writeupFilters = { query: "", folder: "all", tag: "all" };
    if (writeupSearch instanceof HTMLInputElement) writeupSearch.value = "";
    applyWriteupFilters();
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest(".writeup-item") : null;
    if (!target) return;
    const writeup = state.writeupsByPath.get(target.dataset.writeupPath || "");
    if (writeup) renderWriteup(writeup);
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

  return { ensureWriteupsOnDesktop: ensureWriteupsLoaded, ensureWriteupsLoaded };
}
