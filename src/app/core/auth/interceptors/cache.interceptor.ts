import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, of, tap, shareReplay, finalize } from 'rxjs';
import { CacheService } from '../services/cache.service';

// Almacena las peticiones que están "en vuelo" (in-flight)
const pendingRequests = new Map<string, Observable<HttpEvent<unknown>>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cacheService = inject(CacheService);
  const cachedResponse = cacheService.get(req.urlWithParams);

  if (cachedResponse) {
    return of(cachedResponse);
  }

  // Si ya hay una petición idéntica en vuelo, nos suscribimos a ella
  if (pendingRequests.has(req.urlWithParams)) {
    return pendingRequests.get(req.urlWithParams)!;
  }

  // Si no, iniciamos la petición y la compartimos (shareReplay)
  const sharedRequest$ = next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cacheService.set(req.urlWithParams, event);
      }
    }),
    finalize(() => {
      // Limpiamos el mapa cuando la petición termine (éxito o error)
      pendingRequests.delete(req.urlWithParams);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Guardamos el observable compartido
  pendingRequests.set(req.urlWithParams, sharedRequest$);

  return sharedRequest$;
};
