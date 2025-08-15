import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  search(payload: any) {
    this.call('invoice.search', payload);
  }

  getBookingList(payload: any) {
    this.call('invoice.getBookings', payload);
  }
  protected handleMessage(msg: any): boolean {
    return false;
  }
}
