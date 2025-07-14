import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  search(payload: any) {
    this.call('booking.search', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
