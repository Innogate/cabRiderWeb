import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { globalRequestHandler } from '../utils/global';
import { MessageService } from 'primeng/api';
import { environment } from '../../../env';
type MessageHandler = (msg: any) => boolean;

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private socket$: WebSocketSubject<any> | null = null;
  private connected = false;
  private connecting = false;
  private connectionResolver: (() => void) | null = null;
  private connectionRejecter: ((error: any) => void) | null = null;
  private connectionPromise: Promise<void> | null = null;

  private serviceHandler: MessageHandler | null = null;
  private currentPageHandler: MessageHandler | null = null;

  public connectionClosed$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private msgService: MessageService) {
    this.connect();

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.send({ type: 'page-change', pageId: event.urlAfterRedirects });
      });
  }

  /**
   * Ensures the WebSocket is connected.
   * Used by BaseService before sending.
   */
  public async ensureConnected(): Promise<void> {
    if (this.isConnected()) return;

    if (this.connectionPromise) {
      return this.connectionPromise; // already connecting
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      this.connectionResolver = resolve;
      this.connectionRejecter = reject;
      this.connect(); // trigger connection
    });

    return this.connectionPromise;
  }

  private connect(): void {
    if (this.connected || this.connecting) return;

    console.log('[WS] Connecting...');
    this.connecting = true;

    const token = localStorage.getItem('auth_token') ?? '';

    this.socket$ = webSocket({
      url: environment.wsUrl,
      deserializer: (e) => JSON.parse(e.data),
      serializer: (value) => JSON.stringify(value),
      openObserver: {
        next: () => {
          console.log('[WS] Connected');
          this.connected = true;
          this.connecting = false;
          this.connectionClosed$.next(false);

          if (this.socket$) {
            this.socket$.next({
              type: 'auth',
              command: 'authenticate',
              token: token,
              body: {},
            });
          }

          this.connectionResolver?.();
          this.cleanupConnectionPromise();
        },
      },
      closeObserver: {
        next: () => {
          console.warn('[WS] Disconnected');
          this.connected = false;
          this.connecting = false;
          this.connectionClosed$.next(true);

          this.connectionRejecter?.(new Error('Disconnected'));
          this.cleanupConnectionPromise();
        },
      },
    });

    this.socket$.subscribe({
      next: (msg) => this.dispatchMessage(msg),
      error: (err) => {
        console.error('[WS] Error:', err);
        this.connected = false;
        this.connecting = false;
        this.connectionClosed$.next(true);

        this.connectionRejecter?.(err);
        this.cleanupConnectionPromise();
      },
    });
  }

  private cleanupConnectionPromise() {
    this.connectionPromise = null;
    this.connectionResolver = null;
    this.connectionRejecter = null;
  }

  public reconnectManually(): void {
    this.connect();
  }

  public send(data: any): void {
    if (this.isConnected() && this.socket$) {
      this.socket$.next(data);
    } else {
      console.warn('[WS] Not connected. Message not sent:', data);
    }
  }

  public isConnected(): boolean {
    return this.connected && !!this.socket$;
  }

  public setServiceHandler(handler: MessageHandler): void {
    this.serviceHandler = handler;
  }

  public registerPageHandler(handler: MessageHandler): void {
    this.currentPageHandler = handler;
  }

  public unregisterPageHandler(): void {
    this.currentPageHandler = null;
  }

  private dispatchMessage(msg: any): void {
    if (this.serviceHandler && this.serviceHandler(msg)) return;
    if (this.currentPageHandler && this.currentPageHandler(msg)) return;
    // if (globalRequestHandler(msg, this.router, this.msgService)) return;

    console.warn('[WS] Unhandled message:', msg);
  }

  ngOnDestroy(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.connected = false;
    }
  }
}
