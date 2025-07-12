import { WebSocketService } from './websocket.service';

export abstract class BaseService {
  protected constructor(protected ws: WebSocketService) {
    this.ws.setServiceHandler(this.handleMessage.bind(this));
  }

  protected async get(command: string, body: any = {}) {
    try {
      await this.ws.ensureConnected(); // ✅ Ensure connection before sending
      this.ws.send({
        type: 'GET',
        command,
        body,
      });
    } catch (error) {
      console.error(`[BaseService] Failed to send GET "${command}":`, error);
    }
  }

  protected async post(command: string, body: any = {}) {
    try {
      await this.ws.ensureConnected(); // ✅ Ensure connection before sending
      this.ws.send({
        type: 'POST',
        command,
        body,
      });
    } catch (error) {
      console.error(`[BaseService] Failed to send POST "${command}":`, error);
    }
  }

  /**
   * You must implement this in child services.
   * Returns true if message was handled, false to bubble up.
   */
  protected abstract handleMessage(msg: any): boolean;

  public registerPageHandler(handler: (msg: any) => boolean) {
    this.ws.registerPageHandler(handler);
  }

  public unregisterPageHandler() {
    this.ws.unregisterPageHandler();
  }
}
