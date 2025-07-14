import { Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class chargesListMasterService extends BaseService {
  constructor(ws: WebSocketService) {
    super(ws);
  }

  GatAllChargesList(payload: any) {
    this.call('master.gatAllChargesList', payload);
  }

  CreateUpdate(payload: any){
    this.call('master.createUpdateChargesMaster', payload);
  }

  Delete(payload: any){
    this.call('master.deleteCharges', payload);
  }

  protected handleMessage(msg: any): boolean {
    return false;
  }
}
