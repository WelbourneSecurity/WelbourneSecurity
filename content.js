export const portfolio = {
  github: {
    owner: "WelbourneSecurity",
    repo: "CTF-Writeups",
    branch: "main",
    autoDetectGithubPages: true
  },
  profile: {
    name: "Welbourne Security",
    role: "Cyber Intelligence Portfolio",
    eyebrow: "Welbourne Security",
    headline: "Private Sector Cyber Intelligence Solutions.",
    summary:
      "Cybersecurity writeups, browser tools, certifications, and public profiles built for quick review.",
    focus: "Signals intelligence and anonymity",
    signalTagline: "Private-sector intelligence, privacy, and research",
    contactHeading: "Open to cyber intelligence, research, and security work.",
    contactSummary:
      "For collaboration, hiring enquiries, or research opportunities, contact me directly or use the linked public profiles below.",
    primaryAction: {
      label: "Email Me",
      href: "mailto:info@welbournesecurity.com"
    },
    secondaryAction: {
      label: "View LinkedIn",
      href: "https://www.linkedin.com/in/welbournesecurity/"
    },
    contactActions: [
      { label: "Email", href: "mailto:info@welbournesecurity.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/welbournesecurity/" },
      { label: "GitHub", href: "https://github.com/WelbourneSecurity" }
    ]
  },
  heroMetrics: [
    { label: "Writeups Ready", value: "01" },
    { label: "Certifications", value: "05" },
    { label: "Core Focus", value: "SIGINT + Privacy" }
  ],
  signalTags: [
    "Signals Intelligence",
    "Anonymity",
    "OSINT",
    "TryHackMe",
    "Hack The Box"
  ],
  writeupFolders: [
    {
      label: "Hack The Box",
      description: "",
      key: "htb",
      path: "HTB"
    },
    {
      label: "TryHackMe",
      description: "",
      key: "thm",
      path: "THM"
    }
  ],
  platformLinks: [
    {
      title: "LinkedIn",
      href: "https://www.linkedin.com/in/welbournesecurity/"
    },
    {
      title: "GitHub",
      href: "https://github.com/WelbourneSecurity"
    },
    {
      title: "Hack The Box",
      href: "https://profile.hackthebox.com/profile/019d5e35-f9f2-73c9-89fd-762d0cd0d177"
    },
    {
      title: "TryHackMe",
      href: "https://tryhackme.com/p/WelbourneSecurity"
    }
  ],
  certifications: [
    {
      title: "Cisco Ethical Hacker",
      description:
        "Replace this title with the exact certification name if you want the text to match the embedded badge.",
      issuer: "Credly",
      verificationUrl: "https://www.credly.com/badges/56385cdf-944a-481d-b441-274df8b16fc4/public_url",
      imagePath: "./src/ethical-hacker.png"
    },
    {
      title: "IBM Fundamentals",
      description:
        "This badge is already wired into the page using the share badge ID you provided.",
      issuer: "Credly",
      verificationUrl: "https://www.credly.com/badges/e54afb67-fbd1-43ab-8b52-e338eb096318/public_url",
      imagePath: "./src/cybersecurity-fundamentals.png"
    },
    {
      title: "CC",
      description:
        "Use the verification link or replace this copy with the exact cert summary you want recruiters to see.",
      issuer: "Credly",
      verificationUrl: "https://www.credly.com/badges/9f81cd7c-cf0b-48e9-9c71-bc37f6fe5fba/public_url",
      imagePath: "./src/certified-in-cybersecurity-cc.png"
    },
    {
      title: "ICS-300",
      description: "CISA cybersecurity and infrastructure security training badge.",
      issuer: "CISA",
      imagePath: "./src/cisa.png"
    },
    {
      title: "ICS-401",
      description: "CISA cybersecurity and infrastructure security training badge.",
      issuer: "CISA",
      imagePath: "./src/cisa.png"
    }
  ]
};
