import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('https://api.github.com')) {
    return next(req);
  }

  const apiReq = req.clone({
    setHeaders: { Accept: 'application/vnd.github+json' }
  });

  const startedAt = performance.now();

  return next(apiReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const ms = Math.round(performance.now() - startedAt);
          console.log(`[API] ${req.method} ${req.urlWithParams} -> ${event.status} (${ms} ms)`);
        }
      },
      error: (err: HttpErrorResponse) => {
        const ms = Math.round(performance.now() - startedAt);
        console.error(`[API] ${req.method} ${req.urlWithParams} FAILED -> ${err.status} (${ms} ms)`);
      }
    })
  );
};