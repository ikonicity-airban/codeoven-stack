---
name: web-scraping-intelligence
description: Production web scraping and content extraction engine. Automates dynamic SPA rendering with Playwright, extracts clean readable Markdown, handles pagination and infinite scroll, and runs automated website change monitoring.
---

# Web Scraping & Content Extraction Intelligence Skill

A robust engineering playbook for extracting high-signal data, real-time news, documentation, and structured datasets from any modern website.

---

## 1. Scraping Tool Matrix

| Scenario | Recommended Stack | Key Advantage |
| :--- | :--- | :--- |
| **Static HTML & Fast Extraction** | `cheerio`, `axios` (Node) or `httpx`, `BeautifulSoup4` (Python) | Microsecond execution, zero browser memory overhead |
| **Dynamic SPAs / Client-Rendered** | `playwright` (Chromium / Firefox / WebKit) | Handles hydration, virtual DOM, shadow roots, infinite scrolling |
| **Clean Article & Blog Extraction** | `@mozilla/readability` + `turndown` | Strips navigation, sidebars, cookie banners, ads; outputs pure clean Markdown |
| **Scheduled Delta & Change Monitoring**| GitHub Actions / Cron + hash diffing | Alerts only when new articles, release notes, or prices change |

---

## 2. Production Playwright Dynamic Scraper (Node.js)

```typescript
import { chromium } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

export async function scrapeCleanMarkdown(url: string): Promise<{ title: string; content: string; url: string }> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  try {
    // Navigate with sensible wait condition
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Auto-scroll to trigger lazy loading / dynamic feeds
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= 2000) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    const html = await page.content();
    
    // Parse through Mozilla Readability for article extraction
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error(`Failed to extract readable article content from ${url}`);
    }

    // Convert clean HTML to GitHub-flavored Markdown
    const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
    const markdown = turndown.turndown(article.content);

    return {
      title: article.title || '',
      content: markdown,
      url,
    };
  } finally {
    await browser.close();
  }
}
```

---

## 3. High-Speed Python Extraction with `httpx` & `selectolax`

For high-volume scraping of non-heavily obfuscated sites:

```python
import httpx
from selectolax.parser import HTMLParser

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def extract_latest_updates(url: str, item_selector: str, title_selector: str, link_selector: str):
    with httpx.Client(headers=HEADERS, timeout=15.0, follow_redirects=True) as client:
        response = client.get(url)
        response.raise_for_status()
        
    tree = HTMLParser(response.text)
    items = []
    
    for node in tree.css(item_selector):
        title_node = node.css_first(title_selector)
        link_node = node.css_first(link_selector)
        if title_node and link_node:
            items.append({
                "title": title_node.text(strip=True),
                "link": link_node.attributes.get("href", ""),
            })
            
    return items
```

---

## 4. Website Change & Release Monitor (Delta Tracking)

To monitor product releases, changelogs, or documentation updates without constant manual scraping:
1. **Content Hashing**: Compute SHA-256 hash of the sanitized text body.
2. **Snapshot Storage**: Store `{ url, last_seen_hash, updated_at }` in SQLite / JSON.
3. **Diff Trigger**: When `new_hash !== last_seen_hash`, extract the new diff paragraphs and trigger a webhook notification (Slack, Discord, Email).
