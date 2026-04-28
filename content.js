export const portfolio = {
  github: {
    owner: "WelbourneSecurity",
    repo: "CTF-Writeups",
    branch: "main",
    autoDetectGithubPages: true
  },
  writeupFolders: [
    { label: "Hack The Box", description: "", key: "htb", path: "HTB" },
    { label: "TryHackMe", description: "", key: "thm", path: "THM" }
  ],
  profile: {
    name: "Welbourne Security",
    role: "Cyber Intelligence Portfolio",
    eyebrow: "Welbourne Security",
    headline: "Cyber Intelligence Projects, Tools, and Investigations.",
    summary:
      "A focused portfolio of security projects, local analyst utilities, credentials, and practical cyber intelligence workflows.",
    focus: "Signals intelligence and anonymity",
    signalTagline: "Private-sector intelligence and privacy",
    contactHeading: "Open to cyber intelligence and security-focused opportunities.",
    contactSummary:
      "For collaboration, hiring enquiries, or security opportunities, contact me directly or use the linked public profiles below.",
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
    { label: "Projects", value: "02" },
    { label: "Local Tools", value: "11" },
    { label: "Verified Creds", value: "05" }
  ],
  signalTags: [
    "Signals Intelligence",
    "Anonymity",
    "OSINT",
    "TryHackMe",
    "Hack The Box"
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
        "Cisco ethical hacking credential covering reconnaissance, exploitation concepts, vulnerability handling, and defensive security awareness.",
      issuer: "Credly",
      verificationUrl: "https://www.credly.com/badges/56385cdf-944a-481d-b441-274df8b16fc4/public_url",
      imagePath: "./src/ethical-hacker.png"
    },
    {
      title: "IBM Cybersecurity Fundamentals",
      description:
        "Foundational cybersecurity credential covering security concepts, threat types, controls, and basic operational practices.",
      issuer: "Credly",
      verificationUrl: "https://www.credly.com/badges/e54afb67-fbd1-43ab-8b52-e338eb096318/public_url",
      imagePath: "./src/cybersecurity-fundamentals.png"
    },
    {
      title: "ISC2 Certified in Cybersecurity",
      description:
        "ISC2 entry-level cybersecurity certification covering security principles, incident response, access controls, and network security basics.",
      issuer: "Credly",
      verificationUrl: "https://www.credly.com/badges/9f81cd7c-cf0b-48e9-9c71-bc37f6fe5fba/public_url",
      imagePath: "./src/certified-in-cybersecurity-cc.png"
    },
    {
      title: "ICS-300",
      description:
        "CISA Advanced Cybersecurity for Industrial Control Systems course covering ICS security, IT/OT defense concepts, network discovery and mapping, detection, exploitation process, and attack demonstrations.",
      issuer: "CISA",
      resourceUrl: "https://www.cisa.gov/resources-tools/training/advanced-cybersecurity-industrial-control-systems-ics300",
      resourceLabel: "View CISA ICS300 course",
      imagePath: "./src/cisa.png"
    },
    {
      title: "ICS-401",
      description:
        "CISA Industrial Control Systems Evaluation training focused on analyzing, evaluating, and documenting the cybersecurity posture of an ICS network using a repeatable assessment process.",
      issuer: "CISA",
      resourceUrl: "https://www.cisa.gov/resources-tools/training/industrial-control-systems-evaluation-401v",
      resourceLabel: "View CISA 401V course",
      imagePath: "./src/cisa.png"
    }
  ]
};
