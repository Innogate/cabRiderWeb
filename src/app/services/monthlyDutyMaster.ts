import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class monthlyDutyMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllMonthlyDuty(payload: any) {
    this.call('master.getAllMonthlyDutyMaster', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
