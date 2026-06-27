import { Service } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

type CacheEntry = {
  response: HttpResponse<unknown>;
  timestamp: number;
};

@Service()
export class CacheService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly defaultTtl = 60000; // 60s in ms

  get(url: string): HttpResponse<unknown> | null {
    const entry = this.cache.get(url);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.defaultTtl;
    if (isExpired) {
      this.cache.delete(url);
      return null;
    }

    return entry.response;
  }

  set(url: string, response: HttpResponse<unknown>): void {
    this.cache.set(url, {
      response,
      timestamp: Date.now(),
    });
  }

  invalidate(urlPattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(urlPattern)) {
        this.cache.delete(key);
      }
    }
  }

  clearAll(): void {
    this.cache.clear();
  }
}
