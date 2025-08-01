import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})

export class DutyService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  duty(payload:any){
    this.call('duty.allotBooking', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
