import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})

export class MinvoiceService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getMonthlySetupCode(payload:any){
    this.call('minvoice.getMonthlySetupCode', payload);
  }

  getMonthlyBookingList(payload:any){
    this.call('minvoice.getMonthlyBookingList', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
