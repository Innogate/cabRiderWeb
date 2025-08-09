import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class partyRateMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  getAllPartyRate(payload: any) {
    this.call('master.getAllPartyRate', payload);
  }

  createUpdatePartyRate(payload: any) {
    this.call('master.createUpdatePartyRateMaster', payload)
  }



  protected handleMessage(msg: any): boolean {
    return false;
  }
}
