import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import http from "http";
import https from "https";

/* Reusing sockets keeps the connection count down when several sites are
   crawled at once, which is what starves the local DNS resolver. */
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 8 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 8 });

const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

/* Network-level hiccups worth a second attempt. A DNS ENOTFOUND on a domain
   that plainly exists is almost always a momentary resolver failure, not a
   dead host, so it is retried rather than treated as fatal. */
const TRANSIENT_CODES = new Set([
  "ECONNABORTED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "EPIPE",
  "ERR_SOCKET_CONNECTION_TIMEOUT",
]);

function isTransient(err: any): boolean {
  // A response of any status means the host answered - not a transient fault.
  if (err?.response) return false;
  return TRANSIENT_CODES.has(err?.code) || /timeout/i.test(err?.message || "");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(url: string, timeout: number, attempts: number) {
  let lastErr: any;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await axios.get(url, {
        timeout,
        headers: REQUEST_HEADERS,
        httpAgent,
        httpsAgent,
        maxRedirects: 5,
        // Handle non-2xx below instead of turning a 403/404 into a retry-able throw.
        validateStatus: () => true,
      });
    } catch (err: any) {
      lastErr = err;

      if (attempt >= attempts || !isTransient(err)) break;

      const backoff = 800 * attempt;
      console.log(
        `RETRY ${attempt}/${attempts - 1} in ${backoff}ms: ${url} (${err.code || err.message})`
      );
      await sleep(backoff);
    }
  }

  throw lastErr;
}

export async function scrapeWebsite(
  startUrl: string,
  maxPages = 5
): Promise<{ url: string; html: string; text: string }[]> {

  const visited = new Set<string>();
  const queue: string[] = [startUrl];

  const scraped: { url: string; html: string; text: string }[] = [];

  const startDomain = new URL(startUrl).hostname;

  while (queue.length && scraped.length < maxPages) {

    const url = queue.shift()!;

    if (visited.has(url)) continue;

    visited.add(url);

    // The landing page decides whether the whole site yields any text, so it
    // gets a longer budget and retries; inner pages stay cheap.
    const isFirstPage = scraped.length === 0;

    try {

      console.log(`Scraping: ${url}`);

      const response = await fetchPage(
        url,
        isFirstPage ? 30000 : 15000,
        isFirstPage ? 3 : 1
      );

      const html = response.data;

      if (response.status >= 400) {
        console.log(`HTTP ${response.status} at ${url}`);
        continue;
      }

      if (!html || typeof html !== "string") {
        console.log(`Empty HTML at ${url}`);
        continue;
      }

      const $ = cheerio.load(html);

      // remove useless sections
      $(
        "script, style, noscript, svg, nav, footer, header, form, iframe"
      ).remove();

      // extract visible text
      let text = $("body").text();

      text = text
        .replace(/\s+/g, " ")
        .replace(/[^\w\s.,!?-]/g, "")
        .trim();

      // filter garbage lines
      text = text
        .split(".")
        .filter(
          (line) =>
            line.trim().length > 30 &&
            !/(home|about|contact|login|signup|privacy|terms)/i.test(line)
        )
        .join(". ");

      console.log(`TEXT LENGTH: ${text.length}`);

      scraped.push({
        url,
        html,
        text,
      });

      // discover internal links
      $("a[href]").each((_, el) => {

        let link = $(el).attr("href") || "";

        try {

          if (!link.startsWith("http")) {
            link = new URL(link, url).href;
          }

          const linkDomain = new URL(link).hostname;

          if (
            linkDomain === startDomain &&
            !visited.has(link) &&
            !queue.includes(link) &&
            link.startsWith("http")
          ) {

            if (
              !link.startsWith("mailto:") &&
              !link.includes("#")
            ) {
              queue.push(link);
            }
          }

        } catch {}
      });

    } catch (err: any) {

      console.log(`FAILED: ${url}`);

      if (err.response) {
        console.log("STATUS:", err.response.status);
      } else {
        console.log(err.message);
      }
    }
  }

  return scraped;
}
