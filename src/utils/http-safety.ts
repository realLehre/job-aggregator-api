export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const fetchJson = async (url: string, retries = 4): Promise<any> => {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });

      if (res.ok) return await res.json();

      // Only retry things that can succeed later
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= retries) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }

      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = retryAfter
        ? retryAfter * 1000
        : 2 ** attempt * 1000 + Math.random() * 500;
      await sleep(wait);
    } catch (err: any) {
      // Network errors / timeouts land here
      const isHttpError = err.message?.startsWith("HTTP");
      if (isHttpError || attempt >= retries) throw err;
      await sleep(2 ** attempt * 1000 + Math.random() * 500);
    }
  }
};
