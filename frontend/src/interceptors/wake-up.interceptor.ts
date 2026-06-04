import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

const COLD_START_STATUSES = new Set([0, 502, 503]);
const RETRY_DELAY_MS = 20_000;
const MAX_RETRIES = 3;

export const wakeUpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
    return next(req).pipe(
        retry({
            count: MAX_RETRIES,
            delay: (error, attemptIndex) => {
                if (!COLD_START_STATUSES.has(error.status)) {
                    return throwError(() => error);
                }
                console.warn(
                    `[WakeUp] Backend en démarrage (status ${error.status}) — ` +
                    `tentative ${attemptIndex}/${MAX_RETRIES} dans ${RETRY_DELAY_MS / 1000}s…`
                );
                return timer(RETRY_DELAY_MS);
            }
        })
    );
};
