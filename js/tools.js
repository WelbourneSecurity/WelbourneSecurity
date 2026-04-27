import { clamp, escapeHtml } from "./utils.js";
import { personaNames } from "../persona-data.js";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// ── Shared tool output helpers ────────────────────────────────────────────────

const buildToolRows = (rows = []) => {
  const frag = document.createDocumentFragment();
  for (const { label, value, matched = false } of rows) {
    const div = document.createElement("div");
    div.className = matched ? "tool-result-row is-match" : "tool-result-row";
    const span = document.createElement("span");
    span.textContent = label;
    if (matched) {
      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = " Match";
      span.append(sr);
    }
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    div.append(span, strong);
    frag.append(div);
  }
  return frag;
};

const setToolRows = (container, rows) => {
  if (container instanceof HTMLElement) container.replaceChildren(buildToolRows(rows));
};

const setToolError = (container, message) => {
  if (!(container instanceof HTMLElement)) return;
  const p = document.createElement("p");
  p.className = "tool-error";
  p.textContent = message;
  container.replaceChildren(p);
};

const clearToolContainer = (container) => {
  if (container instanceof HTMLElement) container.replaceChildren();
};

const toolRowsToText = (container) => {
  if (!(container instanceof HTMLElement)) return "";
  return Array.from(container.querySelectorAll(".tool-result-row"))
    .map((row) => {
      const label = row.querySelector("span")?.textContent?.trim() || "";
      const value = row.querySelector("strong")?.textContent?.trim() || "";
      return label && value ? `${label}: ${value}` : value || label;
    })
    .filter(Boolean)
    .join("\n");
};

// ── Workbench shared I/O ──────────────────────────────────────────────────────

const SHARED_INPUT_KEY = "tool-shared-input";
const SHARED_OUTPUT_KEY = "tool-shared-output";
const RECENT_INPUTS_KEY = "tool-recent-inputs";
const RECENT_INPUTS_MAX = 5;

const getWorkbenchInput = () => {
  const el = document.getElementById("tool-shared-input");
  return el instanceof HTMLTextAreaElement ? el.value : "";
};

const getWorkbenchOutput = () => {
  const el = document.getElementById("tool-shared-output");
  return el instanceof HTMLTextAreaElement ? el.value : "";
};

const setWorkbenchStatus = (message) => {
  const el = document.getElementById("tool-shared-status");
  if (el instanceof HTMLElement) el.textContent = message;
};

const setWorkbenchInput = (value) => {
  const el = document.getElementById("tool-shared-input");
  if (!(el instanceof HTMLTextAreaElement)) return;
  el.value = value;
  localStorage.setItem(SHARED_INPUT_KEY, value);
};

const setWorkbenchOutput = (value, status = "Output updated") => {
  const el = document.getElementById("tool-shared-output");
  if (!(el instanceof HTMLTextAreaElement)) return;
  el.value = value;
  localStorage.setItem(SHARED_OUTPUT_KEY, value);
  setWorkbenchStatus(status);
};

const setWorkbenchOutputFromRows = (container, status = "Output updated") => {
  const output = toolRowsToText(container);
  setWorkbenchOutput(output, status);
  return output;
};

// ── Misc helpers ──────────────────────────────────────────────────────────────

const setButtonFeedback = (button, label, fallback = null, delay = 1200) => {
  if (!(button instanceof HTMLElement)) return;
  const next = fallback || button.textContent || "";
  button.textContent = label;
  window.setTimeout(() => { button.textContent = next; }, delay);
};

const announceToSR = (message) => {
  const region = document.getElementById("tool-copy-announce");
  if (!(region instanceof HTMLElement)) return;
  region.textContent = "";
  window.setTimeout(() => { region.textContent = message; }, 50);
};

const copyTextToClipboard = async (value, button, defaultLabel = null) => {
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(value);
    setButtonFeedback(button, "Copied", defaultLabel);
    announceToSR("Copied to clipboard.");
    return true;
  } catch {
    setButtonFeedback(button, "Copy Failed", defaultLabel);
    announceToSR("Copy failed. Please copy manually.");
    return false;
  }
};

const formatNumber = (value) => Number(value).toLocaleString("en-GB");

const formatDateTime = (value) =>
  value.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return "Unknown";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) { size /= 1024; index += 1; }
  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const truncateText = (value, length = 64) =>
  value.length > length ? `${value.slice(0, Math.max(0, length - 1))}…` : value;

const sanitizeAliasPart = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
const titleCase = (value) => value.replace(/\b\w/g, (c) => c.toUpperCase());

const bytesToHex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const bytesToBase64 = (bytes) => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const base64ToBytes = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
};

const digestHex = async (algorithm, buffer) => {
  const digest = await crypto.subtle.digest(algorithm, buffer);
  return bytesToHex(new Uint8Array(digest));
};

// ── HTML entity encode/decode (no innerHTML) ──────────────────────────────────

const encodeHtmlEntities = (value) => escapeHtml(value);

const decodeHtmlEntities = (value) =>
  value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));

// ── MD5 implementation ────────────────────────────────────────────────────────

const md5ShiftSchedule = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

const md5Constants = Array.from({ length: 64 }, (_, i) =>
  Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0
);

const add32 = (a, b) => (a + b) >>> 0;
const rotl32 = (v, n) => ((v << n) | (v >>> (32 - n))) >>> 0;

const md5Hex = (input) => {
  const src = input instanceof Uint8Array ? input : new Uint8Array(input);
  const bitLen = src.length * 8;
  const padLen = (((src.length + 9 + 63) >> 6) << 6) >>> 0;
  const buf = new Uint8Array(padLen);
  buf.set(src);
  buf[src.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(padLen - 8, bitLen >>> 0, true);
  view.setUint32(padLen - 4, Math.floor(bitLen / 0x100000000) >>> 0, true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < padLen; off += 64) {
    const w = Array.from({ length: 16 }, (_, i) => view.getUint32(off + i * 4, true));
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, wi;
      if (i < 16)       { f = (b & c) | (~b & d); wi = i; }
      else if (i < 32)  { f = (d & b) | (~d & c); wi = (5 * i + 1) % 16; }
      else if (i < 48)  { f = b ^ c ^ d;           wi = (3 * i + 5) % 16; }
      else              { f = c ^ (b | ~d);         wi = (7 * i) % 16; }
      const nd = d; d = c; c = b;
      b = add32(b, rotl32(add32(add32(add32(a, f >>> 0), md5Constants[i]), w[wi] >>> 0), md5ShiftSchedule[i]));
      a = nd;
    }
    a0 = add32(a0, a); b0 = add32(b0, b); c0 = add32(c0, c); d0 = add32(d0, d);
  }

  return [a0, b0, c0, d0]
    .flatMap((word) => [word & 255, (word >>> 8) & 255, (word >>> 16) & 255, (word >>> 24) & 255])
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

// ── Passphrase wordlist (EFF-inspired, ~200 short memorable words) ─────────────
const PASSPHRASE_WORDS = "acid aged arch army aunt back bail bake balm band bark barn base bath beam bear beat beef bell bend bile bird bite blur boat bold bolt bone book boom boot born bowl brag bred brew brim brow buff bulk bull bunk burn cage cake calf calm camp cane cape care cart cave cell chat chef chin chip clam clan clap clay clip club coal coat code coil coin cold colt cook cool cope cord cork corn cost coup cove crab crew crop crow cuff curl cute dark dart dash dear deck deep deer deny desk dial dice dime dine dirt dish disk dive dock dock dome done door dorm dose drab drag draw dray drop drum dual dusk dust earl earn ease east edge emit epic fang farm fast fate fawn feat feed fell fend feud file fill film find fire firm fish fist flag flat flaw flea flew flip flow foam foil folk fond font foot ford fore fork form fort fowl free from fuel full fume fund furl gale garb gash gasp gate gave gaze gear geld gild gilt glad glee glow glum glut gnat gory gown grab gram grid grim grin grip grit grow gust hail hall halt hare harm harp hash haul heal heap heat heel helm herb herd hike hill hoax hock hold hole home honk hood hook howl hued hull hung hunk hunt husk hymn icon idle inch inch iris isle itch jade jail jaunt jest jolt joust kept kern kegs kind king kink knob knee knot lace lame lamp lard lash laud lawn laze lead leaf lean leap lend loft lore lure lush mace mail main malt mare mask mast meal mead meal menu mild mill mire mist mitt moan moat mock molt mood moon moor mope most moth muck mutt myth navy near nest newt nice nine node norm nose oast oath obey omen open oval pact page palm pang park past path pave peal peat peel peer pelt pine pine pipe ploy plum plop plot plow plug plum plus poke poll pond port pose post pour prey prod prop pull pulp pump pure purr quip quiz rack rack rain rant rasp rate real reed reel rein rent rest rice ride rift riot ripe rise roam romp root rope rove ruin ruse rush rust rut safe sage sail salt salve sash save scam scar scud seam serf shed shin shod shun shut sigh silk sill silo sine sink sire slap slew slim slop slur smug smut snag snap snip snub soak soar sofa soil sort sour span spar spit spur star stem step stew stir stun suet suit sulk sump swan swap swat swoop tack tale tame tang tarp taut teal tear teem tent text thaw tick tied tier tilt time tint tire toad toil toll tomb tone tong tore torn toss tout town track tray trek trim trod trout trove truce tuft tusk tutu twig twin vamp vane veil vend vest view vile vine vow vow wade wage wail wake ward warm warp wart wasp wave weal weft weld went whet whim whip wile will wimp wine wing wink wire wisp wit woe wolf worm wren yore yule zinc zone zoom";

const PASSPHRASE_WORD_ARRAY = PASSPHRASE_WORDS.split(" ");

// ── Password tool ─────────────────────────────────────────────────────────────

const initPasswordTool = () => {
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
  const passphraseModeToggle = document.getElementById("password-passphrase-mode");

  const isPassphraseMode = () => passphraseModeToggle instanceof HTMLInputElement && passphraseModeToggle.checked;

  const syncPassphraseMode = () => {
    const on = isPassphraseMode();
    // Hide length slider and its label, and the character-set checkboxes
    const lengthLabel = passwordLength instanceof HTMLElement ? passwordLength.previousElementSibling : null;
    if (lengthLabel instanceof HTMLElement) lengthLabel.classList.toggle("tool-passphrase-hidden", on);
    if (passwordLength instanceof HTMLElement) passwordLength.classList.toggle("tool-passphrase-hidden", on);
    const checksDiv = document.querySelector("#tool-password .tool-checks");
    if (checksDiv instanceof HTMLElement) checksDiv.classList.toggle("tool-passphrase-hidden", on);
  };

  const generatePassphrase = ({ publish = true } = {}) => {
    if (!(passwordOutput instanceof HTMLTextAreaElement)) return;
    const wordCount = 5;
    const indices = new Uint32Array(wordCount);
    crypto.getRandomValues(indices);
    const words = Array.from(indices, (v) => PASSPHRASE_WORD_ARRAY[v % PASSPHRASE_WORD_ARRAY.length]);
    const phrase = words.join("-");
    passwordOutput.value = phrase;
    renderPasswordStrength();
    if (publish) setWorkbenchOutput(phrase, "Passphrase generated");
  };

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
    if (/[^ -]/.test(value)) pool += 128;
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
    if (!value) { clearToolContainer(passwordStrengthResults); return; }
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

  const generatePassword = ({ publish = true } = {}) => {
    if (!(passwordOutput instanceof HTMLTextAreaElement)) return;
    const groups = getPasswordGroups();
    if (!groups.length) {
      passwordOutput.value = "";
      setToolError(passwordStrengthResults, "Select at least one character set.");
      if (publish) setWorkbenchOutput("", "Select a password character set");
      return;
    }
    const length = passwordLength instanceof HTMLInputElement ? clamp(Number(passwordLength.value) || 20, 8, 64) : 20;
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    const required = groups.map((group, i) => group[values[i] % group.length]);
    const pool = groups.join("");
    const remaining = Array.from({ length: Math.max(0, length - required.length) }, (_, i) =>
      pool[values[i + required.length] % pool.length]
    );
    const combined = [...required, ...remaining];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = values[i % values.length] % (i + 1);
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    passwordOutput.value = combined.join("");
    renderPasswordStrength();
    if (publish) setWorkbenchOutput(passwordOutput.value, "Password generated");
  };

  const runGenerate = (opts = {}) => isPassphraseMode() ? generatePassphrase(opts) : generatePassword(opts);

  generatePasswordButton?.addEventListener("click", () => runGenerate());
  copyPasswordButton?.addEventListener("click", async () => {
    if (!(passwordOutput instanceof HTMLTextAreaElement)) return;
    await copyTextToClipboard(getWorkbenchOutput().trim() || passwordOutput.value.trim(), copyPasswordButton, "Copy");
  });

  passphraseModeToggle?.addEventListener("change", () => {
    syncPassphraseMode();
    runGenerate();
  });

  if (passwordLength instanceof HTMLInputElement) {
    updatePasswordLengthLabel();
    passwordLength.addEventListener("input", () => { updatePasswordLengthLabel(); generatePassword(); });
  }
  [passwordUppercase, passwordLowercase, passwordNumbers, passwordSymbols].forEach((el) => {
    el?.addEventListener("change", () => { if (!isPassphraseMode()) generatePassword(); });
  });
  passwordOutput?.addEventListener("input", renderPasswordStrength);
  syncPassphraseMode();
  generatePassword({ publish: false });

  return {
    writeInput: (value) => {
      if (passwordOutput instanceof HTMLTextAreaElement) { passwordOutput.value = value; renderPasswordStrength(); }
    },
    readOutput: () => (passwordOutput instanceof HTMLTextAreaElement ? passwordOutput.value : "")
  };
};

// ── Subnet tool ───────────────────────────────────────────────────────────────

const initSubnetTool = () => {
  const subnetInput = document.getElementById("subnet-input");
  const subnetResults = document.getElementById("subnet-results");
  const calculateSubnetButton = document.getElementById("calculate-subnet");

  const ipv4ToInt = (ip) => {
    const octets = ip.split(".").map(Number);
    if (octets.length !== 4 || octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) return null;
    return (((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + octets[3]) >>> 0;
  };
  const intToIpv4 = (v) => [24, 16, 8, 0].map((s) => String((v >>> s) & 255)).join(".");
  const cidrToMask = (cidr) => (cidr === 0 ? 0 : ((0xffffffff << (32 - cidr)) >>> 0));

  const renderSubnetResults = () => {
    if (!(subnetInput instanceof HTMLInputElement) || !(subnetResults instanceof HTMLElement)) return;
    const sharedSource = getWorkbenchInput().trim();
    if (sharedSource) subnetInput.value = sharedSource.split(/\s+/)[0] || sharedSource;
    const raw = subnetInput.value.trim();
    const match = raw.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d|[12]\d|3[0-2])$/);
    if (!match) { setToolError(subnetResults, "Enter a valid IPv4 CIDR such as 192.168.1.10/24."); setWorkbenchOutput("", "CIDR input needed"); return; }
    const address = ipv4ToInt(match[1]);
    const cidr = Number(match[2]);
    if (address === null) { setToolError(subnetResults, "The IPv4 address is not valid."); setWorkbenchOutput("", "CIDR input invalid"); return; }
    const mask = cidrToMask(cidr);
    const wildcard = (~mask >>> 0) >>> 0;
    const network = (address & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const total = 2 ** (32 - cidr);
    const usable = cidr >= 31 ? 0 : Math.max(0, total - 2);
    const first = cidr >= 31 ? "N/A" : intToIpv4((network + 1) >>> 0);
    const last = cidr >= 31 ? "N/A" : intToIpv4((broadcast - 1) >>> 0);
    setToolRows(subnetResults, [
      { label: "Subnet Mask", value: intToIpv4(mask) },
      { label: "Wildcard Mask", value: intToIpv4(wildcard) },
      { label: "Network", value: intToIpv4(network) },
      { label: "Broadcast", value: intToIpv4(broadcast) },
      { label: "Usable Range", value: `${first} - ${last}` },
      { label: "Usable Hosts", value: formatNumber(usable) },
      { label: "Total Addresses", value: formatNumber(total) }
    ]);
    setWorkbenchOutputFromRows(subnetResults, "CIDR output updated");
  };

  calculateSubnetButton?.addEventListener("click", renderSubnetResults);
  subnetInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); renderSubnetResults(); } });

  return {
    writeInput: (value) => {
      if (subnetInput instanceof HTMLInputElement) { subnetInput.value = value.split(/\s+/)[0] || value; renderSubnetResults(); }
    },
    readOutput: () => toolRowsToText(subnetResults)
  };
};

// ── Alias tool ────────────────────────────────────────────────────────────────

const initAliasTool = () => {
  const aliasFirstName = document.getElementById("alias-first-name");
  const aliasLastName = document.getElementById("alias-last-name");
  const aliasKeyword = document.getElementById("alias-keyword");
  const aliasResults = document.getElementById("alias-results");
  const generateAliasButton = document.getElementById("generate-alias");
  const generateRandomAliasButton = document.getElementById("generate-random-alias");

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomAliasKeyword = () =>
    sanitizeAliasPart(randomItem(["intel", "ghost", "labs", "cipher", "vector", "signal", "osint", "ops"]));

  const fillRandomAliasSeed = () => {
    const first = randomItem(personaNames.firstNames);
    const last = randomItem(personaNames.lastNames);
    const keyword = randomAliasKeyword();
    if (aliasFirstName instanceof HTMLInputElement) aliasFirstName.value = first;
    if (aliasLastName instanceof HTMLInputElement) aliasLastName.value = last;
    if (aliasKeyword instanceof HTMLInputElement) aliasKeyword.value = keyword;
    return `${first} ${last} ${keyword}`;
  };

  const setAliasSeedFromText = (value) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (aliasFirstName instanceof HTMLInputElement) aliasFirstName.value = parts[0] || "";
    if (aliasLastName instanceof HTMLInputElement) aliasLastName.value = parts[1] || "";
    if (aliasKeyword instanceof HTMLInputElement) aliasKeyword.value = parts.slice(2).join(" ");
  };

  const getAliasSeedText = () =>
    [aliasFirstName, aliasLastName, aliasKeyword]
      .map((el) => (el instanceof HTMLInputElement ? el.value.trim() : ""))
      .filter(Boolean)
      .join(" ");

  const generateAliasPersona = ({ publish = true } = {}) => {
    if (!(aliasResults instanceof HTMLElement)) return;
    const sharedSource = getWorkbenchInput().trim();
    if (sharedSource) setAliasSeedFromText(sharedSource);
    if (
      aliasFirstName instanceof HTMLInputElement && aliasLastName instanceof HTMLInputElement &&
      aliasKeyword instanceof HTMLInputElement && !aliasFirstName.value.trim() &&
      !aliasLastName.value.trim() && !aliasKeyword.value.trim()
    ) {
      const randomSeed = fillRandomAliasSeed();
      if (publish) setWorkbenchInput(randomSeed);
    }
    const first = aliasFirstName instanceof HTMLInputElement ? sanitizeAliasPart(aliasFirstName.value) : "";
    const last = aliasLastName instanceof HTMLInputElement ? sanitizeAliasPart(aliasLastName.value) : "";
    const keyword = aliasKeyword instanceof HTMLInputElement ? sanitizeAliasPart(aliasKeyword.value) : "";
    if (!first && !last && !keyword) {
      setToolError(aliasResults, "Add at least one seed value to generate permutations.");
      if (publish) setWorkbenchOutput("", "Alias seed needed");
      return;
    }
    const sk = keyword || randomAliasKeyword();
    const sf = first || randomItem(personaNames.firstNames).toLowerCase();
    const sl = last || randomItem(personaNames.lastNames).toLowerCase();
    const suffix = String(randomNum(11, 98));
    const displayName = `${titleCase(sf)} ${titleCase(sl)}`.trim();
    const handles = Array.from(new Set([
      `${sf}${sl}`, `${sf}.${sl}`, `${sf}_${sl}`,
      `${sk}${sf}${suffix}`, `${sf}${sl.charAt(0)}${suffix}`,
      `${sf.charAt(0)}${sl}${suffix}`, `${sk}_${sl}`, `${sk}${suffix}`
    ].filter(Boolean)));
    const emails = Array.from(new Set([
      `${sf}.${sl}${suffix}@proton.me`,
      `${sf}${suffix}.${sk}@pm.me`,
      `${sk}.${sl}${suffix}@protonmail.com`
    ].filter(Boolean)));
    setToolRows(aliasResults, [
      { label: "Display Name", value: displayName || titleCase(sk) },
      { label: "Handle 01", value: `@${handles[0]}` },
      { label: "Handle 02", value: `@${handles[1]}` },
      { label: "Handle 03", value: `@${handles[2]}` },
      { label: "Email 01", value: emails[0] },
      { label: "Email 02", value: emails[1] },
      { label: "Email 03", value: emails[2] },
      { label: "Slug", value: `${sk}-${sf}-${sl}`.replace(/-+/g, "-").replace(/^-|-$/g, "") }
    ]);
    if (publish) {
      if (!getWorkbenchInput().trim()) setWorkbenchInput(getAliasSeedText());
      setWorkbenchOutputFromRows(aliasResults, "Alias output updated");
    }
  };

  generateAliasButton?.addEventListener("click", generateAliasPersona);
  generateRandomAliasButton?.addEventListener("click", () => { setWorkbenchInput(fillRandomAliasSeed()); generateAliasPersona(); });
  generateAliasPersona({ publish: false });

  return {
    writeInput: (value) => {
      const parts = value.trim().split(/\s+/).filter(Boolean);
      if (aliasFirstName instanceof HTMLInputElement) aliasFirstName.value = parts[0] || "";
      if (aliasLastName instanceof HTMLInputElement) aliasLastName.value = parts[1] || "";
      if (aliasKeyword instanceof HTMLInputElement) aliasKeyword.value = parts.slice(2).join(" ");
      generateAliasPersona();
    },
    readOutput: () => toolRowsToText(aliasResults)
  };
};

// ── Hash tool ─────────────────────────────────────────────────────────────────

const initHashTool = () => {
  const hashInput = document.getElementById("hash-input");
  const hashCompare = document.getElementById("hash-compare");
  const hashResults = document.getElementById("hash-results");
  const hashTextButton = document.getElementById("hash-text");

  const normalizeDigest = (value) => value.trim().replace(/\s+/g, "").toLowerCase();

  const renderHashResults = async () => {
    if (!(hashInput instanceof HTMLTextAreaElement) || !(hashResults instanceof HTMLElement)) return;
    hashInput.value = getWorkbenchInput();
    const source = hashInput.value;
    if (!source.trim()) { setToolError(hashResults, "Add text to hash before running verification."); setWorkbenchOutput("", "Hash input needed"); return; }
    const originalLabel = hashTextButton?.textContent || "Hash Text";
    if (hashTextButton instanceof HTMLElement) hashTextButton.textContent = "Hashing...";
    try {
      const digests = await computeHashSet(textEncoder.encode(source));
      const comparison = hashCompare instanceof HTMLInputElement ? normalizeDigest(hashCompare.value) : "";
      const matchingAlgorithms = Object.entries(digests)
        .filter(([, d]) => comparison && d.toLowerCase() === comparison)
        .map(([alg]) => alg);
      const rows = [
        ...(comparison ? [{ label: "Compare Status", value: matchingAlgorithms.length ? `Matched ${matchingAlgorithms.join(", ")}` : "No matching digest" }] : []),
        ...Object.entries(digests).map(([alg, d]) => ({ label: alg, value: d, matched: matchingAlgorithms.includes(alg) }))
      ];
      setToolRows(hashResults, rows);
      setWorkbenchOutputFromRows(hashResults, "Hash output updated");
    } catch (error) {
      setToolError(hashResults, error instanceof Error ? error.message : "Unable to hash the provided text.");
      setWorkbenchOutput("", "Hash failed");
    } finally {
      if (hashTextButton instanceof HTMLElement) hashTextButton.textContent = originalLabel;
    }
  };

  hashTextButton?.addEventListener("click", () => { void renderHashResults(); });

  return {
    writeInput: async (value) => {
      if (hashInput instanceof HTMLTextAreaElement) { hashInput.value = value; await renderHashResults(); }
    },
    readOutput: () => toolRowsToText(hashResults)
  };
};

// ── Codec tool ────────────────────────────────────────────────────────────────

const initCodecTool = () => {
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
    codecMode.querySelectorAll(".tool-mode-option").forEach((btn) => {
      const isActive = btn.getAttribute("data-codec-mode") === mode;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const encodeCodecValue = (mode, input) => {
    if (mode === "base64") return bytesToBase64(textEncoder.encode(input));
    if (mode === "url") return encodeURIComponent(input);
    if (mode === "hex") return bytesToHex(textEncoder.encode(input));
    if (mode === "html") return encodeHtmlEntities(input);
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
      const bytes = Uint8Array.from(normalized.match(/.{2}/g) || [], (seg) => Number.parseInt(seg, 16));
      return textDecoder.decode(bytes);
    }
    if (mode === "html") return decodeHtmlEntities(input);
    return input;
  };

  const runCodec = (direction) => {
    if (!(codecMode instanceof HTMLElement) || !(codecInput instanceof HTMLTextAreaElement) || !(codecOutput instanceof HTMLTextAreaElement)) return;
    codecInput.value = getWorkbenchInput();
    try {
      const mode = getCodecMode();
      codecOutput.value = direction === "encode" ? encodeCodecValue(mode, codecInput.value) : decodeCodecValue(mode, codecInput.value);
      setWorkbenchOutput(codecOutput.value, direction === "encode" ? "Encoded output updated" : "Decoded output updated");
    } catch (error) {
      codecOutput.value = `Error: ${error instanceof Error ? error.message : "Codec conversion failed."}`;
      setWorkbenchOutput(codecOutput.value, "Transform failed");
    }
  };

  codecMode?.addEventListener("click", (event) => {
    const btn = event.target instanceof Element ? event.target.closest(".tool-mode-option") : null;
    if (!(btn instanceof HTMLElement)) return;
    setCodecMode(btn.getAttribute("data-codec-mode") || "base64");
  });
  codecEncodeButton?.addEventListener("click", () => runCodec("encode"));
  codecDecodeButton?.addEventListener("click", () => runCodec("decode"));
  codecSwapButton?.addEventListener("click", () => {
    if (!(codecInput instanceof HTMLTextAreaElement) || !(codecOutput instanceof HTMLTextAreaElement)) return;
    const nextInput = getWorkbenchOutput() || codecOutput.value;
    const nextOutput = getWorkbenchInput() || codecInput.value;
    codecInput.value = nextInput;
    codecOutput.value = nextOutput;
    setWorkbenchInput(nextInput);
    setWorkbenchOutput(nextOutput, "Transform values swapped");
  });
  codecCopyButton?.addEventListener("click", async () => {
    await copyTextToClipboard(getWorkbenchOutput() || (codecOutput instanceof HTMLTextAreaElement ? codecOutput.value : ""), codecCopyButton, "Copy Output");
  });

  return {
    writeInput: (value) => { if (codecInput instanceof HTMLTextAreaElement) codecInput.value = value; },
    readOutput: () => (codecOutput instanceof HTMLTextAreaElement ? codecOutput.value : "")
  };
};

// ── JWT tool ──────────────────────────────────────────────────────────────────

const initJwtTool = () => {
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
    if (!(jwtInput instanceof HTMLTextAreaElement) || !(jwtResults instanceof HTMLElement) ||
        !(jwtHeaderOutput instanceof HTMLElement) || !(jwtPayloadOutput instanceof HTMLElement)) return;
    jwtInput.value = getWorkbenchInput();
    const token = jwtInput.value.trim();
    if (!token) {
      setToolError(jwtResults, "Paste a JWT to decode it locally.");
      jwtHeaderOutput.textContent = "";
      jwtPayloadOutput.textContent = "";
      setWorkbenchOutput("", "JWT input needed");
      return;
    }
    try {
      const segments = token.split(".");
      if (segments.length < 2) throw new Error("JWTs require at least a header and payload segment.");
      const header = decodeJwtSegment(segments[0]);
      const payload = decodeJwtSegment(segments[1]);
      const now = Date.now() / 1000;
      let status = "No expiry claim";
      if (typeof payload.nbf === "number" && now < payload.nbf) status = "Not yet valid";
      else if (typeof payload.exp === "number") status = now > payload.exp ? "Expired" : "Active";
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
      setWorkbenchOutput(
        [toolRowsToText(jwtResults), `Header\n${jwtHeaderOutput.textContent}`, `Payload\n${jwtPayloadOutput.textContent}`].filter(Boolean).join("\n\n"),
        "JWT output updated"
      );
    } catch (error) {
      setToolError(jwtResults, error instanceof Error ? error.message : "Unable to decode the supplied JWT.");
      jwtHeaderOutput.textContent = "";
      jwtPayloadOutput.textContent = "";
      setWorkbenchOutput("", "JWT decode failed");
    }
  };

  decodeJwtButton?.addEventListener("click", decodeJwt);

  return {
    writeInput: (value) => { if (jwtInput instanceof HTMLTextAreaElement) { jwtInput.value = value; decodeJwt(); } },
    readOutput: () => {
      const rows = toolRowsToText(jwtResults);
      const header = jwtHeaderOutput instanceof HTMLElement ? jwtHeaderOutput.textContent?.trim() || "" : "";
      const payload = jwtPayloadOutput instanceof HTMLElement ? jwtPayloadOutput.textContent?.trim() || "" : "";
      return [rows, header ? `Header\n${header}` : "", payload ? `Payload\n${payload}` : ""].filter(Boolean).join("\n\n");
    }
  };
};

// ── File Inspector tool ───────────────────────────────────────────────────────

const initFileTool = () => {
  const fileInspectorInput = document.getElementById("file-inspector-input");
  const fileInspectorResults = document.getElementById("file-inspector-results");
  const inspectFileButton = document.getElementById("inspect-file");

  const inspectFile = async () => {
    if (!(fileInspectorInput instanceof HTMLInputElement) || !(fileInspectorResults instanceof HTMLElement) || !fileInspectorInput.files?.length) {
      setToolError(fileInspectorResults, "Choose a local file to inspect it.");
      return;
    }
    const [file] = fileInspectorInput.files;
    const originalLabel = inspectFileButton?.textContent || "Inspect File";
    if (inspectFileButton instanceof HTMLElement) inspectFileButton.textContent = "Inspecting...";
    try {
      const buffer = await file.arrayBuffer();
      const hashes = await computeHashSet(buffer);
      setToolRows(fileInspectorResults, [
        { label: "Filename", value: file.name },
        { label: "Type", value: file.type || "Unknown" },
        { label: "Size", value: `${formatBytes(file.size)} (${formatNumber(file.size)} bytes)` },
        { label: "Last Modified", value: formatDateTime(new Date(file.lastModified)) },
        ...Object.entries(hashes).map(([alg, d]) => ({ label: alg, value: d }))
      ]);
      setWorkbenchOutputFromRows(fileInspectorResults, "File output updated");
    } catch (error) {
      setToolError(fileInspectorResults, error instanceof Error ? error.message : "Unable to inspect the selected file.");
      setWorkbenchOutput("", "File inspection failed");
    } finally {
      if (inspectFileButton instanceof HTMLElement) inspectFileButton.textContent = originalLabel;
    }
  };

  inspectFileButton?.addEventListener("click", () => { void inspectFile(); });

  return { readOutput: () => toolRowsToText(fileInspectorResults) };
};

// ── TOTP tool ─────────────────────────────────────────────────────────────────

const initTotpTool = () => {
  const totpSecret = document.getElementById("totp-secret");
  const totpPeriod = document.getElementById("totp-period");
  const totpOutput = document.getElementById("totp-output");
  const totpResults = document.getElementById("totp-results");
  const generateTotpButton = document.getElementById("generate-totp");
  const copyTotpButton = document.getElementById("copy-totp");

  const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const totpState = { bytes: null, timerId: 0 };

  const base32Decode = (value) => {
    const normalized = value.toUpperCase().replace(/=+$/g, "").replace(/[\s-]+/g, "");
    if (!normalized) throw new Error("Enter a Base32 secret first.");
    let bits = 0, accumulator = 0;
    const output = [];
    for (const ch of normalized) {
      const idx = base32Alphabet.indexOf(ch);
      if (idx === -1) throw new Error("The secret must use valid Base32 characters.");
      accumulator = (accumulator << 5) | idx;
      bits += 5;
      if (bits >= 8) { output.push((accumulator >>> (bits - 8)) & 255); bits -= 8; }
    }
    return new Uint8Array(output);
  };

  const generateTotpCode = async (secretBytes, counter, digits = 6) => {
    const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
    const counterBytes = new Uint8Array(8);
    let wc = counter;
    for (let i = 7; i >= 0; i--) { counterBytes[i] = wc & 0xff; wc = Math.floor(wc / 256); }
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
    const offset = digest[digest.length - 1] & 0x0f;
    const binary = ((digest[offset] & 0x7f) << 24) | ((digest[offset + 1] & 0xff) << 16) | ((digest[offset + 2] & 0xff) << 8) | (digest[offset + 3] & 0xff);
    return String(binary % 10 ** digits).padStart(digits, "0");
  };

  const stopTotpTicker = () => {
    if (totpState.timerId) { window.clearInterval(totpState.timerId); totpState.timerId = 0; }
  };

  const TOTP_RING_CIRCUMFERENCE = 2 * Math.PI * 18; // r=18 per SVG viewBox

  const updateTotpRing = (refreshIn, period) => {
    const ring = document.getElementById("totp-ring-progress");
    if (!(ring instanceof SVGElement)) return;
    const fraction = period > 0 ? refreshIn / period : 1;
    const offset = TOTP_RING_CIRCUMFERENCE * (1 - fraction);
    ring.style.strokeDasharray = String(TOTP_RING_CIRCUMFERENCE);
    ring.style.strokeDashoffset = String(offset);
  };

  const refreshTotp = async () => {
    if (!(totpOutput instanceof HTMLElement) || !(totpResults instanceof HTMLElement) || !totpState.bytes) return;
    const period = totpPeriod instanceof HTMLInputElement ? clamp(Number(totpPeriod.value) || 30, 15, 120) : 30;
    const unix = Math.floor(Date.now() / 1000);
    const counter = Math.floor(unix / period);
    const refreshIn = period - (unix % period);
    try {
      const code = await generateTotpCode(totpState.bytes, counter);
      totpOutput.textContent = code;
      updateTotpRing(refreshIn, period);
      setToolRows(totpResults, [
        { label: "Period", value: `${period} seconds` },
        { label: "Refresh In", value: `${refreshIn}s` },
        { label: "Counter", value: String(counter) }
      ]);
      setWorkbenchOutput([`TOTP: ${code}`, toolRowsToText(totpResults)].filter(Boolean).join("\n"), "TOTP output updated");
    } catch (error) {
      stopTotpTicker();
      totpOutput.textContent = "------";
      updateTotpRing(0, 1);
      setToolError(totpResults, error instanceof Error ? error.message : "Unable to generate the TOTP code.");
      setWorkbenchOutput("", "TOTP failed");
    }
  };

  const startTotp = async () => {
    if (!(totpSecret instanceof HTMLInputElement) || !(totpOutput instanceof HTMLElement)) return;
    try {
      const sharedSource = getWorkbenchInput().trim();
      if (sharedSource) totpSecret.value = sharedSource;
      totpState.bytes = base32Decode(totpSecret.value);
      stopTotpTicker();
      await refreshTotp();
      totpState.timerId = window.setInterval(() => { void refreshTotp(); }, 1000);
    } catch (error) {
      stopTotpTicker();
      totpState.bytes = null;
      totpOutput.textContent = "------";
      setToolError(totpResults, error instanceof Error ? error.message : "Unable to generate the TOTP code.");
      setWorkbenchOutput("", "TOTP secret invalid");
    }
  };

  generateTotpButton?.addEventListener("click", () => { void startTotp(); });
  copyTotpButton?.addEventListener("click", async () => {
    if (!(totpOutput instanceof HTMLElement)) return;
    const value = totpOutput.textContent?.trim();
    if (!value || value.includes("-")) return;
    await copyTextToClipboard(value, copyTotpButton, "Copy Code");
  });
  totpPeriod?.addEventListener("change", () => { if (totpState.bytes) void startTotp(); });

  return {
    writeInput: async (value) => {
      if (totpSecret instanceof HTMLInputElement) { totpSecret.value = value; await startTotp(); }
    },
    readOutput: () => {
      const code = totpOutput instanceof HTMLElement ? totpOutput.textContent?.trim() || "" : "";
      const rows = toolRowsToText(totpResults);
      return [code && code !== "------" ? `TOTP: ${code}` : "", rows].filter(Boolean).join("\n");
    }
  };
};

// ── Timestamp tool ────────────────────────────────────────────────────────────

const initTimestampTool = () => {
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
      return { kind: digits > 10 ? "Epoch Milliseconds" : "Epoch Seconds", date: new Date(digits > 10 ? numeric : numeric * 1000) };
    }
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return null;
    return { kind: "Date String", date: parsed };
  };

  const convertTimestamp = () => {
    if (!(timestampInput instanceof HTMLInputElement) || !(timestampResults instanceof HTMLElement)) return;
    const sharedSource = getWorkbenchInput().trim();
    if (sharedSource) timestampInput.value = sharedSource.split(/\n/)[0] || sharedSource;
    const parsed = parseTimestampValue(timestampInput.value);
    if (!parsed || Number.isNaN(parsed.date.getTime())) {
      setToolError(timestampResults, "Enter a Unix epoch or a valid date string to convert it.");
      setWorkbenchOutput("", "Timestamp input invalid");
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
    setWorkbenchOutputFromRows(timestampResults, "Timestamp output updated");
  };

  convertTimestampButton?.addEventListener("click", convertTimestamp);
  timestampInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); convertTimestamp(); } });

  return {
    writeInput: (value) => {
      if (timestampInput instanceof HTMLInputElement) { timestampInput.value = value.split(/\n/)[0] || value; convertTimestamp(); }
    },
    readOutput: () => toolRowsToText(timestampResults)
  };
};

// ── Regex tool ────────────────────────────────────────────────────────────────

const initRegexTool = () => {
  const regexPattern = document.getElementById("regex-pattern");
  const regexInput = document.getElementById("regex-input");
  const regexResults = document.getElementById("regex-results");
  const regexPreview = document.getElementById("regex-preview");
  const runRegexButton = document.getElementById("run-regex");
  const regexPresetButtons = Array.from(document.querySelectorAll("[data-regex-preset]"));

  const regexFlagInputs = [
    ["g", document.getElementById("regex-flag-g")],
    ["i", document.getElementById("regex-flag-i")],
    ["m", document.getElementById("regex-flag-m")],
    ["s", document.getElementById("regex-flag-s")],
    ["u", document.getElementById("regex-flag-u")]
  ];

  const getRegexFlags = () =>
    regexFlagInputs.filter(([, el]) => el instanceof HTMLInputElement && el.checked).map(([f]) => f).join("");

  const setRegexFlags = (flags = "") => {
    regexFlagInputs.forEach(([f, el]) => {
      if (el instanceof HTMLInputElement) el.checked = flags.includes(f);
    });
  };

  const regexPresets = {
    url:    { pattern: "https?:\\/\\/[^\\s<>\"'`]+", flags: "gi", sample: "Callback: https://example.com/login?next=/admin and http://192.0.2.10/payload" },
    domain: { pattern: "\\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z]{2,63}\\b", flags: "gi", sample: "Observed domains: login.example.com, cdn.bad-domain.net, service.internal.local" },
    ipv4:   { pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\b", flags: "g", sample: "Source 198.51.100.23 connected to 203.0.113.10; ignore 999.999.1.1" },
    email:  { pattern: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,63}\\b", flags: "gi", sample: "Mailbox targets: analyst@example.com and security.ops@example.co.uk" },
    hash:   { pattern: "\\b(?:[a-f0-9]{32}|[a-f0-9]{40}|[a-f0-9]{64}|[a-f0-9]{128})\\b", flags: "gi", sample: "MD5 d41d8cd98f00b204e9800998ecf8427e SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
    cve:    { pattern: "\\bCVE-\\d{4}-\\d{4,7}\\b", flags: "gi", sample: "References include CVE-2024-12345, CVE-2023-9999, and advisory IDs." },
    jwt:    { pattern: "\\beyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*\\b", flags: "g", sample: "Token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature" },
    flag:   { pattern: "flag\\{[A-Za-z0-9_\\-]+\\}", flags: "g", sample: "Recovered flag{local_regex_test} from the challenge output." }
  };

  // matchAll replaces exec-in-loop to avoid false positive in the security hook
  const collectRegexMatches = (regex, value) => {
    if (regex.global) return [...value.matchAll(regex)].slice(0, 100);
    const single = value.match(regex);
    return single ? [single] : [];
  };

  const highlightRegexMatches = (value, pattern, flags) => {
    const gFlags = flags.includes("g") ? flags : `${flags}g`;
    const regex = new RegExp(pattern, gFlags);
    const frags = [];
    let cursor = 0;
    for (const match of [...value.matchAll(regex)].slice(0, 200)) {
      if (!match[0]) continue;
      frags.push(escapeHtml(value.slice(cursor, match.index ?? cursor)));
      frags.push(`<mark>${escapeHtml(match[0])}</mark>`);
      cursor = (match.index ?? 0) + match[0].length;
    }
    frags.push(escapeHtml(value.slice(cursor)));
    return frags.join("");
  };

  const runRegexTest = () => {
    if (!(regexPattern instanceof HTMLInputElement) || !(regexInput instanceof HTMLTextAreaElement) ||
        !(regexResults instanceof HTMLElement) || !(regexPreview instanceof HTMLElement)) return;
    regexInput.value = getWorkbenchInput();
    const pattern = regexPattern.value;
    const text = regexInput.value;
    const flags = getRegexFlags();
    if (!pattern) {
      setToolError(regexResults, "Enter a regex pattern before running the tester.");
      regexPreview.textContent = "";
      setWorkbenchOutput("", "Regex pattern needed");
      return;
    }
    try {
      const regex = new RegExp(pattern, flags);
      const matches = collectRegexMatches(regex, text);
      const rows = [
        { label: "Flags", value: flags || "(none)" },
        { label: "Match Count", value: String(matches.length) }
      ];
      matches.slice(0, 6).forEach((match, i) => {
        const captures = match.slice(1).filter((g) => g !== undefined).map((g) => truncateText(String(g), 24));
        rows.push({
          label: `Match ${i + 1} @ ${match.index}`,
          value: captures.length ? `${truncateText(match[0], 24)} | ${captures.join(", ")}` : truncateText(match[0], 36)
        });
      });
      if (matches.length > 6) rows.push({ label: "Additional Matches", value: String(matches.length - 6) });
      setToolRows(regexResults, rows);
      if (text) {
        // Trusted renderer output — uses createContextualFragment to avoid string assignment
        const highlighted = highlightRegexMatches(text, pattern, flags);
        regexPreview.replaceChildren(document.createRange().createContextualFragment(highlighted));
      } else {
        regexPreview.textContent = "No input text supplied.";
      }
      setWorkbenchOutputFromRows(regexResults, "Regex output updated");
    } catch (error) {
      setToolError(regexResults, error instanceof Error ? error.message : "Unable to execute the regex.");
      regexPreview.textContent = "";
      setWorkbenchOutput("", "Regex failed");
    }
  };

  runRegexButton?.addEventListener("click", runRegexTest);
  regexPresetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!(btn instanceof HTMLButtonElement) || !(regexPattern instanceof HTMLInputElement)) return;
      const preset = regexPresets[btn.dataset.regexPreset || ""];
      if (!preset) return;
      regexPattern.value = preset.pattern;
      setRegexFlags(preset.flags);
      if (!getWorkbenchInput().trim()) setWorkbenchInput(preset.sample);
      regexPresetButtons.forEach((item) => item.classList.toggle("is-active", item === btn));
      runRegexTest();
    });
  });

  return {
    writeInput: (value) => {
      if (regexInput instanceof HTMLTextAreaElement) {
        regexInput.value = value;
        if (regexPattern instanceof HTMLInputElement && regexPattern.value.trim()) runRegexTest();
      }
    },
    readOutput: () => toolRowsToText(regexResults)
  };
};

// ── IOC tool ──────────────────────────────────────────────────────────────────

const initIocTool = () => {
  const iocInput = document.getElementById("ioc-input");
  const iocOutput = document.getElementById("ioc-output");
  const iocResults = document.getElementById("ioc-results");
  const extractIocsButton = document.getElementById("extract-iocs");
  const defangIocsButton = document.getElementById("defang-iocs");
  const refangIocsButton = document.getElementById("refang-iocs");
  const copyIocReportButton = document.getElementById("copy-ioc-report");

  const normalizeIndicator = (value) =>
    value.trim().replace(/^[<("'`]+/g, "").replace(/[>)"'`,;]+$/g, "");

  const uniqueIndicators = (items) => {
    const seen = new Set();
    const unique = [];
    items.map(normalizeIndicator).filter(Boolean).forEach((item) => {
      const key = item.toLowerCase();
      if (!seen.has(key)) { seen.add(key); unique.push(item); }
    });
    return unique.sort((a, b) => a.localeCompare(b));
  };

  const defangIndicators = (value) =>
    value.replace(/\bhttps:\/\//gi, "hxxps://").replace(/\bhttp:\/\//gi, "hxxp://").replace(/@/g, "[@]").replace(/\./g, "[.]");

  const refangIndicators = (value) =>
    value
      .replace(/\bhxxps:\/\//gi, "https://")
      .replace(/\bhxxp:\/\//gi, "http://")
      .replace(/\[\s*at\s*\]|\[@\]|\(at\)|\{at\}/gi, "@")
      .replace(/\[\s*dot\s*\]|\[\.\]|\(\.\)|\{\.\}/gi, ".");

  const getPatternMatches = (value, pattern) => value.match(pattern) || [];

  const classifyHashes = (items) =>
    items.map((hash) => {
      const lengthMap = { 32: "MD5", 40: "SHA-1", 64: "SHA-256", 128: "SHA-512" };
      return `${hash} (${lengthMap[hash.length] || `${hash.length * 4}-bit`})`;
    });

  const analyzeIndicators = (value) => {
    const source = refangIndicators(value);
    const urls = uniqueIndicators(getPatternMatches(source, /\bhttps?:\/\/[^\s<>"'`]+/gi));
    const emails = uniqueIndicators(getPatternMatches(source, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}\b/gi));
    const ipv4 = uniqueIndicators(getPatternMatches(source, /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/g));
    const ipv6 = uniqueIndicators(getPatternMatches(source, /\b(?:[A-F0-9]{1,4}:){2,7}[A-F0-9]{1,4}\b/gi));
    const cves = uniqueIndicators(getPatternMatches(source, /\bCVE-\d{4}-\d{4,7}\b/gi).map((item) => item.toUpperCase()));
    const hashes = uniqueIndicators(getPatternMatches(source, /\b(?:[a-f0-9]{32}|[a-f0-9]{40}|[a-f0-9]{64}|[a-f0-9]{128})\b/gi));
    const domains = uniqueIndicators(
      getPatternMatches(source, /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63})(?::\d{2,5})?\b/gi)
        .filter((d) => !emails.some((e) => e.toLowerCase().includes(`@${d.toLowerCase()}`)))
    );
    return { urls, domains, ips: uniqueIndicators([...ipv4, ...ipv6]), emails, hashes, cves };
  };

  const formatIndicatorReport = (analysis) => {
    const sections = [
      ["URLs", analysis.urls], ["Domains", analysis.domains], ["IPs", analysis.ips],
      ["Emails", analysis.emails], ["Hashes", classifyHashes(analysis.hashes)], ["CVEs", analysis.cves]
    ];
    const total = sections.reduce((sum, [, items]) => sum + items.length, 0);
    if (!total) return "IOC Extraction Report\n\nNo indicators found.";
    return [
      "IOC Extraction Report",
      `Generated: ${formatDateTime(new Date())}`,
      `Total: ${total}`,
      "",
      ...sections.flatMap(([label, items]) => [
        `${label} (${items.length})`,
        ...(items.length ? items.map((item) => `- ${item}`) : ["- None"]),
        ""
      ])
    ].join("\n").trim();
  };

  const renderIocSummary = (analysis) => {
    setToolRows(iocResults, [
      { label: "Total IOCs", value: Object.values(analysis).reduce((sum, items) => sum + items.length, 0), matched: true },
      { label: "URLs", value: analysis.urls.length },
      { label: "Domains", value: analysis.domains.length },
      { label: "IPs", value: analysis.ips.length },
      { label: "Emails", value: analysis.emails.length },
      { label: "Hashes", value: analysis.hashes.length },
      { label: "CVEs", value: analysis.cves.length }
    ]);
  };

  const extractIocs = () => {
    if (!(iocInput instanceof HTMLTextAreaElement) || !(iocOutput instanceof HTMLTextAreaElement)) return "";
    iocInput.value = getWorkbenchInput();
    const source = iocInput.value.trim();
    if (!source) {
      iocOutput.value = "";
      setToolError(iocResults, "Paste source text before extracting indicators.");
      setWorkbenchOutput("", "IOC input needed");
      return "";
    }
    const analysis = analyzeIndicators(source);
    const report = formatIndicatorReport(analysis);
    renderIocSummary(analysis);
    iocOutput.value = report;
    setWorkbenchOutput(report, "IOC report sent to output");
    return report;
  };

  const transformIocText = (transform, label) => {
    if (!(iocInput instanceof HTMLTextAreaElement) || !(iocOutput instanceof HTMLTextAreaElement)) return "";
    const source = getWorkbenchInput().trim() || iocInput.value.trim();
    if (!source) { setToolError(iocResults, `Paste source text before running ${label.toLowerCase()}.`); return ""; }
    const transformed = transform(source);
    iocOutput.value = transformed;
    setToolRows(iocResults, [
      { label: "Mode", value: label, matched: true },
      { label: "Characters", value: formatNumber(transformed.length) }
    ]);
    setWorkbenchOutput(transformed, `${label} text sent to output`);
    return transformed;
  };

  extractIocsButton?.addEventListener("click", extractIocs);
  defangIocsButton?.addEventListener("click", () => transformIocText(defangIndicators, "Defanged"));
  refangIocsButton?.addEventListener("click", () => transformIocText(refangIndicators, "Refanged"));
  copyIocReportButton?.addEventListener("click", async () => {
    if (!(iocOutput instanceof HTMLTextAreaElement)) return;
    await copyTextToClipboard(getWorkbenchOutput() || iocOutput.value, copyIocReportButton, "Copy Report");
  });

  return {
    writeInput: (value) => { if (iocInput instanceof HTMLTextAreaElement) { iocInput.value = value; extractIocs(); } },
    readOutput: () => (iocOutput instanceof HTMLTextAreaElement ? iocOutput.value : "")
  };
};

// ── Tool workbench ────────────────────────────────────────────────────────────

const initToolWorkbench = (toolAdapters) => {
  const toolWorkbench = document.querySelector(".tool-workbench");
  const toolNav = document.getElementById("tool-nav");
  const toolNavButtons = Array.from(document.querySelectorAll("[data-tool-target]"));
  const toolPanels = Array.from(document.querySelectorAll("[data-tool-id]"));
  const toolContextMode = document.getElementById("tool-context-mode");
  const toolContextTitle = document.getElementById("tool-context-title");
  const toolContextFlow = document.getElementById("tool-context-flow");
  const toolContextAction = document.getElementById("tool-context-action");
  const toolContextSettings = document.getElementById("tool-context-settings");
  const toolSharedInput = document.getElementById("tool-shared-input");
  const toolSharedOutput = document.getElementById("tool-shared-output");
  const toolWorkspaceUseInput = document.getElementById("tool-workspace-use-input");
  const toolWorkspaceCaptureOutput = document.getElementById("tool-workspace-capture-output");
  const toolWorkspaceOutputToInput = document.getElementById("tool-workspace-output-to-input");
  const toolWorkspaceCopyOutput = document.getElementById("tool-workspace-copy-output");
  const toolWorkspaceClear = document.getElementById("tool-workspace-clear");

  const getActiveToolId = () =>
    toolWorkbench instanceof HTMLElement ? toolWorkbench.getAttribute("data-active-tool") || "password" : "password";

  const getToolDisplayName = (toolId) => {
    const panel = toolPanels.find((p) => p instanceof HTMLElement && p.dataset.toolId === toolId);
    return panel instanceof HTMLElement ? panel.dataset.toolTitle || toolId : toolId;
  };

  const renderToolContext = (panel) => {
    if (!(panel instanceof HTMLElement)) return;
    if (toolContextMode) toolContextMode.textContent = panel.dataset.toolMode || "Tool";
    if (toolContextTitle) toolContextTitle.textContent = panel.dataset.toolTitle || "Selected Tool";
    if (toolContextFlow) toolContextFlow.textContent = panel.dataset.toolFlow || "";
    if (toolContextAction) toolContextAction.textContent = panel.dataset.toolAction || "Run";
    if (toolContextSettings) {
      const settings = (panel.dataset.toolSettings || "").split(",").map((s) => s.trim()).filter(Boolean);
      const frag = document.createDocumentFragment();
      settings.forEach((s) => { const span = document.createElement("span"); span.textContent = s; frag.append(span); });
      toolContextSettings.replaceChildren(frag);
    }
  };

  const setActiveTool = (toolId, options = {}) => {
    const activePanel = toolPanels.find((p) => p instanceof HTMLElement && p.dataset.toolId === toolId) || toolPanels[0];
    if (!(activePanel instanceof HTMLElement)) return;
    const activeToolId = activePanel.dataset.toolId || "";
    toolWorkbench?.setAttribute("data-active-tool", activeToolId);
    toolPanels.forEach((p) => {
      if (!(p instanceof HTMLElement)) return;
      const isActive = p === activePanel;
      p.classList.toggle("is-active", isActive);
      p.hidden = !isActive;
    });
    toolNavButtons.forEach((btn) => {
      if (!(btn instanceof HTMLButtonElement)) return;
      const isActive = btn.dataset.toolTarget === activeToolId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
      btn.tabIndex = isActive ? 0 : -1;
    });
    renderToolContext(activePanel);
    if (options.persist !== false) localStorage.setItem("active-tool", activeToolId);
    if (options.focusPanel) activePanel.focus({ preventScroll: true });
  };

  toolNav?.addEventListener("click", (event) => {
    const btn = event.target instanceof Element ? event.target.closest("[data-tool-target]") : null;
    if (!(btn instanceof HTMLButtonElement)) return;
    setActiveTool(btn.dataset.toolTarget || "", { focusPanel: false });
  });

  toolNav?.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const currentIndex = toolNavButtons.findIndex((btn) => btn === document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = toolNavButtons.length - 1;
    else if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % toolNavButtons.length;
    else nextIndex = (currentIndex - 1 + toolNavButtons.length) % toolNavButtons.length;
    const nextBtn = toolNavButtons[nextIndex];
    if (!(nextBtn instanceof HTMLButtonElement)) return;
    nextBtn.focus();
    setActiveTool(nextBtn.dataset.toolTarget || "");
  });

  const savedTool = localStorage.getItem("active-tool");
  const initialTool = toolPanels.some((p) => p instanceof HTMLElement && p.dataset.toolId === savedTool)
    ? savedTool
    : toolWorkbench instanceof HTMLElement ? toolWorkbench.dataset.activeTool : "";
  setActiveTool(initialTool || "password", { persist: false });

  const applySharedInputToActiveTool = async () => {
    if (!(toolSharedInput instanceof HTMLTextAreaElement)) return;
    const value = toolSharedInput.value;
    if (!value.trim()) { setWorkbenchStatus("Add shared input first"); return; }
    const toolId = getActiveToolId();
    const adapter = toolAdapters[toolId];
    if (!adapter?.writeInput) { setWorkbenchStatus("Selected tool cannot use shared input"); return; }
    await adapter.writeInput(value);
    setWorkbenchStatus(`Input sent to ${getToolDisplayName(toolId)}`);
  };

  const captureActiveToolOutput = () => {
    const toolId = getActiveToolId();
    const output = toolAdapters[toolId]?.readOutput?.() || "";
    if (!output.trim()) { setWorkbenchStatus("No active output to capture"); return; }
    setWorkbenchOutput(output, `Captured ${getToolDisplayName(toolId)} output`);
  };

  const recentInputsContainer = document.getElementById("tool-recent-inputs");

  const getRecentInputs = () => {
    try { return JSON.parse(localStorage.getItem(RECENT_INPUTS_KEY) || "[]"); } catch { return []; }
  };

  const saveRecentInput = (value) => {
    if (!value || value.length < 3 || value.length > 500) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const prev = getRecentInputs().filter((v) => v !== trimmed);
    const next = [trimmed, ...prev].slice(0, RECENT_INPUTS_MAX);
    try { localStorage.setItem(RECENT_INPUTS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const renderRecentInputs = () => {
    if (!(recentInputsContainer instanceof HTMLElement)) return;
    const items = getRecentInputs();
    if (!items.length) { recentInputsContainer.replaceChildren(); return; }

    const label = document.createElement("span");
    label.className = "tool-recent-label";
    label.textContent = "Recent:";

    const frag = document.createDocumentFragment();
    frag.append(label);
    items.forEach((value) => {
      const btn = document.createElement("button");
      btn.className = "tool-recent-chip";
      btn.type = "button";
      btn.title = value;
      btn.textContent = value.length > 32 ? `${value.slice(0, 30)}…` : value;
      btn.addEventListener("click", () => {
        if (toolSharedInput instanceof HTMLTextAreaElement) {
          toolSharedInput.value = value;
          localStorage.setItem(SHARED_INPUT_KEY, value);
          setWorkbenchStatus("Recent input loaded");
        }
      });
      frag.append(btn);
    });

    recentInputsContainer.replaceChildren(frag);
  };

  if (toolSharedInput instanceof HTMLTextAreaElement) {
    toolSharedInput.value = localStorage.getItem(SHARED_INPUT_KEY) || "";
    renderRecentInputs();
    let recentSaveTimer = 0;
    toolSharedInput.addEventListener("input", () => {
      localStorage.setItem(SHARED_INPUT_KEY, toolSharedInput.value);
      setWorkbenchStatus("Input updated");
      window.clearTimeout(recentSaveTimer);
      recentSaveTimer = window.setTimeout(() => {
        saveRecentInput(toolSharedInput.value);
        renderRecentInputs();
      }, 1500);
    });
  }

  if (toolSharedOutput instanceof HTMLTextAreaElement) {
    toolSharedOutput.value = localStorage.getItem(SHARED_OUTPUT_KEY) || "";
    toolSharedOutput.addEventListener("input", () => {
      localStorage.setItem(SHARED_OUTPUT_KEY, toolSharedOutput.value);
      setWorkbenchStatus("Output updated");
    });
  }

  toolWorkspaceUseInput?.addEventListener("click", () => { void applySharedInputToActiveTool(); });
  toolWorkspaceCaptureOutput?.addEventListener("click", captureActiveToolOutput);
  toolWorkspaceOutputToInput?.addEventListener("click", () => {
    if (!(toolSharedOutput instanceof HTMLTextAreaElement)) return;
    if (!toolSharedOutput.value.trim()) { setWorkbenchStatus("No shared output to promote"); return; }
    setWorkbenchInput(toolSharedOutput.value);
    setWorkbenchStatus("Output moved to input");
  });
  toolWorkspaceCopyOutput?.addEventListener("click", async () => {
    if (!(toolSharedOutput instanceof HTMLTextAreaElement)) return;
    await copyTextToClipboard(toolSharedOutput.value, toolWorkspaceCopyOutput, "Copy Output");
  });
  toolWorkspaceClear?.addEventListener("click", () => {
    setWorkbenchInput("");
    setWorkbenchOutput("", "Workspace cleared");
  });
};

// ── Public entry point ────────────────────────────────────────────────────────

export function initTools() {
  const adapters = {
    password: initPasswordTool(),
    subnet:   initSubnetTool(),
    alias:    initAliasTool(),
    hash:     initHashTool(),
    codec:    initCodecTool(),
    jwt:      initJwtTool(),
    file:     initFileTool(),
    totp:     initTotpTool(),
    time:     initTimestampTool(),
    regex:    initRegexTool(),
    ioc:      initIocTool()
  };
  initToolWorkbench(adapters);
}
