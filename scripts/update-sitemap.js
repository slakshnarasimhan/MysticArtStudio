const { execSync } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const path = require("node:path");

const baseUrl = "https://artbrush.co";
const entries = [
  { loc: "/", file: "index.html" },
  { loc: "/brand.html", file: "brand.html" },
  { loc: "/merchandise.html", file: "merchandise.html" },
  { loc: "/affordable.html", file: "affordable.html" },
  { loc: "/about.html", file: "about.html" },
  { loc: "/blog.html", file: "blog.html" },
  { loc: "/faq.html", file: "faq.html" },
  { loc: "/contact.html", file: "contact.html" },
  { loc: "/art-therapy.html", file: "art-therapy.html" },
  { loc: "/art-therapy-practice.html", file: "art-therapy-practice.html" },
];

const getLastMod = (file) => {
  try {
    const result = execSync(`git log -1 --format=%cs -- "${file}"`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return result || new Date().toISOString().slice(0, 10);
  } catch (error) {
    return new Date().toISOString().slice(0, 10);
  }
};

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((entry) => {
    const lastmod = getLastMod(entry.file);
    return [
      "  <url>",
      `    <loc>${baseUrl}${entry.loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "  </url>",
    ].join("\n");
  }),
  "</urlset>",
  "",
].join("\n");

writeFileSync(path.join(__dirname, "..", "sitemap.xml"), xml);
