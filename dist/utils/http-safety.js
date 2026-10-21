"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = exports.sleep = void 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
exports.sleep = sleep;
const fetchJson = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, retries = 4) {
    var _a;
    for (let attempt = 0;; attempt++) {
        try {
            const res = yield fetch(url, { signal: AbortSignal.timeout(15000) });
            if (res.ok)
                return yield res.json();
            // Only retry things that can succeed later
            const retryable = res.status === 429 || res.status >= 500;
            if (!retryable || attempt >= retries) {
                throw new Error(`HTTP ${res.status} for ${url}`);
            }
            const retryAfter = Number(res.headers.get("retry-after"));
            const wait = retryAfter
                ? retryAfter * 1000
                : 2 ** attempt * 1000 + Math.random() * 500;
            yield (0, exports.sleep)(wait);
        }
        catch (err) {
            // Network errors / timeouts land here
            const isHttpError = (_a = err.message) === null || _a === void 0 ? void 0 : _a.startsWith("HTTP");
            if (isHttpError || attempt >= retries)
                throw err;
            yield (0, exports.sleep)(2 ** attempt * 1000 + Math.random() * 500);
        }
    }
});
exports.fetchJson = fetchJson;
